/**
 * @file config.js
 * @description 配置管理器 - 全局配置存储与访问
 * ✅ 新增: sceneComposition 结构，用于定义场景内容
 */
import logger from './utils/logger.js';
import eventBus from './event-bus.js';

const DEFAULT_CONFIG = {
  // 🟢 新增：场景构成定义
  sceneComposition: {
    active: 'defaultMath', // 当前激活的构成方案
    compositions: {
      defaultMath: [ // 默认的数学可视化场景
        { type: 'math-path', enabled: true },
        { type: 'math-light', enabled: true },
        { type: 'particle-dust', enabled: true }
      ],
      // 预留一个模型场景的例子，未来使用
      modelAnt: [
        { type: 'model', name: 'ant', path: '/models/ant.glb', enabled: true },
        { type: 'particle-dust', enabled: false }
      ]
    }
  },

  data: {
    csvUrl: '../data/data.csv',
    antData: [],
    mappedPoints: [],
    availableDatasets: []
  },
  
  animation: {
    currentStep: 0,
    lerpT: 0,
    animating: false,
    speedFactor: 1.65,
    loop: true
  },

  coordinates: {
    dataSpace: {
      scale: 1.4,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 }
    }
  },
  
  material: {
    path: {
      enabled: true,
      emissiveIntensity: 0.8,
      emissiveColor: '#F0B7B7'
    },
    particles: {
      enabled: true,
      emissiveIntensity: 0.3,
      emissiveColor: '#AF85B7'
    },
    movingLight: {
      enabled: true,
      emissiveIntensity: 1.5,
      emissiveColor: '#FFFFFF'
    }
  },

  lighting: {
    ambient: {
      color: '#ffffff',
      intensity: 0.2
    },
    directional: {
      color: '#ffffff',
      intensity: 1.0,
      position: { x: 5, y: 10, z: 7.5 }
    }
  },

  particles: {
    floatIntensity: 0.2,
    breathIntensity: 0.1,
    dustCount: 3000,
    dustSize: 0.6,
    dustOpacity: 0.6,
    dustColor: '#AF85B7',
    pathPointSize: 0.5,
    pathPointOpacity: 0.9,
    pathPointColor: '#FFFFFF',
    sphereRadius: 1400,
    systemScale: 1.0,
    rotationSpeed: 0,
    rotationTiltXZ: 0,
    rotationTiltXY: 0
  },
  
  path: {
    depthIntensity: 0.5,
    depthEnhanced: true,
    scale: 1.0
  },
  
  environment: {
    skybox: {
      enabled: true,
      path: '/skybox/Medium_Monochrome_Nebulae/'
    },
    fogDensity: 0.015,
    fogVolumeScale: 1.0,
    pathFogIntensity: 0.1,
    pathColor: '#F0B7B7',
    dustColor: '#AF85B7',
    positionScale: 2.0,
    yScale: 1.0,
    cameraDistFactor: 2.5,
    ambientLightIntensity: 0.5,
    directionalLightIntensity: 0.8
  },
  
  postprocess: {
    enabled: true,
    hueSaturation: { enabled: false, hue: 0.0, saturation: 0.0 },
    brightnessContrast: { enabled: false, brightness: 0.0, contrast: 0.0 },
    noise: { enabled: false, intensity: 0.02 },
    chromaticAberration: { enabled: false, offsetX: 0.002, offsetY: 0.002 },
    scanline: { enabled: false, intensity: 0.1, density: 100 }
  },
  
  camera: {
    mode: 'perspective',
    view: 'free',
    fov: 75,
    position: { x: 0, y: 0, z: 10 },
    near: 0.1,
    far: 2000,
    controls: {
      enabled: true,
      dollySpeed: 1.0,
      truckSpeed: 1.0,
      smoothTime: 0.05,
      draggingSmoothTime: 0.25,
      minDistance: 1,
      maxDistance: 100
    }
  }
};

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

class ConfigManager {
  constructor() {
    this._config = deepClone(DEFAULT_CONFIG);
    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      logger.warn('Config', '配置已经初始化过了');
      return;
    }
    
    try {
      this._config = deepClone(DEFAULT_CONFIG);
      this.initialized = true;
      logger.info('Config', '配置初始化完成');
    } catch (err) {
      logger.error('Config', `配置初始化失败: ${err.message}`);
      throw err;
    }
  }

  getRaw() {
    return this._config;
  }

  get(key) {
    try {
      if (!key) return this._config;
      const keys = key.split('.');
      let value = this._config;
      for (const k of keys) {
        if (value === null || value === undefined) return null;
        value = value[k];
      }
      return value;
    } catch (err) {
      logger.error('Config', `获取配置异常 [${key}]: ${err.message}`);
      return null;
    }
  }

  set(key, value) {
    try {
      if (!key) {
        logger.error('Config', '设置配置失败: key 不能为空');
        return false;
      }
      const keys = key.split('.');
      let target = this._config;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!target[k] || typeof target[k] !== 'object') {
          target[k] = {};
        }
        target = target[k];
      }
      const lastKey = keys[keys.length - 1];
      if (target[lastKey] !== value) {
        target[lastKey] = value;
        eventBus.emit('config-changed', { key, value });
        logger.debug('Config', `配置已更新: ${key} = ${JSON.stringify(value)}`);
      }
      return true;
    } catch (err) {
      logger.error('Config', `设置配置异常 [${key}]: ${err.message}`);
      return false;
    }
  }

  applyPresetData(presetData) {
    logger.warn('Config', 'applyPresetData 已被弃用，请使用 PresetManager 的新加载逻辑');
    return true;
  }

  reset() {
    const oldConfig = this._config;
    this._config = deepClone(DEFAULT_CONFIG);
    logger.info('Config', '配置已重置为默认值');
    
    // 触发所有顶级key的更新通知
    Object.keys(DEFAULT_CONFIG).forEach(topKey => {
        // 比较新旧值，只有变化时才发出事件，避免不必要的刷新
        if (JSON.stringify(oldConfig[topKey]) !== JSON.stringify(DEFAULT_CONFIG[topKey])) {
            eventBus.emit('config-changed', { key: topKey, value: DEFAULT_CONFIG[topKey] });
        }
    });
  }
}

const configManager = new ConfigManager();
export default configManager;
export const initConfig = () => configManager.init();
export const get = (key) => configManager.get(key);
export const set = (key, value) => configManager.set(key, value);
export const getRaw = () => configManager.getRaw();
export const applyPresetData = (data) => configManager.applyPresetData(data);
export const reset = () => configManager.reset();
