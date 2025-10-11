/**
 * @file ui-container.ts
 * @description UI 容器系统 - 仅负责创建滚动区域
 * @version 4.0 (Pure Container)
 */
import logger from '../utils/logger';

class UIContainer {
  private panelContainer: HTMLElement | null = null;
  private scrollContent: HTMLElement | null = null;
  private initialized: boolean = false;

  init() {
    if (this.initialized) {
      logger.warn('UIContainer', '容器已初始化');
      return;
    }

    this.panelContainer = document.getElementById('left-panel');

    if (!this.panelContainer) {
      logger.error('UIContainer', '初始化失败: 未找到 #left-panel 元素。');
      return;
    }

    this._createScrollContent();
    this._setupScrollBehavior();

    this.initialized = true;
    logger.info('UIContainer', 'UI 容器已初始化（不干预 Tweakpane 样式）');
  }

  private _createScrollContent() {
    this.panelContainer!.innerHTML = '';
    this.scrollContent = document.createElement('div');
    this.scrollContent.id = 'ui-scroll-content';
    this.panelContainer!.appendChild(this.scrollContent);
  }

  private _setupScrollBehavior() {
    // 阻止滚轮事件冒泡到外层
    this.scrollContent!.addEventListener(
      'wheel',
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );
  }

  getScrollContent(): HTMLElement | null {
    return this.scrollContent;
  }

  dispose() {
    if (this.panelContainer) {
      this.panelContainer.innerHTML = '';
    }
    this.panelContainer = null;
    this.scrollContent = null;
    this.initialized = false;
    logger.info('UIContainer', 'UI 容器已销毁');
  }
}

export default new UIContainer();
