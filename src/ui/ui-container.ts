/**
 * @file ui-container.ts
 * @description 统一 UI 容器系统 - 管理左侧面板，提供滚动区域和深度美化的主题。
 * @version 3.0 (Pistachio Theme)
 * @✨ 主题: 注入了全新的“开心果(Pistachio)”配色方案，增强了UI层级感。
 * @🔧 修正: 调整了文件夹标题样式，解决了背景过窄和文字居中的问题。
 * @✨ 优化: 更新了滚动条样式，使其与新主题匹配。
 * @🔧 简化: 移除了内联的 Tweakpane 主题代码，改为在全局样式中统一管理
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
    this._applyStyles();
    this._setupScrollBehavior();
    
    this.initialized = true;
    logger.info('UIContainer', 'UI 容器已在 #left-panel 中初始化');
  }

  private _createScrollContent() {
    this.panelContainer!.innerHTML = '';
    this.scrollContent = document.createElement('div');
    this.scrollContent.id = 'ui-scroll-content';
    this.panelContainer!.appendChild(this.scrollContent);
  }

  private _applyStyles() {
    Object.assign(this.scrollContent!.style, {
      height: '100%',
      overflowY: 'auto',
      overflowX: 'hidden',
      boxSizing: 'border-box',
      scrollbarWidth: 'thin', 
      scrollbarColor: 'var(--border-color, #75715e) var(--background-color, #272822)'
    });
    
    // Terminal.css 风格的样式现在在 public/style.css 中统一管理
// 这里只保留必要的滚动条行为设置
const style = document.createElement('style');
style.textContent = `
  /* 确保滚动内容使用等宽字体 */
  #ui-scroll-content {
    font-family: var(--font-mono, 'Fira Code', monospace);
  }
`;
document.head.appendChild(style);

  }

  private _setupScrollBehavior() {
    this.scrollContent!.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: false });
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
    logger.info('UIContainer', 'UI 容器内容已清理');
  }
}

export default new UIContainer();
