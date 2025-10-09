/**
 * @file math-light-sys.ts
 * @description 移动光点系统 (数学球体版)
 * ✅ 重构: 监听统一的 'config-changed' 事件
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';


class MathLightSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private coordinateSystem: any;
  private initialized: boolean;
  private lightMesh: any;
  private currentPosition: THREE.Vector3;

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.lightMesh = null;
    this.currentPosition = new THREE.Vector3();
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('MathLightSystem', '移动光点已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this._createLight();
      this._bindEvents();

      this.initialized = true;
      logger.info('MathLightSystem', '移动光点(数学版)初始化完成');

      return this;
    } catch (err) {
      logger.error('MathLightSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createLight() {

    // 🟢 补上丢失的 geometry 定义
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);

    // 从 MaterialService 获取预创建的材质
const material = materialSys.get('movingLight');

if (!material) {
  logger.error('MathLightSystem', '无法从 MaterialService 获取 "movingLight" 材质，光点无法创建。');
  return;
}
    
    this.lightMesh = new THREE.Mesh(geometry, material);
    this.lightMesh.name = 'MovingLight_Math';
    this.lightMesh.visible = false;
    this.lightMesh.userData = { glow: true };
    
    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.lightMesh);

    postprocessSys.addGlowObject(this.lightMesh); // **注册到新的辉光系统**
    
    logger.debug('MathLightSystem', '光点球体已创建');
  }

  _bindEvents() {
    this.eventBus.on('moving-light-position-updated', (position) => {
      this.updatePosition(position);
    });

    this.eventBus.on('animation-reset', () => {
      this.hide();
    });

    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   * @param {{key: string, value: any}} param0
   */
  _handleConfigChange({ key, value }) {
    if (!this.lightMesh) return;
    
    switch (key) {
      case 'particles.pathPointSize':
        this.lightMesh.scale.setScalar(value);
        break;
    }
  }

  updatePosition(position) {
    if (this.lightMesh && position) {
      this.currentPosition.copy(position);
      this.lightMesh.position.copy(position);
      this.lightMesh.visible = true;
    }
  }

  hide() {
    if (this.lightMesh) {
      this.lightMesh.visible = false;
    }
  }

  enable() {
    // 启用光点时，只有在动画进行中才应该可见
    // AnimationSystem 会通过 'moving-light-position-updated' 事件来控制其具体可见性
    // 所以这里只是一个逻辑上的启用标记
    logger.debug('MathLightSystem', '已启用 (可见性由动画系统控制)');
  }

  disable() {
    this.hide(); // 禁用时，强制隐藏
    logger.debug('MathLightSystem', '已禁用');
  }

  dispose() {
    if (this.lightMesh && this.coordinateSystem) {
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.lightMesh);
      this.lightMesh.geometry.dispose();
      this.lightMesh.material.dispose();
    }

    this.initialized = false;
    logger.info('MathLightSystem', '移动光点已销毁');
  }
}

const mathLightSys = new MathLightSystem();
export default mathLightSys;
