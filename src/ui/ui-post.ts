/**
 * @file ui-post.js
 * @description 后期处理控制面板
 * ✅ [重构 v2.1] 更新UI以匹配新的 'film' 效果, 移除旧的 noise 和 scanline。
 */
import eventBus from '../event-bus'; 
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';

class UIPost {
  private _pane: any;
  private _isInitialized: boolean;
  private controls: Map<string, any>;
  private configData: any;

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
    this._bindEvents();
    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后期处理 UI 已初始化 (v2.1)');
  }

  _createPostProcessingControls() {
    // 全局开关
    const globalEnable = this._pane.addBinding(this.configData.postprocess, 'enabled', { label: '启用后期处理' });
    globalEnable.on('change', (ev) => config.set('postprocess.enabled', ev.value));
    this.controls.set('postprocess.enabled', globalEnable);

    // ---------- 辉光 (Bloom) ----------
    const bloomFolder = this._pane.addFolder({ title: '光晕 (Bloom)', expanded: true });
    const bloomEnabled = bloomFolder.addBinding(this.configData.postprocess.bloom, 'enabled', { label: '启用' });
    bloomEnabled.on('change', (ev) => config.set('postprocess.bloom.enabled', ev.value));
    this.controls.set('postprocess.bloom.enabled', bloomEnabled);

    const bloomIntensity = bloomFolder.addBinding(this.configData.postprocess.bloom, 'intensity', { label: '强度', min: 0, max: 3, step: 0.05 });
    bloomIntensity.on('change', (ev) => config.set('postprocess.bloom.intensity', ev.value));
    this.controls.set('postprocess.bloom.intensity', bloomIntensity);

    const bloomThreshold = bloomFolder.addBinding(this.configData.postprocess.bloom, 'luminanceThreshold', { label: '亮度阈值', min: 0, max: 1, step: 0.01 });
    bloomThreshold.on('change', (ev) => config.set('postprocess.bloom.luminanceThreshold', ev.value));
    this.controls.set('postprocess.bloom.luminanceThreshold', bloomThreshold);

    // ---------- 胶片效果 (Film) ----------
    const filmFolder = this._pane.addFolder({ title: '胶片效果 (Film)', expanded: false });
    const filmEnabled = filmFolder.addBinding(this.configData.postprocess.film, 'enabled', { label: '启用' });
    filmEnabled.on('change', (ev) => config.set('postprocess.film.enabled', ev.value));
    this.controls.set('postprocess.film.enabled', filmEnabled);

    const noiseIntensity = filmFolder.addBinding(this.configData.postprocess.film, 'noiseIntensity', { label: '噪点强度', min: 0, max: 1, step: 0.01 });
    noiseIntensity.on('change', (ev) => config.set('postprocess.film.noiseIntensity', ev.value));
    this.controls.set('postprocess.film.noiseIntensity', noiseIntensity);

    const scanlineIntensity = filmFolder.addBinding(this.configData.postprocess.film, 'scanlineIntensity', { label: '扫描线强度', min: 0, max: 1, step: 0.01 });
    scanlineIntensity.on('change', (ev) => config.set('postprocess.film.scanlineIntensity', ev.value));
    this.controls.set('postprocess.film.scanlineIntensity', scanlineIntensity);
    
    const scanlineCount = filmFolder.addBinding(this.configData.postprocess.film, 'scanlineCount', { label: '扫描线数量', min: 0, max: 4096, step: 64 });
    scanlineCount.on('change', (ev) => config.set('postprocess.film.scanlineCount', ev.value));
    this.controls.set('postprocess.film.scanlineCount', scanlineCount);

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
  }

  _bindEvents() {
    const refreshControl = ({ key, value }: { key: string; value: any; }) => {
      if (!key.startsWith('postprocess.')) return;
      
      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData as any;
        for (let i = 0; i < pathParts.length - 1; i++) {
          target = target[pathParts[i]];
        }
        const lastKey = pathParts[pathParts.length - 1];
        if (target && target[lastKey] !== value) {
          target[lastKey] = value;
          control.refresh();
        }
      }
    };

    eventBus.on('config-changed', refreshControl);
    eventBus.on('preset-loaded', () => this.refresh());
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

const uiPost = new UIPost();
export default uiPost;
