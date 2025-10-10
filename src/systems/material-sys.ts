/**
 * @file material-sys.ts
 * @description 材质服务 - 预创建、管理和更新项目中所有共享材质的中央库。
 * ✨ 重构: 移除了与旧辉光系统相关的 emissiveIntensity 逻辑，并简化了路径着色器 uniform。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';

// 导入外部化的 GLSL 文件
import pathVertexShader from './shaders/path.vert?raw';
import pathFragmentShader from './shaders/path.frag?raw';

class MaterialService {
  private initialized: boolean;
  private materials: Map<string, THREE.Material>;

  constructor() {
    this.initialized = false;
    this.materials = new Map();
  }

  init() {
    if (this.initialized) {
      logger.warn('MaterialService', '材质服务已经初始化过了');
      return this;
    }

    this._createAllMaterials();
    this._bindEvents();

    this.initialized = true;
    logger.info('MaterialService', `材质服务初始化完成 | 创建了 ${this.materials.size} 个材质`);
    return this;
  }

  _createAllMaterials() {
    // 从 config 中一次性获取所有需要的配置节
    const pathCfg = config.get('path');
    const materialCfg = config.get('material');
    const particlesCfg = config.get('particles');
    const envCfg = config.get('environment');

    // 1. 路径材质 (PathLine)
    const pathMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uEmissive: { value: new THREE.Color(envCfg.pathColor) },
        uDepthIntensity: { value: pathCfg.depthIntensity },
        uCameraPosition: { value: new THREE.Vector3() },
      },
      vertexShader: pathVertexShader,
      fragmentShader: pathFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.materials.set('pathLine', pathMaterial);

    // ✅ 修正：为尘埃粒子材质提供完整的配置
    const dustParticlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(particlesCfg.dustColor),
      size: particlesCfg.dustSize,
      opacity: particlesCfg.dustOpacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true, // 粒子大小随距离衰减
      vertexColors: false,
    });
    this.materials.set('dustParticles', dustParticlesMaterial);

    // ✅ 修正：为移动光点材质提供完整的配置
    const movingLightMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(materialCfg.movingLight.emissiveColor),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.materials.set('movingLight', movingLightMaterial);
  }

  _bindEvents() {
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      this._updateMaterialProperty(key, value);
    });
  }

  _updateMaterialProperty(key: string, value: any) {
    const pathLineMat = this.materials.get('pathLine');
    const dustMat = this.materials.get('dustParticles');
    const lightMat = this.materials.get('movingLight');

    if (!pathLineMat || !dustMat || !lightMat) return;

    switch (key) {
      // PathLine Material updates
      case 'environment.pathColor':
        if (pathLineMat instanceof THREE.ShaderMaterial) {
          pathLineMat.uniforms?.uEmissive?.value.set(value);
        }
        break;
      case 'path.depthIntensity':
        if (pathLineMat instanceof THREE.ShaderMaterial) {
          pathLineMat.uniforms?.uDepthIntensity &&
            (pathLineMat.uniforms.uDepthIntensity.value = value);
        }
        break;

      // Dust Particles Material updates
      case 'particles.dustColor':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.color.set(value);
        }
        break;
      case 'particles.dustSize':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.size = value;
        }
        break;
      case 'particles.dustOpacity':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.opacity = value;
        }
        break;

      // Moving Light Material updates
      case 'material.movingLight.emissiveColor':
        if (lightMat instanceof THREE.MeshBasicMaterial) {
          lightMat.color.set(value);
        }
        break;
    }
  }

  get(name: string): THREE.Material | null {
    const material = this.materials.get(name);
    if (!material) {
      logger.warn('MaterialService', `请求的材质不存在: "${name}"`);
      return null;
    }
    return material;
  }

  dispose() {
    this.materials.forEach((material) => material.dispose());
    this.materials.clear();
    this.initialized = false;
    logger.info('MaterialService', '材质服务已销毁');
  }
}

const materialSys = new MaterialService();
export default materialSys;
