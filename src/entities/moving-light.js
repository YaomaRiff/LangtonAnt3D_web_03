/**
 * @file moving-light.js
 * @description 移动光点实体 - 沿路径移动的单一发光粒子
 * ✅ 修复材质警告
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class MovingLight {
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
      logger.warn('MovingLight', '移动光点已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this._createLight();
      this._bindEvents();

      this.initialized = true;
      logger.info('MovingLight', '移动光点初始化完成（已接入坐标系统）');

      return this;
    } catch (err) {
      logger.error('MovingLight', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createLight() {
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    
    const lightColor = config.get('particles.pathPointColor') || '#FFFFFF';
    
    // ✅ MeshBasicMaterial 只需要 color，不需要 emissive
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(lightColor),
      transparent: true,
      opacity: 0.9
    });

    // ✅ 无需额外标记,userData.glow 已足够
    
    this.lightMesh = new THREE.Mesh(geometry, material);
    this.lightMesh.name = 'MovingLight';
    this.lightMesh.visible = false;
    this.lightMesh.userData = { glow: true }; // ✅ 标记为辉光对象
    
    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.lightMesh);

    // ✅ 注册材质到 MaterialSystem
  this.eventBus.emit('material-registered', {
    name: 'movingLight',
    material: material
  });
    
    logger.debug('MovingLight', '光点已创建');
  }

  _bindEvents() {
    this.eventBus.on('moving-light-position-updated', (position) => {
      this.updatePosition(position);
    });

    this.eventBus.on('animation-reset', () => {
      this.hide();
    });

    this.eventBus.on('path-point-color-changed', (color) => {
      if (this.lightMesh) {
        this.lightMesh.material.color.set(color);
      }
    });

    // ✅ 移除不必要的 emissive 事件监听
    // this.eventBus.on('moving-light-emissive-intensity-changed', ...)

    this.eventBus.on('path-point-size-changed', (size) => {
      if (this.lightMesh) {
        this.lightMesh.scale.setScalar(size);
      }
    });
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

  dispose() {
    if (this.lightMesh && this.coordinateSystem) {
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.lightMesh);
      this.lightMesh.geometry.dispose();
      this.lightMesh.material.dispose();
    }

    this.initialized = false;
    logger.info('MovingLight', '移动光点已销毁');
  }
}

const movingLight = new MovingLight();
export default movingLight;
