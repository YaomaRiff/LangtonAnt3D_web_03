/**
 * @file ui-presets.js
 * @description 预设系统UI - 手动加载 + 保持UI顺序 + 手动更新绑定
 * ✨ 重构: 移除了对已删除的 ui-material 的引用。
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus';
import presetManager from '../preset-manager';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';
import uiBasic from './ui-basic';
import uiPost from './ui-post';
import uiCoordinates from './ui-coordinates';

class UIPresets {
  private pane: any;
  private initialized: boolean;
  private presetSelector: any;
  private saveNameInput: any;
  private selectedPresetName: string | null;

  constructor() {
    this.pane = null;
    this.initialized = false;
    this.presetSelector = null;
    this.saveNameInput = null;
    this.selectedPresetName = null;
  }

  async init() {
    if (this.initialized) {
      logger.warn('UIPresets', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UIPresets', '容器未初始化');
      return;
    }

    try {
      this.pane = new Pane({
        title: '预设管理',
        container: uiContainer.getScrollContent(),
        expanded: true
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;
      logger.info('UIPresets', '预设UI已初始化');

      return this;
    } catch (err) {
      logger.error('UIPresets', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createControls() {
    const presets = presetManager.getAvailablePresets();
    
    const presetOptions = {};
    presets.forEach((preset: any) => {
      (presetOptions as any)[preset.name] = preset.name;
    });

    const defaultValue = presets.length > 0 ? presets[0].name : '';
    this.selectedPresetName = defaultValue;

    const params = {
      preset: defaultValue
    };

    this.presetSelector = this.pane.addBinding(
      params,
      'preset',
      {
        label: '预设选择',
        options: presetOptions
      }
    );

    this.presetSelector.on('change', (ev: any) => {
      this.selectedPresetName = ev.value;
      logger.debug('UIPresets', `已选择预设: ${ev.value}`);
    });

    const loadButton = this.pane.addButton({
      title: '📥 加载预设'
    });

    loadButton.on('click', () => {
      if (!this.selectedPresetName) {
        alert('请先选择一个预设');
        return;
      }
      this._loadPreset(this.selectedPresetName);
    });

    const resetButton = this.pane.addButton({
      title: '🔄 恢复默认'
    });

    resetButton.on('click', () => {
      if (confirm('确定要恢复到默认配置吗？这将清除所有当前设置。')) {
        this._restoreDefaults();
      }
    });

    const saveFolder = this.pane.addFolder({
      title: '保存当前配置',
      expanded: false
    });

    const saveParams = {
      name: ''
    };

    this.saveNameInput = saveFolder.addBinding(
      saveParams,
      'name',
      {
        label: '预设名称'
      }
    );

    const saveButton = saveFolder.addButton({
      title: '💾 保存预设'
    });

    saveButton.on('click', () => {
      const name = saveParams.name.trim();
      if (!name) {
        alert('请输入预设名称');
        return;
      }

      try {
        presetManager.savePreset(name);
        alert(`预设已保存: ${name}.json\n\n请将文件放入 /presets 文件夹`);
        saveParams.name = '';
        this.saveNameInput.refresh();
      } catch (err) {
        alert(`保存失败: ${(err as Error).message}`);
      }
    });
  }

  _loadPreset(presetName: any) {
    try {
      logger.info('UIPresets', `开始加载预设: ${presetName}`);
      
      presetManager.loadPreset(presetName)
        .then(() => {
          logger.info('UIPresets', `预设已加载: ${presetName}`);
        })
        .catch((err: any) => {
          alert(`加载预设失败: ${err.message}`);
          logger.error('UIPresets', `加载失败: ${err.message}`);
        });
    } catch (err) {
      alert(`加载预设失败: ${(err as Error).message}`);
    }
  }

  _restoreDefaults() {
    try {
      logger.info('UIPresets', '开始恢复默认配置...');
      
      config.reset();
      
      eventBus.emit('preset-loaded', { name: 'default', data: config.getRaw() });
      
      logger.info('UIPresets', '✅ 已恢复默认配置');
    } catch (err) {
      logger.error('UIPresets', `恢复默认失败: ${(err as Error).message}`);
      alert(`恢复默认失败: ${(err as Error).message}`);
    }
  }

  _bindEvents() {
    eventBus.on('preset-loaded', () => {
      logger.debug('UIPresets', '接收到 preset-loaded 事件，UI将各自刷新。');
    });
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.initialized = false;
    logger.info('UIPresets', 'UI已销毁');
  }
}

const uiPresets = new UIPresets();
export default uiPresets;
