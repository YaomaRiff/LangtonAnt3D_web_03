/**
 * @file lighting-sys.js
 * @description 光照系统 - 管理场景中的环境光与直接光
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class LightingSystem {
  constructor() {
    this.scene = null;
    this.initialized = false;
    this.ambientLight = null;
    this.directionalLight = null;
  }

  init({ scene }) {
    if (this.initialized) return this;
    this.scene = scene;

    // 从配置创建光源
    this._createLights();

    this.initialized = true;
    logger.info('LightingSystem', '光照系统初始化完成');
    return this;
  }

  _createLights() {
    // 1. 环境光 (AmbientLight)
    // 为整个场景提供基础光照，防止模型暗部全黑
    const ambientConfig = config.get('lighting.ambient');
    this.ambientLight = new THREE.AmbientLight(
      ambientConfig.color,
      ambientConfig.intensity
    );
    this.ambientLight.name = 'AmbientLight';
    this.scene.add(this.ambientLight);

    // 2. 平行光 (DirectionalLight)
    // 模拟一个无限远的光源（如太阳），产生高光和阴影
    const dirConfig = config.get('lighting.directional');
    this.directionalLight = new THREE.DirectionalLight(
      dirConfig.color,
      dirConfig.intensity
    );
    this.directionalLight.name = 'DirectionalLight';
    this.directionalLight.position.set(
      dirConfig.position.x,
      dirConfig.position.y,
      dirConfig.position.z
    );
    this.scene.add(this.directionalLight);

    logger.debug('LightingSystem', '环境光和平行光已创建');
  }

  // 未来可以添加更新光照参数的方法，例如通过UI
  updateAmbient(color, intensity) {
    if (this.ambientLight) {
      this.ambientLight.color.set(color);
      this.ambientLight.intensity = intensity;
    }
  }
  
  updateDirectional(color, intensity) {
    if (this.directionalLight) {
      this.directionalLight.color.set(color);
      this.directionalLight.intensity = intensity;
    }
  }

  dispose() {
    if (this.ambientLight) this.scene.remove(this.ambientLight);
    if (this.directionalLight) this.scene.remove(this.directionalLight);
    this.ambientLight = null;
    this.directionalLight = null;
    this.initialized = false;
    logger.info('LightingSystem', '光照系统已销毁');
  }
}

const lightingSys = new LightingSystem();
export default lightingSys;
