/**
 * @file scene-director-sys.js
 * @description 场景导演系统 - 根据配置动态启用/禁用场景中的视觉组件
 */
import logger from '../utils/logger.js';
import config from '../config.js';

// 引入所有受其控制的视觉系统
import pathSys from './path-sys.js';
import mathLightSys from './math-light-sys.js';
import particlesSys from './particles-sys.js';
// import modelSys from './model-sys.js'; // 未来用于加载模型

class SceneDirector {
  constructor() {
    this.eventBus = null;
    this.initialized = false;
    this.components = new Map();
  }

  init({ eventBus }) {
    if (this.initialized) return this;
    
    this.eventBus = eventBus;
    this._registerComponents();
    this._bindEvents();

    // 立即应用初始配置
    this._applyCurrentComposition();

    this.initialized = true;
    logger.info('SceneDirector', '场景导演系统初始化完成');
    return this;
  }

  /**
   * 注册所有可被导演控制的视觉组件。
   * key 必须与 config.js -> sceneComposition -> type 的值完全对应。
   */
  _registerComponents() {
    this.components.set('math-path', pathSys);
    this.components.set('math-light', mathLightSys);
    this.components.set('particle-dust', particlesSys);
    // 未来可以添加 'model' 等更多类型
    logger.debug('SceneDirector', `注册了 ${this.components.size} 个视觉组件`);
  }

  _bindEvents() {
    this.eventBus.on('config-changed', ({ key, value }) => {
      if (key === 'sceneComposition.active') {
        logger.info('SceneDirector', `检测到场景构成切换: ${value}`);
        this._applyCurrentComposition();
      }
    });
  }

  /**
   * 应用当前的场景构成配置
   */
  _applyCurrentComposition() {
    const activeCompositionName = config.get('sceneComposition.active');
    const composition = config.get(`sceneComposition.compositions.${activeCompositionName}`);

    if (!composition) {
      logger.error('SceneDirector', `未找到名为 "${activeCompositionName}" 的场景构成`);
      return;
    }

    logger.info('SceneDirector', `正在应用场景构成: "${activeCompositionName}"`);

    // 1. 先禁用所有受控组件，确保一个干净的状态
    this.components.forEach(component => {
      if (typeof component.disable === 'function') {
        component.disable();
      }
    });

    // 2. 根据配置启用所需的组件
    composition.forEach(item => {
      const component = this.components.get(item.type);
      if (component) {
        if (item.enabled && typeof component.enable === 'function') {
          component.enable();
          logger.debug('SceneDirector', `  -> 已启用: ${item.type}`);
        }
      } else {
        logger.warn('SceneDirector', `  -> 未知组件类型: ${item.type}`);
      }
    });
  }

  dispose() {
    this.components.clear();
    this.initialized = false;
    logger.info('SceneDirector', '场景导演系统已销毁');
  }
}

const sceneDirector = new SceneDirector();
export default sceneDirector;
