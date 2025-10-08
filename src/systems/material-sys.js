/**
 * @file material-sys.js
 * @description 材质服务 - 预创建、管理和更新项目中所有共享材质的中央库。
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';
import eventBus from '../event-bus.js';

class MaterialService {
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

  /**
   * 预先创建项目中用到的所有材质
   */
  _createAllMaterials() {
    // 1. 路径线条材质 (ShaderMaterial)
    const pathConfig = config.getRaw();
    const pathMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(pathConfig.environment.pathColor) },
        uEmissive: { value: new THREE.Color(pathConfig.environment.pathColor) },
        uEmissiveIntensity: { value: pathConfig.material.path.emissiveIntensity },
        uDepthIntensity: { value: pathConfig.path.depthIntensity },
        uCameraPosition: { value: new THREE.Vector3() }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uEmissiveIntensity;
        uniform float uDepthIntensity;
        uniform vec3 uCameraPosition;
        varying vec3 vWorldPosition;
        void main() {
          vec3 finalColor = uColor + uEmissive * uEmissiveIntensity;
          float distToCamera = length(vWorldPosition - uCameraPosition);
          float fade = smoothstep(0.0, 200.0, distToCamera); // Hardcoded max distance
          float alpha = 1.0 - fade * uDepthIntensity;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.materials.set('pathLine', pathMaterial);

    // 2. 尘埃粒子材质 (PointsMaterial)
    const dustParticlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(pathConfig.particles.dustColor),
      size: pathConfig.particles.dustSize,
      opacity: pathConfig.particles.dustOpacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      sizeAttenuation: true
    });
    this.materials.set('dustParticles', dustParticlesMaterial);

    // 3. 移动光点材质 (MeshBasicMaterial)
    const movingLightMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(pathConfig.particles.pathPointColor),
      transparent: true,
      opacity: 0.9
    });
    this.materials.set('movingLight', movingLightMaterial);
  }

  /**
   * 监听配置变化，动态更新材质属性
   */
  _bindEvents() {
    eventBus.on('config-changed', ({ key, value }) => {
      this._updateMaterialProperty(key, value);
    });
  }

  _updateMaterialProperty(key, value) {
    const pathMat = this.materials.get('pathLine');
    const dustMat = this.materials.get('dustParticles');
    const lightMat = this.materials.get('movingLight');

    switch (key) {
      // Path Material
      case 'environment.pathColor':
        pathMat.uniforms.uColor.value.set(value);
        pathMat.uniforms.uEmissive.value.set(value);
        break;
      case 'material.path.emissiveIntensity':
        pathMat.uniforms.uEmissiveIntensity.value = value;
        break;
      case 'path.depthIntensity':
        pathMat.uniforms.uDepthIntensity.value = value;
        break;

      // Dust Particles Material
      case 'particles.dustColor':
        dustMat.color.set(value);
        break;
      case 'particles.dustSize':
        dustMat.size = value;
        break;
      case 'particles.dustOpacity':
        dustMat.opacity = value;
        break;

      // Moving Light Material
      case 'particles.pathPointColor':
        lightMat.color.set(value);
        break;
    }
  }

  /**
   * 获取一个已注册的材质实例
   * @param {string} name - 材质名称 ('pathLine', 'dustParticles', 'movingLight')
   * @returns {THREE.Material | undefined}
   */
  get(name) {
    const material = this.materials.get(name);
    if (!material) {
      logger.warn('MaterialService', `请求的材质 "${name}" 不存在`);
    }
    return material;
  }

  dispose() {
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
    this.initialized = false;
    logger.info('MaterialService', '材质服务已销毁');
  }
}

const materialSys = new MaterialService();
export default materialSys;
