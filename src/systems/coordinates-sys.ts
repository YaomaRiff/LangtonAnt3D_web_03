/**
 * @file coordinates-sys.js
 * @description 统一坐标系统 - 管理所有3D对象的坐标空间
 * ✅ 核心改造: 
 *   1. 监听统一的 'config-changed' 事件。
 *   2. 移除了方法内的 config.set() 调用，确保单向数据流。
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class CoordinateSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.initialized = false;

    this.worldRoot = null;
    this.dataSpace = null;
    this.particleAnchor = null;
    this.pathAnchor = null;
    this.lightAnchor = null;
  }

  init({ eventBus, scene }) {
    if (this.initialized) {
      logger.warn('CoordinateSystem', '坐标系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;

      this._createHierarchy();
      this._bindEvents();
      this._loadInitialConfig();

      this.initialized = true;
      logger.info('CoordinateSystem', '坐标系统初始化完成');

      return this;
    } catch (err) {
      logger.error('CoordinateSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createHierarchy() {
    this.worldRoot = new THREE.Group();
    this.worldRoot.name = 'WorldRoot';
    this.scene.add(this.worldRoot);

    this.dataSpace = new THREE.Group();
    this.dataSpace.name = 'DataSpace';
    this.worldRoot.add(this.dataSpace);

    this.particleAnchor = new THREE.Group();
    this.particleAnchor.name = 'ParticleSystemAnchor';
    this.dataSpace.add(this.particleAnchor);

    this.pathAnchor = new THREE.Group();
    this.pathAnchor.name = 'PathSystemAnchor';
    this.dataSpace.add(this.pathAnchor);

    this.lightAnchor = new THREE.Group();
    this.lightAnchor.name = 'LightSystemAnchor';
    this.dataSpace.add(this.lightAnchor);

    logger.debug('CoordinateSystem', '坐标层级结构已创建');
  }

  _bindEvents() {
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
    
    // ✅ 保留命令式事件
    this.eventBus.on('coordinate-system-reset', () => this.reset());
  }

  _loadInitialConfig() {
    const scale = config.get('coordinates.dataSpace.scale');
    this.setDataSpaceScale(scale);
    
    const rotation = config.get('coordinates.dataSpace.rotation');
    this.dataSpace.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

    const position = config.get('coordinates.dataSpace.position');
    this.dataSpace.position.set(position.x || 0, position.y || 0, position.z || 0);

    logger.info('CoordinateSystem', `✅ 配置已加载 | 缩放: ${scale}x`);
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }) {
    // 使用 startsWith 来捕获对对象内部属性（如 rotation.x）的更改
    if (key.startsWith('coordinates.dataSpace')) {
      switch (key) {
        case 'coordinates.dataSpace.scale':
          this.setDataSpaceScale(value);
          break;
        
        // 当 rotation 或 position 的任何子属性变化时，都完整更新
        case 'coordinates.dataSpace.rotation.x':
        case 'coordinates.dataSpace.rotation.y':
        case 'coordinates.dataSpace.rotation.z':
          const rot = config.get('coordinates.dataSpace.rotation');
          this.dataSpace.rotation.set(rot.x, rot.y, rot.z);
          break;
          
        case 'coordinates.dataSpace.position.x':
        case 'coordinates.dataSpace.position.y':
        case 'coordinates.dataSpace.position.z':
          const pos = config.get('coordinates.dataSpace.position');
          this.dataSpace.position.set(pos.x, pos.y, pos.z);
          break;
      }
    }
  }

  /**
   * 设置DataSpace整体缩放
   */
  setDataSpaceScale(scale) {
    if (scale <= 0) return;
    this.dataSpace.scale.setScalar(scale);
    // ❌ 移除 config.set 以避免循环
    this.eventBus.emit('coordinate-system-updated', { type: 'scale', value: scale });
  }

  /**
   * 重置坐标系统到初始状态
   */
  reset() {
    // 通过 config.set 触发更新，让数据流保持一致
    config.set('coordinates.dataSpace.scale', 1.0);
    config.set('coordinates.dataSpace.rotation', { x: 0, y: 0, z: 0 });
    config.set('coordinates.dataSpace.position', { x: 0, y: 0, z: 0 });

    logger.info('CoordinateSystem', '坐标系统重置请求已发送');
    this.eventBus.emit('coordinate-system-reset-completed');
  }

  getParticleAnchor() { return this.particleAnchor; }
  getPathAnchor() { return this.pathAnchor; }
  getLightAnchor() { return this.lightAnchor; }

  dispose() {
    if (this.worldRoot) this.scene.remove(this.worldRoot);
    this.initialized = false;
    logger.info('CoordinateSystem', '坐标系统已销毁');
  }
}

const coordinateSystem = new CoordinateSystem();
export default coordinateSystem;
