/**
 * @file scene-director-sys.ts
 * @description 场景导演系统 - 根据配置动态启用/禁用场景中的视觉组件
 * 🔧 修复: 区分初始化和场景切换，只在切换时强制更新位置
 */
import logger from '../utils/logger';
import config from '../config';
import state from './state';

// 引入所有受其控制的视觉系统
import pathSys from './path-sys';
import particlesSys from './particles-sys';
import lightSys from './light-sys';

class SceneDirector {
  private eventBus: any = null;
  private initialized = false;
  private components: Map<string, any> = new Map();
  private isInitializing = true; // ✅ 标记是否在初始化阶段

  constructor() {
    this.eventBus = null;
    this.initialized = false;
    this.components = new Map();
  }

  init({ eventBus }: { eventBus: any }) {
    if (this.initialized) return this;

    this.eventBus = eventBus;
    this._registerComponents();
    this._bindEvents();

    // 在应用配置前就标记初始化完成
    this.initialized = true;
    this.isInitializing = false;

    // 立即应用初始配置（此时不会触发位置更新）
    this._applyCurrentComposition();

    logger.info('SceneDirector', '场景导演系统初始化完成');
    return this;
  }

  private _registerComponents() {
    this.components.set('math-path', pathSys);
    this.components.set('math-light', lightSys);
    this.components.set('model-light', lightSys); // 共用同一个实例
    this.components.set('particle-dust', particlesSys);
    logger.debug('SceneDirector', `注册了 ${this.components.size} 个视觉组件`);
  }

  private _bindEvents() {
    this.eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'sceneComposition.active') {
        logger.info('SceneDirector', `检测到场景构成切换: ${value}`);
        this._applyCurrentComposition();
      }
    });
  }

  private _applyCurrentComposition() {
    const activeCompositionName = config.get('sceneComposition.active');
    const composition = config.get(`sceneComposition.compositions.${activeCompositionName}`);

    if (!composition) {
      logger.error('SceneDirector', `未找到名为 "${activeCompositionName}" 的场景构成`);
      return;
    }

    logger.info('SceneDirector', `正在应用场景构成: "${activeCompositionName}"`);

    // 1. 先禁用所有受控组件
    this.components.forEach((component) => {
      if (typeof component.disable === 'function') {
        component.disable();
      }
    });

    // 2. 根据配置启用所需的组件
    composition.forEach((item: any) => {
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

    // 🔧 修复：场景切换后强制刷新当前位置（Tween.js版本）
    // 🔧 核心修复：场景切换后刷新当前位置（增强版）
    if (!this.isInitializing) {
      // 第一次尝试：立即发送位置更新（用于已就绪的渲染器）
      setTimeout(() => {
        const currentStep = state.get('animation.currentStep') || 0;
        const mappedPoints = state.get('data.mappedPoints') || [];
        const totalSteps = mappedPoints.length;

        if (totalSteps > 0 && currentStep < totalSteps) {
          const position = mappedPoints[currentStep];
          if (position) {
            logger.info('SceneDirector', `场景切换后刷新位置 (快速): 步数=${currentStep}`);
            this.eventBus.emit('moving-light-position-updated', {
              position: position.clone(),
              distance: currentStep / Math.max(1, totalSteps - 1),
            });
          }
        }
      }, 100); // 第一次尝试：100ms

      // 第二次尝试：延迟发送（确保异步加载的渲染器也能收到）
      setTimeout(() => {
        const currentStep = state.get('animation.currentStep') || 0;
        const mappedPoints = state.get('data.mappedPoints') || [];
        const totalSteps = mappedPoints.length;

        if (totalSteps > 0 && currentStep < totalSteps) {
          const position = mappedPoints[currentStep];
          if (position) {
            logger.info('SceneDirector', `场景切换后刷新位置 (延迟): 步数=${currentStep}`);
            this.eventBus.emit('moving-light-position-updated', {
              position: position.clone(),
              distance: currentStep / Math.max(1, totalSteps - 1),
            });
          }
        }
      }, 350); // 第二次尝试：350ms（给模型加载足够时间）
    }
  }

  // 确保 dispose 在类内部正确结构
  dispose() {
    this.components.clear();
    this.initialized = false;
    logger.info('SceneDirector', '场景导演系统已销毁');
  }
}

const sceneDirector = new SceneDirector();
export default sceneDirector;
