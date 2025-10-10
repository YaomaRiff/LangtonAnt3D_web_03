/**
 * @file ui-coordinates.js
 * @description 坐标系统 UI 面板 - 缩放控制
 * ✅ 已删除：整体旋转、调试信息按钮
 */
import { Pane } from 'tweakpane';
import logger from '../utils/logger';
import uiContainer from './ui-container';
import config from '../config';

class UICoordinates {
  private pane: any;
  private eventBus: any;
  private initialized: boolean;
  private controls: Map<string, any>;
  private configData: any;

  constructor() {
    this.pane = null;
    this.eventBus = null;
    this.initialized = false;
    this.controls = new Map();

    this.configData = config.getRaw();
  }

  async init({ eventBus }: { eventBus: any }) {
    if (this.initialized) {
      logger.warn('UICoordinates', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UICoordinates', '容器未初始化');
      return;
    }

    try {
      this.eventBus = eventBus;

      this.pane = new Pane({
        title: '坐标系统',
        container: uiContainer.getScrollContent() || undefined,
        expanded: true,
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-coordinates', this);

      logger.info('UICoordinates', '坐标系统 UI 已初始化');

      return this;
    } catch (err: unknown) {
      logger.error('UICoordinates', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createControls() {
    // 整体缩放
    const dataSpaceScale = this.pane.addBinding(this.configData.coordinates.dataSpace, 'scale', {
      label: '整体缩放',
      min: 0.1,
      max: 5.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    dataSpaceScale.on('change', (ev: any) => {
      config.set('coordinates.dataSpace.scale', ev.value);
    });
    this.controls.set('coordinates.dataSpace.scale', dataSpaceScale);

    // 粒子系统缩放
    const particleScale = this.pane.addBinding(this.configData.particles, 'systemScale', {
      label: '粒子缩放',
      min: 0.1,
      max: 5.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    particleScale.on('change', (ev: any) => {
      config.set('particles.systemScale', ev.value);
    });
    this.controls.set('particles.systemScale', particleScale);

    // 路径缩放
    const pathScale = this.pane.addBinding(this.configData.path, 'scale', {
      label: '路径缩放',
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    pathScale.on('change', (ev: any) => {
      config.set('path.scale', ev.value);
    });
    this.controls.set('path.scale', pathScale);

    // 重置按钮
    this.pane
      .addButton({
        title: '🔄 重置坐标系统',
      })
      .on('click', () => {
        // 🟢 改造: 通过 eventBus 发出命令
        this.eventBus.emit('coordinate-system-reset');
      });
  }

  _bindEvents() {
    // 监听 reset 命令完成
    this.eventBus.on('coordinate-system-reset-completed', () => {
      this.refresh();
      logger.info('UICoordinates', '坐标系统 UI 已刷新');
    });

    // 监听外部配置变更
    this.eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (part) target = target[part];
        }
        const lastKey = pathParts[pathParts.length - 1]!;
        if (target && target[lastKey] !== value) {
          target[lastKey] = value;
          control.refresh();
        }
      }
    });

    // 监听预设加载
    this.eventBus.on('preset-loaded', () => {
      this.refresh();
    });
  }

  updateBindings() {
    logger.debug('UICoordinates', '绑定检查完成');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UICoordinates', 'UI 已刷新');
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.controls.clear();
    this.initialized = false;
    logger.info('UICoordinates', 'UI 已销毁');
  }
}

const uiCoordinates = new UICoordinates();
export default uiCoordinates;
