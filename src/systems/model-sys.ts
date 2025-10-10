/**
 * @file model-sys.ts
 * @description 模型服务 - 负责加载、缓存和处理 GLB/GLTF 模型资源。
 */
// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import logger from '../utils/logger';
import materialSys from './material-sys';
import { resolveAssetUrl } from '../utils/url-resolver';

class ModelService {
  private initialized: boolean;
  private loader: GLTFLoader;
  private cache: Map<string, any>;

  constructor() {
    this.initialized = false;
    this.loader = new GLTFLoader();
    this.cache = new Map(); // 用于缓存已加载的GLTF结果
  }

  init() {
    if (this.initialized) {
      logger.warn('ModelService', '模型服务已经初始化过了');
      return this;
    }
    this.initialized = true;
    logger.info('ModelService', '模型服务初始化完成');
    return this;
  }

  /**
   * 异步加载一个GLTF/GLB模型
   * @param {string} relativeUrl - 相对于/public目录的模型路径
   * @returns {Promise<THREE.Group>} 返回一个包含模型场景的Promise
   */
  async load(relativeUrl: string) {
    const url = resolveAssetUrl(relativeUrl);

    if (this.cache.has(url)) {
      const cachedGltf = this.cache.get(url);
      const modelClone = cachedGltf.scene.clone(true);
      logger.debug('ModelService', `从缓存加载模型: ${relativeUrl}`);
      return modelClone;
    }

    try {
      logger.info('ModelService', `开始加载模型: ${relativeUrl}`);
      const gltf = await this.loader.loadAsync(url);

      // 缓存原始加载结果
      this.cache.set(url, gltf);

      // 返回场景的克隆，以防原始缓存被修改
      const modelClone = gltf.scene.clone(true);
      logger.info('ModelService', `✅ 模型加载成功: ${relativeUrl}`);

      return modelClone;
    } catch (error: unknown) {
      logger.error('ModelService', `加载模型失败 "${relativeUrl}": ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * 将指定名称的材质应用到模型的所有网格上
   * @param {THREE.Group} model - 目标模型
   * @param {string} materialName - 在 MaterialService 中注册的材质名称
   */
  applyMaterial(model: any, materialName: string) {
    const material = materialSys.get(materialName);
    if (!material) {
      logger.warn('ModelService', `应用材质失败: 材质 "${materialName}" 不存在`);
      return;
    }

    model.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
    logger.debug('ModelService', `已将材质 "${materialName}" 应用到模型上`);
  }

  dispose() {
    this.cache.clear();
    this.initialized = false;
    logger.info('ModelService', '模型服务已销毁');
  }
}

const modelSys = new ModelService();
export default modelSys;
