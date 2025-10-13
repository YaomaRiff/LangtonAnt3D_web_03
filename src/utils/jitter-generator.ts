/**
 * @file jitter-generator.ts
 * @description 通用抖动生成器 - 球内均匀分布 + 随机时间间隔
 * @version 1.0
 *
 * 核心特性：
 *   1. 拒绝采样法实现球内真正均匀分布
 *   2. 时间间隔随机化，避免机械感
 *   3. 支持运行时配置热更新
 */
import * as THREE from 'three';

export class JitterGenerator {
  private lastUpdateTime: number = 0;
  private currentTarget: THREE.Vector3 = new THREE.Vector3();
  private nextUpdateDelay: number = 0;

  constructor(
    private intensity: number, // 抖动球体半径
    private frequency: number, // 基础频率（Hz）
    private timeVariation: number // 时间随机性 [0-1]
  ) {
    this._generateNewTarget();
    this._scheduleNextUpdate();
  }

  /**
   * 🎯 核心方法：生成球内均匀分布的随机点
   * 使用拒绝采样法（Rejection Sampling）
   */
  private _generateNewTarget(): void {
    let x: number, y: number, z: number, lengthSq: number;

    // 拒绝采样：在立方体中随机取点，拒绝超出球体的点
    do {
      x = (Math.random() * 2 - 1) * this.intensity;
      y = (Math.random() * 2 - 1) * this.intensity;
      z = (Math.random() * 2 - 1) * this.intensity;
      lengthSq = x * x + y * y + z * z;
    } while (lengthSq > this.intensity * this.intensity);

    this.currentTarget.set(x, y, z);
  }

  /**
   * ⏱️ 计算下次更新的时间间隔（带随机性）
   */
  private _scheduleNextUpdate(): void {
    const baseInterval = 1000 / this.frequency; // 毫秒
    const randomFactor = 1 + (Math.random() * 2 - 1) * this.timeVariation;
    this.nextUpdateDelay = baseInterval * randomFactor;
  }

  /**
   * 🔄 每帧调用，返回当前抖动偏移量
   * @param currentTime - 当前时间戳（毫秒）
   * @returns 抖动向量的克隆
   */
  update(currentTime: number): THREE.Vector3 {
    if (currentTime - this.lastUpdateTime >= this.nextUpdateDelay) {
      this._generateNewTarget();
      this._scheduleNextUpdate();
      this.lastUpdateTime = currentTime;
    }
    return this.currentTarget.clone();
  }

  /**
   * 🛠️ 动态更新配置
   */
  updateConfig(intensity?: number, frequency?: number, timeVariation?: number): void {
    if (intensity !== undefined) this.intensity = intensity;
    if (frequency !== undefined) this.frequency = frequency;
    if (timeVariation !== undefined) this.timeVariation = timeVariation;
  }

  /**
   * 获取当前配置（用于调试）
   */
  getConfig(): { intensity: number; frequency: number; timeVariation: number } {
    return {
      intensity: this.intensity,
      frequency: this.frequency,
      timeVariation: this.timeVariation,
    };
  }
}
