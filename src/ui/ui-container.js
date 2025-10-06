/**
 * @file ui-container.js
 * @description 统一 UI 容器系统 - 左侧可滚动面板
 */
import logger from '../utils/logger.js';

class UIContainer {
  constructor() {
    this.container = null;
    this.scrollContent = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      logger.warn('UIContainer', '容器已初始化');
      return;
    }

    this._createContainer();
    this._applyStyles();
    this._setupScrollBehavior();
    
    this.initialized = true;
    logger.info('UIContainer', 'UI 容器已创建');
  }

  _createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'ui-container';
    
    this.scrollContent = document.createElement('div');
    this.scrollContent.id = 'ui-scroll-content';
    
    this.container.appendChild(this.scrollContent);
    document.body.appendChild(this.container);
  }

  _applyStyles() {
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '320px',
      maxHeight: 'calc(100vh - 40px)',
      zIndex: '10000',
      
      background: 'rgba(18, 20, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    });

    Object.assign(this.scrollContent.style, {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '12px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
    });

    const style = document.createElement('style');
    style.textContent = `
      #ui-scroll-content::-webkit-scrollbar {
        width: 8px;
      }
      
      #ui-scroll-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      #ui-scroll-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        transition: background 0.2s;
      }
      
      #ui-scroll-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .tp-dfwv {
        background: transparent !important;
        margin-bottom: 8px !important;
      }
      
      .tp-rotv {
        background: rgba(255, 255, 255, 0.03) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-radius: 8px !important;
        margin-bottom: 8px !important;
      }
      
      .tp-rotv_t {
        color: rgba(255, 255, 255, 0.9) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        padding: 8px 12px !important;
        font-weight: 500 !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        line-height: 1.4 !important;
      }

      .tp-rotv_b {
        align-items: center !important;
      }
      
      .tp-lblv_l {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .tp-brkv {
        background: rgba(255, 255, 255, 0.02) !important;
      }
      
      .tp-btnv_b {
        background: rgba(100, 150, 255, 0.15) !important;
        border: 1px solid rgba(100, 150, 255, 0.3) !important;
        color: rgba(150, 200, 255, 1) !important;
        transition: all 0.2s !important;
      }
      
      .tp-btnv_b:hover {
        background: rgba(100, 150, 255, 0.25) !important;
        border-color: rgba(100, 150, 255, 0.5) !important;
      }
      
      .tp-btnv_b:active {
        background: rgba(100, 150, 255, 0.35) !important;
      }
    `;
    document.head.appendChild(style);
  }

  _setupScrollBehavior() {
    this.scrollContent.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    this.scrollContent.style.scrollBehavior = 'smooth';
  }

  getScrollContent() {
    return this.scrollContent;
  }

  dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.scrollContent = null;
    this.initialized = false;
    logger.info('UIContainer', 'UI 容器已清理');
  }
}

export default new UIContainer();
