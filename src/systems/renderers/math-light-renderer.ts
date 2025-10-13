/**
 * @file math-light-renderer.ts
 * @description 数学球体光点渲染器 - 基于 THREE.Mesh
 */
import * as THREE from 'three';
import { ILightRenderer } from './light-renderer';
import materialSys from '../material-sys';
import postprocessSys from '../postprocess-sys';
import logger from '../../utils/logger';

export class MathLightRenderer implements ILightRenderer {
  private mesh: THREE.Mesh | null = null;
  private coordinateSystem: any;
  private _isReady = false;

  constructor(coordinateSystem: any) {
    this.coordinateSystem = coordinateSystem;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  create(): void {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = materialSys.get('movingLight');

    if (!material) {
      logger.error('MathLightRenderer', '无法获取材质');
      return;
    }

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'MovingLight_Math';
    this.mesh.visible = false;
    this.mesh.userData = { glow: true };

    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.mesh);

    postprocessSys.addGlowObject(this.mesh);

    this._isReady = true;
    logger.info('MathLightRenderer', '✅ 数学球体已创建');
  }

  updatePosition(position: THREE.Vector3): void {
    if (this.mesh) {
      this.mesh.position.copy(position);
      this.mesh.visible = true;
    }
  }

  show(): void {
    if (this.mesh) this.mesh.visible = true;
  }

  hide(): void {
    if (this.mesh) this.mesh.visible = false;
  }

  dispose(): void {
    if (this.mesh) {
      postprocessSys.removeGlowObject(this.mesh);
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.mesh);
      this.mesh.geometry.dispose();
      // 不销毁共享材质
    }
    this._isReady = false;
    logger.info('MathLightRenderer', '数学球体已销毁');
  }
}
