/**
 * @file ui-post.js
 * @description 后期处理控制面板
 * ✅ 核心改造: 完全重写以匹配 config.js 中的新后处理结构，并使用 config.set()。
 */
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIPost {
  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIPost', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    
    this._pane = new Pane({
      title: '后期处理',
      expanded: false,
      container: uiContainer.getScrollContent()
    });

    this._createPostProcessingControls();
    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后期处理 UI 已初始化');
  }

  _createPostProcessingControls() {
    // 全局开关
    const globalEnable = this._pane.addBinding(this.configData.postprocess, 'enabled', { label: '启用后期处理' });
    globalEnable.on('change', (ev) => config.set('postprocess.enabled', ev.value));
    this.controls.set('postprocess.enabled', globalEnable);
    
    // ---------- 色相/饱和度 ----------
    const hsFolder = this._pane.addFolder({ title: '色相/饱和度', expanded: false });
    const hsEnabled = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'enabled', { label: '启用' });
    hsEnabled.on('change', (ev) => config.set('postprocess.hueSaturation.enabled', ev.value));
    this.controls.set('postprocess.hueSaturation.enabled', hsEnabled);

    const hue = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'hue', { label: '色相', min: -1, max: 1, step: 0.01 });
    hue.on('change', (ev) => config.set('postprocess.hueSaturation.hue', ev.value));
    this.controls.set('postprocess.hueSaturation.hue', hue);

    const saturation = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'saturation', { label: '饱和度', min: -1, max: 1, step: 0.01 });
    saturation.on('change', (ev) => config.set('postprocess.hueSaturation.saturation', ev.value));
    this.controls.set('postprocess.hueSaturation.saturation', saturation);

    // ---------- 亮度/对比度 ----------
    const bcFolder = this._pane.addFolder({ title: '亮度/对比度', expanded: false });
    const bcEnabled = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'enabled', { label: '启用' });
    bcEnabled.on('change', (ev) => config.set('postprocess.brightnessContrast.enabled', ev.value));
    this.controls.set('postprocess.brightnessContrast.enabled', bcEnabled);

    const brightness = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'brightness', { label: '亮度', min: -1, max: 1, step: 0.01 });
    brightness.on('change', (ev) => config.set('postprocess.brightnessContrast.brightness', ev.value));
    this.controls.set('postprocess.brightnessContrast.brightness', brightness);

    const contrast = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'contrast', { label: '对比度', min: -1, max: 1, step: 0.01 });
    contrast.on('change', (ev) => config.set('postprocess.brightnessContrast.contrast', ev.value));
    this.controls.set('postprocess.brightnessContrast.contrast', contrast);

    // ---------- 噪点 ----------
    const noiseFolder = this._pane.addFolder({ title: '噪点', expanded: false });
    const noiseEnabled = noiseFolder.addBinding(this.configData.postprocess.noise, 'enabled', { label: '启用' });
    noiseEnabled.on('change', (ev) => config.set('postprocess.noise.enabled', ev.value));
    this.controls.set('postprocess.noise.enabled', noiseEnabled);
    
    const noiseIntensity = noiseFolder.addBinding(this.configData.postprocess.noise, 'intensity', { label: '强度', min: 0, max: 0.2, step: 0.001 });
    noiseIntensity.on('change', (ev) => config.set('postprocess.noise.intensity', ev.value));
    this.controls.set('postprocess.noise.intensity', noiseIntensity);

    // ---------- 扫描线 ----------
    const scanlineFolder = this._pane.addFolder({ title: '扫描线', expanded: false });
    const scanlineEnabled = scanlineFolder.addBinding(this.configData.postprocess.scanline, 'enabled', { label: '启用' });
    scanlineEnabled.on('change', (ev) => config.set('postprocess.scanline.enabled', ev.value));
    this.controls.set('postprocess.scanline.enabled', scanlineEnabled);

    const scanlineIntensity = scanlineFolder.addBinding(this.configData.postprocess.scanline, 'intensity', { label: '强度', min: 0, max: 1, step: 0.01 });
    scanlineIntensity.on('change', (ev) => config.set('postprocess.scanline.intensity', ev.value));
    this.controls.set('postprocess.scanline.intensity', scanlineIntensity);

    const scanlineDensity = scanlineFolder.addBinding(this.configData.postprocess.scanline, 'density', { label: '密度', min: 10, max: 300, step: 0.1 });
    scanlineDensity.on('change', (ev) => config.set('postprocess.scanline.density', ev.value));
    this.controls.set('postprocess.scanline.density', scanlineDensity);
  }

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
    logger.info('UIPost', '后期处理 UI 已清理');
  }
}

export default new UIPost();
