/**
 * @file main.js
 * @description 应用主入口 - 系统协调与生命周期管理
 * ✅ 已集成坐标系统和音频系统
 */
import * as THREE from 'three';
import logger from './utils/logger.js';
import config, { initConfig } from './config.js';
import eventBus from './event-bus.js';
import presetManager from './preset-manager.js';

// UI 系统
import uiContainer from './ui/ui-container.js';
import uiBasic from './ui/ui-basic.js';
import uiMaterial from './ui/ui-material.js';
import uiPost from './ui/ui-post.js';
import uiPresets from './ui/ui-presets.js';
import uiCoordinates from './ui/ui-coordinates.js';

// 核心系统
import coordinateSystem from './systems/coordinates-sys.js';
import cameraSys from './systems/camera-sys.js';
import dataSys from './systems/data-sys.js';
import animationSys from './systems/animation-sys.js';
import particlesSys from './systems/particles-sys.js';
import postprocessSys from './systems/postprocess-sys.js';
import audioSys from './systems/audio-sys.js';
import lightingSys from './systems/lighting-sys.js';
import environmentSys from './systems/environment-sys.js';
import materialSys from './systems/material-sys.js';
import modelSys from './systems/model-sys.js';
import sceneDirector from './systems/scene-director-sys.js';

// 实体
import pathSys from './systems/path-sys.js';
import mathLightSys from './systems/math-light-sys.js';

class Application {
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

      // 将坐标系统存入scene.userData供camera-sys访问
      this.scene.userData.coordinateSystem = coordinateSystem;

      // 4. 初始化相机系统
      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer
      });

      // 4.5 初始化光照系统 (新)
      lightingSys.init({ scene: this.scene });

       // 4.6 初始化环境系统 (天空盒)
      environmentSys.init({ scene: this.scene });

      const mainCamera = cameraSys.getActiveCamera();

      // 4.7. 初始化后处理系统
      postprocessSys.init({
        eventBus,
        scene: this.scene,
        camera: mainCamera,
        renderer: this.renderer
      });

      // 5. 初始化音频系统（在相机之后）
      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera()
      });

      // 6. 初始化 UI 容器
      uiContainer.init();

      // 核心修复：优先初始化数据系统
      // 这样后续的UI系统就能在第一时间拿到数据
      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls()
      });

      // 7. 初始化基础 UI
      await uiBasic.init();

      // 8. 初始化材质 UI
      await uiMaterial.init();

      // 9. 初始化后处理 UI
      await uiPost.init();

      await presetManager.init();

      // 10. 初始化预设系统
      await uiPresets.init();

      // 11. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });

      // 12. ✅ 初始化核心服务系统 (必须在实体和视觉系统之前)
      materialSys.init();
      modelSys.init();

      // 14. 修改: 初始化新的系统（传入coordinateSystem）
      pathSys.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });
      
      mathLightSys.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });

      // 15. 初始化粒子系统（传入coordinateSystem）
      particlesSys.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });

      // 16. 初始化动画系统
      animationSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer,
        controls: cameraSys.getControls(),
        particlesSys
      });

      //17.5. 初始化场景导演系统 (在所有视觉系统之后)
      sceneDirector.init({ eventBus });

      // 18. 绑定事件
      this._bindEvents();

      // 19. 启动渲染循环
      this._startRenderLoop();

      // 20. 加载默认数据
      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;
      logger.info('App', '✅ 应用初始化完成');

    } catch (err) {
      logger.error('App', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createScene() {
    this.scene = new THREE.Scene();
    // 背景色现在由 environment-sys 管理
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

    // eventBus.on('bg-color-changed', (color) => {
    //   this.scene.background = new THREE.Color(color);
    // });

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = coordinateSystem.debugInfo();
      console.log('📊 坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    postprocessSys.handleResize();
    logger.debug('App', '窗口大小已调整');
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
      } else {
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
    uiMaterial.dispose();
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
