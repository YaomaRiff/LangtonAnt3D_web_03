/**
 * @file landing-page.ts
 * @description 初始页面控制器 - 管理静态页面和3D场景切换
 * @version 1.0
 */

import app from './main';
import config from './config';
import eventBus from './event-bus';

class LandingPage {
  private overlay: HTMLElement;
  private mainLayout: HTMLElement;
  private backgroundImage: HTMLImageElement;
  private isTransitioning: boolean = false;

  constructor() {
    // 获取DOM元素
    this.overlay = document.getElementById('landing-overlay')!;
    this.mainLayout = document.getElementById('main-layout')!;
    this.backgroundImage = document.getElementById('background-image') as HTMLImageElement;

    if (!this.overlay || !this.mainLayout || !this.backgroundImage) {
      throw new Error('Required DOM elements not found');
    }

    // 初始化页面内容
    this.initPageContent();

    // 初始化背景图片
    this.initBackgroundImage();

    // 初始化毛玻璃效果
    this.initGlassPanel();

    // 初始化高级毛玻璃效果
    this.initAdvancedGlass();

    // 初始化动画毛玻璃效果
    this.initAnimatedGlass();

    // 初始化布局配置
    this.initLayout();

    // 监听配置变化
    this.initConfigListeners();

    // 绑定事件
    this.bindEvents();

    console.log('Landing Page initialized');
  }

  /**
   * 初始化配置监听器
   */
  private initConfigListeners(): void {
    eventBus.on('config-changed', ({ key }: { key: string }) => {
      if (key.startsWith('landingPage.glassPanel')) {
        this.updateGlassPanel();
        console.log('Glass panel updated due to config change:', key);
      } else if (key.startsWith('landingPage.advancedGlass')) {
        this.updateAdvancedGlass();
        console.log('Advanced glass updated due to config change:', key);
      } else if (key.startsWith('landingPage.animatedGlass')) {
        this.updateAnimatedGlass();
        console.log('Animated glass updated due to config change:', key);
      } else if (key.startsWith('landingPage.layout')) {
        this.updateLayout();
        console.log('Layout updated due to config change:', key);
      } else if (
        key.startsWith('landingPage.') &&
        !key.startsWith('landingPage.glassPanel') &&
        !key.startsWith('landingPage.advancedGlass') &&
        !key.startsWith('landingPage.animatedGlass') &&
        !key.startsWith('landingPage.layout')
      ) {
        this.initPageContent();
        this.initBackgroundImage();
        console.log('Landing page content updated due to config change:', key);
      }
    });
  }

  /**
   * 初始化页面内容
   */
  private initPageContent(): void {
    const landingConfig = config.get('landingPage');

    // 更新文字内容
    const titleElement = document.getElementById('main-title');
    const subtitleElement = document.getElementById('main-subtitle');
    const customTextElement = document.getElementById('custom-text');
    const buttonElement = document.getElementById('start-btn');

    if (titleElement) {
      titleElement.textContent = landingConfig.title;
      // 确保使用Tailwind类
      if (!titleElement.classList.contains('title-glass')) {
        titleElement.className = 'title-glass';
      }
    }

    if (subtitleElement) {
      subtitleElement.textContent = landingConfig.subtitle;
      // 确保使用Tailwind类
      if (!subtitleElement.classList.contains('subtitle-glass')) {
        subtitleElement.className = 'subtitle-glass';
      }
    }

    if (customTextElement) {
      customTextElement.innerHTML = landingConfig.customText;
      // 确保有基础样式类
      if (!customTextElement.classList.contains('text-gray-300')) {
        customTextElement.className = 'text-gray-300 mb-8';
      }
    }

    if (buttonElement) buttonElement.textContent = landingConfig.buttonText;
  }

  /**
   * 初始化背景图片
   */
  private initBackgroundImage(): void {
    const imageUrl = config.get('landingPage.imageUrl');

    if (imageUrl) {
      this.backgroundImage.src = imageUrl;
      this.backgroundImage.alt = 'Background';
    } else {
      this.backgroundImage.style.display = 'none';
    }
  }

  /**
   * 初始化毛玻璃效果
   */
  private initGlassPanel(): void {
    this.updateGlassPanel();
  }

  /**
   * 更新毛玻璃效果
   */
  private updateGlassPanel(): void {
    const glassPanel = document.getElementById('glass-panel');
    if (!glassPanel) return;

    const glassConfig = config.get('landingPage.glassPanel');

    // 应用backdrop-filter
    const backdropFilter = `blur(${glassConfig.blur}px)`;
    glassPanel.style.backdropFilter = backdropFilter;
    (glassPanel.style as any).webkitBackdropFilter = backdropFilter;

    // 应用背景颜色和透明度
    const backgroundColor = `rgba(${glassConfig.backgroundR}, ${glassConfig.backgroundG}, ${glassConfig.backgroundB}, ${glassConfig.backgroundOpacity})`;
    glassPanel.style.background = backgroundColor;

    // 应用边框
    glassPanel.style.border = `1px solid rgba(255, 255, 255, ${glassConfig.borderOpacity})`;

    // 应用圆角
    glassPanel.style.borderRadius = `${glassConfig.borderRadius}px`;

    // 应用内边距
    glassPanel.style.padding = `${glassConfig.padding}px`;

    console.log('Glass panel settings applied:', glassConfig);
  }

  /**
   * 初始化高级毛玻璃效果
   */
  private initAdvancedGlass(): void {
    this.updateAdvancedGlass();
  }

  /**
   * 更新高级毛玻璃效果
   */
  private updateAdvancedGlass(): void {
    const glassPanel = document.getElementById('glass-panel');
    if (!glassPanel) return;

    const advancedConfig = config.get('landingPage.advancedGlass');

    // 创建高级效果样式
    let advancedEffects = '';

    // 噪点效果
    if (advancedConfig.noiseEnabled) {
      advancedEffects += this.generateNoiseEffect(advancedConfig.noiseOpacity);
    }

    // 色差效果
    if (advancedConfig.chromaticAberration > 0) {
      glassPanel.style.textShadow = `
        ${advancedConfig.chromaticAberration}px 0 0 rgba(255, 0, 0, 0.3),
        ${-advancedConfig.chromaticAberration}px 0 0 rgba(0, 0, 255, 0.3)
      `;
    } else {
      glassPanel.style.textShadow = 'none';
    }

    // 磨砂效果
    if (advancedConfig.frostedEnabled) {
      glassPanel.style.transform = `scale(${advancedConfig.frostedScale})`;
      glassPanel.style.filter += ` contrast(1.2) brightness(1.1)`;
    } else {
      glassPanel.style.transform = 'scale(1)';
    }

    // 反射效果
    if (advancedConfig.reflectionEnabled) {
      const reflection = glassPanel.querySelector('::after') as any;
      if (reflection) {
        const style = document.createElement('style');
        style.textContent = `
          #glass-panel::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 30%;
            background: linear-gradient(
              to bottom,
              rgba(255, 255, 255, ${advancedConfig.reflectionOpacity}),
              transparent
            );
            pointer-events: none;
          }
        `;
        document.head.appendChild(style);
      }
    }

    // 应用噪点效果
    if (advancedEffects) {
      const style = document.createElement('style');
      style.textContent = advancedEffects;
      style.id = 'advanced-glass-effects';

      // 移除旧样式
      const oldStyle = document.getElementById('advanced-glass-effects');
      if (oldStyle) oldStyle.remove();

      document.head.appendChild(style);
    }

    console.log('Advanced glass effects applied:', advancedConfig);
  }

  /**
   * 生成噪点效果CSS
   */
  private generateNoiseEffect(opacity: number): string {
    return `
      #glass-panel::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, ${opacity}) 2px,
            rgba(255, 255, 255, ${opacity}) 4px
          );
        pointer-events: none;
        z-index: 1;
      }
    `;
  }

  /**
   * 绑定按钮事件
   */
  private bindEvents(): void {
    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
      startBtn.addEventListener('click', () => this.handleButtonClick());
    }

    // 添加键盘支持
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        this.handleButtonClick();
      }
    });
  }

  /**
   * 处理按钮点击事件
   */
  private handleButtonClick(): void {
    const jumpUrl = config.get('landingPage.jumpUrl');

    if (jumpUrl && jumpUrl !== '#main') {
      // 外部链接跳转
      if (jumpUrl.startsWith('http://') || jumpUrl.startsWith('https://')) {
        window.open(jumpUrl, '_blank');
      } else {
        // 内部跳转
        window.location.href = jumpUrl;
      }
    } else {
      // 默认行为：启动3D体验
      this.startExperience();
    }
  }

  /**
   * 开始体验（包含过渡动画）
   */
  public async startExperience(): Promise<void> {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    try {
      await this.fadeOut();
      await this.transitionTo3D();
    } catch (error) {
      console.error('Transition error:', error);
      // 出错时强制切换
      this.forceSwitchTo3D();
    }
  }

  /**
   * 标准淡出动画
   */
  private async fadeOut(): Promise<void> {
    return new Promise((resolve) => {
      this.overlay.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      this.overlay.style.opacity = '0';
      this.overlay.style.transform = 'scale(1.05)';

      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  /**
   * 切换到3D场景
   */
  private async transitionTo3D(): Promise<void> {
    // 隐藏初始页面
    this.overlay.classList.add('hidden');

    // 显示3D场景
    this.mainLayout.classList.remove('hidden');

    // 添加淡入效果
    this.mainLayout.style.opacity = '0';
    this.mainLayout.style.transition = 'opacity 0.8s ease-in';

    // 强制重排以确保过渡效果
    this.mainLayout.offsetHeight;

    this.mainLayout.style.opacity = '1';

    // 初始化3D应用
    try {
      await app.init();
      console.log('3D Application initialized successfully');
    } catch (error) {
      console.error('Failed to initialize 3D application:', error);
      throw error;
    }

    // 清理初始页面资源
    this.cleanup();

    // 重置过渡状态
    setTimeout(() => {
      this.isTransitioning = false;
    }, 1000);
  }

  /**
   * 强制切换到3D场景（出错时使用）
   */
  private forceSwitchTo3D(): void {
    this.overlay.classList.add('hidden');
    this.mainLayout.classList.remove('hidden');
    this.mainLayout.style.opacity = '1';

    try {
      app.init().catch((error) => {
        console.error('Critical error: Could not initialize 3D application:', error);
      });
    } catch (error) {
      console.error('Critical error: Could not initialize 3D application:', error);
    }

    this.cleanup();
  }

  /**
   * 清理资源
   */
  private cleanup(): void {
    // 移除事件监听器
    document.removeEventListener('keydown', () => {});

    console.log('Landing page resources cleaned up');
  }

  /**
   * 检查是否正在过渡中
   */
  public get isTransitionInProgress(): boolean {
    return this.isTransitioning;
  }

  /**
   * 手动更新毛玻璃效果（用于调试）
   */
  public updateGlassManually(newSettings: Partial<any>): void {
    // 直接更新配置值
    for (const [key, value] of Object.entries(newSettings)) {
      config.set(`landingPage.glassPanel.${key}`, value);
    }

    console.log('Glass panel manually updated:', newSettings);
  }

  /**
   * 初始化动画毛玻璃效果
   */
  private initAnimatedGlass(): void {
    this.updateAnimatedGlass();
  }

  /**
   * 更新动画毛玻璃效果
   */
  private updateAnimatedGlass(): void {
    const glassPanel = document.getElementById('glass-panel');
    if (!glassPanel) return;

    const animatedConfig = config.get('landingPage.animatedGlass');

    // 创建动画样式
    let animations = '';

    // 脉冲效果
    if (animatedConfig.pulseEnabled) {
      animations += this.generatePulseAnimation(
        animatedConfig.pulseSpeed,
        animatedConfig.pulseIntensity
      );
    }

    // 微光效果
    if (animatedConfig.shimmerEnabled) {
      animations += this.generateShimmerAnimation(animatedConfig.shimmerSpeed);
    }

    // 应用动画样式
    if (animations) {
      const style = document.createElement('style');
      style.textContent = animations;
      style.id = 'animated-glass-effects';

      // 移除旧样式
      const oldStyle = document.getElementById('animated-glass-effects');
      if (oldStyle) oldStyle.remove();

      document.head.appendChild(style);
    }

    console.log('Animated glass effects applied:', animatedConfig);
  }

  /**
   * 初始化布局配置
   */
  private initLayout(): void {
    this.updateLayout();
  }

  /**
   * 更新布局配置
   */
  private updateLayout(): void {
    const glassPanel = document.getElementById('glass-panel');
    if (!glassPanel) return;

    const layoutConfig = config.get('landingPage.layout');

    // 处理全屏毛玻璃
    if (layoutConfig.fullScreenGlass) {
      // 移除现有类，添加全屏类
      glassPanel.className = 'glass-panel-fullscreen';
    } else {
      // 确保有基础毛玻璃类
      if (!glassPanel.classList.contains('glass-panel')) {
        glassPanel.className = 'glass-panel';
      }

      // 处理面板位置
      this.setGlassPanelPosition(glassPanel, layoutConfig);

      // 设置面板尺寸
      glassPanel.style.width = layoutConfig.glassPanelWidth;
      glassPanel.style.height = layoutConfig.glassPanelHeight;
      glassPanel.style.maxWidth = layoutConfig.glassPanelMaxWidth;
      glassPanel.style.maxHeight = layoutConfig.glassPanelMaxHeight;
    }

    // 设置文字布局
    glassPanel.style.textAlign = layoutConfig.textAlign;

    // 设置各个元素的边距
    const titleElement = document.getElementById('main-title');
    const subtitleElement = document.getElementById('main-subtitle');
    const customTextElement = document.getElementById('custom-text');
    const actionButtonsElement = document.querySelector('.action-buttons') as HTMLElement;

    if (titleElement) {
      titleElement.style.marginBottom = layoutConfig.titleMarginBottom;
    }

    if (subtitleElement) {
      subtitleElement.style.marginBottom = layoutConfig.subtitleMarginBottom;
    }

    if (customTextElement) {
      customTextElement.style.marginTop = layoutConfig.customTextMarginTop;
      customTextElement.style.marginBottom = layoutConfig.customTextMarginBottom;
    }

    if (actionButtonsElement) {
      actionButtonsElement.style.marginTop = layoutConfig.buttonMarginTop;
      actionButtonsElement.style.justifyContent = this.getAlignmentValue(layoutConfig.buttonAlign);
      actionButtonsElement.style.gap = layoutConfig.buttonGap;
      actionButtonsElement.style.flexWrap = layoutConfig.buttonWrap;

      // 确保按钮使用Tailwind类
      const startBtn = document.getElementById('start-btn');
      if (startBtn && !startBtn.classList.contains('button-glass')) {
        startBtn.className = 'button-glass';
      }
    }

    console.log('Layout settings applied:', layoutConfig);
  }

  /**
   * 设置毛玻璃面板位置
   */
  private setGlassPanelPosition(glassPanel: HTMLElement, layoutConfig: any): void {
    const position = layoutConfig.glassPanelPosition;

    // 首先重置所有位置属性
    glassPanel.style.position = 'absolute';
    glassPanel.style.top = 'auto';
    glassPanel.style.left = 'auto';
    glassPanel.style.right = 'auto';
    glassPanel.style.bottom = 'auto';
    glassPanel.style.transform = 'translate(-50%, -50%)';

    switch (position) {
      case 'center':
        glassPanel.style.top = '50%';
        glassPanel.style.left = '50%';
        break;

      case 'top':
        glassPanel.style.top = '10%';
        glassPanel.style.left = '50%';
        glassPanel.style.transform = 'translateX(-50%)';
        break;

      case 'bottom':
        glassPanel.style.bottom = '10%';
        glassPanel.style.left = '50%';
        glassPanel.style.transform = 'translateX(-50%)';
        break;

      case 'left':
        glassPanel.style.top = '50%';
        glassPanel.style.left = '10%';
        glassPanel.style.transform = 'translateY(-50%)';
        break;

      case 'right':
        glassPanel.style.top = '50%';
        glassPanel.style.right = '10%';
        glassPanel.style.transform = 'translateY(-50%)';
        break;

      case 'top-left':
        glassPanel.style.top = '10%';
        glassPanel.style.left = '10%';
        glassPanel.style.transform = 'none';
        break;

      case 'top-right':
        glassPanel.style.top = '10%';
        glassPanel.style.right = '10%';
        glassPanel.style.transform = 'none';
        break;

      case 'bottom-left':
        glassPanel.style.bottom = '10%';
        glassPanel.style.left = '10%';
        glassPanel.style.transform = 'none';
        break;

      case 'bottom-right':
        glassPanel.style.bottom = '10%';
        glassPanel.style.right = '10%';
        glassPanel.style.transform = 'none';
        break;

      default:
        // 自定义位置
        glassPanel.style.top = layoutConfig.glassTop;
        glassPanel.style.left = layoutConfig.glassLeft;
        break;
    }
  }

  /**
   * 获取对齐值
   */
  private getAlignmentValue(align: string): string {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      case 'center':
      default:
        return 'center';
    }
  }

  /**
   * 生成脉冲动画CSS
   */
  private generatePulseAnimation(speed: number, intensity: number): string {
    return `
      @keyframes glassPulse {
        0%, 100% {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1);
        }
        50% {
          background: rgba(255, 255, 255, ${0.1 + intensity});
          transform: scale(${1 + intensity * 0.05});
        }
      }

      #glass-panel {
        animation: glassPulse ${speed}s ease-in-out infinite;
      }
    `;
  }

  /**
   * 生成微光动画CSS
   */
  private generateShimmerAnimation(speed: number): string {
    return `
      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      #glass-panel::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          105deg,
          transparent 40%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 60%
        );
        background-size: 200% 100%;
        animation: shimmer ${speed}s linear infinite;
        pointer-events: none;
      }
    `;
  }
}

// 初始化landing page - 确保在DOM完全加载后执行
function initializeLandingPage() {
  const shouldShowLanding = !localStorage.getItem('skipLandingPage');

  if (shouldShowLanding) {
    try {
      // 确保DOM元素存在
      const overlay = document.getElementById('landing-overlay');
      const startBtn = document.getElementById('start-btn');

      if (overlay && startBtn) {
        const landingPage = new LandingPage();
        console.log('Landing page loaded successfully');

        // 将landingPage实例和config绑定到window，便于调试
        (window as any).landingPage = landingPage;
        (window as any).config = config;
      } else {
        console.warn('Required DOM elements not found, initializing 3D app directly');
        import('./main.ts').then(({ default: app }) => {
          app.init().catch((err: any) => {
            console.error('3D application init failed:', err);
          });
        });
      }
    } catch (error) {
      console.error('Landing page initialization failed:', error);
      // 出错时直接启动3D应用
      import('./main.ts').then(({ default: app }) => {
        app.init().catch((err: any) => {
          console.error('3D application init failed:', err);
        });
      });
    }
  } else {
    // 直接启动3D应用
    import('./main.ts').then(({ default: app }) => {
      app.init().catch((err: any) => {
        console.error('3D application init failed:', err);
      });
    });
  }
}

// 多种方式确保初始化执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLandingPage);
} else {
  // DOM已经加载完成
  initializeLandingPage();
}

export default LandingPage;
