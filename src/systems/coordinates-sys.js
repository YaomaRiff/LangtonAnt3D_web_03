/**
 * @file coordinates-sys.js
 * @description 统一坐标系统 - 管理所有3D对象的坐标空间
 * 
 * 架构说明:
 * Scene (全局场景)
 *   └─ WorldRoot (世界根节点, position=[0,0,0], scale=1)
 *       └─ DataSpace (数据坐标空间, 可整体缩放/旋转/平移)
 *           ├─ ParticleSystemAnchor (粒子系统锚点)
 *           │   └─ ParticleSystem (独立缩放)
 *           ├─ PathSystemAnchor (路径系统锚点)
 *           │   └─ PathLine (独立缩放)
 *           └─ LightSystemAnchor (移动光点锚点)
 *               └─ MovingLight
 * 
 * Camera (独立于WorldRoot, 避免正交相机视锥体问题)
 * 已删除：整体旋转功能
 */

import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class CoordinateSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.initialized = false;

    // 坐标层级节点
    this.worldRoot = null;      // 世界根节点
    this.dataSpace = null;       // 数据坐标空间
    
    // 子系统锚点
    this.particleAnchor = null;
    this.pathAnchor = null;
    this.lightAnchor = null;

    // 坐标系统状态
    this.dataSpaceScale = 1.0;
    this.dataSpaceRotation = new THREE.Euler(0, 0, 0);
    this.dataSpacePosition = new THREE.Vector3(0, 0, 0);
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
      this._loadConfig();

      this.initialized = true;
      logger.info('CoordinateSystem', '坐标系统初始化完成');

      return this;
    } catch (err) {
      logger.error('CoordinateSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * 创建坐标层级结构
   */
  _createHierarchy() {
    // 1. 世界根节点
    this.worldRoot = new THREE.Group();
    this.worldRoot.name = 'WorldRoot';
    this.scene.add(this.worldRoot);

    // 2. 数据坐标空间
    this.dataSpace = new THREE.Group();
    this.dataSpace.name = 'DataSpace';
    this.worldRoot.add(this.dataSpace);

    // 3. 粒子系统锚点
    this.particleAnchor = new THREE.Group();
    this.particleAnchor.name = 'ParticleSystemAnchor';
    this.dataSpace.add(this.particleAnchor);

    // 4. 路径系统锚点
    this.pathAnchor = new THREE.Group();
    this.pathAnchor.name = 'PathSystemAnchor';
    this.dataSpace.add(this.pathAnchor);

    // 5. 移动光点锚点
    this.lightAnchor = new THREE.Group();
    this.lightAnchor.name = 'LightSystemAnchor';
    this.dataSpace.add(this.lightAnchor);

    logger.debug('CoordinateSystem', '坐标层级结构已创建');
  }

  /**
   * 绑定事件监听
   */
  _bindEvents() {
    // 监听DataSpace缩放
    this.eventBus.on('dataspace-scale-changed', (scale) => {
      this.setDataSpaceScale(scale);
    });

    // 监听DataSpace旋转
    this.eventBus.on('dataspace-rotation-changed', ({ axis, angle }) => {
      this.setDataSpaceRotation(axis, angle);
    });

    // 监听DataSpace位置
    this.eventBus.on('dataspace-position-changed', (position) => {
      this.setDataSpacePosition(position);
    });

    // 监听坐标系统重置
    this.eventBus.on('coordinate-system-reset', () => {
      this.reset();
    });
  }

  /**
   * 从配置加载初始状态
   */
  _loadConfig() {
    const scale = config.get('coordinates.dataSpace.scale');
    const rotation = config.get('coordinates.dataSpace.rotation');
    const position = config.get('coordinates.dataSpace.position');

    if (scale !== undefined) {
      this.setDataSpaceScale(scale);
    }

    if (rotation) {
      this.dataSpace.rotation.set(
        rotation.x || 0,
        rotation.y || 0,
        rotation.z || 0
      );
      this.dataSpaceRotation.copy(this.dataSpace.rotation);
    }

    if (position) {
      this.dataSpace.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
      );
      this.dataSpacePosition.copy(this.dataSpace.position);
    }

    logger.info('CoordinateSystem', `✅ 配置已加载 | 缩放: ${this.dataSpaceScale}x`);
  }

  /**
   * 设置DataSpace整体缩放
   */
  setDataSpaceScale(scale) {
    if (scale <= 0) {
      logger.warn('CoordinateSystem', '缩放值必须大于0');
      return;
    }

    this.dataSpaceScale = scale;
    this.dataSpace.scale.setScalar(scale);
    
    config.set('coordinates.dataSpace.scale', scale);
    this.eventBus.emit('coordinate-system-updated', { type: 'scale', value: scale });
    
    logger.debug('CoordinateSystem', `DataSpace缩放: ${scale}`);
  }

  /**
   * 设置DataSpace旋转
   * @param {string} axis - 'x', 'y', 或 'z'
   * @param {number} angle - 弧度值
   */
  setDataSpaceRotation(axis, angle) {
    if (!['x', 'y', 'z'].includes(axis)) {
      logger.warn('CoordinateSystem', '无效的旋转轴');
      return;
    }

    this.dataSpaceRotation[axis] = angle;
    this.dataSpace.rotation[axis] = angle;

    config.set(`coordinates.dataSpace.rotation.${axis}`, angle);
    this.eventBus.emit('coordinate-system-updated', { 
      type: 'rotation', 
      axis, 
      value: angle 
    });

    logger.debug('CoordinateSystem', `DataSpace旋转 ${axis}: ${angle}`);
  }

  /**
   * 设置DataSpace位置
   */
  setDataSpacePosition(position) {
    this.dataSpacePosition.copy(position);
    this.dataSpace.position.copy(position);

    config.set('coordinates.dataSpace.position', {
      x: position.x,
      y: position.y,
      z: position.z
    });

    this.eventBus.emit('coordinate-system-updated', { 
      type: 'position', 
      value: position 
    });

    logger.debug('CoordinateSystem', 'DataSpace位置:', position);
  }

  /**
   * 重置坐标系统到初始状态
   */
  reset() {
    this.setDataSpaceScale(1.0);
    this.dataSpace.rotation.set(0, 0, 0);
    this.dataSpace.position.set(0, 0, 0);
    this.dataSpaceRotation.set(0, 0, 0);
    this.dataSpacePosition.set(0, 0, 0);

    logger.info('CoordinateSystem', '坐标系统已重置');
    this.eventBus.emit('coordinate-system-reset-completed');
  }

  /**
   * 获取锚点（供子系统挂载对象）
   */
  getParticleAnchor() { return this.particleAnchor; }
  getPathAnchor() { return this.pathAnchor; }
  getLightAnchor() { return this.lightAnchor; }

  /**
   * 获取DataSpace的世界坐标位置（用于相机lookAt）
   */
  getWorldPosition(target = new THREE.Vector3()) {
    return this.dataSpace.getWorldPosition(target);
  }

  /**
   * 获取当前状态
   */
  getState() {
    return {
      scale: this.dataSpaceScale,
      rotation: this.dataSpaceRotation.clone(),
      position: this.dataSpacePosition.clone()
    };
  }

  /**
   * 调试信息
   */
  debugInfo() {
    return {
      worldRoot: {
        position: this.worldRoot.position.toArray(),
        scale: this.worldRoot.scale.toArray()
      },
      dataSpace: {
        position: this.dataSpace.position.toArray(),
        rotation: [
          this.dataSpace.rotation.x,
          this.dataSpace.rotation.y,
          this.dataSpace.rotation.z
        ],
        scale: this.dataSpace.scale.toArray()
      },
      anchors: {
        particle: this.particleAnchor.children.length,
        path: this.pathAnchor.children.length,
        light: this.lightAnchor.children.length
      }
    };
  }

  dispose() {
    if (this.worldRoot) {
      this.scene.remove(this.worldRoot);
    }

    this.initialized = false;
    logger.info('CoordinateSystem', '坐标系统已销毁');
  }
}

const coordinateSystem = new CoordinateSystem();
export default coordinateSystem;
