/**
 * @file path-sys.js
 * @description 路径系统 - 动态轨迹线条 + 实时绘制
 * ✅ 重构: 监听统一的 'config-changed' 事件
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';
import materialSys from './material-sys.js';


class PathSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.pathLine = null;
    this.allPoints = [];
    this.currentDrawIndex = 0;
    
    this.pathContainer = null;
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('PathSystem', '路径系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this.pathContainer = new THREE.Group();
      this.pathContainer.name = 'PathContainer';
      
      const initialScale = config.get('path.scale') || 1.0;
      this.pathContainer.scale.setScalar(initialScale);
      
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.add(this.pathContainer);

      this._bindEvents();

      this.initialized = true;
      logger.info('PathSystem', '路径系统初始化完成');

      return this;
    } catch (err) {
      logger.error('PathSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('data-loaded', (data) => {
      this.allPoints = data.points;
      this.currentDrawIndex = 0;
      this._createPath();
    });

    this.eventBus.on('moving-light-position-updated', (position) => {
      this._updatePathToPosition(position);
    });

    this.eventBus.on('animation-step-updated', (step) => {
      this._jumpToStep(step);
    });

    this.eventBus.on('animation-reset', () => {
      this.currentDrawIndex = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });

    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }

  /**
   * ✅ 新增: 统一处理配置变更
   * @param {{key: string, value: any}} param0
   */
  _handleConfigChange({ key, value }) {
    if (!this.pathLine) return;

    switch (key) {
      case 'path.scale':
        if (this.pathContainer) {
          this.pathContainer.scale.setScalar(value);
        }
        break;
    }
  }

  _createPath() {
    if (!this.allPoints || this.allPoints.length === 0) {
      logger.warn('PathSystem', '路径点为空');
      return;
    }

    if (this.pathLine) {
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      this.pathLine.material.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    const maxPoints = this.allPoints.length;
    const positions = new Float32Array(maxPoints * 3);
    
    for (let i = 0; i < maxPoints; i++) {
      const point = this.allPoints[i];
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    // 从 MaterialService 获取预创建的材质
const material = materialSys.get('pathLine');

if (!material) {
  logger.error('PathSystem', '无法从 MaterialService 获取 "pathLine" 材质，路径无法创建。');
  return;
}

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };
    
    this.pathContainer.add(this.pathLine);

    this.currentDrawIndex = 0;
    logger.info('PathSystem', `路径已创建: 总点数 ${this.allPoints.length}`);
  }

  _updatePathToPosition(position) {
    if (!this.pathLine || !this.allPoints.length) return;

    let closestIndex = 0;
    let minDist = Infinity;

    for (let i = this.currentDrawIndex; i < this.allPoints.length; i++) {
      const dist = position.distanceTo(this.allPoints[i]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
      if (dist > minDist) break;
    }

    if (closestIndex > this.currentDrawIndex) {
      this.currentDrawIndex = closestIndex;
      this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
    }
  }

  _jumpToStep(step) {
    if (!this.pathLine || !this.allPoints.length) return;

    const targetIndex = Math.min(step, this.allPoints.length - 1);
    this.currentDrawIndex = targetIndex;
    this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
  }

  updateCameraPosition(camera) {
    if (this.pathLine && camera) {
      const worldCamPos = camera.position.clone();
      const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
      this.pathLine.material.uniforms.uCameraPosition.value.copy(localCamPos);
    }
  }

  update(delta) {
    // 占位
  }

  enable() {
    if (this.pathContainer) {
      this.pathContainer.visible = true;
      logger.debug('PathSystem', '已启用');
    }
  }

  disable() {
    if (this.pathContainer) {
      this.pathContainer.visible = false;
      logger.debug('PathSystem', '已禁用');
    }
  }

  dispose() {
    if (this.pathLine) {
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      this.pathLine.material.dispose();
    }

    if (this.pathContainer && this.coordinateSystem) {
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.remove(this.pathContainer);
    }

    this.initialized = false;
    logger.info('PathSystem', '路径系统已销毁');
  }
}

const pathSys = new PathSystem();
export default pathSys;
