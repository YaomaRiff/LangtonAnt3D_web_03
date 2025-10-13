/**
 * @file path-sys.ts
 * @description 极简路径系统 - 火箭轨迹的可视化
 * @version 5.1 (Type Safety Fix)
 *
 * 核心逻辑：
 *   1. 预分配足够的顶点空间（基于节点数量）
 *   2. 监听火箭位置更新，动态扩展绘制范围
 *   3. 使用 drawRange 控制可见部分
 *   4. ✅ 添加完整的类型守卫，修复所有 undefined 错误
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

class PathSystem {
  private eventBus: any;
  public scene: THREE.Scene | null = null;
  public isEnabled: boolean = true;

  private coordinateSystem: any;
  private initialized: boolean;
  private pathLine: THREE.Line | null;
  private pathContainer: THREE.Group | null;

  // 核心数据
  private rawPoints: THREE.Vector3[] = []; // CSV原始节点
  private samplesPerSegment: number = 10; // 每段插值点数
  private currentDrawCount: number = 0; // 当前绘制的顶点数
  private totalSamples: number = 0; // 总采样点数

  constructor() {
    this.eventBus = null;
    this.coordinateSystem = null;
    this.initialized = false;
    this.pathLine = null;
    this.pathContainer = null;
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
      logger.info('PathSystem', '✅ 极简路径系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('PathSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    // 🔥 核心事件1：数据加载完成，创建路径几何体
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.rawPoints = data.points;
      this._createPath();
    });

    // 🔥 核心事件2：火箭位置更新，扩展路径绘制
    this.eventBus.on('moving-light-position-updated', ({ progress }: { progress: number }) => {
      this._updatePathByProgress(progress);
    });

    // 配置变更
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // 动画重置
    this.eventBus.on('animation-reset', () => {
      this.currentDrawCount = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
    if (key === 'path.scale' && this.pathContainer) {
      this.pathContainer.scale.setScalar(value);
    }
  }

  /**
   * 🔥 核心方法1：创建路径几何体（预分配足够空间）
   * ✅ 修复：添加完整的类型守卫
   */
  _createPath() {
    if (this.rawPoints.length < 2) {
      logger.error('PathSystem', '节点数量不足');
      return;
    }

    // 清理旧对象
    if (this.pathLine && this.pathContainer) {
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
    }

    // 计算总采样点数（每段插值 + 最后一个节点）
    const totalSegments = this.rawPoints.length - 1;
    this.totalSamples = totalSegments * this.samplesPerSegment + 1;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.totalSamples * 3);

    // 🔥 核心逻辑：预填充所有插值点
    let idx = 0;
    for (let i = 0; i < totalSegments; i++) {
      const p0 = this.rawPoints[i];
      const p1 = this.rawPoints[i + 1];

      // ✅ 核心修复：添加类型守卫
      if (!p0 || !p1) {
        logger.warn('PathSystem', `跳过无效段: index=${i}`);
        continue;
      }

      for (let j = 0; j < this.samplesPerSegment; j++) {
        const t = j / this.samplesPerSegment;
        const x = THREE.MathUtils.lerp(p0.x, p1.x, t);
        const y = THREE.MathUtils.lerp(p0.y, p1.y, t);
        const z = THREE.MathUtils.lerp(p0.z, p1.z, t);

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
        idx++;
      }
    }

    // ✅ 修复：添加最后一个节点的类型守卫
    const lastPoint = this.rawPoints[this.rawPoints.length - 1];
    if (lastPoint) {
      positions[idx * 3] = lastPoint.x;
      positions[idx * 3 + 1] = lastPoint.y;
      positions[idx * 3 + 2] = lastPoint.z;
    } else {
      logger.warn('PathSystem', '最后一个节点不存在');
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0); // 初始不绘制

    const material = materialSys.get('pathLine');

    if (!material) {
      logger.error('PathSystem', '❌ 无法获取路径材质');
      return;
    }

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };

    postprocessSys.addGlowObject(this.pathLine);
    this.pathContainer?.add(this.pathLine);

    this.currentDrawCount = 0;

    logger.info(
      'PathSystem',
      `✅ 路径已创建 | 节点数: ${this.rawPoints.length} | 总采样点: ${this.totalSamples}`
    );
  }

  /**
   * 🔥 核心方法2：根据归一化进度 [0, 1] 更新路径绘制范围
   */
  _updatePathByProgress(progress: number) {
    if (!this.pathLine || this.totalSamples === 0) return;

    // 钳制进度范围
    progress = THREE.MathUtils.clamp(progress, 0, 1);

    // 计算当前应该绘制到第几个顶点
    const targetDrawCount = Math.floor(progress * this.totalSamples);

    // 只在需要扩展时更新（避免重复刷新）
    if (targetDrawCount > this.currentDrawCount) {
      this.currentDrawCount = targetDrawCount;
      this.pathLine.geometry.setDrawRange(0, Math.max(1, this.currentDrawCount));
    }
  }

  /**
   * 更新相机位置（用于深度着色器）
   */
  updateCameraPosition(camera: THREE.Camera) {
    if (this.pathLine && camera && this.pathContainer) {
      const material = this.pathLine.material as THREE.ShaderMaterial;
      if (material.uniforms?.uCameraPosition) {
        const worldCamPos = camera.position.clone();
        const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
        material.uniforms.uCameraPosition.value.copy(localCamPos);
      }
    }
  }

  update(_delta: number) {
    // 占位方法（未来可添加动画效果）
  }

  enable() {
    this.isEnabled = true;
    if (this.pathContainer) this.pathContainer.visible = true;
    logger.debug('PathSystem', '已启用');
  }

  disable() {
    this.isEnabled = false;
    if (this.pathContainer) this.pathContainer.visible = false;
    logger.debug('PathSystem', '已禁用');
  }

  dispose() {
    if (this.pathLine && this.pathContainer) {
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
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
