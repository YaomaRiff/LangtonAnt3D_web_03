/**
 * @file ui-monitor.ts
 * @description 监视器覆盖层UI - 在3D视图上显示状态信息。
 */
import eventBus from '../event-bus';
import state from '../systems/state';
import logger from '../utils/logger';

class UIMonitor {
  private container: HTMLElement | null = null;
  private stepDisplay: HTMLElement | null = null;
  private initialized: boolean = false;

  init() {
    if (this.initialized) {
      logger.warn('UIMonitor', 'UI已初始化');
      return;
    }

    this.container = document.getElementById('monitor-overlay-ui');
    if (!this.container) {
      logger.error('UIMonitor', '初始化失败: 未找到 #monitor-overlay-ui 元素。');
      return;
    }

    this._createElements();
    this._bindEvents();

    this.initialized = true;
    logger.info('UIMonitor', '监视器UI已初始化');
  }

  private _createElements() {
    // 动画步数显示
    const stepWrapper = document.createElement('div');
    stepWrapper.className = 'monitor-info-item';
    stepWrapper.innerHTML = `<span class="label">STEP:</span>`;
    this.stepDisplay = document.createElement('span');
    this.stepDisplay.className = 'value';
    this.stepDisplay.textContent = '0 / 0';
    stepWrapper.appendChild(this.stepDisplay);

    this.container!.appendChild(stepWrapper);
  }

  private _bindEvents() {
    const updateStepDisplay = () => {
      const currentStep = state.get('animation.currentStep') || 0;
      const totalSteps = (state.get('data.mappedPoints') || []).length;
      if (this.stepDisplay) {
        this.stepDisplay.textContent = `${currentStep} / ${totalSteps > 0 ? totalSteps - 1 : 0}`;
      }
    };

    eventBus.on('state-changed', ({ key }: { key: string }) => {
      if (key === 'animation.currentStep' || key === 'data.mappedPoints') {
        updateStepDisplay();
      }
    });

    // 初始化时也更新一次
    updateStepDisplay();
  }

  dispose() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.initialized = false;
    logger.info('UIMonitor', '监视器UI已销毁');
  }
}

export default new UIMonitor();
