/**
 * @file ui-post.js
 * @description 后处理效果控制面板 - 直接绑定到 config._config + 手动更新临时对象
 * ✅ 修复：在 constructor 中获取配置 + 添加 updateBindings() 方法
 * 已删除：辉光Bloom组件（已由选择性辉光系统替代）
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIPost {
  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    
    // ✅ 在 constructor 中获取配置引用
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIPost', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    
    this._pane = new Pane({
      title: '后处理效果',
      expanded: false,
      container: uiContainer.getScrollContent()
    });

    this._createPostControls();
    
    this._isInitialized = true;

    // ✅ 注册到UIRegistry
    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后处理 UI 已初始化(直接绑定)');
  }

  _createPostControls() {
    // ========== 色相饱和度 ==========
    const hueFolder = this._pane.addFolder({ title: '色相饱和度', expanded: false });
    
    const hueEnabled = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'enabled',
      { label: '启用' }
    );
    
    hueEnabled.on('change', (ev) => {
      eventBus.emit('hue-saturation-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.enabled', hueEnabled);
    
    const hue = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'hue',
      { label: '色相', min: -1, max: 1, step: 0.01 }
    );
    
    hue.on('change', (ev) => {
      eventBus.emit('hue-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.hue', hue);
    
    const saturation = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'saturation',
      { label: '饱和度', min: -1, max: 1, step: 0.01 }
    );
    
    saturation.on('change', (ev) => {
      eventBus.emit('saturation-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.saturation', saturation);
    
    // ========== 亮度对比度 ==========
    const brightFolder = this._pane.addFolder({ title: '亮度对比度', expanded: false });
    
    const brightEnabled = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'enabled',
      { label: '启用' }
    );
    
    brightEnabled.on('change', (ev) => {
      eventBus.emit('brightness-contrast-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.enabled', brightEnabled);
    
    const brightness = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'brightness',
      { label: '亮度', min: -0.5, max: 0.5, step: 0.01 }
    );
    
    brightness.on('change', (ev) => {
      eventBus.emit('brightness-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.brightness', brightness);
    
    const contrast = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'contrast',
      { label: '对比度', min: -0.5, max: 0.5, step: 0.01 }
    );
    
    contrast.on('change', (ev) => {
      eventBus.emit('contrast-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.contrast', contrast);
    
    // ========== 噪点 ==========
    const noiseFolder = this._pane.addFolder({ title: '噪点', expanded: false });
    
    const noiseEnabled = noiseFolder.addBinding(
      this.configData.postprocess.noise,
      'enabled',
      { label: '启用' }
    );
    
    noiseEnabled.on('change', (ev) => {
      eventBus.emit('noise-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.noise.enabled', noiseEnabled);
    
    const noiseIntensity = noiseFolder.addBinding(
      this.configData.postprocess.noise,
      'intensity',
      { label: '强度', min: 0, max: 0.1, step: 0.001 }
    );
    
    noiseIntensity.on('change', (ev) => {
      eventBus.emit('noise-intensity-changed', ev.value);
    });
    
    this.controls.set('postprocess.noise.intensity', noiseIntensity);
    
    // ========== 色差 ==========
    const caFolder = this._pane.addFolder({ title: '色差', expanded: false });
    
    const caEnabled = caFolder.addBinding(
      this.configData.postprocess.chromaticAberration,
      'enabled',
      { label: '启用' }
    );
    
    caEnabled.on('change', (ev) => {
      eventBus.emit('chromatic-aberration-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.chromaticAberration.enabled', caEnabled);
    
    // const caOffsetX = caFolder.addBinding(
    //   this.configData.postprocess.chromaticAberration,
    //   'offsetX',
    //   { label: 'X偏移', min: 0, max: 0.02, step: 0.001 }
    // );
    
    // caOffsetX.on('change', (ev) => {
    //   eventBus.emit('chromatic-aberration-offset-changed', {
    //     x: ev.value,
    //     y: this.configData.postprocess.chromaticAberration.offsetY
    //   });
    // });
    
    // this.controls.set('postprocess.chromaticAberration.offsetX', caOffsetX);
    
    // const caOffsetY = caFolder.addBinding(
    //   this.configData.postprocess.chromaticAberration,
    //   'offsetY',
    //   { label: 'Y偏移', min: 0, max: 0.02, step: 0.001 }
    // );
    
    // caOffsetY.on('change', (ev) => {
    //   eventBus.emit('chromatic-aberration-offset-changed', {
    //     x: this.configData.postprocess.chromaticAberration.offsetX,
    //     y: ev.value
    //   });
    // });
    
    // this.controls.set('postprocess.chromaticAberration.offsetY', caOffsetY);
    
    // ========== 扫描线 ==========
    const scanFolder = this._pane.addFolder({ title: '扫描线', expanded: false });
    
    const scanEnabled = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'enabled',
      { label: '启用' }
    );
    
    scanEnabled.on('change', (ev) => {
      eventBus.emit('scanline-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.enabled', scanEnabled);
    
    const scanIntensity = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'intensity',
      { label: '强度', min: 0, max: 1, step: 0.01 }
    );
    
    scanIntensity.on('change', (ev) => {
      eventBus.emit('scanline-intensity-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.intensity', scanIntensity);
    
    const scanDensity = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'density',
      { label: '密度', min: 10, max: 500, step: 0.1 }
    );
    
    scanDensity.on('change', (ev) => {
      eventBus.emit('scanline-density-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.density', scanDensity);
  }

  // ✅ 新增：手动更新所有绑定（后处理也是直接绑定，无需手动更新）
  updateBindings() {
    logger.debug('UIPost', '绑定检查完成（无临时对象）');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIPost', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    this.controls.clear();
    this._isInitialized = false;
    logger.info('UIPost', '后处理 UI 已清理');
  }
}

export default new UIPost();
