/**
 * @file preset-manager.js
 * @description 预设管理器 - 加载、保存和应用配置快照。通过 config.set() 自动触发更新事件。
 * ✅ 核心改造:
 *   1. 删除了巨大的 _emitConfigEvents 方法。
 *   2. 加载预设时，通过遍历并调用 config.set() 来自动触发更新。
 */
import config from './config';
import logger from './utils/logger';
import eventBus from './event-bus';
import uiRegistry from './ui/ui-registry';
import { resolveAssetUrl } from './utils/url-resolver';

class PresetManager {
  constructor() {
    this.initialized = false;
    this.availablePresets = [];
    this.currentPreset = null;
    this.presetBaseUrl = '/presets';
  }

  async init() {
    if (this.initialized) {
      logger.warn('PresetManager', '预设管理器已初始化');
      return this;
    }

    try {
      await this._scanPresets();
      
      this.initialized = true;
      logger.info('PresetManager', `预设管理器已初始化 | 发现 ${this.availablePresets.length} 个预设`);
      
      return this;
    } catch (err) {
      logger.error('PresetManager', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  async _scanPresets() {
    try {
      const presetFiles = [
        '01.json',
        '02.json',
        '03.json'
      ];

      this.availablePresets = presetFiles.map(filename => ({
        name: filename.replace('.json', ''),
        filename: filename,
        path: `${this.presetBaseUrl}/${filename}`
      }));

    } catch (err) {
      logger.warn('PresetManager', `扫描预设失败: ${err.message}`);
      this.availablePresets = [];
    }
  }

  getAvailablePresets() {
    return this.availablePresets;
  }

  async loadPreset(presetName) {
    try {
      const preset = this.availablePresets.find(p => p.name === presetName);
      if (!preset) {
        throw new Error(`预设不存在: ${presetName}`);
      }

      logger.info('PresetManager', `正在加载预设: ${presetName}`);

      const response = await fetch(resolveAssetUrl(preset.path));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presetData = await response.json();
      
      // 1. ✅ 应用配置到内存, 这个过程会通过 config.set() 自动发出所有事件
      this._applyPresetToConfig(presetData);

      // 2. 标记当前预设
      this.currentPreset = presetName;
      
      // 3. ✅ 最后通知UI刷新 (例如刷新Tweakpane面板)
      eventBus.emit('preset-loaded', { name: presetName, data: presetData });
      
      logger.info('PresetManager', `✅ 预设已加载: ${presetName}`);
      
      return presetData;
    } catch (err) {
      logger.error('PresetManager', `加载预设失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * ✅ 核心修改: 重写此方法，通过递归调用 config.set() 应用配置
   */
  _applyPresetToConfig(presetData) {
    if (!presetData || typeof presetData !== 'object') {
      throw new Error('预设数据格式无效');
    }

    const applyRecursively = (obj, pathPrefix = '') => {
      for (const key in obj) {
        // 跳过元数据字段
        if (key === 'name' || key === 'timestamp') continue;
        
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

  /**
   * ❌ 已删除: 这个巨大的、难以维护的函数已被移除
   */
  // _emitConfigEvents(presetData) { ... }

  savePreset(presetName) {
    if (!presetName || typeof presetName !== 'string') {
      throw new Error('预设名称无效');
    }

    try {
      const presetData = {
        name: presetName,
        timestamp: new Date().toISOString()
      };

      const allPaths = uiRegistry.getAllControls();
      logger.info('PresetManager', `准备保存 ${allPaths.length} 个控件的数据`);

      const configSnapshot = config.getRaw();
      allPaths.forEach(path => {
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

    } catch (err) {
      logger.error('PresetManager', `保存预设失败: ${err.message}`);
      throw err;
    }
  }
  
  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }
    return value;
  }

  _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let target = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[keys[keys.length - 1]] = JSON.parse(JSON.stringify(value));
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
