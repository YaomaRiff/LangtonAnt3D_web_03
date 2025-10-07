/**
 * @file preset-manager.js
 * @description 预设管理器 - 基于完整配置快照 + 事件触发机制
 * ✅ 修复：
 *   1. savePreset() 只保存UI相关配置，排除运行时数据
 *   2. loadPreset() 触发所有相关事件，确保UI和系统同步
 */
import config from './config.js';
import logger from './utils/logger.js';
import eventBus from './event-bus.js';
import uiRegistry from './ui/ui-registry.js';

class PresetManager {
  constructor() {
    this.initialized = false;
    this.availablePresets = [];
    this.currentPreset = null;
    this.presetBaseUrl = '/presets';
  }

  async init() {
    if (this.initialized) {
      logger.warn('PresetManager', '预设管理器已初始化');
      return this;
    }

    try {
      await this._scanPresets();
      
      this.initialized = true;
      logger.info('PresetManager', `预设管理器已初始化 | 发现 ${this.availablePresets.length} 个预设`);
      
      return this;
    } catch (err) {
      logger.error('PresetManager', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  async _scanPresets() {
    try {
      const presetFiles = [
        '01.json',
        '02.json',
        '03.json'
      ];

      this.availablePresets = presetFiles.map(filename => ({
        name: filename.replace('.json', ''),
        filename: filename,
        path: `${this.presetBaseUrl}/${filename}`
      }));

    } catch (err) {
      logger.warn('PresetManager', `扫描预设失败: ${err.message}`);
      this.availablePresets = [];
    }
  }

  getAvailablePresets() {
    return this.availablePresets;
  }

  async loadPreset(presetName) {
    try {
      const preset = this.availablePresets.find(p => p.name === presetName);
      if (!preset) {
        throw new Error(`预设不存在: ${presetName}`);
      }

      logger.info('PresetManager', `正在加载预设: ${presetName}`);

      const response = await fetch(preset.path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presetData = await response.json();
      
      // 1. 应用配置到内存
      this._applyPresetToConfig(presetData);

      // 2. 触发系统事件(让系统先更新状态)
      this._emitConfigEvents(presetData);

      // 3. 更新当前预设标记
      this.currentPreset = presetName;
      
      // 4. 最后通知UI刷新
      eventBus.emit('preset-loaded', { name: presetName, data: presetData });
      
      logger.info('PresetManager', `✅ 预设已加载: ${presetName}`);
      
      return presetData;
    } catch (err) {
      logger.error('PresetManager', `加载预设失败: ${err.message}`);
      throw err;
    }
  }

  _applyPresetToConfig(presetData) {
    if (!presetData || typeof presetData !== 'object') {
      throw new Error('预设数据格式无效');
    }

    const configData = config.getRaw();

    // 深度合并（保留未在预设中定义的字段）
    Object.keys(presetData).forEach(key => {
      // 跳过元数据字段
      if (key === 'name' || key === 'timestamp') {
        return;
      }
      
      if (typeof presetData[key] === 'object' && !Array.isArray(presetData[key])) {
        configData[key] = {
          ...configData[key],
          ...JSON.parse(JSON.stringify(presetData[key]))
        };
      } else {
        configData[key] = JSON.parse(JSON.stringify(presetData[key]));
      }
    });

    logger.debug('PresetManager', '配置已更新');
    
  }

  /**
   * 核心方法：根据预设数据发送所有相关事件
   */
  _emitConfigEvents(presetData) {
    // ========== 粒子系统事件 ==========
    if (presetData.particles) {
      if (presetData.particles.dustColor) {
        eventBus.emit('dust-color-changed', presetData.particles.dustColor);
      }
      if (presetData.particles.dustSize !== undefined) {
        eventBus.emit('dust-size-changed', presetData.particles.dustSize);
      }
      if (presetData.particles.dustOpacity !== undefined) {
        eventBus.emit('dust-opacity-changed', presetData.particles.dustOpacity);
      }
      if (presetData.particles.dustCount !== undefined) {
        eventBus.emit('dust-count-changed', presetData.particles.dustCount);
      }
      if (presetData.particles.systemScale !== undefined) {
        eventBus.emit('particle-system-scale-changed', presetData.particles.systemScale);
      }
      if (presetData.particles.breathIntensity !== undefined) {
        eventBus.emit('particle-breath-intensity-changed', presetData.particles.breathIntensity);
      }
      if (presetData.particles.floatIntensity !== undefined) {
        eventBus.emit('particle-float-intensity-changed', presetData.particles.floatIntensity);
      }
      if (presetData.particles.rotationSpeed !== undefined) {
        eventBus.emit('rotation-speed-changed', presetData.particles.rotationSpeed);
      }
      if (presetData.particles.rotationTiltXZ !== undefined) {
        eventBus.emit('rotation-tilt-xz-changed', presetData.particles.rotationTiltXZ);
      }
      if (presetData.particles.rotationTiltXY !== undefined) {
        eventBus.emit('rotation-tilt-xy-changed', presetData.particles.rotationTiltXY);
      }
      if (presetData.particles.pathPointColor) {
        eventBus.emit('path-point-color-changed', presetData.particles.pathPointColor);
      }
      if (presetData.particles.pathPointSize !== undefined) {
        eventBus.emit('path-point-size-changed', presetData.particles.pathPointSize);
      }
    }

    // ========== 路径系统事件 ==========
    if (presetData.path) {
      if (presetData.path.scale !== undefined) {
        eventBus.emit('path-scale-changed', presetData.path.scale);
      }
      if (presetData.path.depthIntensity !== undefined) {
        eventBus.emit('path-depth-intensity-changed', presetData.path.depthIntensity);
      }
    }

    // ========== 环境系统事件 ==========
    if (presetData.environment) {
      if (presetData.environment.bgColor) {
        eventBus.emit('bg-color-changed', presetData.environment.bgColor);
      }
      if (presetData.environment.pathColor) {
        eventBus.emit('path-color-changed', presetData.environment.pathColor);
      }
    }

    // ========== 材质系统事件 ==========
    if (presetData.material) {
      if (presetData.material.path) {
        eventBus.emit('material-glow-enabled-changed', {
          target: 'path',
          enabled: presetData.material.path.enabled
        });
        if (presetData.material.path.emissiveIntensity !== undefined) {
          eventBus.emit('material-glow-intensity-changed', {
            target: 'path',
            intensity: presetData.material.path.emissiveIntensity
          });
        }
      }
      if (presetData.material.particles) {
        eventBus.emit('material-glow-enabled-changed', {
          target: 'particles',
          enabled: presetData.material.particles.enabled
        });
        if (presetData.material.particles.emissiveIntensity !== undefined) {
          eventBus.emit('particle-emissive-intensity-changed', 
            presetData.material.particles.emissiveIntensity
          );
        }
      }
      if (presetData.material.movingLight) {
        eventBus.emit('material-glow-enabled-changed', {
          target: 'movingLight',
          enabled: presetData.material.movingLight.enabled
        });
        if (presetData.material.movingLight.emissiveIntensity !== undefined) {
          eventBus.emit('moving-light-emissive-intensity-changed',
            presetData.material.movingLight.emissiveIntensity
          );
        }
      }
    }

    // ========== 坐标系统事件 ==========
    if (presetData.coordinates?.dataSpace) {
      if (presetData.coordinates.dataSpace.scale !== undefined) {
        eventBus.emit('dataspace-scale-changed', presetData.coordinates.dataSpace.scale);
      }
      if (presetData.coordinates.dataSpace.rotation) {
        const rot = presetData.coordinates.dataSpace.rotation;
        ['x', 'y', 'z'].forEach(axis => {
          if (rot[axis] !== undefined) {
            eventBus.emit('dataspace-rotation-changed', { axis, angle: rot[axis] });
          }
        });
      }
      if (presetData.coordinates.dataSpace.position) {
        eventBus.emit('dataspace-position-changed', presetData.coordinates.dataSpace.position);
      }
    }

    // ========== 后处理事件 ==========
    if (presetData.postprocess) {
      // Bloom
      if (presetData.postprocess.bloom) {
        // ✅ Bloom 事件已删除(使用选择性辉光系统)
      }
      
      // 色相饱和度
      if (presetData.postprocess.hueSaturation) {
        eventBus.emit('hue-saturation-enabled-changed', 
          presetData.postprocess.hueSaturation.enabled
        );
        if (presetData.postprocess.hueSaturation.hue !== undefined) {
          eventBus.emit('hue-changed', presetData.postprocess.hueSaturation.hue);
        }
        if (presetData.postprocess.hueSaturation.saturation !== undefined) {
          eventBus.emit('saturation-changed', presetData.postprocess.hueSaturation.saturation);
        }
      }
      
      // 亮度对比度
      if (presetData.postprocess.brightnessContrast) {
        eventBus.emit('brightness-contrast-enabled-changed',
          presetData.postprocess.brightnessContrast.enabled
        );
        if (presetData.postprocess.brightnessContrast.brightness !== undefined) {
          eventBus.emit('brightness-changed', presetData.postprocess.brightnessContrast.brightness);
        }
        if (presetData.postprocess.brightnessContrast.contrast !== undefined) {
          eventBus.emit('contrast-changed', presetData.postprocess.brightnessContrast.contrast);
        }
      }
      
      // 噪点
      if (presetData.postprocess.noise) {
        eventBus.emit('noise-enabled-changed', presetData.postprocess.noise.enabled);
        if (presetData.postprocess.noise.intensity !== undefined) {
          eventBus.emit('noise-intensity-changed', presetData.postprocess.noise.intensity);
        }
      }
      
      // 色差
      if (presetData.postprocess.chromaticAberration) {
        eventBus.emit('chromatic-aberration-enabled-changed',
          presetData.postprocess.chromaticAberration.enabled
        );
        if (presetData.postprocess.chromaticAberration.offsetX !== undefined ||
            presetData.postprocess.chromaticAberration.offsetY !== undefined) {
          eventBus.emit('chromatic-aberration-offset-changed', {
            x: presetData.postprocess.chromaticAberration.offsetX || 0,
            y: presetData.postprocess.chromaticAberration.offsetY || 0
          });
        }
      }
      
      // 扫描线
      if (presetData.postprocess.scanline) {
        eventBus.emit('scanline-enabled-changed', presetData.postprocess.scanline.enabled);
        if (presetData.postprocess.scanline.intensity !== undefined) {
          eventBus.emit('scanline-intensity-changed', presetData.postprocess.scanline.intensity);
        }
        if (presetData.postprocess.scanline.density !== undefined) {
          eventBus.emit('scanline-density-changed', presetData.postprocess.scanline.density);
        }
      }
    }

    // ========== 相机事件 ==========
    if (presetData.camera) {
      if (presetData.camera.mode) {
        eventBus.emit('camera-mode-changed', presetData.camera.mode);
      }
      if (presetData.camera.fov !== undefined) {
        eventBus.emit('camera-fov-changed', presetData.camera.fov);
      }
    }

    // ========== 动画事件 ==========
    if (presetData.animation) {
      if (presetData.animation.speedFactor !== undefined) {
        eventBus.emit('animation-speed-changed', presetData.animation.speedFactor);
      }
      if (presetData.animation.loop !== undefined) {
        eventBus.emit('animation-loop-changed', presetData.animation.loop);
      }
    }

    logger.info('PresetManager', '✅ 所有事件已触发');
  }

  /**
   * 保存预设（只保存UI相关配置，排除运行时数据）
   */
  /**
   * ✅ 核心改动:从UIRegistry自动提取预设数据
   * 排除: data.*, animation.*, audio.*
   */
  savePreset(presetName) {
    if (!presetName || typeof presetName !== 'string') {
      throw new Error('预设名称无效');
    }

    try {
      const presetData = {
        name: presetName,
        timestamp: new Date().toISOString()
      };

      // ✅ 从UIRegistry收集所有控件路径
      const allPaths = uiRegistry.getAllControls();
      logger.info('PresetManager', `准备保存 ${allPaths.length} 个控件的数据`);

      // ✅ 根据路径提取配置值
      const configSnapshot = config.getRaw();
      allPaths.forEach(path => {
        const value = this._getNestedValue(configSnapshot, path);
        if (value !== undefined) {
          this._setNestedValue(presetData, path, value);
        }
      });

      // 导出JSON
      const jsonContent = JSON.stringify(presetData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${presetName}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      logger.info('PresetManager', `✅ 预设已保存: ${presetName}.json`);
      eventBus.emit('preset-saved', { name: presetName });

    } catch (err) {
      logger.error('PresetManager', `保存预设失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * ✅ 辅助方法:根据路径获取嵌套值(例如 "particles.dustColor")
   */
  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }
    return value;
  }

  /**
   * ✅ 辅助方法:根据路径设置嵌套值
   */
  _setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let target = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }
    
    target[keys[keys.length - 1]] = JSON.parse(JSON.stringify(value));
  }

  getCurrentPreset() {
    return this.currentPreset;
  }

  dispose() {
    this.availablePresets = [];
    this.currentPreset = null;
    this.initialized = false;
    logger.info('PresetManager', '预设管理器已销毁');
  }
}

const presetManager = new PresetManager();
export default presetManager;
