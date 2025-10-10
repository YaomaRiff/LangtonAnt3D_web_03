/**
 * @file preset-manager.ts
 * @description 预设管理器 - 加载、保存和应用配置快照
 * ✅ 修复: 添加了完整的类型守卫，修复所有 TypeScript 严格模式错误
 */
import config from './config';
import logger from './utils/logger';
import eventBus from './event-bus';
import uiRegistry from './ui/ui-registry';
import { resolveAssetUrl } from './utils/url-resolver';

class PresetManager {
  private initialized = false;
  private availablePresets: any[] = [];
  private currentPreset: string | null = null;
  private presetBaseUrl = '/presets';

  async init() {
    if (this.initialized) {
      logger.warn('PresetManager', '预设管理器已初始化');
      return this;
    }

    try {
      await this._scanPresets();

      this.initialized = true;
      logger.info(
        'PresetManager',
        `预设管理器已初始化 | 发现 ${this.availablePresets.length} 个预设`
      );

      return this;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `初始化失败: ${errorMsg}`);
      throw err;
    }
  }

  async _scanPresets() {
    try {
      const presetFiles = ['01.json', '02.json', '03.json'];

      this.availablePresets = presetFiles.map((filename) => ({
        name: filename.replace('.json', ''),
        filename: filename,
        path: `${this.presetBaseUrl}/${filename}`,
      }));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.warn('PresetManager', `扫描预设失败: ${errorMsg}`);
      this.availablePresets = [];
    }
  }

  getAvailablePresets() {
    return this.availablePresets;
  }

  async loadPreset(presetName: string) {
    try {
      const preset = this.availablePresets.find((p) => p.name === presetName);
      if (!preset) {
        throw new Error(`预设不存在: ${presetName}`);
      }

      logger.info('PresetManager', `正在加载预设: ${presetName}`);

      const response = await fetch(resolveAssetUrl(preset.path));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presetData = await response.json();

      this._applyPresetToConfig(presetData);
      this.currentPreset = presetName;

      eventBus.emit('preset-loaded', { name: presetName, data: presetData });

      logger.info('PresetManager', `✅ 预设已加载: ${presetName}`);

      return presetData;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `加载预设失败: ${errorMsg}`);
      throw err;
    }
  }

  _applyPresetToConfig(presetData: any) {
    if (!presetData || typeof presetData !== 'object') {
      throw new Error('预设数据格式无效');
    }

    const applyRecursively = (obj: any, pathPrefix = '') => {
      for (const key in obj) {
        if (key === 'name' || key === 'timestamp') continue;
        if (!key) continue;

        const value = obj[key];
        const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          applyRecursively(value, fullPath);
        } else {
          config.set(fullPath, value);
        }
      }
    };

    applyRecursively(presetData);
    logger.debug('PresetManager', '配置已通过 config.set() 应用完成');
  }

  savePreset(presetName: string) {
    if (!presetName || typeof presetName !== 'string') {
      throw new Error('预设名称无效');
    }

    try {
      const presetData = {
        name: presetName,
        timestamp: new Date().toISOString(),
      };

      const allPaths = uiRegistry.getAllControls();
      logger.info('PresetManager', `准备保存 ${allPaths.length} 个控件的数据`);

      const configSnapshot = config.getRaw();
      allPaths.forEach((path) => {
        // ✅ 添加类型守卫
        if (typeof path !== 'string') {
          logger.warn('PresetManager', `跳过无效路径: ${path}`);
          return;
        }

        const value = this._getNestedValue(configSnapshot, path);
        if (value !== undefined) {
          this._setNestedValue(presetData, path, value);
        }
      });

      const jsonContent = JSON.stringify(presetData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presetName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('PresetManager', `✅ 预设已保存: ${presetName}.json`);
      eventBus.emit('preset-saved', { name: presetName });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `保存预设失败: ${errorMsg}`);
      throw err;
    }
  }

  _getNestedValue(obj: any, path: string) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }
    return value;
  }

  _setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let target = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // ✅ 核心修复：添加类型守卫
      if (!key) continue;
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }

    // ✅ 核心修复：确保 lastKey 存在
    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      target[lastKey] = JSON.parse(JSON.stringify(value));
    }
  }

  getCurrentPreset() {
    return this.currentPreset;
  }

  dispose() {
    this.availablePresets = [];
    this.currentPreset = null;
    this.initialized = false;
    logger.info('PresetManager', '预设管理器已销毁');
  }
}

const presetManager = new PresetManager();
export default presetManager;
