/**
 * @file ui-scene.ts
 * @description 场景构成切换UI - 控制光点模式（数学球体 vs 3D模型）
 * ✨ 功能：提供一个独立的UI面板来切换场景中的视觉组件
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';

class UIScene {
  private pane: Pane | null = null;
  private initialized: boolean = false;
  private controls: Map<string, any> = new Map();
  private configData: any;

  constructor() {
    this.configData = config.getRaw();
  }

  async init() {
    if (this.initialized) {
      logger.warn('UIScene', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UIScene', '容器未初始化');
      return;
    }

    try {
      this.pane = new Pane({
        title: '场景构成',
        container: uiContainer.getScrollContent() || undefined,
        expanded: true,
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      // 注册到UI注册表
      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-scene', this);

      logger.info('UIScene', '场景构成 UI 已初始化');

      return this;
    } catch (err: unknown) {
      logger.error('UIScene', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  private _createControls() {
    // 场景模式选择器
    const sceneMode = this.pane!.addBinding(this.configData.sceneComposition, 'active', {
      label: '光点模式',
      options: {
        数学球体: 'defaultMath',
        '3D模型 (火箭)': 'modelAnt',
      },
    });

    sceneMode.on('change', (ev: any) => {
      config.set('sceneComposition.active', ev.value);
      logger.info('UIScene', `场景模式已切换: ${ev.value}`);
    });

    this.controls.set('sceneComposition.active', sceneMode);

    //只保留模型设置文件夹（移除使用说明）
    const modelFolder = this.pane!.addFolder({
      title: '模型设置',
      expanded: false,
    });

    modelFolder.addBlade({
      view: 'text',
      label: '当前模型',
      parse: (v: string) => String(v),
      value: 'rocket.glb',
    });
  }

  private _bindEvents() {
    // 监听外部配置变更，同步UI
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'sceneComposition.active') {
        const control = this.controls.get(key);
        if (control && this.configData.sceneComposition.active !== value) {
          this.configData.sceneComposition.active = value;
          control.refresh();
        }
      }
    });

    // 监听预设加载
    eventBus.on('preset-loaded', () => {
      this.refresh();
    });
  }

  refresh() {
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIScene', 'UI 已刷新');
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.controls.clear();
    this.initialized = false;
    logger.info('UIScene', 'UI 已销毁');
  }
}

const uiScene = new UIScene();
export default uiScene;
