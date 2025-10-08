/**
 * @file ui-material.js
 * @description 材质辉光控制面板
 * ✅ 核心改造: 所有控件的 'change' 事件现在直接调用 config.set()。
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIMaterial {
  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIMaterial', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    
    this._pane = new Pane({
      title: '材质辉光',
      expanded: false,
      container: uiContainer.getScrollContent()
    });

    this._createMaterialControls();

    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-material', this);
    
    logger.info('UIMaterial', '材质辉光 UI 已初始化');
  }

  _createMaterialControls() {
    // ========== 路径辉光 ==========
    const pathFolder = this._pane.addFolder({ title: '路径辉光', expanded: true });
    
    const pathEnabled = pathFolder.addBinding(
      this.configData.material.path,
      'enabled',
      { label: '启用' }
    );
    pathEnabled.on('change', (ev) => {
      config.set('material.path.enabled', ev.value); // ✅
    });
    this.controls.set('material.path.enabled', pathEnabled);
    
    const pathIntensity = pathFolder.addBinding(
      this.configData.material.path,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    pathIntensity.on('change', (ev) => {
      config.set('material.path.emissiveIntensity', ev.value); // ✅
    });
    this.controls.set('material.path.emissiveIntensity', pathIntensity);
    
    // ========== 粒子辉光 ==========
    const particlesFolder = this._pane.addFolder({ title: '粒子辉光', expanded: false });
    
    const particlesEnabled = particlesFolder.addBinding(
      this.configData.material.particles,
      'enabled',
      { label: '启用' }
    );
    particlesEnabled.on('change', (ev) => {
      config.set('material.particles.enabled', ev.value); // ✅
    });
    this.controls.set('material.particles.enabled', particlesEnabled);
    
    const particlesIntensity = particlesFolder.addBinding(
      this.configData.material.particles,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 2, step: 0.1 }
    );
    particlesIntensity.on('change', (ev) => {
      config.set('material.particles.emissiveIntensity', ev.value); // ✅
    });
    this.controls.set('material.particles.emissiveIntensity', particlesIntensity);
    
    // ========== 移动光点辉光 ==========
    const movingLightFolder = this._pane.addFolder({ title: '移动光点辉光', expanded: false });
    
    const movingLightEnabled = movingLightFolder.addBinding(
      this.configData.material.movingLight,
      'enabled',
      { label: '启用' }
    );
    movingLightEnabled.on('change', (ev) => {
      config.set('material.movingLight.enabled', ev.value); // ✅
    });
    this.controls.set('material.movingLight.enabled', movingLightEnabled);
    
    const movingLightIntensity = movingLightFolder.addBinding(
      this.configData.material.movingLight,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    movingLightIntensity.on('change', (ev) => {
      config.set('material.movingLight.emissiveIntensity', ev.value); // ✅
    });
    this.controls.set('material.movingLight.emissiveIntensity', movingLightIntensity);
  }

  updateBindings() {
    // 材质辉光直接绑定到 configData，无需手动更新
    logger.debug('UIMaterial', '绑定检查完成（无临时对象）');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIMaterial', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    this.controls.clear();
    this._isInitialized = false;
    logger.info('UIMaterial', '材质辉光 UI 已清理');
  }
}

export default new UIMaterial();
