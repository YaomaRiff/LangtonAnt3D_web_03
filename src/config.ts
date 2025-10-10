/**
 * @file config.ts
 * @description 配置管理器 - 全局配置存储与访问
 * 🔧 修正: 对 set 方法中的日志进行节流处理，防止UI拖动时刷屏。
 * ✨ 重构: 移除了旧的材质辉光相关配置 (emissiveIntensity)，辉光效果由 postprocess.bloom 统一控制。
 * 🔧 清理: 移除了 dotScreen 和 hueSaturation 的配置项。
 */
import logger from './utils/logger';
import eventBus from './event-bus';

const DEFAULT_CONFIG = {
  // 🟢 新增：场景构成定义
  sceneComposition: {
    active: 'defaultMath', // 当前激活的构成方案
    compositions: {
      defaultMath: [
        // 默认的数学可视化场景
        { type: 'math-path', enabled: true },
        { type: 'math-light', enabled: true },
        { type: 'particle-dust', enabled: true },
      ],
      // 预留一个模型场景的例子，未来使用
      modelAnt: [
        { type: 'model', name: 'ant', path: '/models/ant.glb', enabled: true },
        { type: 'particle-dust', enabled: false },
      ],
    },
  },

  data: {
    csvUrl: '../data/data.csv',
    availableDatasets: [],
  },

  animation: {
    speedFactor: 1.65,
    loop: true,
  },

  coordinates: {
    dataSpace: {
      scale: 1.4,
      rotation: { x: 0, y: 0, z: 0 },
      position: { x: 0, y: 0, z: 0 },
    },
  },

  material: {
    path: {
      emissiveColor: '#F0B7B7',
    },
    particles: {
      emissiveColor: '#AF85B7',
    },
    movingLight: {
      emissiveColor: '#FFFFFF',
    },
  },

  lighting: {
    ambient: {
      color: '#ffffff',
      intensity: 0.2,
    },
    directional: {
      color: '#ffffff',
      intensity: 1.0,
      position: { x: 5, y: 10, z: 7.5 },
    },
  },

  particles: {
    floatIntensity: 0.2,
    breathIntensity: 0.1,
    dustCount: 3000,
    dustSize: 0.6,
    dustOpacity: 0.6,
    dustColor: '#AF85B7',
    pathPointColor: '#F0B7B7',
    pathPointSize: 0.5,
    pathPointOpacity: 0.9,
    sphereRadius: 1400,
    systemScale: 1.0,
    rotationSpeed: 0,
    rotationTiltXZ: 0,
    rotationTiltXY: 0,
  },

  path: {
    depthIntensity: 0.5,
    depthEnhanced: true,
    scale: 1.0,
  },

  environment: {
    skybox: {
      enabled: true,
      path: '/skybox/Medium_Monochrome_Nebulae/',
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
    directionalLightIntensity: 0.8,
  },

  postprocess: {
    enabled: true,

    // 光晕效果 (Bloom)
    bloom: {
      enabled: false,
      intensity: 1.0, // 效果强度
      luminanceThreshold: 0.1, // 亮度阈值
      luminanceSmoothing: 0.2, // 阈值平滑度
      mipmapBlur: true, // 是否使用 Mipmap 模糊
    },

    // 景深效果 (Bokeh)
    bokeh: {
      enabled: false,
      focus: 40.0, // 焦距
      dof: 0.02, // 景深范围
      aperture: 0.025, // 光圈大小
      maxBlur: 0.01, // 最大模糊
    },

    // 色差效果 (Chromatic Aberration)
    chromaticAberration: {
      enabled: false,
      offset: { x: 0.001, y: 0.001 }, // 颜色偏移量
    },

    // 胶片效果 (Film) - 替代旧的 Noise 和 Scanline
    film: {
      enabled: false,
      scanlineIntensity: 0.3, // 扫描线强度
      noiseIntensity: 0.3, // 噪点强度
      scanlineCount: 2048, // 扫描线数量
      grayscale: false, // 是否灰度
    },

    // 色彩调整效果
    brightnessContrast: { enabled: false, brightness: 0.0, contrast: 0.0 },
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
      maxDistance: 100,
    },
  },
};

function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));
  const cloned: any = {};
  for (const key in obj) {
    if ((obj as Object).hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

class ConfigManager {
  private _config: any;
  private initialized: boolean;

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
    } catch (err: unknown) {
      logger.error('Config', `配置初始化失败: ${(err as Error).message}`);
      throw err as Error;
    }
  }

  getRaw(): any {
    return this._config;
  }

  get(key?: string): any {
    try {
      if (!key) return this._config;
      const keys = key.split('.');
      let value: any = this._config as any;
      for (const k of keys) {
        if (!k) continue; // ✅ 跳过空字符串
        if (value === null || value === undefined) return null;
        if (value) value = value[k];
      }
      return value;
    } catch (err: unknown) {
      logger.error('Config', `获取配置异常 [${key}]: ${(err as Error).message}`);
      return null;
    }
  }

  set(key: string, value: any) {
    try {
      if (!key) {
        logger.error('Config', '设置配置失败: key 不能为空');
        return false;
      }
      const keys = key.split('.');
      let target: any = this._config as any;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!k) continue; // ✅ 跳过 undefined
        if (k && (!target[k] || typeof target[k] !== 'object')) {
          target[k] = {};
        }
        target = target[k];
      }
      const lastKey = keys[keys.length - 1]!; // ✅ 非空断言
      if (target[lastKey!] !== value) {
        target[lastKey!] = value;
        eventBus.emit('config-changed', { key, value });

        // ✅ 核心修正: 使用节流日志替换普通日志，防止刷屏
        const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
        logger.debugThrottled(
          'Config',
          `config-set:${key}`, // 使用唯一的 key 来节流
          `配置已更新: ${key} = ${valueStr}`,
          1500 // 每 1.5 秒最多打印一次
        );
      }
      return true;
    } catch (err: unknown) {
      logger.error('Config', `设置配置异常 [${key}]: ${(err as Error).message}`);
      return false;
    }
  }

  applyPresetData(_presetData: any) {
    logger.warn('Config', 'applyPresetData 已被弃用，请使用 PresetManager 的新加载逻辑');
    return true;
  }

  reset() {
    const oldConfig = this._config;
    this._config = deepClone(DEFAULT_CONFIG);
    logger.info('Config', '配置已重置为默认值');

    // 触发所有顶级key的更新通知
    Object.keys(DEFAULT_CONFIG as any).forEach((topKey: string) => {
      // 比较新旧值，只有变化时才发出事件，避免不必要的刷新
      if (
        JSON.stringify((oldConfig as any)[topKey]) !==
        JSON.stringify((DEFAULT_CONFIG as any)[topKey])
      ) {
        eventBus.emit('config-changed', { key: topKey, value: (DEFAULT_CONFIG as any)[topKey] });
      }
    });
  }
}

const configManager = new ConfigManager();
export default configManager;

// 保持原有的快捷导出不变
export const initConfig = () => configManager.init();
export const get = (key?: string): any => configManager.get(key);
export const set = (key: string, value: any) => configManager.set(key, value);
export const getRaw = (): any => configManager.getRaw();
export const applyPresetData = (data: any) => configManager.applyPresetData(data);
export const reset = () => configManager.reset();
