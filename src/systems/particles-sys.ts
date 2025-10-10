/**
 * @file particles-sys.ts
 * @description 粒子系统 - 球形分布 + 自转 + 呼吸 + 浮动效果
 * ✨ 重构: 移除了对旧辉光属性 material.particles.emissiveIntensity 的监听。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

const DEFAULT_SPHERE_RADIUS = 1600;
// const _DEFAULT_SYSTEM_SCALE = 1.0;
const DEFAULT_BREATH_INTENSITY = 0.1;
const DEFAULT_BREATH_PERIOD = 3.0;
const DEFAULT_FLOAT_INTENSITY = 0.3;
const DEFAULT_FLOAT_PERIOD = 4.0;

class ParticlesSystem {
  private eventBus: any;

  // ✅ 公共属性
  public scene: THREE.Scene | null = null;
  public baseRadius: number = 1600;

  private coordinateSystem: any;
  private initialized: boolean;
  private dustParticles: any;
  private particleContainer: any;
  private rotationAxis: THREE.Vector3;
  private rotationSpeed: number;
  private tiltXZ: number;
  private tiltXY: number;

  private breathIntensity: number;
  private breathPeriod: number;
  private floatIntensity: number;
  private floatPeriod: number;
  private initialPositions: any;
  private baseSize: number;

  constructor() {
    this.eventBus = null;

    this.coordinateSystem = null;
    this.initialized = false;

    this.dustParticles = null;
    this.particleContainer = null;

    this.rotationAxis = new THREE.Vector3(0, 1, 0);
    this.rotationSpeed = 0;
    this.tiltXZ = 0;
    this.tiltXY = 0;

    this.breathIntensity = DEFAULT_BREATH_INTENSITY;
    this.breathPeriod = DEFAULT_BREATH_PERIOD;
    this.floatIntensity = DEFAULT_FLOAT_INTENSITY;
    this.floatPeriod = DEFAULT_FLOAT_PERIOD;

    this.initialPositions = null;
    this.baseSize = 0.6;
  }

  init({
    eventBus,
    scene,
    coordinateSystem,
  }: {
    eventBus: any;
    scene: THREE.Scene;
    coordinateSystem: any;
  }) {
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

      const initialScale = config.get('particles.systemScale') ?? 1.0;
      this.particleContainer.scale.setScalar(initialScale);
      logger.info('ParticlesSystem', `初始粒子缩放: ${initialScale}x`);

      this._createDustParticles();
      this._bindEvents();
      this._loadInitialConfig();

      this.initialized = true;
      logger.info('ParticlesSystem', '粒子系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('ParticlesSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createDustParticles() {
    const count = config.get('particles.dustCount') ?? 3000;
    const radius = config.get('particles.sphereRadius') ?? DEFAULT_SPHERE_RADIUS;

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

    const material = materialSys.get('dustParticles');

    if (!material) {
      logger.error(
        'ParticlesSystem',
        '无法从 MaterialService 获取 "dustParticles" 材质，粒子无法创建。'
      );
      return;
    }

    this.baseSize = config.get('particles.dustSize') ?? 0.6;

    this.dustParticles = new THREE.Points(geometry, material);
    this.dustParticles.name = 'DustParticles';
    this.dustParticles.userData = { glow: true };

    this.particleContainer.add(this.dustParticles);

    postprocessSys.addGlowObject(this.dustParticles);

    logger.debug('ParticlesSystem', `尘埃粒子已创建: ${count} 个`);
  }

  _bindEvents() {
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }

  _loadInitialConfig() {
    this.breathIntensity = config.get('particles.breathIntensity');
    this.floatIntensity = config.get('particles.floatIntensity');
    this.rotationSpeed = config.get('particles.rotationSpeed');
    this.tiltXZ = config.get('particles.rotationTiltXZ');
    this.tiltXY = config.get('particles.rotationTiltXY');
    this._updateRotationAxis();
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
    if (!this.dustParticles) return;

    switch (key) {
      case 'particles.dustColor':
        (this.dustParticles.material as THREE.PointsMaterial).color.set(value);
        break;

      case 'particles.dustSize':
        this.baseSize = value;
        (this.dustParticles.material as THREE.PointsMaterial).size = value;
        break;

      case 'particles.dustOpacity':
        (this.dustParticles.material as THREE.PointsMaterial).opacity = value;
        break;

      case 'particles.systemScale':
        if (this.particleContainer) {
          this.particleContainer.scale.setScalar(value);
        }
        break;

      case 'particles.dustCount':
        this._rebuildDustParticles(value);
        break;

      case 'particles.rotationSpeed':
        this.rotationSpeed = value;
        break;

      case 'particles.rotationTiltXZ':
        this.tiltXZ = value;
        this._updateRotationAxis();
        break;

      case 'particles.rotationTiltXY':
        this.tiltXY = value;
        this._updateRotationAxis();
        break;

      case 'particles.breathIntensity':
        this.breathIntensity = value;
        break;

      case 'particles.floatIntensity':
        this.floatIntensity = value;
        break;
    }
  }

  _updateRotationAxis() {
    const radXZ = (this.tiltXZ * Math.PI) / 180;
    const radXY = (this.tiltXY * Math.PI) / 180;

    const axis = new THREE.Vector3(0, 1, 0);
    axis.applyAxisAngle(new THREE.Vector3(1, 0, 0), radXY);
    axis.applyAxisAngle(new THREE.Vector3(0, 0, 1), radXZ);

    this.rotationAxis.copy(axis.normalize());
  }

  _rebuildDustParticles(count: number) {
    if (this.dustParticles) {
      this.particleContainer?.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
    }

    this._createDustParticles();

    logger.info('ParticlesSystem', `粒子系统已重建: ${count} 个`);
  }

  update(elapsed: number) {
    if (this.dustParticles && this.rotationSpeed !== 0) {
      // Note: The rotation is not frame-rate independent here. For smoother results, multiply by delta in the main loop.
      this.dustParticles.rotateOnAxis(this.rotationAxis, this.rotationSpeed * 0.001);
    }

    if (this.dustParticles && this.initialPositions) {
      const positions = this.dustParticles.geometry.attributes.position.array as Float32Array;
      const sizes = this.dustParticles.geometry.attributes.size.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const phaseOffset = sizes[i] ?? 0; // ✅ 提供默认值

        const floatPhase = elapsed / this.floatPeriod + phaseOffset;
        const floatOffset = Math.sin(floatPhase * Math.PI * 2) * this.floatIntensity;

        positions[i * 3 + 1] = this.initialPositions[i * 3 + 1] + floatOffset;
      }

      this.dustParticles.geometry.attributes.position.needsUpdate = true;

      const globalBreath =
        1.0 + Math.sin((elapsed / this.breathPeriod) * Math.PI * 2) * this.breathIntensity * 0.3;
      (this.dustParticles.material as THREE.PointsMaterial).size = this.baseSize * globalBreath;
    }
  }

  enable() {
    if (this.particleContainer) {
      this.particleContainer.visible = true;
      logger.debug('ParticlesSystem', '已启用');
    }
  }

  disable() {
    if (this.particleContainer) {
      this.particleContainer.visible = false;
      logger.debug('ParticlesSystem', '已禁用');
    }
  }

  dispose() {
    if (this.dustParticles && this.particleContainer) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
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
