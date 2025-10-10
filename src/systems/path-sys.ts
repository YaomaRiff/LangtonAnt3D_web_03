/**
 * @file path-sys.ts
 * @description 路径系统 - 动态轨迹线条 + 实时绘制
 * 🔧 修正: 移除对旧辉光层 (GLOW_LAYER) 的引用，改用新的 postprocessSys.addGlowObject() 方法。
 * 🔧 修正: 移除对共享材质的 .dispose() 调用，以保护材质服务。
 * 🔧 补充: 恢复 enable/disable 方法以兼容场景导演。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

class PathSystem {
  private eventBus: any;

  // ✅ 公共属性
  public scene: THREE.Scene | null = null;
  public isEnabled: boolean = true;

  private coordinateSystem: any;
  private initialized: boolean;
  private pathLine: THREE.Line | null;
  private allPoints: THREE.Vector3[];
  private currentDrawIndex: number;
  private pathContainer: THREE.Group | null;

  constructor() {
    this.eventBus = null;

    this.coordinateSystem = null;
    this.initialized = false;

    this.pathLine = null;
    this.allPoints = [];
    this.currentDrawIndex = 0;

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
      logger.info('PathSystem', '路径系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('PathSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.allPoints = data.points;
      this.currentDrawIndex = 0;
      this._createPath();
    });

    this.eventBus.on('moving-light-position-updated', (position: THREE.Vector3) => {
      this._updatePathToPosition(position);
    });

    this.eventBus.on('animation-step-updated', (step: number) => {
      this._jumpToStep(step);
    });

    this.eventBus.on('animation-reset', () => {
      this.currentDrawIndex = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });

    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
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

    if (this.pathLine && this.pathContainer) {
      // ✅ 核心修正: 从辉光场景中移除旧对象
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      // ✅ 核心修正: 不要销毁由 materialSys 管理的共享材质
      // this.pathLine.material.dispose();
    }

    const geometry = new THREE.BufferGeometry();
    const maxPoints = this.allPoints.length;
    const positions = new Float32Array(maxPoints * 3);

    for (let i = 0; i < maxPoints; i++) {
      const point = this.allPoints[i];
      positions[i * 3] = point?.x || 0;
      positions[i * 3 + 1] = point?.y || 0;
      positions[i * 3 + 2] = point?.z || 0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    const material = materialSys.get('pathLine');

    if (!material) {
      logger.error('PathSystem', '无法从 MaterialService 获取 "pathLine" 材质，路径无法创建。');
      return;
    }

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };

    // ✅ 核心修正: 使用新的方法将路径添加到辉光场景
    postprocessSys.addGlowObject(this.pathLine);

    this.pathContainer?.add(this.pathLine);

    this.currentDrawIndex = 0;
    logger.info('PathSystem', `路径已创建: 总点数 ${this.allPoints.length}`);
  }

  _updatePathToPosition(position: THREE.Vector3) {
    if (!this.pathLine || !this.allPoints.length) return;

    let closestIndex = 0;
    let minDist = Infinity;

    for (let i = this.currentDrawIndex; i < this.allPoints.length; i++) {
      const dist = this.allPoints[i] ? position.distanceTo(this.allPoints[i]!) : Infinity;
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
      if (dist > minDist && i > this.currentDrawIndex + 5) break; // 优化: 如果距离开始变大，则停止搜索
    }

    if (closestIndex > this.currentDrawIndex) {
      this.currentDrawIndex = closestIndex;
      this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
    }
  }

  _jumpToStep(step: number) {
    if (!this.pathLine || !this.allPoints.length) return;

    const targetIndex = Math.min(step, this.allPoints.length - 1);
    this.currentDrawIndex = targetIndex;
    this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
  }

  updateCameraPosition(camera: THREE.Camera) {
    if (this.pathLine && camera && this.pathContainer) {
      const material = this.pathLine.material as THREE.ShaderMaterial;
      if (material.uniforms.uCameraPosition) {
        const worldCamPos = camera.position.clone();
        const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
        material.uniforms.uCameraPosition.value.copy(localCamPos);
      }
    }
  }

  update(_delta: number) {
    // 占位
  }

  // ✅ 补充: 恢复 enable/disable 方法以兼容 scene-director-sys
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
