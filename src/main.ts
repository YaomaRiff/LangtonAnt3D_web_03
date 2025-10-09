/**
 * @file main.js
 * @description 应用主入口 - 系统协调与生命周期管理
 * ✨ 重构: 彻底移除了旧的 ui-material 系统。
 */
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

// 实体
import pathSys from './systems/path-sys';
import mathLightSys from './systems/math-light-sys';

class Application {
  private scene: THREE.Scene | null;
  private renderer: THREE.WebGLRenderer | null;
  private clock: THREE.Clock;
  private initialized: boolean;
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

      // 1. 初始化配置
      initConfig();

      // 2. 创建场景和渲染器
      this._createScene();
      this._createRenderer();

      // 3. 初始化坐标系统（必须在相机之前）
      coordinateSystem.init({
        eventBus,
        scene: this.scene
      });

      if (this.scene) {
        this.scene.userData.coordinateSystem = coordinateSystem;
      }

      // 4. 初始化相机系统
      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer
      });

      lightingSys.init({ scene: this.scene });
      environmentSys.init({ scene: this.scene });

      const mainCamera = cameraSys.getActiveCamera();

      postprocessSys.init({
        scene: this.scene as THREE.Scene,
        camera: mainCamera as THREE.Camera,
        renderer: this.renderer as THREE.WebGLRenderer
      });

      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera()
      });

      uiContainer.init();

      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls()
      });

      // 7. 初始化基础 UI
      await uiBasic.init();
      // 8. 初始化后处理 UI
      await uiPost.init();

      await presetManager.init();

      // 9. 初始化预设系统
      await uiPresets.init();
      // 10. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });

      // 11. 初始化核心服务系统
      materialSys.init();
      modelSys.init();

      pathSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });
      
      mathLightSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });

      particlesSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });

      animationSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        renderer: this.renderer as THREE.WebGLRenderer,
        controls: cameraSys.getControls(),
        particlesSys
      });

      sceneDirector.init({ eventBus });

      this._bindEvents();
      this._handleResize();
      this._startRenderLoop();

      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;
      logger.info('App', '✅ 应用初始化完成');

    } catch (err) {
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
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.display = 'block';
    
    document.body.appendChild(canvas);
    
    logger.info('App', `✅ Canvas已添加 | 尺寸: ${canvas.width}x${canvas.height}`);
    logger.debug('App', '渲染器已创建');
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._handleResize();
    });

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = (coordinateSystem as any).debugInfo?.() || 'N/A';
      console.log('📊 坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    postprocessSys.handleResize();
    logger.debugThrottled(
      'App',
      'window-resize',
      '窗口大小已调整',
      1000
    );
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

    sceneDirector.dispose();
    coordinateSystem.dispose();
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
    mathLightSys.dispose();
    uiBasic.dispose();
    uiPost.dispose();
    uiPresets.dispose();
    uiCoordinates.dispose();
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
app.init().catch(err => {
  logger.error('App', `启动失败: ${err.message}`);
  console.error(err);
});

export default app;
