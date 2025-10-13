/**
 * @file model-light-renderer.ts
 * @description 3D模型光点渲染器 - 完整版：跟随光源 + 尾焰 + 烟雾 + 抖动 + 调试坐标轴
 * @version 5.3 (BugFix Complete)
 *
 * 🔧 修复：
 *   1. 添加了所有必要的导入
 *   2. 补充了缺失的 _updateDebugConfig 方法
 *   3. 修复了 debugConfig 的作用域问题
 *   4. 移除了未使用的变量警告
 */

import * as THREE from 'three';
import { ILightRenderer } from './light-renderer';
import modelSys from '../model-sys';
import postprocessSys from '../postprocess-sys';
import logger from '../../utils/logger';
import config from '../../config';
import eventBus from '../../event-bus';
import { JitterGenerator } from '../../utils/jitter-generator';
import { createAxisHelper, updateAxisHelper, toggleAxisHelper } from '../../utils/axis-helper';
import visualEffectsSys from '../visual-effects-sys';

// ========== 烟雾粒子类 ==========
class SmokeParticle {
  position: THREE.Vector3 = new THREE.Vector3();
  velocity: THREE.Vector3 = new THREE.Vector3();
  age: number = 0;
  maxAge: number = 2.0;
  size: number = 0.3;
  opacity: number = 1.0;
  rotationPhase: number = Math.random() * Math.PI * 2;

  update(delta: number): boolean {
    this.age += delta;

    const t = this.age / this.maxAge;
    this.opacity = Math.pow(1.0 - t, 2);

    this.size += delta * config.get('exhaust.smoke.sizeGrowth');

    const swirl =
      Math.sin(this.age * 3 + this.rotationPhase) * config.get('exhaust.smoke.swirlIntensity');
    this.velocity.x += swirl * delta;
    this.velocity.z +=
      Math.cos(this.age * 3 + this.rotationPhase) *
      config.get('exhaust.smoke.swirlIntensity') *
      delta;

    this.position.add(this.velocity.clone().multiplyScalar(delta));

    return this.age < this.maxAge;
  }
}

// ========== 主渲染器类 ==========
export class ModelLightRenderer implements ILightRenderer {
  private group: THREE.Group | null = null;
  private followLight: THREE.PointLight | null = null;

  // 🔥 尾焰系统
  private exhaustFlame: THREE.Mesh | null = null;
  private flameMaterial: THREE.ShaderMaterial | null = null;

  // 🔥 烟雾系统
  private smokeParticles: THREE.Points | null = null;
  private smokePool: SmokeParticle[] = [];
  private emitTimer = 0;

  // 核心属性
  private coordinateSystem: any;
  private modelPath: string;
  private previousPosition = new THREE.Vector3();
  private _isReady = false;
  private pendingPosition: THREE.Vector3 | null = null;

  // 竞态条件防护
  private loadAbortController: AbortController | null = null;
  private currentLoadId: number = 0;

  // 朝向平滑插值
  private targetRotation = new THREE.Quaternion();
  private currentRotation = new THREE.Quaternion();
  private baseLerpAlpha = 0.15;

  // 🔥 抖动生成器
  private rocketJitterGen: JitterGenerator | null = null;
  private flameJitterGen: JitterGenerator | null = null;

  // 🔧 调试工具
  private emitterAxisHelper: THREE.Group | null = null;

  // 🔥 性能统计
  private lastUpdateTime = 0;

  constructor(coordinateSystem: any, modelPath = '/models/rocket.glb') {
    this.coordinateSystem = coordinateSystem;
    this.modelPath = modelPath;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  async create(): Promise<void> {
    try {
      if (this.loadAbortController) {
        this.loadAbortController.abort();
      }
      this.loadAbortController = new AbortController();

      const loadId = ++this.currentLoadId;
      logger.info('ModelLightRenderer', `开始加载模型 (loadId=${loadId}): ${this.modelPath}`);

      const loadedModel = await modelSys.load(this.modelPath);

      if (this.loadAbortController?.signal.aborted) {
        logger.warn('ModelLightRenderer', `加载被中止 (loadId=${loadId})`);
        this._cleanupModel(loadedModel);
        return;
      }

      if (loadId !== this.currentLoadId) {
        logger.warn('ModelLightRenderer', `新的加载请求已发出，放弃旧结果 (loadId=${loadId})`);
        return;
      }

      // 创建容器组
      this.group = new THREE.Group();
      this.group.name = 'MovingLight_Model';
      this.group.add(loadedModel);
      this.group.scale.setScalar(1.0);
      this.group.visible = false;

      // 创建跟随光源
      this.followLight = new THREE.PointLight('#ffffff', 2.0, 50);
      this.followLight.position.set(0, 5, 5);
      this.followLight.name = 'FollowLight';
      this.group.add(this.followLight);

      // 🔥 核心：创建尾焰
      this._createExhaustFlame();

      // 创建烟雾系统
      this._createSmokeSystem();

      // 设置材质
      this._setupMaterials(loadedModel);

      // 初始化旋转四元数
      const initialDirection = new THREE.Vector3(0, 1, 0);
      const forward = new THREE.Vector3(0, 1, 0);
      this.targetRotation.setFromUnitVectors(forward, initialDirection);
      this.currentRotation.copy(this.targetRotation);
      this.group.quaternion.copy(this.currentRotation);

      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.add(this.group);

      postprocessSys.addGlowObject(this.group);

      // 初始化抖动生成器
      const rocketJitterCfg = config.get('exhaust.rocketJitter');
      this.rocketJitterGen = new JitterGenerator(
        rocketJitterCfg.intensity,
        rocketJitterCfg.frequency,
        rocketJitterCfg.timeVariation
      );

      const flameJitterCfg = config.get('exhaust.flameJitter');
      this.flameJitterGen = new JitterGenerator(
        flameJitterCfg.intensity,
        flameJitterCfg.frequency,
        flameJitterCfg.timeVariation
      );

      // 绑定配置变更监听
      this._bindConfigEvents();

      this._isReady = true;

      if (this.pendingPosition) {
        const cachedPosition = this.pendingPosition.clone();
        setTimeout(() => {
          this.updatePosition(cachedPosition);
        }, 50);
        this.pendingPosition = null;
      }

      logger.info('ModelLightRenderer', `✅ 模型已加载并准备就绪 (loadId=${loadId})`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        logger.warn('ModelLightRenderer', `模型加载被中止`);
        return;
      }
      logger.error('ModelLightRenderer', `模型加载失败: ${(err as Error).message}`);
    }
  }

  /**
   * 🔥 核心方法：创建尾焰（完全配置驱动版本）
   */
  private _createExhaustFlame(): void {
    const flameConfig = config.get('exhaust.flame');

    const flameGeometry = new THREE.ConeGeometry(
      flameConfig.radius,
      flameConfig.length,
      8,
      1,
      true
    );

    this.flameMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: new THREE.Color(flameConfig.baseColor) },
        uTipColor: { value: new THREE.Color(flameConfig.tipColor) },
        uIntensity: { value: flameConfig.intensity },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uBaseColor;
        uniform vec3 uTipColor;
        uniform float uIntensity;
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          float gradient = smoothstep(0.0, 1.0, vUv.y);
          vec3 color = mix(uBaseColor, uTipColor, gradient);

          float flicker = 0.8 + 0.2 * sin(uTime * 10.0 + vPosition.y * 5.0);
          
          float dist = length(vUv - vec2(0.5, 0.5));
          float alpha = (1.0 - smoothstep(0.0, 0.5, dist)) * flicker * uIntensity;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });

    this.exhaustFlame = new THREE.Mesh(flameGeometry, this.flameMaterial);
    this.exhaustFlame.name = 'ExhaustFlame';
    this.exhaustFlame.rotation.x = Math.PI;
    this.exhaustFlame.position.set(flameConfig.offsetX, flameConfig.offsetY, flameConfig.offsetZ);
    this.exhaustFlame.userData = { glow: true };

    this.group!.add(this.exhaustFlame);
    postprocessSys.addGlowObject(this.exhaustFlame);

    logger.info('ModelLightRenderer', '✅ 尾焰已创建（配置驱动）');
  }

  /**
   * 🔥 核心方法：创建烟雾粒子系统（配置驱动 + 调试坐标轴）
   */
  private _createSmokeSystem(): void {
    const smokeConfig = config.get('exhaust.smoke');
    const debugConfig = config.get('exhaust.debug');
    const maxParticles = smokeConfig.maxParticles;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(maxParticles * 3);
    const colors = new Float32Array(maxParticles * 3);
    const sizes = new Float32Array(maxParticles);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
      map: this._createSmokeTexture(),
    });

    this.smokeParticles = new THREE.Points(geometry, material);
    this.smokeParticles.name = 'ExhaustSmoke';

    // ✅ 创建发射器坐标轴
    this.emitterAxisHelper = createAxisHelper(debugConfig.axisSize, new THREE.Vector3());
    this.emitterAxisHelper.visible = debugConfig.showEmitterAxis;

    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.smokeParticles);
    lightAnchor.add(this.emitterAxisHelper);

    logger.info('ModelLightRenderer', '✅ 烟雾系统已创建（带坐标轴调试）');
  }

  /**
   * 创建球形粒子纹理
   */
  private _createSmokeTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /**
   * 🔥 核心方法：发射烟雾粒子（配置驱动，世界坐标）
   */
  private _emitSmokeParticle(worldPosition: THREE.Vector3, direction: THREE.Vector3): void {
    const smokeConfig = config.get('exhaust.smoke');

    if (this.smokePool.length >= smokeConfig.maxParticles) {
      this.smokePool.shift();
    }

    const particle = new SmokeParticle();
    particle.maxAge = smokeConfig.particleLifetime;

    // 将局部偏移量转换到世界坐标
    const localOffset = new THREE.Vector3(
      smokeConfig.emitterOffsetX,
      smokeConfig.emitterOffsetY,
      smokeConfig.emitterOffsetZ
    );

    // 应用火箭的当前旋转到偏移量
    const worldOffset = localOffset.clone().applyQuaternion(this.group!.quaternion);
    const emitterWorldPos = worldPosition.clone().add(worldOffset);
    particle.position.copy(emitterWorldPos);

    // 应用初始大小
    particle.size = smokeConfig.initialSize;

    const randomAngle = Math.random() * Math.PI * 2;
    const randomRadius = Math.random() * smokeConfig.randomSpread;

    // 应用速度倍率
    particle.velocity
      .copy(direction)
      .multiplyScalar(smokeConfig.initialVelocity * smokeConfig.velocityMultiplier);

    particle.velocity.x += Math.cos(randomAngle) * randomRadius;
    particle.velocity.z += Math.sin(randomAngle) * randomRadius;

    this.smokePool.push(particle);

    // ✅ 更新坐标轴位置
    if (this.emitterAxisHelper) {
      updateAxisHelper(this.emitterAxisHelper, emitterWorldPos);
    }
  }

  /**
   * 🔥 核心方法：更新烟雾系统 - 同步世界坐标
   */
  private _updateSmokeSystem(delta: number): void {
    if (!this.smokeParticles) return;

    const smokeConfig = config.get('exhaust.smoke');

    this.smokePool = this.smokePool.filter((p) => p.update(delta));

    const geometry = this.smokeParticles.geometry;

    const posAttr = geometry.attributes.position;
    const colorAttr = geometry.attributes.color;
    const sizeAttr = geometry.attributes.size;

    if (!posAttr || !colorAttr || !sizeAttr) {
      logger.warn('ModelLightRenderer', '烟雾系统缺少必要的 BufferAttribute');
      return;
    }

    const positions = posAttr.array as Float32Array;
    const colors = colorAttr.array as Float32Array;
    const sizes = sizeAttr.array as Float32Array;

    for (let i = 0; i < smokeConfig.maxParticles; i++) {
      const particle = this.smokePool[i];

      if (i < this.smokePool.length && particle) {
        positions[i * 3] = particle.position.x;
        positions[i * 3 + 1] = particle.position.y;
        positions[i * 3 + 2] = particle.position.z;

        const brightness = particle.opacity;
        colors[i * 3] = brightness;
        colors[i * 3 + 1] = brightness;
        colors[i * 3 + 2] = brightness;

        sizes[i] = particle.size;
      } else {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        sizes[i] = 0;
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    geometry.setDrawRange(0, Math.min(this.smokePool.length, smokeConfig.maxParticles));
  }

  /**
   * 🔥 新增方法：绑定配置变更事件
   */
  private _bindConfigEvents(): void {
    const bus = this.coordinateSystem?.eventBus || eventBus;

    bus.on('config-changed', ({ key }: { key: string }) => {
      if (!key.startsWith('exhaust.')) return;

      if (key.startsWith('exhaust.flame')) {
        this._updateFlameConfig();
      }

      if (key.startsWith('exhaust.smoke')) {
        this._updateSmokeConfig();
      }

      if (key.startsWith('exhaust.debug')) {
        this._updateDebugConfig();
      }

      if (key.startsWith('exhaust.rocketJitter')) {
        this._updateRocketJitterConfig();
      }
      if (key.startsWith('exhaust.flameJitter')) {
        this._updateFlameJitterConfig();
      }
    });
  }

  /**
   * 🔥 新增方法：更新尾焰配置
   */
  private _updateFlameConfig(): void {
    if (!this.flameMaterial?.uniforms || !this.exhaustFlame) return;

    const flameConfig = config.get('exhaust.flame');
    const u = this.flameMaterial.uniforms;

    if (u.uBaseColor) u.uBaseColor.value.set(flameConfig.baseColor);
    if (u.uTipColor) u.uTipColor.value.set(flameConfig.tipColor);
    if (u.uIntensity) u.uIntensity.value = flameConfig.intensity;

    const newGeometry = new THREE.ConeGeometry(flameConfig.radius, flameConfig.length, 8, 1, true);
    this.exhaustFlame.geometry.dispose();
    this.exhaustFlame.geometry = newGeometry;

    this.exhaustFlame.position.set(flameConfig.offsetX, flameConfig.offsetY, flameConfig.offsetZ);

    logger.debug('ModelLightRenderer', '尾焰配置已更新');
  }

  /**
   * 更新烟雾配置
   */
  private _updateSmokeConfig(): void {
    const smokeConfig = config.get('exhaust.smoke');

    this.smokePool.forEach((p) => {
      p.maxAge = smokeConfig.particleLifetime;
    });

    logger.debug('ModelLightRenderer', '烟雾配置已更新');
  }

  /**
   * ✅ 新增方法：更新调试配置
   */
  private _updateDebugConfig(): void {
    if (!this.emitterAxisHelper) return;

    const debugConfig = config.get('exhaust.debug');
    toggleAxisHelper(this.emitterAxisHelper, debugConfig.showEmitterAxis);

    // 更新轴线大小（需要重新创建）
    if (debugConfig.axisSize !== this.emitterAxisHelper.scale.x) {
      this.emitterAxisHelper.scale.setScalar(debugConfig.axisSize);
    }

    logger.debug('ModelLightRenderer', '调试配置已更新');
  }

  /**
   * 更新火箭抖动配置
   */
  private _updateRocketJitterConfig(): void {
    if (!this.rocketJitterGen) return;
    const cfg = config.get('exhaust.rocketJitter');
    this.rocketJitterGen.updateConfig(cfg.intensity, cfg.frequency, cfg.timeVariation);
    logger.debug('ModelLightRenderer', '火箭抖动配置已更新');
  }

  /**
   * 更新尾焰抖动配置
   */
  private _updateFlameJitterConfig(): void {
    if (!this.flameJitterGen) return;
    const cfg = config.get('exhaust.flameJitter');
    this.flameJitterGen.updateConfig(cfg.intensity, cfg.frequency, cfg.timeVariation);
    logger.debug('ModelLightRenderer', '尾焰抖动配置已更新');
  }

  /**
   * 设置材质
   */
  private _setupMaterials(model: THREE.Object3D): void {
    model.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      const hasTexture =
        mesh.material && (mesh.material as THREE.MeshStandardMaterial).map !== null;

      if (hasTexture) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.emissive = mat.color.clone().multiplyScalar(0.9);
        mat.emissiveIntensity = 0;
        mat.roughness = 0.65;
        mat.metalness = 0.8;
        mat.toneMapped = true;

        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace;
        }
        mat.needsUpdate = true;
      } else {
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#00ff88'),
          emissive: new THREE.Color('#00ff88'),
          emissiveIntensity: 0.5,
          roughness: 0.4,
          metalness: 0.3,
        });
      }
    });
  }

  /**
   * 🔥 核心方法：更新位置（包含平滑朝向 + 尾焰 + 烟雾 + 抖动）
   */
  updatePosition(position: THREE.Vector3): void {
    if (!this._isReady || !this.group) {
      this.pendingPosition = position.clone();
      return;
    }

    this.pendingPosition = null;

    const now = performance.now() / 1000;
    const delta = now - this.lastUpdateTime;
    this.lastUpdateTime = now;

    const displacement = new THREE.Vector3().subVectors(position, this.previousPosition);
    const speed = displacement.length();

    if (speed > 0.01) {
      displacement.normalize();

      // 平滑朝向
      const forward = new THREE.Vector3(0, 1, 0);
      this.targetRotation.setFromUnitVectors(forward, displacement);

      const dynamicAlpha = THREE.MathUtils.clamp(this.baseLerpAlpha + speed * 0.02, 0.05, 0.3);
      this.currentRotation.slerp(this.targetRotation, dynamicAlpha);

      // 🔥 火箭机体抖动（受控版本）
      let rocketJitter = new THREE.Vector3();
      if (visualEffectsSys.isEffectActive('rocketJitter') && this.rocketJitterGen) {
        rocketJitter = this.rocketJitterGen.update(now * 1000);
      }

      this.group.quaternion.copy(this.currentRotation);
      this.group.position.copy(position).add(rocketJitter);

      // ✅ 获取尾焰配置
      const flameConfig = config.get('exhaust.flame');

      // 🔥 尾焰独立抖动（受控版本）
      if (
        this.exhaustFlame &&
        this.flameJitterGen &&
        visualEffectsSys.isEffectActive('flameJitter')
      ) {
        const flameJitter = this.flameJitterGen.update(now * 1000);
        this.exhaustFlame.position.set(
          flameConfig.offsetX + flameJitter.x,
          flameConfig.offsetY + flameJitter.y,
          flameConfig.offsetZ + flameJitter.z
        );
      }

      // 🔥 更新尾焰
      if (this.flameMaterial?.uniforms) {
        const u = this.flameMaterial.uniforms;

        if (u.uTime) u.uTime.value = now;
        if (u.uIntensity) {
          const dynamicIntensity = flameConfig.intensity + speed * flameConfig.speedMultiplier;
          u.uIntensity.value = THREE.MathUtils.clamp(dynamicIntensity, 0.5, 2.0);
        }
      }

      if (this.exhaustFlame) {
        const baseScale = 1.0;
        const speedScale = THREE.MathUtils.clamp(speed * flameConfig.speedMultiplier, 0.8, 2.0);
        this.exhaustFlame.scale.setScalar(baseScale * speedScale);
      }

      // 🔥 更新烟雾发射
      const smokeConfig = config.get('exhaust.smoke');
      const emitInterval = 1.0 / smokeConfig.emitRate;

      this.emitTimer += delta;

      const shouldEmit = smokeConfig.emitOnlyWhenMoving ? speed > 0.01 : true;

      if (this.emitTimer >= emitInterval && shouldEmit) {
        this.emitTimer = 0;
        this._emitSmokeParticle(position, displacement);
      }

      this._updateSmokeSystem(delta);
      this.previousPosition.copy(position);
    } else {
      // 静止时处理
      const smokeConfig = config.get('exhaust.smoke');
      if (!smokeConfig.emitOnlyWhenMoving) {
        this.emitTimer += delta;
        const emitInterval = 1.0 / smokeConfig.emitRate;

        if (this.emitTimer >= emitInterval) {
          this.emitTimer = 0;
          const defaultDirection = new THREE.Vector3(0, -1, 0);
          this._emitSmokeParticle(position, defaultDirection);
        }
      }

      this._updateSmokeSystem(delta);
    }

    this.group.visible = true;
  }

  show(): void {
    if (this.group) this.group.visible = true;
  }

  hide(): void {
    if (this.group) this.group.visible = false;
  }

  private _cleanupModel(model: THREE.Object3D): void {
    model.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  }

  dispose(): void {
    if (this.loadAbortController) {
      this.loadAbortController.abort();
      this.loadAbortController = null;
    }

    if (this.group) {
      postprocessSys.removeGlowObject(this.group);
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.group);

      if (this.followLight) {
        this.followLight.dispose();
        this.followLight = null;
      }

      if (this.exhaustFlame) {
        postprocessSys.removeGlowObject(this.exhaustFlame);
        this.exhaustFlame.geometry.dispose();
        this.flameMaterial?.dispose();
      }

      if (this.smokeParticles) {
        this.smokeParticles.geometry.dispose();
        (this.smokeParticles.material as THREE.Material).dispose();
        const lightAnchor = this.coordinateSystem.getLightAnchor();
        lightAnchor.remove(this.smokeParticles);
      }

      if (this.emitterAxisHelper) {
        const lightAnchor = this.coordinateSystem.getLightAnchor();
        lightAnchor.remove(this.emitterAxisHelper);
      }

      this._cleanupModel(this.group);
    }

    this._isReady = false;
    logger.info('ModelLightRenderer', '模型光点渲染器已销毁');
  }
}
