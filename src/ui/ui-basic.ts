/**
 * @file ui-basic.js
 * @description 基础 UI 控制面板
 * ✅ 核心改造: 所有控件的 'change' 事件现在直接调用 config.set()，
 *    不再发出独立的 eventBus 事件。
 */
import eventBus from '../event-bus';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';
import dataSys from '../systems/data-sys';
import state from '../systems/state';

class UIBasic {
  private controls: Map<string, any>;
  private folders: Map<string, any>;
  private _pane: any;
  private _isInitialized: boolean;
  private configData: any;
  private stateData: any;
  private tempObjects: any;
  private dataControls: any[];
  private descriptionBlade: any;

  constructor() {
    this.controls = new Map();
    this.folders = new Map();
    this._pane = null;
    this._isInitialized = false;
    
    this.configData = config.getRaw();
    this.stateData = state.getRaw();
    
    // 临时对象用于Tweakpane的颜色选择器等特殊控件
    this.tempObjects = {
      dustColor: { dustColor: this.configData.particles.dustColor },
      pathColor: { pathColor: this.configData.environment.pathColor },
      pathPointColor: { pathPointColor: this.configData.particles.pathPointColor }
    };

    this.dataControls = []; 
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

    const dataFolder = this._pane.addFolder({ title: '数据源', expanded: true });
    this.folders.set('data', dataFolder);

    this._rebuildDataControls();
    this._createAnimationControls();
    this._createCameraControls();
    this._createParticleControls();
    this._createPathControls();
    this._createAudioControls();
    this._bindEvents();
    
    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-basic', this);

    logger.info('UIBasic', `基础 UI 已初始化 | 控件数量: ${this.controls.size}`);
  }
  
  _rebuildDataControls() {
    const folder = this.folders.get('data');
    if (!folder) return;
    
    this.dataControls.forEach(c => c.dispose());
    this.dataControls = [];
    this.controls.delete('data.csvUrl');

    const datasets = dataSys.getAvailableDatasets();
    
    if (datasets.length === 0) {
      const errorBlade = folder.addBlade({
        view: 'text', label: '错误', parse: (v) => String(v), value: '未找到数据源清单'
      });
      this.dataControls.push(errorBlade);
      return;
    }
    
    const datasetOptions = datasets.reduce((acc, ds) => {
      acc[ds.name] = ds.path; // ✅ 直接使用 manifest 中的路径
      return acc;
    }, {});

    const csvSelect = folder.addBinding(this.configData.data, 'csvUrl', {
      label: 'CSV文件', options: datasetOptions
    });
    
    csvSelect.on('change', (ev) => {
      // ✅ 状态变更 -> config.set
      // ✅ 命令 -> eventBus.emit
      config.set('data.csvUrl', ev.value);
      eventBus.emit('data-load-requested', ev.value);
      this._updateDatasetDescription();
    });
    
    this.controls.set('data.csvUrl', csvSelect);
    this.dataControls.push(csvSelect);
    
    const descriptionBlade = folder.addBlade({
      view: 'text', label: '描述', parse: (v) => String(v), value: ''
    });
    this.dataControls.push(descriptionBlade);
    this.descriptionBlade = descriptionBlade;
    
    this._updateDatasetDescription();

    const loadBtn = folder.addButton({ title: '🔄 重新加载' });
    loadBtn.on('click', () => {
      eventBus.emit('data-load-requested', config.get('data.csvUrl'));
    });
    this.dataControls.push(loadBtn);
  }

  _updateDatasetDescription() {
    if (!this.descriptionBlade) return;
    const currentPath = config.get('data.csvUrl');
    const datasets = dataSys.getAvailableDatasets();
    const currentDataset = datasets.find(ds => ds.path === currentPath);
    this.descriptionBlade.value = currentDataset ? currentDataset.description : '---';
  }

    _createAnimationControls() {
    const folder = this._pane.addFolder({ title: '动画控制', expanded: true });
    
    const playButton = folder.addButton({ title: state.get('animation.animating') ? '⏸️ 暂停' : '▶️ 播放' });
    playButton.on('click', () => {
      const isPlaying = !state.get('animation.animating');
      // ✅ 直接调用 state.set
      state.set('animation.animating', isPlaying);
    });

    // 监听状态变化来更新按钮标题
    eventBus.on('state-changed', ({ key, value }) => {
        if (key === 'animation.animating') {
            playButton.title = value ? '⏸️ 暂停' : '▶️ 播放';
        }
    });
    
    const stepSlider = folder.addBinding(this.stateData.animation, 'currentStep', { // ✅ 绑定到 stateData
      label: '当前步数', min: 0, max: 100, step: 1
    });
    stepSlider.on('change', (ev) => {
      eventBus.emit('step-to', ev.value);
    });
    this.controls.set('animation.currentStep', stepSlider); // ✅ key 保持不变
    
    eventBus.on('data-loaded', (data) => {
      stepSlider.max = data.points.length - 1;
      stepSlider.refresh();
    });
    
    // speed 和 loop 仍然是配置项，所以绑定到 configData
    const speed = folder.addBinding(this.configData.animation, 'speedFactor', { 
      label: '速度', min: 0.05, max: 5, step: 0.05 
    });
    speed.on('change', (ev) => config.set('animation.speedFactor', ev.value));
    this.controls.set('animation.speedFactor', speed);
    
    const loop = folder.addBinding(this.configData.animation, 'loop', { label: '循环播放' });
    loop.on('change', (ev) => config.set('animation.loop', ev.value));
    this.controls.set('animation.loop', loop);
    
    this.folders.set('animation', folder);
  }


  _createCameraControls() {
    const folder = this._pane.addFolder({ title: '相机设置', expanded: false });
    
    const mode = folder.addBinding(this.configData.camera, 'mode', {
      label: '相机模式', options: { '透视': 'perspective', '正交': 'orthographic' }
    });
    mode.on('change', (ev) => config.set('camera.mode', ev.value)); // ✅
    this.controls.set('camera.mode', mode);
    
    const viewContainer = folder.addFolder({ title: '视图预设', expanded: false });
    ['top', 'front', 'side'].forEach(key => {
      viewContainer.addButton({ title: `${key.charAt(0).toUpperCase() + key.slice(1)} View` })
        .on('click', () => eventBus.emit('view-changed', key)); // 命令，保留
    });
    viewContainer.addButton({ title: '🔄 翻转180°' }).on('click', () => eventBus.emit('flip-view')); // 命令，保留
    
    const fovBinding = folder.addBinding(this.configData.camera, 'fov', { 
      label: '视野角度', min: 20, max: 120, step: 1 
    });
    fovBinding.on('change', (ev) => config.set('camera.fov', ev.value)); // ✅
    this.controls.set('camera.fov', fovBinding);
    
    // 动态禁用/启用UI
    const setViewControlsState = (cameraMode) => {
      const disabled = cameraMode === 'perspective';
      viewContainer.children.forEach(c => c.disabled = disabled);
      fovBinding.disabled = !disabled;
    };
    eventBus.on('config-changed', ({ key, value }) => {
        if (key === 'camera.mode') setViewControlsState(value);
    });
    setViewControlsState(config.get('camera.mode'));

    this.folders.set('camera', folder);
  }

  _createParticleControls() {
    const folder = this._pane.addFolder({ title: '粒子系统', expanded: false });
    
    const dustColor = folder.addBinding(this.tempObjects.dustColor, 'dustColor', { label: '粒子颜色', view: 'color' });
    dustColor.on('change', (ev) => config.set('particles.dustColor', ev.value)); // ✅
    this.controls.set('particles.dustColor', dustColor);
    
    const dustSize = folder.addBinding(this.configData.particles, 'dustSize', { 
      label: '粒子大小', min: 0.05, max: 1.0, step: 0.01 
    });
    dustSize.on('change', (ev) => config.set('particles.dustSize', ev.value)); // ✅
    this.controls.set('particles.dustSize', dustSize);
    
    const dustCount = folder.addBinding(this.configData.particles, 'dustCount', { 
      label: '粒子数量', min: 500, max: 10000, step: 100 
    });
    dustCount.on('change', (ev) => config.set('particles.dustCount', ev.value)); // ✅
    this.controls.set('particles.dustCount', dustCount);

    const breath = folder.addBinding(this.configData.particles, 'breathIntensity', { 
      label: '呼吸强度', min: 0, max: 0.5, step: 0.01 
    });
    breath.on('change', (ev) => config.set('particles.breathIntensity', ev.value)); // ✅
    this.controls.set('particles.breathIntensity', breath);

    const float = folder.addBinding(this.configData.particles, 'floatIntensity', { 
      label: '浮动强度', min: 0, max: 1.0, step: 0.01 
    });
    float.on('change', (ev) => config.set('particles.floatIntensity', ev.value)); // ✅
    this.controls.set('particles.floatIntensity', float);

    const rotSpeed = folder.addBinding(this.configData.particles, 'rotationSpeed', { 
      label: '自转速度', min: -5, max: 5, step: 0.1 
    });
    rotSpeed.on('change', (ev) => config.set('particles.rotationSpeed', ev.value)); // ✅
    this.controls.set('particles.rotationSpeed', rotSpeed);
    
    const rotTiltXZ = folder.addBinding(this.configData.particles, 'rotationTiltXZ', { 
      label: '自转倾斜(XZ)', min: -90, max: 90, step: 1 
    });
    rotTiltXZ.on('change', (ev) => config.set('particles.rotationTiltXZ', ev.value)); // ✅
    this.controls.set('particles.rotationTiltXZ', rotTiltXZ);
    
    const rotTiltXY = folder.addBinding(this.configData.particles, 'rotationTiltXY', { 
      label: '自转俯仰(XY)', min: -90, max: 90, step: 1 
    });
    rotTiltXY.on('change', (ev) => config.set('particles.rotationTiltXY', ev.value)); // ✅
    this.controls.set('particles.rotationTiltXY', rotTiltXY);
    
    const opacity = folder.addBinding(this.configData.particles, 'dustOpacity', { 
      label: '透明度', min: 0, max: 1, step: 0.01 
    });
    opacity.on('change', (ev) => config.set('particles.dustOpacity', ev.value)); // ✅
    this.controls.set('particles.dustOpacity', opacity);
    
    this.folders.set('particles', folder);
  }

  _createPathControls() {
    const folder = this._pane.addFolder({ title: '路径设置', expanded: false });
    
    const pathColor = folder.addBinding(this.tempObjects.pathColor, 'pathColor', { label: '路径颜色', view: 'color' });
    pathColor.on('change', (ev) => config.set('environment.pathColor', ev.value)); // ✅
    this.controls.set('environment.pathColor', pathColor);

    const pointColor = folder.addBinding(this.tempObjects.pathPointColor, 'pathPointColor', { label: '光点颜色', view: 'color' });
    pointColor.on('change', (ev) => config.set('particles.pathPointColor', ev.value)); // ✅
    this.controls.set('particles.pathPointColor', pointColor);
    
    const pointSize = folder.addBinding(this.configData.particles, 'pathPointSize', { 
      label: '光点大小', min: 0.1, max: 2.0, step: 0.05 
    });
    pointSize.on('change', (ev) => config.set('particles.pathPointSize', ev.value)); // ✅
    this.controls.set('particles.pathPointSize', pointSize);
    
    const depth = folder.addBinding(this.configData.path, 'depthIntensity', { 
      label: '景深强度', min: 0, max: 1, step: 0.01 
    });
    depth.on('change', (ev) => config.set('path.depthIntensity', ev.value)); // ✅
    this.controls.set('path.depthIntensity', depth);
    
    this.folders.set('path', folder);
  }

  _createAudioControls() {
    const folder = this._pane.addFolder({ title: '背景音乐', expanded: false });
    
    let audioLoaded = false;
    const playButton = folder.addButton({ title: '▶️ 播放音乐' });
    playButton.on('click', () => {
      // Audio controls are commands, not state changes, so they stay with eventBus
      if (!audioLoaded) {
        eventBus.emit('audio-load', '/background-music.mp3');
        audioLoaded = true;
        eventBus.once('audio-loaded', () => eventBus.emit('audio-toggle'));
      } else {
        eventBus.emit('audio-toggle');
      }
    });
    eventBus.on('audio-playing', isPlaying => playButton.title = isPlaying ? '⏸️ 暂停音乐' : '▶️ 播放音乐');

    folder.addButton({ title: '⏹️ 停止' }).on('click', () => eventBus.emit('audio-stop'));

    const volumeObj = { volume: 0.5 };
    folder.addBinding(volumeObj, 'volume', { label: '音量', min: 0, max: 1, step: 0.01 })
      .on('change', (ev) => eventBus.emit('audio-volume-changed', ev.value));
    
    this.folders.set('audio', folder);
  }

      _bindEvents() {
    eventBus.on('datasets-list-updated', () => this._rebuildDataControls());

    // 监听配置变更
    eventBus.on('config-changed', ({ key, value }) => {
      this._updateControl(key, value, this.configData, this.tempObjects);
    });
    
    // ✅ 新增: 监听状态变更
    eventBus.on('state-changed', ({ key, value }) => {
      this._updateControl(key, value, this.stateData);
    });

    eventBus.on('preset-loaded', () => {
        this.refresh();
    });
  }

  // ✅ 新增: 提取一个可重用的辅助方法来更新UI控件
  _updateControl(key: string, value: any, primarySource: any, secondarySource?: any) {
      const control = this.controls.get(key);
      if (!control) return;

      const pathParts = key.split('.');
      let target: any;
      let tempKey: string | undefined;

      // 特殊处理颜色等绑定到 tempObjects 的情况
      if (secondarySource && (key === 'particles.dustColor' || key === 'environment.pathColor' || key === 'particles.pathPointColor')) {
          tempKey = pathParts[1]; // e.g., 'dustColor'
          target = secondarySource[tempKey];
          if (target && target[tempKey] !== value) {
              target[tempKey] = value;
              control.refresh();
          }
          return;
      }
      
      // 处理直接绑定到 primarySource (configData or stateData) 的情况
      target = primarySource;
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]];
      }
      const lastKey = pathParts[pathParts.length - 1];
      if (target && target[lastKey] !== value) {
        target[lastKey] = value;
        control.refresh();
      }
  }

  updateBindings() {
    this.tempObjects.dustColor.dustColor = config.get('particles.dustColor');
    this.tempObjects.pathColor.pathColor = config.get('environment.pathColor');
    this.tempObjects.pathPointColor.pathPointColor = config.get('particles.pathPointColor');
    
    ['particles.dustColor', 'environment.pathColor', 'particles.pathPointColor'].forEach(key => {
      const control = this.controls.get(key);
      if (control) control.refresh();
    });
    
    logger.debug('UIBasic', '临时对象已更新并刷新');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') control.refresh();
    });
    logger.debug('UIBasic', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) this._pane.dispose();
    this.controls.clear();
    this.folders.clear();
    this.dataControls.forEach(c => c.dispose());
    this.dataControls = [];
    this._isInitialized = false;
    logger.info('UIBasic', 'UI 已销毁');
  }
}

const uiBasic = new UIBasic();
export default uiBasic;
