/**
 * @file animation-sys.js
 * @description 动画系统 - 路径插值与步进控制
 * 核心改造: 监听统一的 'config-changed' 事件来控制动画启停。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import state from './state';

class AnimationSystem {
  private eventBus: any;

  // 公共属性
  public scene: THREE.Scene | null = null;
  public renderer: THREE.WebGLRenderer | null = null;
  public controls: any = null;
  public particlesSys: any = null;

  private initialized: boolean;
  private currentStep: number;
  private lerpT: number;
  private animating: boolean;
  private mappedPoints: any[];

  constructor() {
    this.eventBus = null;

    this.initialized = false;

    // 动画状态
    this.currentStep = 0;
    this.lerpT = 0;
    this.animating = false;
    this.mappedPoints = [];
  }

  init({ eventBus, scene, renderer, controls, particlesSys }: any) {
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
    } catch (err: unknown) {
      logger.error('AnimationSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _loadInitialConfig() {
    this.animating = state.get('animation.animating') || false; //从 state 读取
  }

  _bindEvents() {
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
    this.eventBus.on('state-changed', this._handleStateChange.bind(this));

    // ✅ 保留数据信号和命令式事件
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.mappedPoints = data.points;
      this.currentStep = 0;
      this.lerpT = 0;
      logger.info('AnimationSystem', `数据已加载: ${this.mappedPoints.length} 个点`);
    });

    this.eventBus.on('reset-animation', () => {
      this.reset();
    });

    this.eventBus.on('step-to', (step: number) => {
      this.stepTo(step);
    });
  }

  //统一处理配置变更
  _handleConfigChange(_params: { key: string; value: any }): void {
    // speedFactor 和 loop 在 update 循环中直接从 config 读取，无需处理
    // animating 的处理已移至 _handleStateChange
  }

  //统一处理 *状态* 变更
  _handleStateChange({ key, value }: { key: string; value: any }) {
    if (key === 'animation.animating') {
      this.animating = value;
      logger.info('AnimationSystem', `动画状态变更为: ${value ? '播放' : '暂停'}`);
    }
  }

  update(delta: number, _elapsed: number) {
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
          state.set('animation.animating', false);
          this.eventBus.emit('animation-completed');
          logger.info('AnimationSystem', '动画播放完成');
          return;
        }
      }
    }

    this._updatePosition();

    // 更新配置状态(触发UI刷新)
    state.set('animation.currentStep', this.currentStep);
    state.set('animation.lerpT', this.lerpT);

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
    state.set('animation.currentStep', 0);
    state.set('animation.lerpT', 0);
    state.set('animation.animating', false);

    // 手动同步内部状态
    this.currentStep = 0;
    this.lerpT = 0;

    logger.info('AnimationSystem', '动画已重置');
    this.eventBus.emit('animation-reset');
  }

  stepTo(step: number): void {
    if (step < 0 || step >= this.mappedPoints.length) {
      logger.warn('AnimationSystem', `无效的步骤: ${step}`);
      return;
    }

    // 通过 config.set 驱动状态变更
    state.set('animation.currentStep', step);
    state.set('animation.lerpT', 0);

    // 手动同步内部状态
    this.currentStep = step;
    this.lerpT = 0;

    this._updatePosition();
    // ✅ 使用节流日志，避免拖动进度条时刷屏
    logger.debugThrottled(
      'AnimationSystem',
      'animation-step-to', // 节流的唯一Key
      `跳转到步骤: ${this.currentStep}`,
      500 // 500毫秒的间隔对进度条拖动更友好
    );
  }

  getCurrentStep() {
    return this.currentStep;
  }
  getTotalSteps() {
    return this.mappedPoints.length;
  }

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
