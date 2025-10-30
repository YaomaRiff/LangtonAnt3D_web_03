/**
 * @file simple-debug-panel.ts
 * @description 简化调试面板 - 使用原生HTML实现
 * 提供基本的参数调整和状态监控功能
 */

import configManager from '../config';
import eventBus from '../event-bus';
import logger from '../utils/logger';
import { ColorUtils, Utils } from '../utils/enhanced-utils';

class SimpleDebugPanel {
  private initialized: boolean = false;
  private container: HTMLElement | null = null;
  private boundHandleConfigChange: (data: { key: string; value: any }) => void;

  constructor() {
    // 绑定方法引用
    this.boundHandleConfigChange = this.handleConfigChange.bind(this);

    // 检查是否在开发环境
    if (import.meta.env.PROD) {
      logger.info('SimpleDebugPanel', '生产环境，跳过调试面板初始化');
      return;
    }
  }

  init() {
    if (this.initialized) {
      logger.warn('SimpleDebugPanel', '调试面板已初始化');
      return;
    }

    this.createDebugPanel();
    this.bindEvents();

    this.initialized = true;
    logger.info('SimpleDebugPanel', '简单调试面板已初始化');
  }

  private createDebugPanel() {
    // 创建面板容器
    this.container = document.createElement('div');
    this.container.id = 'simple-debug-panel';
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 320px;
      height: 100vh;
      background: rgba(20, 20, 25, 0.95);
      backdrop-filter: blur(10px);
      border-left: 1px solid rgba(139, 92, 246, 0.3);
      z-index: 9999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: white;
      overflow-y: auto;
      padding: 16px;
    `;

    // 创建面板内容
    this.container.innerHTML = this.createPanelContent();

    // 添加到页面
    document.body.appendChild(this.container);

    // 绑定事件监听
    this.attachPanelEvents();
  }

  private createPanelContent(): string {
    return `
      <div style="margin-bottom: 16px;">
        <h3 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 14px; font-weight: 600;">
          🎮 Langton's Ant 调试面板
        </h3>
        <button id="toggle-panel" style="
          position: absolute;
          top: 10px;
          right: 10px;
          background: #8b5cf6;
          border: none;
          border-radius: 4px;
          color: white;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 12px;
        ">隐藏</button>
      </div>

      <!-- 动画控制 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🎮 动画控制</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">播放状态</label>
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="isPlaying" style="width: 16px; height: 16px; accent-color: #8b5cf6;">
            <span style="font-size: 12px;">播放/暂停</span>
          </label>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            动画速度: <span id="speedValue">0.05</span>
          </label>
          <input type="range" id="speedFactor" min="0.001" max="0.2" step="0.001" value="0.05"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            当前步数: <span id="stepValue">0</span>
          </label>
          <input type="range" id="currentStep" min="0" max="10000" step="1" value="0"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>
      </div>

      <!-- 音频控制 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🔊 音频控制</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            音量: <span id="volumeValue">0.5</span>
          </label>
          <input type="range" id="volume" min="0" max="1" step="0.01" value="0.5"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="isMuted" style="width: 16px; height: 16px; accent-color: #8b5cf6;">
            <span style="font-size: 12px;">静音</span>
          </label>
        </div>
      </div>

      <!-- 尾焰效果 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🚀 尾焰效果</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">底部颜色</label>
          <input type="color" id="flameBaseColor" value="#ff0055"
                 style="width: 100%; height: 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.1); padding: 2px;">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">顶部颜色</label>
          <input type="color" id="flameTipColor" value="#d4e83c"
                 style="width: 100%; height: 32px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.1); padding: 2px;">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            强度: <span id="intensityValue">1.0</span>
          </label>
          <input type="range" id="flameIntensity" min="0" max="3" step="0.1" value="1.0"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>
      </div>

      <!-- 粒子效果 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🌟 粒子效果</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            数量: <span id="particleCountValue">1900</span>
          </label>
          <input type="range" id="particleCount" min="100" max="5000" step="100" value="1900"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            大小: <span id="particleSizeValue">0.73</span>
          </label>
          <input type="range" id="particleSize" min="0.1" max="3" step="0.1" value="0.73"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>
      </div>

      <!-- 后期处理 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">✨ 后期处理</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="bloomEnabled" checked style="width: 16px; height: 16px; accent-color: #8b5cf6;">
            <span style="font-size: 12px;">光晕效果</span>
          </label>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="filmEnabled" checked style="width: 16px; height: 16px; accent-color: #8b5cf6;">
            <span style="font-size: 12px;">胶片效果</span>
          </label>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            光晕强度: <span id="bloomIntensityValue">1.0</span>
          </label>
          <input type="range" id="bloomIntensity" min="0" max="3" step="0.1" value="1.0"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>
      </div>

      <!-- 相机控制 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🎯 相机控制</h4>

        <div style="margin-bottom: 12px;">
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <input type="checkbox" id="autoRotate" checked style="width: 16px; height: 16px; accent-color: #8b5cf6;">
            <span style="font-size: 12px;">自动旋转</span>
          </label>
        </div>

        <div style="margin-bottom: 12px;">
          <label style="display: block; font-size: 12px; margin-bottom: 4px; color: rgba(255,255,255,0.7);">
            视野角度: <span id="fovValue">75°</span>
          </label>
          <input type="range" id="fov" min="30" max="120" step="1" value="75"
                 style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; outline: none;">
        </div>
      </div>

      <!-- 颜色工具 -->
      <div class="control-section" style="margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🎨 颜色工具</h4>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="generatePalette" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">生成配色方案</button>

          <button id="randomizeFlame" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">随机尾焰颜色</button>

          <button id="complementaryColors" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">互补色方案</button>
        </div>
      </div>

      <!-- 实用工具 -->
      <div class="control-section" style="margin-bottom: 20px;">
        <h4 style="color: #8b5cf6; margin: 0 0 12px 0; font-size: 12px;">🔧 实用工具</h4>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          <button id="resetCamera" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #64748b, #475569);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">重置相机</button>

          <button id="resetAnimation" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #64748b, #475569);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">重置动画</button>

          <button id="exportConfig" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #059669, #047857);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">导出配置</button>

          <button id="showInfo" style="
            padding: 8px 12px;
            background: linear-gradient(135deg, #7c3aed, #6d28d9);
            border: none;
            border-radius: 6px;
            color: white;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
          ">显示信息</button>
        </div>
      </div>
    `;
  }

  private attachPanelEvents() {
    if (!this.container) return;

    // 动画控制
    const isPlaying = this.container.querySelector('#isPlaying') as HTMLInputElement;
    const speedFactor = this.container.querySelector('#speedFactor') as HTMLInputElement;
    const currentStep = this.container.querySelector('#currentStep') as HTMLInputElement;
    const speedValue = this.container.querySelector('#speedValue');
    const stepValue = this.container.querySelector('#stepValue');

    // 音频控制
    const volume = this.container.querySelector('#volume') as HTMLInputElement;
    const isMuted = this.container.querySelector('#isMuted') as HTMLInputElement;
    const volumeValue = this.container.querySelector('#volumeValue');

    // 尾焰效果
    const flameBaseColor = this.container.querySelector('#flameBaseColor') as HTMLInputElement;
    const flameTipColor = this.container.querySelector('#flameTipColor') as HTMLInputElement;
    const flameIntensity = this.container.querySelector('#flameIntensity') as HTMLInputElement;
    const intensityValue = this.container.querySelector('#intensityValue');

    // 粒子效果
    const particleCount = this.container.querySelector('#particleCount') as HTMLInputElement;
    const particleSize = this.container.querySelector('#particleSize') as HTMLInputElement;
    const particleCountValue = this.container.querySelector('#particleCountValue');
    const particleSizeValue = this.container.querySelector('#particleSizeValue');

    // 后期处理
    const bloomEnabled = this.container.querySelector('#bloomEnabled') as HTMLInputElement;
    const filmEnabled = this.container.querySelector('#filmEnabled') as HTMLInputElement;
    const bloomIntensity = this.container.querySelector('#bloomIntensity') as HTMLInputElement;
    const bloomIntensityValue = this.container.querySelector('#bloomIntensityValue');

    // 相机控制
    const autoRotate = this.container.querySelector('#autoRotate') as HTMLInputElement;
    const fov = this.container.querySelector('#fov') as HTMLInputElement;
    const fovValue = this.container.querySelector('#fovValue');

    // 初始化值
    this.updateControlValues();

    // 绑定事件监听器
    isPlaying?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).checked;
      configManager.set('animation.isPlaying', value);
      eventBus.emit('animation-play-pause', value);
    });

    speedFactor?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      configManager.set('animation.speedFactor', value);
      if (speedValue) speedValue.textContent = value.toFixed(3);
    });

    currentStep?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      eventBus.emit('step-changed', { step: value, percent: (value / 10000) * 100 });
      if (stepValue) stepValue.textContent = value.toString();
    });

    volume?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      configManager.set('audio.volume', value);
      eventBus.emit('volume-changed', value);
      if (volumeValue) volumeValue.textContent = value.toFixed(2);
    });

    isMuted?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).checked;
      configManager.set('audio.isMuted', value);
      eventBus.emit('audio-mute', value);
    });

    flameBaseColor?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      configManager.set('exhaust.flame.baseColor', value);
      this.updateFlameEffects();
    });

    flameTipColor?.addEventListener('input', (e) => {
      const value = (e.target as HTMLInputElement).value;
      configManager.set('exhaust.flame.tipColor', value);
      this.updateFlameEffects();
    });

    flameIntensity?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      configManager.set('exhaust.flame.intensity', value);
      if (intensityValue) intensityValue.textContent = value.toFixed(1);
    });

    particleCount?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      configManager.set('particles.dustCount', value);
      if (particleCountValue) particleCountValue.textContent = value.toString();
    });

    particleSize?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      configManager.set('particles.dustSize', value);
      if (particleSizeValue) particleSizeValue.textContent = value.toFixed(2);
    });

    bloomEnabled?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).checked;
      configManager.set('postprocess.bloom.enabled', value);
    });

    filmEnabled?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).checked;
      configManager.set('postprocess.film.enabled', value);
    });

    bloomIntensity?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      configManager.set('postprocess.bloom.intensity', value);
      if (bloomIntensityValue) bloomIntensityValue.textContent = value.toFixed(1);
    });

    autoRotate?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).checked;
      configManager.set('camera.autoRotate', value);
      eventBus.emit('camera-auto-rotate', value);
    });

    fov?.addEventListener('input', (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      configManager.set('camera.fov', value);
      eventBus.emit('camera-fov-changed', value);
      if (fovValue) fovValue.textContent = value + '°';
    });

    // 按钮事件
    const generatePalette = this.container.querySelector('#generatePalette');
    const randomizeFlame = this.container.querySelector('#randomizeFlame');
    const complementaryColors = this.container.querySelector('#complementaryColors');
    const resetCamera = this.container.querySelector('#resetCamera');
    const resetAnimation = this.container.querySelector('#resetAnimation');
    const exportConfig = this.container.querySelector('#exportConfig');
    const showInfo = this.container.querySelector('#showInfo');
    const togglePanel = this.container.querySelector('#toggle-panel');

    generatePalette?.addEventListener('click', () => this.generateColorPalette());
    randomizeFlame?.addEventListener('click', () => this.randomizeFlameColors());
    complementaryColors?.addEventListener('click', () => this.applyComplementaryColors());
    resetCamera?.addEventListener('click', () => this.resetCamera());
    resetAnimation?.addEventListener('click', () => this.resetAnimation());
    exportConfig?.addEventListener('click', () => this.exportConfiguration());
    showInfo?.addEventListener('click', () => this.showInfo());
    togglePanel?.addEventListener('click', () => this.toggleVisibility());
  }

  private updateControlValues() {
    if (!this.container) return;

    // 更新控件值
    const controls = {
      isPlaying: configManager.get('animation.isPlaying') || false,
      speedFactor: configManager.get('animation.speedFactor') || 0.05,
      volume: configManager.get('audio.volume') || 0.5,
      isMuted: configManager.get('audio.isMuted') || false,
      flameBaseColor: configManager.get('exhaust.flame.baseColor') || '#ff0055',
      flameTipColor: configManager.get('exhaust.flame.tipColor') || '#d4e83c',
      flameIntensity: configManager.get('exhaust.flame.intensity') || 1.0,
      particleCount: configManager.get('particles.dustCount') || 1900,
      particleSize: configManager.get('particles.dustSize') || 0.73,
      bloomEnabled: configManager.get('postprocess.bloom.enabled') !== false,
      filmEnabled: configManager.get('postprocess.film.enabled') !== false,
      bloomIntensity: configManager.get('postprocess.bloom.intensity') || 1.0,
      autoRotate: configManager.get('camera.autoRotate') !== false,
      fov: configManager.get('camera.fov') || 75,
    };

    // 更新DOM元素
    this.updateDOMValue('isPlaying', controls.isPlaying);
    this.updateDOMValue('speedFactor', controls.speedFactor);
    this.updateDOMValue('currentStep', 0);
    this.updateDOMValue('volume', controls.volume);
    this.updateDOMValue('isMuted', controls.isMuted);
    this.updateDOMValue('flameBaseColor', controls.flameBaseColor);
    this.updateDOMValue('flameTipColor', controls.flameTipColor);
    this.updateDOMValue('flameIntensity', controls.flameIntensity);
    this.updateDOMValue('particleCount', controls.particleCount);
    this.updateDOMValue('particleSize', controls.particleSize);
    this.updateDOMValue('bloomEnabled', controls.bloomEnabled);
    this.updateDOMValue('filmEnabled', controls.filmEnabled);
    this.updateDOMValue('bloomIntensity', controls.bloomIntensity);
    this.updateDOMValue('autoRotate', controls.autoRotate);
    this.updateDOMValue('fov', controls.fov);

    // 更新显示值
    this.updateDisplayValue('speedValue', controls.speedFactor, 3);
    this.updateDisplayValue('stepValue', 0, 0);
    this.updateDisplayValue('volumeValue', controls.volume, 2);
    this.updateDisplayValue('intensityValue', controls.flameIntensity, 1);
    this.updateDisplayValue('particleCountValue', controls.particleCount, 0);
    this.updateDisplayValue('particleSizeValue', controls.particleSize, 2);
    this.updateDisplayValue('bloomIntensityValue', controls.bloomIntensity, 1);
    this.updateDisplayValue('fovValue', controls.fov, 0);
  }

  private updateDOMValue(id: string, value: any) {
    const element = this.container?.querySelector(`#${id}`) as HTMLInputElement;
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = value;
      } else {
        element.value = value;
      }
    }
  }

  private updateDisplayValue(id: string, value: number, decimals: number = 2) {
    const element = this.container?.querySelector(`#${id}`) as HTMLElement;
    if (element) {
      element.textContent = value.toFixed(decimals);
    }
  }

  private updateFlameEffects() {
    const baseColor = configManager.get('exhaust.flame.baseColor');
    const tipColor = configManager.get('exhaust.flame.tipColor');

    if (baseColor && tipColor) {
      // 使用Chroma.js生成尾焰渐变
      const gradient = ColorUtils.generateGradient([baseColor, tipColor]);
      eventBus.emit('flame-gradient-updated', gradient);
      logger.debug('SimpleDebugPanel', `尾焰渐变已更新: ${gradient}`);
    }
  }

  private generateColorPalette() {
    const palette = ColorUtils.generateRandomPalette();

    // 应用配色方案
    configManager.set('exhaust.flame.baseColor', palette.primary);
    configManager.set('exhaust.flame.tipColor', palette.secondary);
    configManager.set('particles.dustColor', palette.accent);

    // 更新控件值
    this.updateDOMValue('flameBaseColor', palette.primary);
    this.updateDOMValue('flameTipColor', palette.secondary);

    logger.info('SimpleDebugPanel', `新配色方案已生成: ${JSON.stringify(palette)}`);
  }

  private randomizeFlameColors() {
    const colors = ColorUtils.generateAnalogousColors('#ff0055');

    configManager.set('exhaust.flame.baseColor', colors[0]);
    configManager.set('exhaust.flame.tipColor', colors[1]);

    // 更新控件值
    this.updateDOMValue('flameBaseColor', colors[0]);
    this.updateDOMValue('flameTipColor', colors[1]);

    logger.info('SimpleDebugPanel', `尾焰颜色已随机化: ${JSON.stringify(colors)}`);
  }

  private applyComplementaryColors() {
    const baseColor = configManager.get('exhaust.flame.baseColor');
    const complement = ColorUtils.getComplementaryColor(baseColor);

    configManager.set('exhaust.flame.baseColor', baseColor);
    configManager.set('exhaust.flame.tipColor', complement);
    configManager.set('particles.dustColor', complement);

    // 更新控件值
    this.updateDOMValue('flameTipColor', complement);

    logger.info(
      'SimpleDebugPanel',
      `互补色方案已应用: { base: ${baseColor}, complement: ${complement} }`
    );
  }

  private resetCamera() {
    eventBus.emit('camera-reset');
    logger.info('SimpleDebugPanel', '相机已重置');
  }

  private resetAnimation() {
    eventBus.emit('animation-reset');
    this.updateDOMValue('currentStep', 0);
    this.updateDisplayValue('stepValue', 0, 0);
    logger.info('SimpleDebugPanel', '动画已重置');
  }

  private exportConfiguration() {
    try {
      const config = configManager.getRaw();
      const dataStr = JSON.stringify(config, null, 2);
      Utils.downloadFile(
        dataStr,
        `langton-ant-config-${Utils.generateId()}.json`,
        'application/json'
      );
      logger.info('SimpleDebugPanel', '配置已导出');
    } catch (error) {
      logger.error('SimpleDebugPanel', `导出配置失败: ${error}`);
    }
  }

  private showInfo() {
    const config = configManager.getRaw();
    const info = {
      项目: "Langton's Ant 3D Visualization",
      版本: '0.3.1',
      环境: import.meta.env.MODE,
      调试面板: '已启用',
      配置项数量: Object.keys(config).length,
    };

    alert(JSON.stringify(info, null, 2));
  }

  private toggleVisibility() {
    if (!this.container) return;

    const toggleButton = this.container.querySelector('#toggle-panel') as HTMLButtonElement;
    const isVisible = this.container.style.display !== 'none';

    if (isVisible) {
      this.container.style.display = 'none';
      toggleButton.textContent = '👁️';
    } else {
      this.container.style.display = 'block';
      toggleButton.textContent = '⚙️';
    }
  }

  private bindEvents() {
    // 监听配置变化
    eventBus.on('config-changed', this.boundHandleConfigChange);

    // 监听动画状态变化
    eventBus.on('animation-state-changed', (isPlaying: boolean) => {
      this.updateDOMValue('isPlaying', isPlaying);
    });

    // 监听步数变化
    eventBus.on('step-changed', ({ step }: { step: number }) => {
      this.updateDOMValue('currentStep', step);
      this.updateDisplayValue('stepValue', step, 0);
    });
  }

  private handleConfigChange({ key, value }: { key: string; value: any }) {
    // 更新对应的控件值
    const controlIdMap: Record<string, string> = {
      'animation.isPlaying': 'isPlaying',
      'animation.speedFactor': 'speedFactor',
      'audio.volume': 'volume',
      'audio.isMuted': 'isMuted',
      'exhaust.flame.baseColor': 'flameBaseColor',
      'exhaust.flame.tipColor': 'flameTipColor',
      'exhaust.flame.intensity': 'flameIntensity',
      'particles.dustCount': 'particleCount',
      'particles.dustSize': 'particleSize',
      'postprocess.bloom.enabled': 'bloomEnabled',
      'postprocess.film.enabled': 'filmEnabled',
      'postprocess.bloom.intensity': 'bloomIntensity',
      'camera.autoRotate': 'autoRotate',
      'camera.fov': 'fov',
    };

    const controlId = controlIdMap[key];
    if (controlId) {
      this.updateDOMValue(controlId, value);

      // 更新显示值
      if (controlId === 'speedFactor') {
        this.updateDisplayValue('speedValue', value, 3);
      } else if (controlId === 'flameIntensity') {
        this.updateDisplayValue('intensityValue', value, 1);
      } else if (controlId === 'particleSize') {
        this.updateDisplayValue('particleSizeValue', value, 2);
      } else if (controlId === 'bloomIntensity') {
        this.updateDisplayValue('bloomIntensityValue', value, 1);
      } else if (controlId === 'fov') {
        this.updateDisplayValue('fovValue', value, 0);
        const fovElement = this.container?.querySelector('#fovValue') as HTMLElement;
        if (fovElement) fovElement.textContent = value + '°';
      } else if (controlId === 'volume') {
        this.updateDisplayValue('volumeValue', value, 2);
      }
    }
  }

  // 公共方法
  show() {
    if (this.container) {
      this.container.style.display = 'block';
      const toggleButton = this.container.querySelector('#toggle-panel') as HTMLButtonElement;
      if (toggleButton) toggleButton.textContent = '⚙️';
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }

  dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    // 移除事件监听
    eventBus.off('config-changed', this.boundHandleConfigChange);
    eventBus.off('animation-state-changed', () => {});
    eventBus.off('step-changed', () => {});

    this.initialized = false;
    logger.info('SimpleDebugPanel', '调试面板已销毁');
  }
}

// 导出单例实例
export default new SimpleDebugPanel();
