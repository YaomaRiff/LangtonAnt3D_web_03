/**
 * @file user-ui.ts
 * @description 现代化播放器风格UI控制面板 - 路径步数控制 + 相机视角 + 音乐
 * @version 2.0 (Modern Player UI)
 */

import configManager from './config';
import eventBus from './event-bus';
import logger from './utils/logger';
import animationSys from './systems/animation-sys';
import cameraSys from './systems/camera-sys';
import audioSys from './systems/audio-sys';

export class UserUI {
  private currentStep = 0;
  private totalSteps = 0;
  private isPlaying = false;
  private isDragging = false;

  // UI元素引用
  private playBtn: HTMLButtonElement | null = null;
  private playIcon: SVGElement | null = null;
  private pauseIcon: SVGElement | null = null;
  private progressSlider: HTMLInputElement | null = null;
  private progressFill: HTMLDivElement | null = null;
  private currentStepDisplay: HTMLSpanElement | null = null;
  private totalStepsDisplay: HTMLSpanElement | null = null;
  private audioBtn: HTMLButtonElement | null = null;
  private audioOnIcon: SVGElement | null = null;
  private audioOffIcon: SVGElement | null = null;

  constructor() {
    // 延迟初始化，等待DOM准备完成
  }

  public async initialize() {
    console.log('🎛️ Initializing Modern Player UI...');

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      await new Promise((resolve) => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    this.setupControlElements();
    this.setupEventListeners();
    this.updateUIState();
    console.log('✅ Modern Player UI initialized');
  }

  private setupControlElements() {
    // 播放控制按钮
    this.playBtn = document.getElementById('play-pause') as HTMLButtonElement;
    this.playIcon = this.playBtn?.querySelector('.play-icon') as SVGElement;
    this.pauseIcon = this.playBtn?.querySelector('.pause-icon') as SVGElement;

    // 进度条
    this.progressSlider = document.getElementById('progress-slider') as HTMLInputElement;
    this.progressFill = document.getElementById('progress-fill') as HTMLDivElement;

    // 步数显示
    this.currentStepDisplay = document.getElementById('current-step') as HTMLSpanElement;
    this.totalStepsDisplay = document.getElementById('total-steps') as HTMLSpanElement;

    // 音频控制
    this.audioBtn = document.getElementById('audio-toggle') as HTMLButtonElement;
    this.audioOnIcon = this.audioBtn?.querySelector('.audio-on') as SVGElement;
    this.audioOffIcon = this.audioBtn?.querySelector('.audio-off') as SVGElement;

    console.log('🎮 Control elements initialized');
  }

  private setupEventListeners() {
    // 播放/暂停按钮
    this.playBtn?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    // 进度条控制
    this.progressSlider?.addEventListener('input', (e) => {
      if (!this.isDragging) {
        this.handleProgressChange((e.target as HTMLInputElement).value);
      }
    });

    this.progressSlider?.addEventListener('mousedown', () => {
      this.isDragging = true;
    });

    this.progressSlider?.addEventListener('mouseup', () => {
      this.isDragging = false;
      if (this.progressSlider) {
        this.handleProgressChange(this.progressSlider.value);
      }
    });

    // 进度条点击
    const progressBar = document.querySelector('.progress-bar');
    progressBar?.addEventListener('click', (e: Event) => {
      const rect = progressBar.getBoundingClientRect();
      const mouseEvent = e as MouseEvent;
      const percent = ((mouseEvent.clientX - rect.left) / rect.width) * 100;
      this.handleProgressChange(percent.toString());
    });

    // 步数控制按钮
    document.getElementById('step-backward')?.addEventListener('click', () => {
      this.changeStep(-10);
    });

    document.getElementById('step-forward')?.addEventListener('click', () => {
      this.changeStep(10);
    });

    // 视角控制按钮
    document.getElementById('view-left')?.addEventListener('click', () => {
      this.setView('side');
    });

    document.getElementById('view-front')?.addEventListener('click', () => {
      this.setView('front');
    });

    document.getElementById('view-top')?.addEventListener('click', () => {
      this.setView('top');
    });

    document.getElementById('view-perspective')?.addEventListener('click', () => {
      this.setPerspectiveView();
    });

    // 音频控制
    this.audioBtn?.addEventListener('click', () => {
      this.toggleAudio();
    });

    // 监听动画状态变化
    eventBus.on('animation-state-changed', (isPlaying: boolean) => {
      this.isPlaying = isPlaying;
      this.updatePlayButton();
    });

    // 监听音频状态变化
    eventBus.on('audio-state-changed', (isPlaying: boolean) => {
      this.updateAudioButton(isPlaying);
    });

    // 监听数据加载完成
    eventBus.on('data-loaded', (data: any) => {
      if (data && data.points) {
        this.totalSteps = data.points.length || 0;
        this.updateStepDisplay();
        logger.info('UserUI', `数据已加载，总步数: ${this.totalSteps}`);
      }
    });

    console.log('🎧 Event listeners set up');
  }

  private togglePlayPause() {
    if (this.isPlaying) {
      animationSys.pause();
    } else {
      animationSys.play();
    }
    this.isPlaying = !this.isPlaying;
    configManager.set('animation.isPlaying', this.isPlaying);
    this.updatePlayButton();
  }

  private updatePlayButton() {
    if (this.playIcon && this.pauseIcon) {
      if (this.isPlaying) {
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
      } else {
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
      }
    }
  }

  private handleProgressChange(value: string) {
    const percent = parseFloat(value) / 100;
    const newStep = Math.round(percent * this.totalSteps);
    this.currentStep = Math.max(0, Math.min(newStep, this.totalSteps));

    // 更新进度条
    this.updateProgressBar();

    // 触发步数变化事件
    eventBus.emit('step-changed', {
      step: this.currentStep,
      percent: percent * 100,
    });

    // 更新动画系统
    animationSys.setStep(this.currentStep);
    this.updateStepDisplay();
  }

  private changeStep(delta: number) {
    this.currentStep = Math.max(0, Math.min(this.currentStep + delta, this.totalSteps));

    const percent = this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0;

    if (this.progressSlider) {
      this.progressSlider.value = percent.toString();
    }

    this.updateProgressBar();

    eventBus.emit('step-changed', {
      step: this.currentStep,
      percent: percent,
    });

    animationSys.setStep(this.currentStep);
    this.updateStepDisplay();
  }

  private updateProgressBar() {
    if (this.progressFill && this.totalSteps > 0) {
      const percent = (this.currentStep / this.totalSteps) * 100;
      this.progressFill.style.width = `${percent}%`;

      if (this.progressSlider) {
        this.progressSlider.value = percent.toString();
      }
    }
  }

  private updateStepDisplay() {
    if (this.currentStepDisplay) {
      this.currentStepDisplay.textContent = this.currentStep.toString();
    }
    if (this.totalStepsDisplay) {
      this.totalStepsDisplay.textContent = this.totalSteps.toString();
    }
  }

  private setView(viewName: 'front' | 'top' | 'side') {
    // 移除所有视角按钮的active状态
    document.querySelectorAll('.view-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // 设置当前视角按钮为active
    let buttonId = '';
    switch (viewName) {
      case 'side':
        buttonId = 'view-left';
        break;
      case 'front':
        buttonId = 'view-front';
        break;
      case 'top':
        buttonId = 'view-top';
        break;
    }

    const activeBtn = document.getElementById(buttonId);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // 切换到正交相机模式并设置视角
    configManager.set('camera.mode', 'orthographic');
    cameraSys.setView(viewName);

    // 关闭自动旋转
    cameraSys.setAutoRotate(false);
    configManager.set('camera.autoRotate', false);
  }

  private setPerspectiveView() {
    // 移除所有视角按钮的active状态
    document.querySelectorAll('.view-btn').forEach((btn) => {
      btn.classList.remove('active');
    });

    // 设置透视相机按钮为active
    const perspectiveBtn = document.getElementById('view-perspective');
    if (perspectiveBtn) {
      perspectiveBtn.classList.add('active');
    }

    // 切换到透视相机模式
    configManager.set('camera.mode', 'perspective');
    cameraSys.setAutoRotate(false);
    configManager.set('camera.autoRotate', false);
  }

  private toggleAudio() {
    const isMuted = audioSys.toggleMute();
    const isPlaying = !isMuted;

    configManager.set('audio.isMuted', isMuted);
    configManager.set('audio.volume', audioSys.getVolume());

    this.updateAudioButton(isPlaying);
  }

  private updateAudioButton(isPlaying: boolean) {
    if (this.audioOnIcon && this.audioOffIcon) {
      if (isPlaying) {
        this.audioOnIcon.style.display = 'block';
        this.audioOffIcon.style.display = 'none';
        this.audioBtn?.classList.add('active');
      } else {
        this.audioOnIcon.style.display = 'none';
        this.audioOffIcon.style.display = 'block';
        this.audioBtn?.classList.remove('active');
      }
    }
  }

  private updateUIState() {
    // 初始化播放状态
    this.isPlaying = configManager.get('animation.isPlaying') || false;
    this.updatePlayButton();

    // 初始化音频状态
    const audioMuted = configManager.get('audio.isMuted') || true;
    this.updateAudioButton(!audioMuted);

    // 初始化步数显示
    this.updateStepDisplay();
  }

  /**
   * 设置当前步数（供外部系统调用）
   */
  public setStep(step: number) {
    this.currentStep = Math.max(0, Math.min(step, this.totalSteps));
    this.updateProgressBar();
    this.updateStepDisplay();
  }

  /**
   * 设置总步数（供外部系统调用）
   */
  public setTotalSteps(total: number) {
    this.totalSteps = total;
    this.updateStepDisplay();
    this.updateProgressBar();
  }

  /**
   * 获取当前步数
   */
  public getCurrentStep(): number {
    return this.currentStep;
  }

  /**
   * 获取总步数
   */
  public getTotalSteps(): number {
    return this.totalSteps;
  }

  /**
   * 清理资源
   */
  public dispose() {
    eventBus.off('animation-state-changed', this.updatePlayButton);
    eventBus.off('audio-state-changed', this.updateAudioButton);
    eventBus.off('data-loading-completed', this.updateStepDisplay);
    console.log('🗑️ Modern Player UI disposed');
  }
}

// 导出单例实例
export const userUI = new UserUI();
