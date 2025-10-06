/**
 * @file path-entity.js
 * @description 路径实体 - 动态轨迹线条 + 实时绘制 + 材质辉光注册
 * ✅ 使用容器缩放而非数据重映射
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class PathEntity {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.pathLine = null;
    this.allPoints = [];
    this.currentDrawIndex = 0;
    
    this.pathContainer = null; // ✅ 独立缩放容器
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('PathEntity', '路径实体已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      // ✅ 创建独立缩放容器并挂载到路径锚点
      this.pathContainer = new THREE.Group();
      this.pathContainer.name = 'PathContainer';
      
      // ✅ 初始化时设置一次缩放
      const initialScale = config.get('path.scale') || 1.0;
      this.pathContainer.scale.setScalar(initialScale);
      
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.add(this.pathContainer);

      this._bindEvents();

      this.initialized = true;
      logger.info('PathEntity', '路径实体初始化完成（已接入坐标系统）');

      return this;
    } catch (err) {
      logger.error('PathEntity', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('data-loaded', (data) => {
      this.allPoints = data.points;
      this.currentDrawIndex = 0;
      this._createPath();
    });

    // ❌ 删除：不再监听 data-scaled
    // this.eventBus.on('data-scaled', (data) => { ... });

    this.eventBus.on('moving-light-position-updated', (position) => {
      this._updatePathToPosition(position);
    });

    this.eventBus.on('animation-step-updated', (step) => {
      this._jumpToStep(step);
    });

    this.eventBus.on('path-color-changed', (color) => {
      if (this.pathLine) {
        this.pathLine.material.uniforms.uColor.value.set(color);
        this.pathLine.material.uniforms.uEmissive.value.set(color);
      }
    });

    this.eventBus.on('path-depth-intensity-changed', (intensity) => {
      if (this.pathLine) {
        this.pathLine.material.uniforms.uDepthIntensity.value = intensity;
      }
    });

    this.eventBus.on('animation-reset', () => {
      this.currentDrawIndex = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });

    // ✅ 路径独立缩放（核心逻辑）
    this.eventBus.on('path-scale-changed', (scale) => {
      if (this.pathContainer) {
        this.pathContainer.scale.setScalar(scale);
        logger.debug('PathEntity', `路径已缩放: ${scale.toFixed(2)}x`);
      }
    });
  }

  _createPath() {
    if (!this.allPoints || this.allPoints.length === 0) {
      logger.warn('PathEntity', '路径点为空');
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

    const pathColor = config.get('environment.pathColor') || '#F0B7B7';
    const depthIntensity = config.get('path.depthIntensity') || 0.5;
    const emissiveIntensity = config.get('material.path.emissiveIntensity') || 0.8;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(pathColor) },
        uEmissive: { value: new THREE.Color(pathColor) },
        uEmissiveIntensity: { value: emissiveIntensity },
        uDepthIntensity: { value: depthIntensity },
        uCameraPosition: { value: new THREE.Vector3() },
        uMaxDistance: { value: 100.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uEmissiveIntensity;
        uniform float uDepthIntensity;
        uniform vec3 uCameraPosition;
        uniform float uMaxDistance;
        
        varying vec3 vWorldPosition;
        
        void main() {
          vec3 finalColor = uColor + uEmissive * uEmissiveIntensity;
          
          float distToCamera = length(vWorldPosition - uCameraPosition);
          float fade = smoothstep(0.0, uMaxDistance, distToCamera);
          float alpha = 1.0 - fade * uDepthIntensity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };
    
    this.pathContainer.add(this.pathLine);

    this.eventBus.emit('material-registered', {
      name: 'path',
      material: material
    });

    // ✅ 移除：不再每次创建路径时重新设置缩放

    this.currentDrawIndex = 0;

    logger.info('PathEntity', `路径已创建: 总点数 ${this.allPoints.length}`);
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
    logger.info('PathEntity', '路径实体已销毁');
  }
}

const pathEntity = new PathEntity();
export default pathEntity;
