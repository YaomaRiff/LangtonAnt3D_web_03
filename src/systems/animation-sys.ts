/**
 * @file animation-sys.ts
 * @description 极简动画系统 - 基于 requestAnimationFrame 的线性插值
 * @version 5.2 (Type Safety Fix)
 *
 * 核心修复：
 *   1. 增加基础时长到 60 秒
 *   2. 循环时自动重置路径绘制
 *   3. 同步更新步数状态
 *   4. ✅ 添加完整的类型守卫，修复所有 undefined 错误
 */
import logger from '../utils/logger';
import config from '../config';
import state from './state';
import * as THREE from 'three';

class AnimationSystem {
  private eventBus: any;
  private initialized: boolean;

  // 动画状态
  private isPlaying: boolean = false;
  private progress: number = 0; // 归一化进度 [0, 1]
  private speed: number = 1; // 速度倍率
  private lastTime: number = 0;

  // 数据
  private mappedPoints: THREE.Vector3[] = [];
  private baseDuration: number = 60000; // ✅ 60 秒

  constructor() {
    this.eventBus = null;
    this.initialized = false;
  }

  init({ eventBus }: any) {
    if (this.initialized) {
      logger.warn('AnimationSystem', '动画系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;

      // 从配置中读取初始速度
      this.speed = config.get('animation.speedFactor') || 1;

      this._bindEvents();

      this.initialized = true;
      logger.info('AnimationSystem', `✅ 极简动画系统初始化完成 | 初始速度: ${this.speed}x`);

      return this;
    } catch (err: unknown) {
      logger.error('AnimationSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    // 数据加载
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.mappedPoints = data.points;
      logger.info('AnimationSystem', `数据已加载 | 节点数: ${this.mappedPoints.length}`);
    });

    // 状态变更
    this.eventBus.on('state-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'animation.animating') {
        if (value) this.play();
        else this.pause();
      }
    });

    // 配置变更
    this.eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'animation.speedFactor') {
        this.speed = value;
      }
    });

    // 重置
    this.eventBus.on('reset-animation', () => {
      this.reset();
    });

    // 跳转到指定步数
    this.eventBus.on('step-to', (step: number) => {
      this.stepTo(step);
    });
  }

  /**
   * 🔥 核心方法：每帧更新
   */
  update(_delta: number, _elapsed: number) {
    if (!this.isPlaying || this.mappedPoints.length < 2) return;

    const now = performance.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    // 更新进度
    const increment = (dt / this.baseDuration) * this.speed;
    this.progress += increment;

    // ✅ 循环处理（增强版）
    if (this.progress >= 1) {
      if (config.get('animation.loop')) {
        this.progress = 0;

        // 🔥 核心修复：循环时重置路径
        this.eventBus.emit('animation-reset');

        logger.info('AnimationSystem', '🔁 循环重置');
      } else {
        this.progress = 1;
        this.pause();
      }
    }

    this._updatePosition();
  }

  /**
   * 🔥 核心方法：根据进度计算火箭位置
   * ✅ 修复：添加完整的类型守卫
   */
  _updatePosition() {
    if (this.mappedPoints.length < 2) return;

    const totalSegments = this.mappedPoints.length - 1;
    const segmentFloat = this.progress * totalSegments;
    const segmentIndex = Math.floor(segmentFloat);
    const segmentT = segmentFloat - segmentIndex;

    // ✅ 修复：添加边界检查
    if (segmentIndex >= totalSegments) {
      const lastPoint = this.mappedPoints[this.mappedPoints.length - 1];

      // ✅ 核心修复：添加类型守卫
      if (!lastPoint) {
        logger.warn('AnimationSystem', '最后一个点不存在');
        return;
      }

      this._emitPosition(lastPoint, 1.0);
      state.set('animation.currentStep', totalSegments);
      return;
    }

    // ✅ 核心修复：线性插值前添加类型守卫
    const p0 = this.mappedPoints[segmentIndex];
    const p1 = this.mappedPoints[segmentIndex + 1];

    // ✅ 确保两个点都存在
    if (!p0 || !p1) {
      logger.warn('AnimationSystem', `插值点不存在: index=${segmentIndex}`);
      return;
    }

    const position = new THREE.Vector3(
      THREE.MathUtils.lerp(p0.x, p1.x, segmentT),
      THREE.MathUtils.lerp(p0.y, p1.y, segmentT),
      THREE.MathUtils.lerp(p0.z, p1.z, segmentT)
    );

    this._emitPosition(position, this.progress);
    state.set('animation.currentStep', segmentIndex);
  }

  /**
   * 🔥 核心方法：发出位置更新事件（统一格式）
   */
  _emitPosition(position: THREE.Vector3, progress: number) {
    this.eventBus.emit('moving-light-position-updated', {
      position: position.clone(),
      progress: progress,
    });
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTime = performance.now();
    logger.info('AnimationSystem', '▶️ 开始播放');
  }

  pause() {
    this.isPlaying = false;
    logger.info('AnimationSystem', '⏸️ 暂停');
  }

  reset() {
    this.progress = 0;
    this.isPlaying = false;
    this._updatePosition();
    logger.info('AnimationSystem', '🔄 重置');
  }

  stepTo(step: number) {
    if (step < 0 || step >= this.mappedPoints.length) {
      logger.warn('AnimationSystem', `⚠️ 无效步数: ${step}`);
      return;
    }

    const totalSegments = Math.max(1, this.mappedPoints.length - 1);
    this.progress = step / totalSegments;

    this._updatePosition();
    logger.debug('AnimationSystem', `⏭️ 跳转到步数 ${step}`);
  }

  dispose() {
    this.isPlaying = false;
    this.initialized = false;
    logger.info('AnimationSystem', '动画系统已销毁');
  }
}

const animationSys = new AnimationSystem();
export default animationSys;
