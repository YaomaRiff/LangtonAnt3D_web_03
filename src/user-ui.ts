/**
 * @file user-ui.ts
 * @description 用户友好的简化UI系统 - 仅包含4个核心控件
 * @version 1.0
 */

import configManager, { type ConfigEvent } from './config';
import eventBus from './event-bus';
import presetManager from './preset-manager';
import animationSys from './systems/animation-sys';
import cameraSys from './systems/camera-sys';
import audioSys from './systems/audio-sys';

interface UIControl {
  id: string;
  title: string;
  container: HTMLElement;
  visible: boolean;
}

export class UserUI {
  private controls: Map<string, UIControl> = new Map();
  private isInitialized = false;

  constructor() {
    // 延迟初始化，等待DOM准备完成
  }

  public async initialize() {
    console.log('🎛️ Initializing User UI...');

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    this.setupControls();
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('✅ User UI initialized');
  }

  private setupControls() {
    // 创建动画控制
    this.createAnimationControl();

    // 创建相机控制
    this.createCameraControl();

    // 创建预设控制
    this.createPresetControl();

    // 创建音频控制
    this.createAudioControl();
  }

  private createAnimationControl() {
    const container = document.getElementById('animation-control');
    if (!container) return;

    container.innerHTML = `
      <h3 class="text-white font-mono text-sm mb-3 opacity-80">Animation</h3>
      <div class="space-y-2">
        <button id="play-pause-btn" class="ui-button w-full">
          <span id="play-icon">⏸️</span> <span id="play-text">Pause</span>
        </button>
        <button id="reset-animation-btn" class="ui-button w-full">
          🔄 Reset
        </button>
        <div class="flex items-center space-x-2">
          <label class="text-xs text-gray-400">Speed:</label>
          <input type="range" id="speed-slider" min="0.1" max="3" step="0.1" value="1"
                 class="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer">
          <span id="speed-value" class="text-xs text-gray-400 w-8">1.0</span>
        </div>
      </div>
    `;

    this.controls.set('animation', {
      id: 'animation',
      title: 'Animation',
      container,
      visible: true
    });

    this.setupAnimationEvents();
  }

  private createCameraControl() {
    const container = document.getElementById('camera-control');
    if (!container) return;

    container.innerHTML = `
      <h3 class="text-white font-mono text-sm mb-3 opacity-80">Camera</h3>
      <div class="space-y-2">
        <button id="camera-auto-btn" class="ui-button w-full active">
          🎥 Auto Rotate
        </button>
        <button id="camera-front-btn" class="ui-button w-full">
          🔳 Front View
        </button>
        <button id="camera-top-btn" class="ui-button w-full">
          ⬆️ Top View
        </button>
        <button id="camera-side-btn" class="ui-button w-full">
          ➡️ Side View
        </button>
      </div>
    `;

    this.controls.set('camera', {
      id: 'camera',
      title: 'Camera',
      container,
      visible: true
    });

    this.setupCameraEvents();
  }

  private createPresetControl() {
    const container = document.getElementById('preset-control');
    if (!container) return;

    // 获取可用预设列表
    const presets = presetManager.getAvailablePresets();

    container.innerHTML = `
      <h3 class="text-white font-mono text-sm mb-3 opacity-80">Presets</h3>
      <div class="space-y-2">
        <select id="preset-select" class="w-full bg-glass-dark border border-glass-border rounded text-white text-sm p-2">
          ${presets.map(preset => `<option value="${preset}">${preset}</option>`).join('')}
        </select>
        <div class="flex space-x-1">
          <button id="load-preset-btn" class="ui-button flex-1">
            📂 Load
          </button>
          <button id="save-preset-btn" class="ui-button flex-1">
            💾 Save
          </button>
        </div>
      </div>
    `;

    this.controls.set('preset', {
      id: 'preset',
      title: 'Presets',
      container,
      visible: true
    });

    this.setupPresetEvents();
  }

  private createAudioControl() {
    const container = document.getElementById('audio-control');
    if (!container) return;

    container.innerHTML = `
      <h3 class="text-white font-mono text-sm mb-3 opacity-80">Audio</h3>
      <div class="space-y-2">
        <button id="audio-toggle-btn" class="ui-button w-full">
          <span id="audio-icon">🔇</span> <span id="audio-text">Off</span>
        </button>
        <div class="flex items-center space-x-2">
          <label class="text-xs text-gray-400">Volume:</label>
          <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="0.5"
                 class="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer">
          <span id="volume-value" class="text-xs text-gray-400 w-8">50%</span>
        </div>
      </div>
    `;

    this.controls.set('audio', {
      id: 'audio',
      title: 'Audio',
      container,
      visible: true
    });

    this.setupAudioEvents();
  }

  private setupAnimationEvents() {
    const playPauseBtn = document.getElementById('play-pause-btn') as HTMLButtonElement;
    const resetBtn = document.getElementById('reset-animation-btn') as HTMLButtonElement;
    const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
    const speedValue = document.getElementById('speed-value') as HTMLSpanElement;

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        const isCurrentlyPlaying = animationSys.getIsPlaying();
        if (isCurrentlyPlaying) {
          animationSys.pause();
        } else {
          animationSys.play();
        }
        configManager.set('animation.isPlaying', !isCurrentlyPlaying);
        this.updatePlayPauseButton(!isCurrentlyPlaying);
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        animationSys.reset();
      });
    }

    if (speedSlider && speedValue) {
      speedSlider.addEventListener('input', (e) => {
        const speed = parseFloat((e.target as HTMLInputElement).value);
        configManager.set('animation.speedFactor', speed);
        speedValue.textContent = speed.toFixed(1);
      });
    }

    // 监听动画状态变化
    eventBus.on('animation-state-changed', (isPlaying: boolean) => {
      this.updatePlayPauseButton(isPlaying);
    });
  }

  private setupCameraEvents() {
    const autoBtn = document.getElementById('camera-auto-btn') as HTMLButtonElement;
    const frontBtn = document.getElementById('camera-front-btn') as HTMLButtonElement;
    const topBtn = document.getElementById('camera-top-btn') as HTMLButtonElement;
    const sideBtn = document.getElementById('camera-side-btn') as HTMLButtonElement;

    const setCameraActive = (activeBtn: HTMLButtonElement) => {
      [autoBtn, frontBtn, topBtn, sideBtn].forEach(btn => {
        if (btn) btn.classList.remove('active');
      });
      if (activeBtn) activeBtn.classList.add('active');
    };

    if (autoBtn) {
      autoBtn.addEventListener('click', () => {
        cameraSys.setAutoRotate(true);
        configManager.set('camera.autoRotate', true);
        setCameraActive(autoBtn);
      });
    }

    if (frontBtn) {
      frontBtn.addEventListener('click', () => {
        cameraSys.setAutoRotate(false);
        cameraSys.setView('front');
        configManager.set('camera.autoRotate', false);
        setCameraActive(frontBtn);
      });
    }

    if (topBtn) {
      topBtn.addEventListener('click', () => {
        cameraSys.setAutoRotate(false);
        cameraSys.setView('top');
        configManager.set('camera.autoRotate', false);
        setCameraActive(topBtn);
      });
    }

    if (sideBtn) {
      sideBtn.addEventListener('click', () => {
        cameraSys.setAutoRotate(false);
        cameraSys.setView('side');
        configManager.set('camera.autoRotate', false);
        setCameraActive(sideBtn);
      });
    }
  }

  private setupPresetEvents() {
    const presetSelect = document.getElementById('preset-select') as HTMLSelectElement;
    const loadBtn = document.getElementById('load-preset-btn') as HTMLButtonElement;
    const saveBtn = document.getElementById('save-preset-btn') as HTMLButtonElement;

    if (loadBtn && presetSelect) {
      loadBtn.addEventListener('click', () => {
        const presetName = presetSelect.value;
        if (presetName) {
          presetManager.loadPreset(presetName);
          console.log(`📂 Preset loaded: ${presetName}`);
        }
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const presetName = prompt('Enter preset name:');
        if (presetName) {
          presetManager.savePreset(presetName);
          console.log(`💾 Preset saved: ${presetName}`);
          // 更新预设列表
          this.refreshPresetList();
        }
      });
    }
  }

  private setupAudioEvents() {
    const audioToggleBtn = document.getElementById('audio-toggle-btn') as HTMLButtonElement;
    const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
    const volumeValue = document.getElementById('volume-value') as HTMLSpanElement;

    if (audioToggleBtn) {
      audioToggleBtn.addEventListener('click', () => {
        const isMuted = audioSys.toggleMute();
        configManager.set('audio.isMuted', isMuted);
        configManager.set('audio.volume', audioSys.getVolume());
        this.updateAudioButton(!isMuted);
      });
    }

    if (volumeSlider && volumeValue) {
      volumeSlider.addEventListener('input', (e) => {
        const volume = parseFloat((e.target as HTMLInputElement).value);
        audioSys.setVolume(volume);
        configManager.set('audio.volume', volume);
        configManager.set('audio.isMuted', volume === 0);
        volumeValue.textContent = Math.round(volume * 100) + '%';
      });
    }

    // 监听音频状态变化
    eventBus.on('audio-state-changed', (isPlaying: boolean) => {
      this.updateAudioButton(isPlaying);
    });
  }

  private updatePlayPauseButton(isPlaying: boolean) {
    const playIcon = document.getElementById('play-icon');
    const playText = document.getElementById('play-text');

    if (playIcon && playText) {
      if (isPlaying) {
        playIcon.textContent = '⏸️';
        playText.textContent = 'Pause';
      } else {
        playIcon.textContent = '▶️';
        playText.textContent = 'Play';
      }
    }
  }

  private updateAudioButton(isPlaying: boolean) {
    const audioIcon = document.getElementById('audio-icon');
    const audioText = document.getElementById('audio-text');

    if (audioIcon && audioText) {
      if (isPlaying) {
        audioIcon.textContent = '🔊';
        audioText.textContent = 'On';
      } else {
        audioIcon.textContent = '🔇';
        audioText.textContent = 'Off';
      }
    }
  }

  private refreshPresetList() {
    const presetSelect = document.getElementById('preset-select') as HTMLSelectElement;
    if (presetSelect) {
      const presets = presetManager.getAvailablePresets();
      const currentValue = presetSelect.value;
      presetSelect.innerHTML = presets.map(preset =>
        `<option value="${preset}" ${preset === currentValue ? 'selected' : ''}>${preset}</option>`
      ).join('');
    }
  }

  private setupEventListeners() {
    // 监听配置变化事件
    eventBus.on('config-changed', (event: ConfigEvent) => {
      this.handleConfigChange(event);
    });

    // 监听预设加载/保存事件
    eventBus.on('preset-loaded', (presetName: string) => {
      console.log(`📂 Preset loaded: ${presetName}`);
    });

    eventBus.on('preset-saved', (presetName: string) => {
      console.log(`💾 Preset saved: ${presetName}`);
    });
  }

  private handleConfigChange(event: ConfigEvent) {
    // 根据配置变化更新UI状态
    switch (event.key) {
      case 'animation.isPlaying':
        this.updatePlayPauseButton(event.newValue);
        break;
      case 'animation.speedFactor':
        const speedSlider = document.getElementById('speed-slider') as HTMLInputElement;
        const speedValue = document.getElementById('speed-value') as HTMLSpanElement;
        if (speedSlider && speedValue) {
          speedSlider.value = event.newValue.toString();
          speedValue.textContent = event.newValue.toFixed(1);
        }
        break;
      case 'audio.isMuted':
        this.updateAudioButton(!event.newValue);
        break;
      case 'audio.volume':
        const volumeSlider = document.getElementById('volume-slider') as HTMLInputElement;
        const volumeValue = document.getElementById('volume-value') as HTMLSpanElement;
        if (volumeSlider && volumeValue) {
          volumeSlider.value = event.newValue.toString();
          volumeValue.textContent = Math.round(event.newValue * 100) + '%';
        }
        break;
      case 'camera.autoRotate':
        const autoBtn = document.getElementById('camera-auto-btn') as HTMLButtonElement;
        if (autoBtn) {
          if (event.newValue) {
            autoBtn.classList.add('active');
          } else {
            autoBtn.classList.remove('active');
          }
        }
        break;
    }
  }

  /**
   * 显示/隐藏特定控件
   */
  public toggleControl(controlId: string, visible?: boolean) {
    const control = this.controls.get(controlId);
    if (control) {
      const isVisible = visible !== undefined ? visible : !control.visible;
      control.visible = isVisible;
      control.container.style.display = isVisible ? 'block' : 'none';
    }
  }

  /**
   * 显示/隐藏所有控件
   */
  public toggleAllControls(visible?: boolean) {
    this.controls.forEach((control) => {
      this.toggleControl(control.id, visible);
    });
  }

  /**
   * 获取控件状态
   */
  public getControlState() {
    const state: Record<string, boolean> = {};
    this.controls.forEach((control) => {
      state[control.id] = control.visible;
    });
    return state;
  }

  /**
   * 清理资源
   */
  public dispose() {
    this.controls.clear();
    eventBus.off('config-changed', (event: ConfigEvent) => {
      this.handleConfigChange(event);
    });
  }
}

// 导出单例实例
export const userUI = new UserUI();