/**
 * @file particles-sys.js
 * @description 粒子系统 - 球形分布 + 自转 + 呼吸 + 浮动效果
 * ✅ 修改：sphereRadius 默认1600，systemScale 默认1.0
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

const DEFAULT_SPHERE_RADIUS = 1600;
const DEFAULT_SYSTEM_SCALE = 1.0;
const DEFAULT_BREATH_INTENSITY = 0.1;
const DEFAULT_BREATH_PERIOD = 3.0;
const DEFAULT_FLOAT_INTENSITY = 0.3;
const DEFAULT_FLOAT_PERIOD = 4.0;

class ParticlesSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.dustParticles = null;
    this.particleContainer = null;
    
    this.rotationAxis = new THREE.Vector3(0, 1, 0);
    this.rotationSpeed = 0;
    this.tiltXZ = 0;
    this.tiltXY = 0;
    
    this.baseRadius = DEFAULT_SPHERE_RADIUS;
    this.breathIntensity = DEFAULT_BREATH_INTENSITY;
    this.breathPeriod = DEFAULT_BREATH_PERIOD;
    this.floatIntensity = DEFAULT_FLOAT_INTENSITY;
    this.floatPeriod = DEFAULT_FLOAT_PERIOD;
    
    this.initialPositions = null;
    this.baseSize = 0.6;
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('ParticlesSystem', '粒子系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this.particleContainer = new THREE.Group();
      this.particleContainer.name = 'ParticleContainer';
      
      const particleAnchor = this.coordinateSystem.getParticleAnchor();
      particleAnchor.add(this.particleContainer);

      // ✅ 默认缩放改回1.0
      const initialScale = config.get('particles.systemScale') ?? 1.0;
      this.particleContainer.scale.setScalar(initialScale);
      logger.info('ParticlesSystem', `✅ 初始粒子缩放: ${initialScale}x`);

      this._createDustParticles();
      this._bindEvents();

      this.initialized = true;
      logger.info('ParticlesSystem', '粒子系统初始化完成');

      return this;
    } catch (err) {
      logger.error('ParticlesSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createDustParticles() {
    const count = config.get('particles.dustCount') ?? 3000;
    const radius = config.get('particles.sphereRadius') ?? DEFAULT_SPHERE_RADIUS;  // ✅ 使用常量
    
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      
      sizes[i] = Math.random() * Math.PI * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    this.initialPositions = positions.slice();
    
    const dustColor = config.get('particles.dustColor') ?? '#AF85B7';
    this.baseSize = config.get('particles.dustSize') ?? 0.6;
    const dustOpacity = config.get('particles.dustOpacity') ?? 0.6;
    const emissiveIntensity = config.get('material.particles.emissiveIntensity') ?? 0.3;
    
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(dustColor),
      size: this.baseSize,
      opacity: dustOpacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      sizeAttenuation: true
    });
    
    material.userData = {
      emissive: new THREE.Color(dustColor),
      emissiveIntensity: emissiveIntensity,
       isParticleMaterial: true  // ✅ 标记为粒子材质
    };
    
    this.dustParticles = new THREE.Points(geometry, material);
    this.dustParticles.name = 'DustParticles';
    this.dustParticles.userData = { glow: true };  // ✅ 标记为辉光对象
    
    this.particleContainer.add(this.dustParticles);

    // ✅ 注册材质到 MaterialSystem
  this.eventBus.emit('material-registered', {
    name: 'particles',
    material: material
  });
    
    logger.debug('ParticlesSystem', `尘埃粒子已创建: ${count} 个`);
  }

  _bindEvents() {
    this.eventBus.on('dust-color-changed', (color) => {
      if (this.dustParticles) {
        this.dustParticles.material.color.set(color);
        this.dustParticles.material.userData.emissive.set(color);
      }
    });

    this.eventBus.on('dust-size-changed', (size) => {
      this.baseSize = size;
      if (this.dustParticles) {
        this.dustParticles.material.size = size;
      }
    });

    this.eventBus.on('dust-opacity-changed', (opacity) => {
      if (this.dustParticles) {
        this.dustParticles.material.opacity = opacity;
      }
    });

    this.eventBus.on('particle-system-scale-changed', (scale) => {
      if (this.particleContainer) {
        this.particleContainer.scale.setScalar(scale);
        logger.debug('ParticlesSystem', `粒子容器已缩放: ${scale}x`);
      }
    });

    this.eventBus.on('dust-count-changed', (count) => {
      this._rebuildDustParticles(count);
    });

    this.eventBus.on('rotation-speed-changed', (speed) => {
      this.rotationSpeed = speed;
    });

    this.eventBus.on('rotation-tilt-xz-changed', (angle) => {
      this.tiltXZ = angle;
      this._updateRotationAxis();
    });

    this.eventBus.on('rotation-tilt-xy-changed', (angle) => {
      this.tiltXY = angle;
      this._updateRotationAxis();
    });

    // ✅ 保留呼吸和浮动事件监听
    this.eventBus.on('particle-breath-intensity-changed', (intensity) => {
      this.breathIntensity = intensity;
      config.set('particles.breathIntensity', intensity);
    });

    this.eventBus.on('particle-float-intensity-changed', (intensity) => {
      this.floatIntensity = intensity;
      config.set('particles.floatIntensity', intensity);
    });

    this.eventBus.on('particle-emissive-intensity-changed', (intensity) => {
      if (this.dustParticles) {
        this.dustParticles.material.userData.emissiveIntensity = intensity;
      }
    });
  }

  _updateRotationAxis() {
    const radXZ = (this.tiltXZ * Math.PI) / 180;
    const radXY = (this.tiltXY * Math.PI) / 180;
    
    const axisXZ = new THREE.Vector3(Math.sin(radXZ), Math.cos(radXZ), 0);
    
    const axisXY = new THREE.Vector3(
      axisXZ.x,
      axisXZ.y * Math.cos(radXY) - axisXZ.z * Math.sin(radXY),
      axisXZ.y * Math.sin(radXY) + axisXZ.z * Math.cos(radXY)
    );
    
    this.rotationAxis.copy(axisXY.normalize());
  }

  _rebuildDustParticles(count) {
    if (this.dustParticles) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
      this.dustParticles.material.dispose();
    }

    config.set('particles.dustCount', count);
    this._createDustParticles();
    
    const currentScale = this.particleContainer.scale.x;
    logger.debug('ParticlesSystem', `粒子重建后保持缩放: ${currentScale}x`);
    
    logger.info('ParticlesSystem', `粒子系统已重建: ${count} 个`);
  }

  update(elapsed) {
    // 自转
    if (this.dustParticles && this.rotationSpeed !== 0) {
      this.dustParticles.rotateOnAxis(this.rotationAxis, this.rotationSpeed * 0.01);
    }

    // ✅ 保留粒子呼吸和浮动效果
    if (this.dustParticles && this.initialPositions) {
      const positions = this.dustParticles.geometry.attributes.position.array;
      const sizes = this.dustParticles.geometry.attributes.size.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const phaseOffset = sizes[i];
        
        const breathPhase = elapsed / this.breathPeriod + phaseOffset;
        const breathScale = 1.0 + Math.sin(breathPhase * Math.PI * 2) * this.breathIntensity;
        
        const floatPhase = elapsed / this.floatPeriod + phaseOffset;
        const floatOffset = Math.sin(floatPhase * Math.PI * 2) * this.floatIntensity;
        
        positions[i * 3 + 1] = this.initialPositions[i * 3 + 1] + floatOffset;
      }

      this.dustParticles.geometry.attributes.position.needsUpdate = true;

      const globalBreath = 1.0 + Math.sin(elapsed / this.breathPeriod * Math.PI * 2) * this.breathIntensity * 0.3;
      this.dustParticles.material.size = this.baseSize * globalBreath;
    }
  }

  dispose() {
    if (this.dustParticles) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
      this.dustParticles.material.dispose();
    }

    if (this.particleContainer && this.coordinateSystem) {
      const particleAnchor = this.coordinateSystem.getParticleAnchor();
      particleAnchor.remove(this.particleContainer);
    }

    this.initialized = false;
    logger.info('ParticlesSystem', '粒子系统已销毁');
  }
}

const particlesSys = new ParticlesSystem();
export default particlesSys;
