/**
 * @file ui-post.ts
 * @description 后期处理控制面板
 * @✨ 新增: 添加了景深(Bokeh)和色差(Chromatic Aberration)效果的UI控件。
 * @✨ 重构: 使用辅助函数简化了控件创建流程，提高了代码可读性和可维护性。
 * @🔧 清理: 移除了过时和重复的UI创建代码。
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

    logger.info('UIPost', '后期处理 UI 已初始化');
  }

  _createPostProcessingControls() {
    // 全局开关
    this.addBinding(this._pane, 'postprocess.enabled', { label: '启用后期处理' });

    // ---------- 辉光 (Bloom) ----------
    const bloomFolder = this._pane.addFolder({ title: '光晕 (Bloom)', expanded: true });
    this.addBinding(bloomFolder, 'postprocess.bloom.enabled', { label: '启用' });
    this.addBinding(bloomFolder, 'postprocess.bloom.intensity', { label: '强度', min: 0, max: 5, step: 0.05 });
    this.addBinding(bloomFolder, 'postprocess.bloom.luminanceThreshold', { label: '亮度阈值', min: 0, max: 1, step: 0.01 });

    // ---------- 景深 (Bokeh) - 新增 ----------
    const bokehFolder = this._pane.addFolder({ title: '景深 (Bokeh)', expanded: false });
    this.addBinding(bokehFolder, 'postprocess.bokeh.enabled', { label: '启用' });
    this.addBinding(bokehFolder, 'postprocess.bokeh.focus', { label: '焦距', min: 0, max: 100, step: 0.1 });
    this.addBinding(bokehFolder, 'postprocess.bokeh.dof', { label: '景深范围', min: 0, max: 0.1, step: 0.001 });
    this.addBinding(bokehFolder, 'postprocess.bokeh.aperture', { label: '光圈', min: 0, max: 0.1, step: 0.001 });
    this.addBinding(bokehFolder, 'postprocess.bokeh.maxBlur', { label: '最大模糊', min: 0, max: 0.05, step: 0.001 });

    // ---------- 色差 (Chromatic Aberration) - 新增 ----------
    const caFolder = this._pane.addFolder({ title: '色差 (Chromatic Aberration)', expanded: false });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.enabled', { label: '启用' });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.offset.x', { label: '偏移量 X', min: -0.01, max: 0.01, step: 0.0001 });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.offset.y', { label: '偏移量 Y', min: -0.01, max: 0.01, step: 0.0001 });

    // ---------- 胶片效果 (Film) ----------
    const filmFolder = this._pane.addFolder({ title: '胶片效果 (Film)', expanded: false });
    this.addBinding(filmFolder, 'postprocess.film.enabled', { label: '启用' });
    this.addBinding(filmFolder, 'postprocess.film.noiseIntensity', { label: '噪点强度', min: 0, max: 1, step: 0.01 });
    this.addBinding(filmFolder, 'postprocess.film.scanlineIntensity', { label: '扫描线强度', min: 0, max: 1, step: 0.01 });
    this.addBinding(filmFolder, 'postprocess.film.scanlineCount', { label: '扫描线数量', min: 0, max: 4096, step: 64 });

    // ---------- 亮度/对比度 ----------
    const bcFolder = this._pane.addFolder({ title: '亮度/对比度', expanded: false });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.enabled', { label: '启用' });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.brightness', { label: '亮度', min: -1, max: 1, step: 0.01 });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.contrast', { label: '对比度', min: -1, max: 1, step: 0.01 });
  }

  /**
   * 辅助函数，用于创建绑定、设置事件监听并注册控件，极大简化代码。
   */
  private addBinding(folder: any, key: string, options: any) {
    const pathParts = key.split('.');
    let target = this.configData;
    for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]];
    }
    const property = pathParts[pathParts.length - 1];

    const control = folder.addBinding(target, property, options);
    control.on('change', (ev: { value: any; }) => config.set(key, ev.value));
    this.controls.set(key, control);
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

  refresh() {
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
