/**
 * @file ui-presets.js
 * @description 预设系统UI - 手动加载 + 保持UI顺序 + 手动更新绑定
 * ✅ 修复：在预设加载后调用所有 UI 的 updateBindings() 方法
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus.js';
import presetManager from '../preset-manager.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';
import uiBasic from './ui-basic.js';
import uiMaterial from './ui-material.js';
import uiPost from './ui-post.js';
import uiCoordinates from './ui-coordinates.js';

class UIPresets {
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
      logger.error('UIPresets', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createControls() {
    const presets = presetManager.getAvailablePresets();
    
    const presetOptions = {};
    presets.forEach(preset => {
      presetOptions[preset.name] = preset.name;
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

    this.presetSelector.on('change', (ev) => {
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
        alert(`保存失败: ${err.message}`);
      }
    });
  }

  _loadPreset(presetName) {
    try {
      logger.info('UIPresets', `开始加载预设: ${presetName}`);
      
      presetManager.loadPreset(presetName)
        .then(() => {
          logger.info('UIPresets', `预设已加载: ${presetName}`);
        })
        .catch(err => {
          alert(`加载预设失败: ${err.message}`);
          logger.error('UIPresets', `加载失败: ${err.message}`);
        });
    } catch (err) {
      alert(`加载预设失败: ${err.message}`);
    }
  }

  _restoreDefaults() {
    try {
      logger.info('UIPresets', '开始恢复默认配置...');
      
      config.reset();
      this._emitDefaultEvents();
      this._refreshAllUI();
      
      logger.info('UIPresets', '✅ 已恢复默认配置');
    } catch (err) {
      logger.error('UIPresets', `恢复默认失败: ${err.message}`);
      alert(`恢复默认失败: ${err.message}`);
    }
  }

  _emitDefaultEvents() {
    const cfg = config.getRaw();
    
    eventBus.emit('dust-color-changed', cfg.particles.dustColor);
    eventBus.emit('dust-size-changed', cfg.particles.dustSize);
    eventBus.emit('dust-opacity-changed', cfg.particles.dustOpacity);
    eventBus.emit('dust-count-changed', cfg.particles.dustCount);
    eventBus.emit('particle-system-scale-changed', cfg.particles.systemScale);
    eventBus.emit('particle-breath-intensity-changed', cfg.particles.breathIntensity);
    eventBus.emit('particle-float-intensity-changed', cfg.particles.floatIntensity);
    eventBus.emit('rotation-speed-changed', cfg.particles.rotationSpeed);
    eventBus.emit('rotation-tilt-xz-changed', cfg.particles.rotationTiltXZ);
    eventBus.emit('rotation-tilt-xy-changed', cfg.particles.rotationTiltXY);
    eventBus.emit('path-point-color-changed', cfg.particles.pathPointColor);
    eventBus.emit('path-point-size-changed', cfg.particles.pathPointSize);
    eventBus.emit('path-scale-changed', cfg.path.scale);
    eventBus.emit('path-depth-intensity-changed', cfg.path.depthIntensity);
    eventBus.emit('bg-color-changed', cfg.environment.bgColor);
    eventBus.emit('path-color-changed', cfg.environment.pathColor);
    eventBus.emit('material-glow-enabled-changed', { target: 'path', enabled: cfg.material.path.enabled });
    eventBus.emit('material-glow-intensity-changed', { target: 'path', intensity: cfg.material.path.emissiveIntensity });
    eventBus.emit('material-glow-enabled-changed', { target: 'particles', enabled: cfg.material.particles.enabled });
    eventBus.emit('particle-emissive-intensity-changed', cfg.material.particles.emissiveIntensity);
    eventBus.emit('material-glow-enabled-changed', { target: 'movingLight', enabled: cfg.material.movingLight.enabled });
    eventBus.emit('dataspace-scale-changed', cfg.coordinates.dataSpace.scale);
    ['x', 'y', 'z'].forEach(axis => {
      eventBus.emit('dataspace-rotation-changed', { 
        axis, 
        angle: cfg.coordinates.dataSpace.rotation[axis] 
      });
    });
    eventBus.emit('dataspace-position-changed', cfg.coordinates.dataSpace.position);
    eventBus.emit('bloom-intensity-changed', cfg.postprocess.bloom.intensity);
    eventBus.emit('bloom-smoothing-changed', cfg.postprocess.bloom.smoothing);
    eventBus.emit('hue-saturation-enabled-changed', cfg.postprocess.hueSaturation.enabled);
    eventBus.emit('brightness-contrast-enabled-changed', cfg.postprocess.brightnessContrast.enabled);
    eventBus.emit('noise-enabled-changed', cfg.postprocess.noise.enabled);
    eventBus.emit('chromatic-aberration-enabled-changed', cfg.postprocess.chromaticAberration.enabled);
    eventBus.emit('scanline-enabled-changed', cfg.postprocess.scanline.enabled);
    eventBus.emit('camera-mode-changed', cfg.camera.mode);
    eventBus.emit('camera-fov-changed', cfg.camera.fov);
    eventBus.emit('animation-speed-changed', cfg.animation.speedFactor);
    eventBus.emit('animation-loop-changed', cfg.animation.loop);
    
    logger.debug('UIPresets', '默认事件已全部触发');
  }

  _bindEvents() {
    eventBus.on('preset-loaded', () => {
      // ✅ 核心修复：先调用 updateBindings()，再刷新 Pane
      this._updateAllBindings();
      this._refreshAllPanes();
    });
  }

  /**
   * ✅ 核心方法：手动更新所有 UI 模块的临时对象
   */
  _updateAllBindings() {
    logger.info('UIPresets', '开始更新所有UI绑定...');

    const uiModules = [
      { module: uiBasic, name: 'uiBasic' },
      { module: uiMaterial, name: 'uiMaterial' },
      { module: uiPost, name: 'uiPost' },
      { module: uiCoordinates, name: 'uiCoordinates' }
    ];

    uiModules.forEach(({ module, name }) => {
      if (module && typeof module.updateBindings === 'function') {
        module.updateBindings();
        logger.debug('UIPresets', `${name} 绑定已更新`);
      }
    });

    logger.info('UIPresets', '✅ 所有UI绑定已更新');
  }

  /**
 * ✅ 正确的刷新逻辑：先更新绑定，再刷新控件，最后刷新 Pane
 */
_refreshAllPanes() {
  logger.info('UIPresets', '开始刷新所有UI面板...');

  const uiModules = [
    { module: uiBasic, name: 'uiBasic' },
    { module: uiMaterial, name: 'uiMaterial' },
    { module: uiPost, name: 'uiPost' },
    { module: uiCoordinates, name: 'uiCoordinates' }
  ];

  uiModules.forEach(({ module, name }) => {
    // 1. 刷新所有控件
    if (module && module.controls) {
      module.controls.forEach((control) => {
        if (control && typeof control.refresh === 'function') {
          control.refresh();
        }
      });
    }
    
    // 2. 刷新 Pane 本身
    if (module && module._pane && typeof module._pane.refresh === 'function') {
      module._pane.refresh();
    } else if (module && module.pane && typeof module.pane.refresh === 'function') {
      module.pane.refresh();
    }
    
    logger.debug('UIPresets', `${name} 已刷新`);
  });

  logger.info('UIPresets', '✅ 所有UI已刷新');
}

  /**
   * 仅在恢复默认时使用（完全重建）
   */
  async _refreshAllUI() {
    logger.info('UIPresets', '开始重建所有UI...');

    const uiModules = [
      { module: uiBasic, name: 'uiBasic' },
      { module: uiMaterial, name: 'uiMaterial' },
      { module: uiPost, name: 'uiPost' },
      { module: uiCoordinates, name: 'uiCoordinates' }
    ];

    for (const { module, name } of uiModules) {
      if (module && typeof module.dispose === 'function') {
        module.dispose();
        logger.debug('UIPresets', `${name} 已销毁`);
      }

      if (module && typeof module.init === 'function') {
        await module.init({ eventBus });
        logger.debug('UIPresets', `${name} 已重建`);
      }
    }

    logger.info('UIPresets', '✅ 所有UI已重建');
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
