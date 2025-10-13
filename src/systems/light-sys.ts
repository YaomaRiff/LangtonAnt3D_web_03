/**
 * @file light-sys.ts
 * @description 统一光点管理器 - 只负责接收位置更新
 * @version 2.0 (Simplified)
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import { ILightRenderer } from './renderers/light-renderer';
import { MathLightRenderer } from './renderers/math-light-renderer';
import { ModelLightRenderer } from './renderers/model-light-renderer';

type RendererType = 'math' | 'model';

class LightSystem {
  private eventBus: any = null;
  private initialized = false;

  // 渲染器管理
  private renderers: Map<RendererType, ILightRenderer> = new Map();
  private activeRenderer: ILightRenderer | null = null;
  private currentType: RendererType = 'math';

  // 状态缓存
  private currentPosition: THREE.Vector3 = new THREE.Vector3();
  private isEnabled = true;

  constructor() {}

  async init({ eventBus, coordinateSystem }: { eventBus: any; coordinateSystem: any }) {
    if (this.initialized) {
      logger.warn('LightSystem', '光点系统已初始化');
      return this;
    }

    try {
      this.eventBus = eventBus;

      // 创建所有渲染器实例
      this.renderers.set('math', new MathLightRenderer(coordinateSystem));
      this.renderers.set('model', new ModelLightRenderer(coordinateSystem));

      // 根据配置决定默认激活哪个渲染器
      const activeComposition = config.get('sceneComposition.active');
      const defaultType = activeComposition === 'modelAnt' ? 'model' : 'math';

      await this._switchRenderer(defaultType);

      this._bindEvents();

      this.initialized = true;
      logger.info('LightSystem', '统一光点系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('LightSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * 🔥 核心方法：切换渲染器
   */
  private async _switchRenderer(type: RendererType) {
    if (this.currentType === type && this.activeRenderer?.isReady) {
      return;
    }

    // 销毁旧渲染器
    if (this.activeRenderer) {
      this.activeRenderer.dispose();
    }

    // 激活新渲染器
    const newRenderer = this.renderers.get(type);
    if (!newRenderer) {
      logger.error('LightSystem', `未知的渲染器类型: ${type}`);
      return;
    }

    if (!newRenderer.isReady) {
      await newRenderer.create();
    }

    this.activeRenderer = newRenderer;
    this.currentType = type;

    // 恢复到当前位置
    if (this.isEnabled && this.currentPosition.lengthSq() > 0) {
      this.activeRenderer.updatePosition(this.currentPosition);
    }

    logger.info('LightSystem', `✅ 已切换到 ${type} 渲染器`);
  }

  /**
   * 🔥 核心方法：绑定事件
   */
  private _bindEvents() {
    // 监听位置更新（新格式）
    this.eventBus.on('moving-light-position-updated', (data: any) => {
      const position = data.position || data;
      this.updatePosition(position);
    });

    // 监听场景切换
    this.eventBus.on('config-changed', async ({ key }: { key: string }) => {
      if (key === 'sceneComposition.active') {
        const compositionName = config.get('sceneComposition.active');
        const targetType = compositionName === 'modelAnt' ? 'model' : 'math';
        await this._switchRenderer(targetType);
      }
    });

    // 监听动画重置
    this.eventBus.on('animation-reset', () => {
      this.hide();
    });
  }

  /**
   * 更新光点位置
   */
  updatePosition(position: THREE.Vector3) {
    if (!this.isEnabled || !this.activeRenderer) return;

    this.currentPosition.copy(position);

    if (this.activeRenderer.isReady) {
      this.activeRenderer.updatePosition(position);
    }
  }

  show() {
    if (this.activeRenderer) {
      this.activeRenderer.show();
    }
  }

  hide() {
    if (this.activeRenderer) {
      this.activeRenderer.hide();
    }
  }

  enable() {
    this.isEnabled = true;
    this.show();
  }

  disable() {
    this.isEnabled = false;
    this.hide();
  }

  dispose() {
    this.renderers.forEach((renderer) => renderer.dispose());
    this.renderers.clear();
    this.activeRenderer = null;
    this.initialized = false;
    logger.info('LightSystem', '统一光点系统已销毁');
  }
}

const lightSys = new LightSystem();
export default lightSys;
