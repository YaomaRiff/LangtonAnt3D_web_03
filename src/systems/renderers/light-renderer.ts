/**
 * @file light-renderer.ts
 * @description 光点渲染器接口定义 - 策略模式的核心抽象
 */
import * as THREE from 'three';

export interface ILightRenderer {
  /**
   * 创建视觉对象（球体/模型/粒子等）
   */
  create(): Promise<void> | void;

  /**
   * 更新光点位置
   */
  updatePosition(position: THREE.Vector3): void;

  /**
   * 更新光点朝向（可选，仅3D模型需要）
   */
  updateRotation?(direction: THREE.Vector3): void;

  /**
   * 显示光点
   */
  show(): void;

  /**
   * 隐藏光点
   */
  hide(): void;

  /**
   * 销毁资源
   */
  dispose(): void;

  /**
   * 是否已准备好（异步加载完成）
   */
  readonly isReady: boolean;
}
