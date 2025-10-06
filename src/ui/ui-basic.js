/**
 * @file ui-basic.js
 * @description 基础 UI 控制面板 - 直接绑定到 config._config + 手动更新临时对象
 * ✅ 修复：添加 updateBindings() 方法，在预设加载后手动更新颜色等临时对象
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIBasic {
  constructor() {
    this.controls = new Map();
    this.folders = new Map();
    this._pane = null;
    this._isInitialized = false;
    
    // ✅ 在 constructor 中获取配置引用
    this.configData = config.getRaw();
    
    // ✅ 记录所有需要手动更新的临时对象
    this.tempObjects = {
      dustColor: { dustColor: this.configData.particles.dustColor },
      pathColor: { pathColor: this.configData.environment.pathColor },
      bgColor: { bgColor: this.configData.environment.bgColor },
      pathPointColor: { pathPointColor: this.configData.particles.pathPointColor },
      rotationSpeed: { rotationSpeed: this.configData.particles.rotationSpeed },
      rotationTiltXZ: { rotationTiltXZ: this.configData.particles.rotationTiltXZ },
      rotationTiltXY: { rotationTiltXY: this.configData.particles.rotationTiltXY },
      pathPointSize: { pathPointSize: this.configData.particles.pathPointSize },
      depthIntensity: { depthIntensity: this.configData.path.depthIntensity }
    };
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIBasic', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    this._pane = new Pane({
      title: '基础控制',
      expanded: true,
      container: uiContainer.getScrollContent()
    });

    this._createDataControls();
    this._createAnimationControls();
    this._createCameraControls();
    this._createParticleControls();
    this._createPathControls();
    this._createAudioControls();
    this._bindEvents();
    
    this._isInitialized = true;

    // ✅ 注册到UIRegistry
    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-basic', this);

    logger.info('UIBasic', `基础 UI 已初始化 | 控件数量: ${this.controls.size}`);
  }

  _createDataControls() {
    const folder = this._pane.addFolder({ title: '数据源', expanded: true });
    
    const datasets = config.get('data.availableDatasets') || [];
    
    if (!datasets || datasets.length === 0) {
      folder.addBlade({
        view: 'text',
        label: '错误',
        parse: (v) => String(v),
        value: '未配置 availableDatasets'
      });
      
      logger.warn('UIBasic', '数据源未配置: availableDatasets 为空');
      this.folders.set('data', folder);
      return;
    }
    
    const datasetOptions = datasets.reduce((acc, ds) => {
      acc[ds.name] = ds.path;
      return acc;
    }, {});
    
    const csvSelect = folder.addBinding(
      this.configData.data,
      'csvUrl',
      {
        label: 'CSV文件',
        options: datasetOptions
      }
    );
    
    csvSelect.on('change', (ev) => {
      eventBus.emit('data-load-requested', ev.value);
      logger.info('UIBasic', `切换CSV: ${ev.value}`);
    });
    
    this.controls.set('data.csvUrl', csvSelect);
    
    const currentDataset = datasets.find(ds => ds.path === config.get('data.csvUrl'));
    if (currentDataset?.description) {
      folder.addBlade({
        view: 'text',
        label: '描述',
        parse: (v) => String(v),
        value: currentDataset.description
      });
    }
    
    const loadBtn = folder.addButton({ title: '🔄 重新加载' });
    loadBtn.on('click', () => {
      const currentPath = config.get('data.csvUrl');
      eventBus.emit('data-load-requested', currentPath);
      logger.info('UIBasic', `重新加载数据: ${currentPath}`);
    });
    
    this.folders.set('data', folder);
    logger.debug('UIBasic', '数据源控件已创建');
  }

  _createAnimationControls() {
    const folder = this._pane.addFolder({ title: '动画控制', expanded: true });
    
    const playButton = folder.addButton({ title: '▶️ 播放' });
    playButton.on('click', () => {
      const isPlaying = this.configData.animation.animating;
      this.configData.animation.animating = !isPlaying;
      eventBus.emit('animation-toggled', !isPlaying);
      playButton.title = !isPlaying ? '⏸️ 暂停' : '▶️ 播放';
      logger.info('UIBasic', `动画: ${!isPlaying ? '播放' : '暂停'}`);
    });
    
    const stepSlider = folder.addBinding(
      this.configData.animation,
      'currentStep',
      {
        label: '当前步数',
        min: 0,
        max: 100,
        step: 1
      }
    );
    
    stepSlider.on('change', (ev) => {
      eventBus.emit('step-to', ev.value);
    });
    
    this.controls.set('animation.currentStep', stepSlider);
    
    eventBus.on('data-loaded', (data) => {
      stepSlider.max = data.points.length - 1;
      stepSlider.refresh();
    });
    
    const speed = folder.addBinding(
      this.configData.animation,
      'speedFactor',
      { label: '速度', min: 0.05, max: 2, step: 0.05 }
    );
    
    speed.on('change', (ev) => {
      eventBus.emit('animation-speed-changed', ev.value);
    });
    
    this.controls.set('animation.speed', speed);
    
    const loop = folder.addBinding(
      this.configData.animation,
      'loop',
      { label: '循环播放' }
    );
    
    loop.on('change', (ev) => {
      eventBus.emit('animation-loop-changed', ev.value);
    });
    
    this.controls.set('animation.loop', loop);
    
    this.folders.set('animation', folder);
  }

  _createCameraControls() {
    const folder = this._pane.addFolder({ title: '相机设置', expanded: false });
    
    const mode = folder.addBinding(
      this.configData.camera,
      'mode',
      {
        label: '相机模式',
        options: {
          '透视相机': 'perspective',
          '正交相机': 'orthographic'
        }
      }
    );
    
    mode.on('change', (ev) => {
      eventBus.emit('camera-mode-changed', ev.value);
    });
    
    this.controls.set('camera.mode', mode);
    
    const viewContainer = folder.addFolder({ title: '视图预设', expanded: false });
    
    const viewButtons = [];
    
    const views = [
      { name: '俯视图', key: 'top' },
      { name: '正视图', key: 'front' },
      { name: '侧视图', key: 'side' }
    ];
    
    views.forEach(view => {
      const btn = viewContainer.addButton({ title: view.name });
      btn.on('click', () => {
        eventBus.emit('view-changed', view.key);
        logger.info('UIBasic', `切换视图: ${view.name}`);
      });
      viewButtons.push(btn);
    });
    
    const flipBtn = viewContainer.addButton({ title: '🔄 翻转180°' });
    flipBtn.on('click', () => {
      eventBus.emit('flip-view');
      logger.info('UIBasic', '翻转视图');
    });
    viewButtons.push(flipBtn);
    
    eventBus.on('camera-mode-switched', (cameraMode) => {
      const disabled = cameraMode === 'perspective';
      viewButtons.forEach(btn => {
        btn.disabled = disabled;
      });
      
      viewContainer.title = disabled 
        ? '视图预设 (仅正交模式)'
        : '视图预设';
    });
    
    const fovBinding = folder.addBinding(
      this.configData.camera,
      'fov',
      { label: '视野角度 (透视)', min: 20, max: 120, step: 1 }
    );
    
    fovBinding.on('change', (ev) => {
      eventBus.emit('camera-fov-changed', ev.value);
    });
    
    this.controls.set('camera.fov', fovBinding);
    
    eventBus.on('camera-mode-switched', (cameraMode) => {
      fovBinding.disabled = cameraMode !== 'perspective';
    });
    
    const initialMode = config.get('camera.mode') || 'perspective';
    viewButtons.forEach(btn => {
      btn.disabled = initialMode === 'perspective';
    });
    fovBinding.disabled = initialMode !== 'perspective';
    
    this.folders.set('camera', folder);
  }

  _createParticleControls() {
    const folder = this._pane.addFolder({ title: '粒子系统', expanded: false });
    
    // 粒子颜色（使用临时对象）
    const dustColor = folder.addBinding(
      this.tempObjects.dustColor,
      'dustColor',
      { label: '粒子颜色' }
    );
    
    dustColor.on('change', (ev) => {
      this.configData.particles.dustColor = ev.value;
      eventBus.emit('dust-color-changed', ev.value);
    });
    
    this.controls.set('particles.dustColor', dustColor);
    
    const dustSize = folder.addBinding(
      this.configData.particles,
      'dustSize',
      { label: '粒子大小', min: 0.05, max: 1.0, step: 0.01 }
    );
    
    dustSize.on('change', (ev) => {
      eventBus.emit('dust-size-changed', ev.value);
    });
    
    this.controls.set('particles.dustSize', dustSize);
    
    const dustCount = folder.addBinding(
      this.configData.particles,
      'dustCount',
      { label: '粒子数量', min: 500, max: 10000, step: 100 }
    );
    
    dustCount.on('change', (ev) => {
      eventBus.emit('dust-count-changed', ev.value);
    });
    
    this.controls.set('particles.dustCount', dustCount);

    const breathIntensity = folder.addBinding(
      this.configData.particles,
      'breathIntensity',
      { label: '呼吸强度', min: 0, max: 0.5, step: 0.01 }
    );
    
    breathIntensity.on('change', (ev) => {
      eventBus.emit('particle-breath-intensity-changed', ev.value);
    });
    
    this.controls.set('particles.breathIntensity', breathIntensity);

    const floatIntensity = folder.addBinding(
      this.configData.particles,
      'floatIntensity',
      { label: '浮动强度', min: 0, max: 1.0, step: 0.01 }
    );
    
    floatIntensity.on('change', (ev) => {
      eventBus.emit('particle-float-intensity-changed', ev.value);
    });
    
    this.controls.set('particles.floatIntensity', floatIntensity);

    // 自转速度（使用临时对象）
    const rotationSpeed = folder.addBinding(
      this.tempObjects.rotationSpeed,
      'rotationSpeed',
      { label: '自转速度', min: -5, max: 5, step: 0.1 }
    );
    
    rotationSpeed.on('change', (ev) => {
      this.configData.particles.rotationSpeed = ev.value;
      eventBus.emit('rotation-speed-changed', ev.value);
    });
    
    this.controls.set('particles.rotationSpeed', rotationSpeed);
    
    // 自转倾斜XZ（使用临时对象）
    const rotationTiltXZ = folder.addBinding(
      this.tempObjects.rotationTiltXZ,
      'rotationTiltXZ',
      { label: '自转倾斜(XZ)', min: -90, max: 90, step: 1 }
    );
    
    rotationTiltXZ.on('change', (ev) => {
      this.configData.particles.rotationTiltXZ = ev.value;
      eventBus.emit('rotation-tilt-xz-changed', ev.value);
    });
    
    this.controls.set('particles.rotationTiltXZ', rotationTiltXZ);
    
    // 自转俯仰XY（使用临时对象）
    const rotationTiltXY = folder.addBinding(
      this.tempObjects.rotationTiltXY,
      'rotationTiltXY',
      { label: '自转俯仰(XY)', min: -90, max: 90, step: 1 }
    );
    
    rotationTiltXY.on('change', (ev) => {
      this.configData.particles.rotationTiltXY = ev.value;
      eventBus.emit('rotation-tilt-xy-changed', ev.value);
    });
    
    this.controls.set('particles.rotationTiltXY', rotationTiltXY);
    
    const dustOpacity = folder.addBinding(
      this.configData.particles,
      'dustOpacity',
      { label: '透明度', min: 0, max: 1, step: 0.01 }
    );
    
    dustOpacity.on('change', (ev) => {
      eventBus.emit('dust-opacity-changed', ev.value);
    });
    
    this.controls.set('particles.dustOpacity', dustOpacity);
    
    this.folders.set('particles', folder);
    logger.debug('UIBasic', '✅ 粒子控件已创建(直接绑定)');
  }

  _createPathControls() {
    const folder = this._pane.addFolder({ title: '路径设置', expanded: false });

    // 背景颜色（使用临时对象）
    const bgColor = folder.addBinding(
      this.tempObjects.bgColor,
      'bgColor',
      { label: '背景颜色' }
    );
    
    bgColor.on('change', (ev) => {
      this.configData.environment.bgColor = ev.value;
      eventBus.emit('bg-color-changed', ev.value);
    });
    
    this.controls.set('environment.bgColor', bgColor);
    
    // 路径颜色（使用临时对象）
    const pathColor = folder.addBinding(
      this.tempObjects.pathColor,
      'pathColor',
      { label: '路径颜色' }
    );
    
    pathColor.on('change', (ev) => {
      this.configData.environment.pathColor = ev.value;
      eventBus.emit('path-color-changed', ev.value);
    });
    
    this.controls.set('environment.pathColor', pathColor);

    // 光点颜色（使用临时对象）
    const pathPointColor = folder.addBinding(
      this.tempObjects.pathPointColor,
      'pathPointColor',
      { label: '光点颜色' }
    );
    
    pathPointColor.on('change', (ev) => {
      this.configData.particles.pathPointColor = ev.value;
      eventBus.emit('path-point-color-changed', ev.value);
    });
    
    this.controls.set('particles.pathPointColor', pathPointColor);
    
    // 光点大小（使用临时对象）
    const pathPointSize = folder.addBinding(
      this.tempObjects.pathPointSize,
      'pathPointSize',
      { label: '光点大小', min: 0.1, max: 2.0, step: 0.05 }
    );
    
    pathPointSize.on('change', (ev) => {
      this.configData.particles.pathPointSize = ev.value;
      eventBus.emit('path-point-size-changed', ev.value);
    });
    
    this.controls.set('particles.pathPointSize', pathPointSize);
    
    // 景深强度（使用临时对象）
    const depthIntensity = folder.addBinding(
      this.tempObjects.depthIntensity,
      'depthIntensity',
      { label: '景深强度', min: 0, max: 1, step: 0.01 }
    );
    
    depthIntensity.on('change', (ev) => {
      this.configData.path.depthIntensity = ev.value;
      eventBus.emit('path-depth-intensity-changed', ev.value);
    });
    
    this.controls.set('path.depthIntensity', depthIntensity);
    
    this.folders.set('path', folder);
  }

  _createAudioControls() {
    const folder = this._pane.addFolder({ title: '背景音乐', expanded: false });
    
    let audioLoaded = false;

    const playButton = folder.addButton({ title: '▶️ 播放音乐' });
    playButton.on('click', () => {
      if (!audioLoaded) {
        eventBus.emit('audio-load', '/background-music.mp3');
        audioLoaded = true;
        
        eventBus.once('audio-loaded', () => {
          eventBus.emit('audio-toggle');
        });
      } else {
        eventBus.emit('audio-toggle');
      }
    });
    
    eventBus.on('audio-playing', (isPlaying) => {
      playButton.title = isPlaying ? '⏸️ 暂停音乐' : '▶️ 播放音乐';
    });

    const stopButton = folder.addButton({ title: '⏹️ 停止' });
    stopButton.on('click', () => {
      eventBus.emit('audio-stop');
    });

    const volumeObj = { volume: 0.5 };
    const volumeBinding = folder.addBinding(
      volumeObj,
      'volume',
      { label: '音量', min: 0, max: 1, step: 0.01 }
    );
    
    volumeBinding.on('change', (ev) => {
      eventBus.emit('audio-volume-changed', ev.value);
    });
    
    this.folders.set('audio', folder);
    logger.debug('UIBasic', '音频控件已创建');
  }

  _bindEvents() {
    eventBus.on('step-changed', (step) => {
      const stepControl = this.controls.get('animation.currentStep');
      if (stepControl && this.configData.animation.currentStep !== step) {
        this.configData.animation.currentStep = step;
        stepControl.refresh();
      }
    });

    eventBus.on('animation-state-changed', (animating) => {
      if (this.configData.animation.animating !== animating) {
        this.configData.animation.animating = animating;
      }
    });

    eventBus.on('camera-mode-switched', (mode) => {
      if (this.configData.camera.mode !== mode) {
        this.configData.camera.mode = mode;
        const modeControl = this.controls.get('camera.mode');
        if (modeControl) {
          modeControl.refresh();
        }
      }
    });

    logger.debug('UIBasic', '事件监听已绑定');
  }

  // ✅ 新增：手动更新所有临时对象
  updateBindings() {
  // 1. 更新临时对象的值
  this.tempObjects.dustColor.dustColor = this.configData.particles.dustColor;
  this.tempObjects.pathColor.pathColor = this.configData.environment.pathColor;
  this.tempObjects.bgColor.bgColor = this.configData.environment.bgColor;
  this.tempObjects.pathPointColor.pathPointColor = this.configData.particles.pathPointColor;
  this.tempObjects.rotationSpeed.rotationSpeed = this.configData.particles.rotationSpeed;
  this.tempObjects.rotationTiltXZ.rotationTiltXZ = this.configData.particles.rotationTiltXZ;
  this.tempObjects.rotationTiltXY.rotationTiltXY = this.configData.particles.rotationTiltXY;
  this.tempObjects.pathPointSize.pathPointSize = this.configData.particles.pathPointSize;
  this.tempObjects.depthIntensity.depthIntensity = this.configData.path.depthIntensity;
  
  // 2. ✅ 必须刷新对应的控件
  const controlsToRefresh = [
    'particles.dustColor',
    'environment.pathColor',
    'environment.bgColor',
    'particles.pathPointColor',
    'particles.rotationSpeed',
    'particles.rotationTiltXZ',
    'particles.rotationTiltXY',
    'particles.pathPointSize',
    'path.depthIntensity'
  ];
  
  controlsToRefresh.forEach(key => {
    const control = this.controls.get(key);
    if (control && typeof control.refresh === 'function') {
      control.refresh();
    }
  });
  
  logger.debug('UIBasic', '✅ 临时对象已更新并刷新');
}

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIBasic', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    
    this.controls.clear();
    this.folders.clear();
    this._isInitialized = false;
    
    logger.info('UIBasic', 'UI 已销毁');
  }

  getPane() {
    return this._pane;
  }

  isInitialized() {
    return this._isInitialized;
  }
}

const uiBasic = new UIBasic();
export default uiBasic;
