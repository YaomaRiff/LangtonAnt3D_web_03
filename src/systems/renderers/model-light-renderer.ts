/**
 * @file model-light-renderer.ts
 * @description 3D模型光点渲染器 - 组合方案：跟随点光源 + 轻微自发光
 * @version 3.0 (Combined Lighting Solution)
 *
 * 核心改进：
 *   1. ✅ 添加跟随火箭的点光源（方案1）
 *   2. ✅ 为模型材质添加轻微自发光（方案3）
 *   3. ✅ 使用 Three.js r152+ 的新 API (colorSpace 替代 encoding)
 *   4. ✅ 平滑朝向插值 + 竞态条件防护
 */

import * as THREE from 'three';
import { ILightRenderer } from './light-renderer';
import modelSys from '../model-sys';
import postprocessSys from '../postprocess-sys';
import logger from '../../utils/logger';

export class ModelLightRenderer implements ILightRenderer {
  private group: THREE.Group | null = null;
  private followLight: THREE.PointLight | null = null; // ✅ 新增：跟随光源
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

  constructor(coordinateSystem: any, modelPath = '/models/rocket.glb') {
    this.coordinateSystem = coordinateSystem;
    this.modelPath = modelPath;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  async create(): Promise<void> {
    try {
      // 取消旧的加载请求
      if (this.loadAbortController) {
        this.loadAbortController.abort();
      }
      this.loadAbortController = new AbortController();

      const loadId = ++this.currentLoadId;
      logger.info('ModelLightRenderer', `开始加载模型 (loadId=${loadId}): ${this.modelPath}`);

      const loadedModel = await modelSys.load(this.modelPath);

      // 检查是否被中止
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

      // ✅ 方案1：创建跟随光源
      this.followLight = new THREE.PointLight('#ffffff', 2.0, 50);
      this.followLight.position.set(0, 5, 5); // 相对于模型的位置
      this.followLight.name = 'FollowLight';
      this.group.add(this.followLight);

      // ✅ 方案3：设置材质（包含轻微自发光）
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

      this._isReady = true;

      // 延迟应用待处理位置
      if (this.pendingPosition) {
        const cachedPosition = this.pendingPosition.clone();
        setTimeout(() => {
          this.updatePosition(cachedPosition);
          logger.info(
            'ModelLightRenderer',
            `已应用待处理位置 (loadId=${loadId}): (${cachedPosition.x.toFixed(2)}, ${cachedPosition.y.toFixed(2)}, ${cachedPosition.z.toFixed(2)})`
          );
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
   * ✅ 方案3：设置材质（轻微自发光 + Three.js r152+ 兼容）
   */
  private _setupMaterials(model: THREE.Object3D): void {
    model.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      const hasTexture =
        mesh.material && (mesh.material as THREE.MeshStandardMaterial).map !== null;

      if (hasTexture) {
        const mat = mesh.material as THREE.MeshStandardMaterial;

        // ✅ 修复：添加轻微自发光（使用原始颜色）
        mat.emissive = mat.color.clone().multiplyScalar(0.9); // 原色的30%
        mat.emissiveIntensity = 0; // 提高到0.8

        // 优化 PBR 属性
        mat.roughness = 0.65; // 更光滑
        mat.metalness = 0.8; // 增加金属感

        mat.toneMapped = true;

        // ✅ 修复: 使用 Three.js r152+ 的新 API
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace; // 替代旧的 .encoding
        }

        mat.needsUpdate = true;
      } else {
        // ✅ 无贴图部分也使用发光材质
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
   * 更新位置（包含平滑朝向）
   */
  updatePosition(position: THREE.Vector3): void {
    if (!this._isReady || !this.group) {
      this.pendingPosition = position.clone();
      logger.info('ModelLightRenderer', '位置缓存中，等待渲染器就绪');
      return;
    }

    this.pendingPosition = null;

    this.group.position.copy(position);

    // 计算运动向量和速度
    const displacement = new THREE.Vector3().subVectors(position, this.previousPosition);
    const speed = displacement.length();

    if (speed > 0.01) {
      displacement.normalize();

      const forward = new THREE.Vector3(0, 1, 0);
      this.targetRotation.setFromUnitVectors(forward, displacement);

      // 根据速度动态调整插值系数
      const dynamicAlpha = THREE.MathUtils.clamp(this.baseLerpAlpha + speed * 0.02, 0.05, 0.3);

      this.currentRotation.slerp(this.targetRotation, dynamicAlpha);
      this.group.quaternion.copy(this.currentRotation);

      this.previousPosition.copy(position);
    }

    this.group.visible = true;

    logger.debug(
      'ModelLightRenderer',
      `位置已更新: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`
    );
  }

  show(): void {
    if (this.group) this.group.visible = true;
  }

  hide(): void {
    if (this.group) this.group.visible = false;
  }

  /**
   * 清理模型资源
   */
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

      // ✅ 新增: 清理光源
      if (this.followLight) {
        this.followLight.dispose();
        this.followLight = null;
      }

      this._cleanupModel(this.group);
    }

    this._isReady = false;
    this.pendingPosition = null;
    logger.info('ModelLightRenderer', '模型已销毁');
  }
}
