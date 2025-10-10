/**
 * @file environment-sys.js
 * @description 环境系统 - 负责管理天空盒、背景和环境反射
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';
import { resolveAssetUrl } from '../utils/url-resolver';

class EnvironmentSystem {
  private scene: THREE.Scene | null = null;
  private initialized = false;
  private cubeTextureLoader: THREE.CubeTextureLoader;
  private fallbackColor: THREE.Color;

  constructor() {
    this.scene = null;
    this.initialized = false;
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.fallbackColor = new THREE.Color('#121414'); // 默认背景色
  }

  init({ scene }: any) {
    if (this.initialized) return this;
    this.scene = scene;

    this._loadSkybox();
    this._bindEvents();

    this.initialized = true;
    logger.info('EnvironmentSystem', '环境系统初始化完成');
    return this;
  }

  _bindEvents() {
    // 监听背景颜色变化，用于在禁用天空盒时切换
    eventBus.on('bg-color-changed', (color: any) => {
      const skyboxEnabled = config.get('environment.skybox.enabled');
      if (!skyboxEnabled) {
        this.fallbackColor.set(color);
        if (this.scene) this.scene.background = this.fallbackColor;
      }
    });
  }

  _loadSkybox() {
    const skyboxConfig = config.get('environment.skybox');

    if (!skyboxConfig || !skyboxConfig.enabled || !skyboxConfig.path) {
      logger.warn('EnvironmentSystem', '天空盒未配置或未启用，使用纯色背景');
      if (this.scene) this.scene.background = this.fallbackColor;
      return;
    }

    // ✅ 2. 使用 resolveAssetUrl 包装基础路径
    const basePath = resolveAssetUrl(skyboxConfig.path);
    const urls = [
      basePath + 'px.png',
      basePath + 'nx.png', // 右, 左
      basePath + 'py.png',
      basePath + 'ny.png', // 上, 下
      basePath + 'nz.png',
      basePath + 'pz.png', // 前, 后
    ];

    logger.debug('EnvironmentSystem', `正在加载天空盒: ${basePath}`);

    this.cubeTextureLoader.load(
      urls,
      (texture) => {
        if (this.scene) {
          this.scene.background = texture;
          this.scene.environment = texture;
        }
        logger.info('EnvironmentSystem', '✅ 天空盒加载成功并应用');
      },
      undefined,
      (error) => {
        logger.error('EnvironmentSystem', `天空盒加载失败: ${(error as Error).message}`);
        // ✅ 添加空值检查
        if (this.scene) {
          this.scene.background = this.fallbackColor;
        }
      }
    );
  }

  dispose() {
    if (this.scene) this.scene.background = null;
    if (this.scene) this.scene.environment = null;
    this.initialized = false;
    logger.info('EnvironmentSystem', '环境系统已销毁');
  }
}

const environmentSys = new EnvironmentSystem();
export default environmentSys;
