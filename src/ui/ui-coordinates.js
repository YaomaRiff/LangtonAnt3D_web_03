/**
 * @file ui-coordinates.js
 * @description 坐标系统 UI 面板 - 缩放控制
 * ✅ 已删除：整体旋转、调试信息按钮
 */
import { Pane } from 'tweakpane';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';
import config from '../config.js';

class UICoordinates {
  constructor() {
    this.pane = null;
    this.eventBus = null;
    this.initialized = false;
    this.controls = new Map();
    
    this.configData = config.getRaw();
  }

  async init({ eventBus }) {
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
        container: uiContainer.getScrollContent(),
        expanded: true
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-coordinates', this);

      logger.info('UICoordinates', '坐标系统 UI 已初始化');

      return this;
    } catch (err) {
      logger.error('UICoordinates', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createControls() {
    // 整体缩放
    const dataSpaceScale = this.pane.addBinding(
      this.configData.coordinates.dataSpace,
      'scale',
      {
        label: '整体缩放',
        min: 0.1,
        max: 5.0,
        step: 0.1
      }
    );
    
    dataSpaceScale.on('change', (ev) => {
      this.eventBus.emit('dataspace-scale-changed', ev.value);
    });
    
    this.controls.set('coordinates.dataSpace.scale', dataSpaceScale);

    // 粒子系统缩放
    const particleScale = this.pane.addBinding(
      this.configData.particles,
      'systemScale',
      {
        label: '粒子缩放',
        min: 0.1,
        max: 5.0,
        step: 0.1
      }
    );
    
    particleScale.on('change', (ev) => {
      this.eventBus.emit('particle-system-scale-changed', ev.value);
      logger.debug('UICoordinates', `粒子缩放: ${ev.value.toFixed(2)}x`);
    });
    
    this.controls.set('particles.systemScale', particleScale);

    // 路径缩放
    const pathScale = this.pane.addBinding(
      this.configData.path,
      'scale',
      {
        label: '路径缩放',
        min: 0.1,
        max: 3.0,
        step: 0.1
      }
    );
    
    pathScale.on('change', (ev) => {
      this.eventBus.emit('path-scale-changed', ev.value);
      logger.debug('UICoordinates', `路径缩放: ${ev.value.toFixed(2)}x`);
    });
    
    this.controls.set('path.scale', pathScale);

    // 重置按钮
    this.pane.addButton({
      title: '🔄 重置坐标系统'
    }).on('click', () => {
      this.eventBus.emit('coordinate-system-reset');
    });
  }

  _bindEvents() {
    this.eventBus.on('coordinate-system-reset-completed', () => {
      this.pane.refresh();
      logger.info('UICoordinates', '坐标系统 UI 已刷新');
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
