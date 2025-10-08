/**
 * @file animation-sys.js
 * @description 动画系统 - 路径插值与步进控制
 * ✅ 核心改造: 监听统一的 'config-changed' 事件来控制动画启停。
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class AnimationSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.particlesSys = null;
    this.initialized = false;
    
    // 动画状态
    this.currentStep = 0;
    this.lerpT = 0;
    this.animating = false;
    this.mappedPoints = [];
  }

  init({ eventBus, scene, renderer, controls, particlesSys }) {
    if (this.initialized) {
      logger.warn('AnimationSystem', '动画系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.renderer = renderer;
      this.controls = controls;
      this.particlesSys = particlesSys;
      
      this._loadInitialConfig();
      this._bindEvents();

      this.initialized = true;
      logger.info('AnimationSystem', '动画系统初始化完成');

      return this;
    } catch (err) {
      logger.error('AnimationSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }
  
  _loadInitialConfig() {
    this.animating = config.get('animation.animating') || false;
  }

  _bindEvents() {
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // ✅ 保留数据信号和命令式事件
    this.eventBus.on('data-loaded', (data) => {
      this.mappedPoints = data.points;
      this.currentStep = 0;
      this.lerpT = 0;
      logger.info('AnimationSystem', `数据已加载: ${this.mappedPoints.length} 个点`);
    });

    this.eventBus.on('reset-animation', () => {
      this.reset();
    });

    this.eventBus.on('step-to', (step) => {
      this.stepTo(step);
    });
  }

  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }) {
    switch (key) {
      case 'animation.animating':
        this.animating = value;
        logger.info('AnimationSystem', `动画状态变更为: ${value ? '播放' : '暂停'}`);
        break;
      // speedFactor 和 loop 在 update 循环中直接读取，无需在这里处理
    }
  }

  update(delta, elapsed) {
    if (!this.animating || this.mappedPoints.length === 0) return;

    const speedFactor = config.get('animation.speedFactor') || 0.1;
    this.lerpT += speedFactor * delta;

    if (this.lerpT >= 1.0) {
      this.lerpT = 0;
      this.currentStep++;

      if (this.currentStep >= this.mappedPoints.length - 1) {
        const loop = config.get('animation.loop');
        if (loop) {
          this.currentStep = 0;
          logger.debug('AnimationSystem', '动画循环重新开始');
        } else {
          // 通过 config.set 触发UI和其他系统的更新
          config.set('animation.animating', false); 
          this.eventBus.emit('animation-completed');
          logger.info('AnimationSystem', '动画播放完成');
          return;
        }
      }
    }

    this._updatePosition();
    
    // 更新配置状态(触发UI刷新)
    config.set('animation.currentStep', this.currentStep);
    config.set('animation.lerpT', this.lerpT);

    this.eventBus.emit('animation-step-updated', this.currentStep);
  }

  _updatePosition() {
    if (this.currentStep >= this.mappedPoints.length - 1) return;

    const current = this.mappedPoints[this.currentStep];
    const next = this.mappedPoints[this.currentStep + 1];

    const interpolated = new THREE.Vector3().lerpVectors(current, next, this.lerpT);

    this.eventBus.emit('moving-light-position-updated', interpolated);
  }

  reset() {
    // 通过 config.set 驱动状态变更
    config.set('animation.currentStep', 0);
    config.set('animation.lerpT', 0);
    config.set('animation.animating', false);

    // 手动同步内部状态
    this.currentStep = 0;
    this.lerpT = 0;

    logger.info('AnimationSystem', '动画已重置');
    this.eventBus.emit('animation-reset');
  }

  stepTo(step) {
    if (step < 0 || step >= this.mappedPoints.length) {
      logger.warn('AnimationSystem', `无效的步骤: ${step}`);
      return;
    }
    
    // 通过 config.set 驱动状态变更
    config.set('animation.currentStep', step);
    config.set('animation.lerpT', 0);

    // 手动同步内部状态
    this.currentStep = step;
    this.lerpT = 0;

    this._updatePosition();
    logger.debug('AnimationSystem', `跳转到步骤: ${step}`);
  }

  getCurrentStep() { return this.currentStep; }
  getTotalSteps() { return this.mappedPoints.length; }
  
  getProgress() {
    if (this.mappedPoints.length === 0) return 0;
    return (this.currentStep + this.lerpT) / this.mappedPoints.length;
  }

  dispose() {
    this.animating = false;
    this.initialized = false;
    logger.info('AnimationSystem', '动画系统已销毁');
  }
}

const animationSys = new AnimationSystem();
export default animationSys;
