/**
 * @file ui-material.js
 * @description 材质辉光控制面板 - 直接绑定到 config._config + 手动更新临时对象
 * ✅ 修复：在 constructor 中获取配置 + 添加 updateBindings() 方法
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
    
    // ✅ 在 constructor 中获取配置引用
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

    // ✅ 注册到UIRegistry
    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-material', this);
    
    logger.info('UIMaterial', '材质辉光 UI 已初始化(直接绑定)');
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
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'path', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.path.enabled', pathEnabled);
    
    const pathIntensity = pathFolder.addBinding(
      this.configData.material.path,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    
    pathIntensity.on('change', (ev) => {
      eventBus.emit('material-glow-intensity-changed', { 
        target: 'path', 
        intensity: ev.value 
      });
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
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'particles', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.particles.enabled', particlesEnabled);
    
    const particlesIntensity = particlesFolder.addBinding(
      this.configData.material.particles,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 2, step: 0.1 }
    );
    
    particlesIntensity.on('change', (ev) => {
      eventBus.emit('particle-emissive-intensity-changed', ev.value);
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
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'movingLight', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.movingLight.enabled', movingLightEnabled);
    
    const movingLightIntensity = movingLightFolder.addBinding(
      this.configData.material.movingLight,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    
    movingLightIntensity.on('change', (ev) => {
      eventBus.emit('moving-light-emissive-intensity-changed', ev.value);
    });
    
    this.controls.set('material.movingLight.emissiveIntensity', movingLightIntensity);
  }

  // ✅ 新增：手动更新所有绑定（材质辉光没有临时对象，直接刷新即可）
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
