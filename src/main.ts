/**
 * @file main.ts
 * @description 应用主入口 - 系统协调与生命周期管理
 * @✨ 重构: 彻底移除了旧的 ui-material 系统。
 * @✨ 重构: 适配了新的监视器布局，修改了渲染器挂载和尺寸调整逻辑。
 */

import './style.css';

import * as THREE from 'three';
import logger from './utils/logger';
import config, { initConfig } from './config';
import eventBus from './event-bus';
import presetManager from './preset-manager';

// UI 系统
import uiContainer from './ui/ui-container';
import uiBasic from './ui/ui-basic';
import uiPost from './ui/ui-post';
import uiPresets from './ui/ui-presets';
import uiCoordinates from './ui/ui-coordinates';
import uiMonitor from './ui/ui-monitor';
import uiScene from './ui/ui-scene';

// 核心系统
import coordinateSystem from './systems/coordinates-sys';
import cameraSys from './systems/camera-sys';
import dataSys from './systems/data-sys';
import animationSys from './systems/animation-sys';
import particlesSys from './systems/particles-sys';
import postprocessSys from './systems/postprocess-sys';
import audioSys from './systems/audio-sys';
import lightingSys from './systems/lighting-sys';
import environmentSys from './systems/environment-sys';
import materialSys from './systems/material-sys';
import modelSys from './systems/model-sys';
import sceneDirector from './systems/scene-director-sys';
import visualEffectsSys from './systems/visual-effects-sys';

// 实体
import pathSys from './systems/path-sys';
import lightSys from './systems/light-sys';

class Application {
  private scene: THREE.Scene | null;
  private renderer: THREE.WebGLRenderer | null;
  private clock: THREE.Clock;
  private initialized: boolean;
  private monitorContainer: HTMLElement | null = null; // 新增：监视器容器引用

  constructor() {
    this.scene = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      logger.warn('App', '应用已经初始化过了');
      return;
    }

    try {
      logger.info('App', '🚀 应用启动中...');

      this.monitorContainer = document.getElementById('monitor-container');
      if (!this.monitorContainer) {
        throw new Error('启动失败: 未在DOM中找到 #monitor-container。');
      }

      // 1. 初始化配置
      initConfig();

      // 2. 创建场景和渲染器 (现在在新的容器中)
      this._createScene();
      this._createRenderer();

      // 3. 初始化坐标系统（必须在相机之前）
      coordinateSystem.init({
        eventBus,
        scene: this.scene,
      });

      if (this.scene) {
        this.scene.userData.coordinateSystem = coordinateSystem;
      }

      // 4. 初始化UI容器 (现在它会找到自己的位置)
      uiContainer.init();

      // 5. 初始化相机系统
      if (!this.scene || !this.renderer) {
        throw new Error('场景或渲染器未初始化');
      }

      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer!,
      });

      lightingSys.init({ scene: this.scene });
      environmentSys.init({ scene: this.scene });

      const mainCamera = cameraSys.getActiveCamera();

      this._handleResize();

      postprocessSys.init({
        scene: this.scene as THREE.Scene,
        camera: mainCamera as THREE.Camera,
        renderer: this.renderer as THREE.WebGLRenderer,
      });

      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera(),
      });

      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls(),
      });

      // 7. 初始化基础 UI
      await uiBasic.init();
      await uiScene.init();
      // 8. 初始化后处理 UI
      await uiPost.init();
      await presetManager.init();
      // 9. 初始化预设系统
      await uiPresets.init();
      // 10. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });
      //10.5. 初始化监视器UI
      uiMonitor.init();

      // 11. 初始化核心服务系统
      materialSys.init();
      modelSys.init();

      pathSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        coordinateSystem,
      });

      await lightSys.init({
        eventBus,
        coordinateSystem,
      });

      particlesSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        coordinateSystem,
      });

      animationSys.init({
        eventBus,
      });

      sceneDirector.init({ eventBus });

      visualEffectsSys.init();

      this._bindEvents();
      this._handleResize(); // 第一次手动调用以设置正确尺寸
      this._startRenderLoop();

      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;

      // ✅ 新增：触发场景准备完成事件
      setTimeout(() => {
        eventBus.emit('scene-ready');
        logger.info('App', '🎬 场景准备完成，视觉效果已激活');
      }, 500); // 延迟500ms确保所有系统就绪

      logger.info('App', '✅ 应用初始化完成');
    } catch (err: unknown) {
      logger.error('App', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createScene() {
    this.scene = new THREE.Scene();
    logger.debug('App', '场景已创建');
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    // 尺寸将在 _handleResize 中设置
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const canvas = this.renderer.domElement;
    // 移除所有内联定位样式，交给 CSS 处理
    canvas.style.display = 'block';

    //将 Canvas 添加到右侧监视器容器
    this.monitorContainer!.appendChild(canvas);

    // 立即设置初始尺寸，防止 Framebuffer 错误
    const initialWidth = this.monitorContainer!.clientWidth || window.innerWidth;
    const initialHeight = this.monitorContainer!.clientHeight || window.innerHeight;
    this.renderer.setSize(initialWidth, initialHeight);

    logger.info('App', `Canvas 已添加到 #monitor-container`);
    logger.debug('App', '渲染器已创建');
  }

  _bindEvents() {
    // 监听全局窗口大小变化事件，以便调整渲染器和相机
    window.addEventListener('resize', this._handleResize.bind(this));

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = (coordinateSystem as any).debugInfo?.() || 'N/A';
      console.log('坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    if (!this.renderer || !this.monitorContainer) return;

    //监视器容器获取尺寸
    const width = this.monitorContainer.clientWidth;
    const height = this.monitorContainer.clientHeight;

    // 更新渲染器
    this.renderer.setSize(width, height);

    //将新尺寸传递给下游系统
    cameraSys.handleResize(width, height);
    postprocessSys.handleResize(width, height);

    logger.debugThrottled('App', 'window-resize', `窗口大小已调整: ${width}x${height}`, 1000);
  }

  _startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      cameraSys.update(delta);
      pathSys.updateCameraPosition(cameraSys.getActiveCamera());
      pathSys.update(delta);
      animationSys.update(delta, elapsed);
      particlesSys.update(elapsed);

      if (config.get('postprocess.enabled')) {
        postprocessSys.render(delta);
      } else if (this.renderer && this.scene) {
        this.renderer.render(this.scene, cameraSys.getActiveCamera());
      }
    };

    animate();
    logger.info('App', '渲染循环已启动');
  }

  dispose() {
    logger.info('App', '应用正在销毁...');

    window.removeEventListener('resize', this._handleResize.bind(this));

    sceneDirector.dispose();
    coordinateSystem.dispose();
    visualEffectsSys.dispose();
    cameraSys.dispose();
    dataSys.dispose();
    animationSys.dispose();
    particlesSys.dispose();
    materialSys.dispose();
    postprocessSys.dispose();
    audioSys.dispose();
    lightingSys.dispose();
    environmentSys.dispose();
    pathSys.dispose();
    lightSys.dispose();
    uiBasic.dispose();
    uiScene.dispose();
    uiPost.dispose();
    uiPresets.dispose();
    uiCoordinates.dispose();
    uiMonitor.dispose();
    uiContainer.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    this.initialized = false;
    logger.info('App', '应用已销毁');
  }
}

const app = new Application();

export default app;
