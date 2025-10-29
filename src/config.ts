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
  // 场景构成定义
  sceneComposition: {
    active: 'modelAnt', // 当前激活的构成方案
    compositions: {
      defaultMath: [
        // 默认的数学可视化场景
        { type: 'math-path', enabled: true },
        { type: 'math-light', enabled: true },
        { type: 'particle-dust', enabled: true },
      ],
      // 预留一个模型场景的例子，未来使用
      modelAnt: [
        { type: 'math-path', enabled: true }, // 保留路径
        { type: 'model-light', enabled: true }, // 使用模型光点
        { type: 'particle-dust', enabled: true },
      ],
    },
  },

  exhaust: {
    // 新增：调试工具配置
    debug: {
      showEmitterAxis: false, // 是否显示发射器坐标轴
      axisSize: 0.6, // 坐标轴大小
    },
    flame: {
      baseColor: '#ff0055', // 尾焰底部颜色（橙色）
      tipColor: '#d4e83c', // 尾焰顶部颜色（黄色）
      intensity: 1.0, // 基础强度
      speedMultiplier: 0.3, // 速度对强度的影响系数
      length: 1.6, // 尾焰长度
      radius: 0.2, // 尾焰半径
      offsetX: 0, // 火箭坐标到尾焰底面的 X 偏移
      offsetY: -0.8, // 火箭坐标到尾焰底面的 Y 偏移（负值表示向下）
      offsetZ: 0, // 火箭坐标到尾焰底面的 Z 偏移
    },
    smoke: {
      maxParticles: 0, // 最大粒子数
      emitRate: 8, // 每秒发射数量
      particleLifetime: 0.8, // 粒子寿命（秒）
      sizeGrowth: 0.8, // 尺寸增长速度

      initialSize: 0.3, // 粒子初始大小
      emitOnlyWhenMoving: false, // 是否只在移动时发射

      velocityMultiplier: 0.2, // 速度倍率
      initialVelocity: -0.5, // 初始速度（负值向后）
      randomSpread: 0.5, // 随机扩散半径
      swirlIntensity: 0.5, // 旋转扰动强度
      emitterOffsetX: 0, // 火箭坐标到烟雾发射器的 X 偏移
      emitterOffsetY: -2.5, // 火箭坐标到烟雾发射器的 Y 偏移
      emitterOffsetZ: 0, // 火箭坐标到烟雾发射器的 Z 偏移
    },
    vibration: {
      intensity: 0.03, // 震动强度（单位距离）
      frequency: 50, // 主震动频率（Hz）
      timeVariation: 0.3, // 时间随机性 [0-1]
    },
    // 火箭机体抖动配置
    rocketJitter: {
      intensity: 0.02, // 抖动球体半径
      frequency: 30, // 基础频率（Hz）
      timeVariation: 0.4, // 时间随机性 [0-1]
    },
    // 尾焰抖动配置
    flameJitter: {
      intensity: 0.05, // 抖动球体半径
      frequency: 60, // 基础频率（Hz）
      timeVariation: 0.5, // 时间随机性 [0-1]
    },
  },

  data: {
    csvUrl: '../data/data.csv',
    availableDatasets: [],
  },

  // 视觉效果控制
  visualEffects: {
    rocketJitter: {
      enabled: true,
      runOnReady: true, // 场景加载完就开始抖动
    },
    flameJitter: {
      enabled: true,
      runOnReady: true,
    },
    exhaustFlame: {
      enabled: true,
      runOnReady: true, // 尾焰始终显示
    },
  },

  animation: {
    speedFactor: 0.05,
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
      enabled: true,
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

  // 静态页面配置
  landingPage: {
    imageUrl: '', // 背景图片URL
    title: '(OUwNO)Ant', // 主标题
    subtitle: "Langton's Ant 3D Visualization", // 副标题
    customText: '', // 自定义文字内容
    buttonText: 'Start', // 按钮文字
    jumpUrl: '#main', // 跳转目标URL

    // 布局和位置配置
    layout: {
      // 毛玻璃面板位置和大小
      glassPanelPosition: 'center', // 位置: 'center', 'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
      glassPanelWidth: '80%', // 面板宽度
      glassPanelHeight: 'auto', // 面板高度
      glassPanelMaxWidth: '600px', // 最大宽度
      glassPanelMaxHeight: '80vh', // 最大高度
      fullScreenGlass: false, // 是否全屏毛玻璃
      glassTop: '50%', // 自定义顶部位置 (当position为自定义时使用)
      glassLeft: '50%', // 自定义左侧位置

      // 文字布局
      textAlign: 'center', // 文字对齐: 'left', 'center', 'right'
      titleMarginBottom: '16px', // 标题下边距
      subtitleMarginBottom: '20px', // 副标题下边距
      customTextMarginTop: '20px', // 自定义文字上边距
      customTextMarginBottom: '30px', // 自定义文字下边距

      // 按钮布局
      buttonAlign: 'center', // 按钮对齐: 'left', 'center', 'right'
      buttonMarginTop: '30px', // 按钮上边距
      buttonGap: '20px', // 按钮间距
      buttonWrap: 'wrap', // 按钮换行: 'wrap', 'nowrap'
    },

    // 毛玻璃效果参数
    glassPanel: {
      blur: 6, // 模糊程度 (0-50px)
      backgroundOpacity: 0.1, // 背景透明度 (0-1)
      borderOpacity: 0.2, // 边框透明度 (0-1)
      borderRadius: 20, // 圆角大小 (0-50px)
      padding: 40, // 内边距 (10-100px)
      backgroundR: 255, // 背景颜色 R (0-255)
      backgroundG: 255, // 背景颜色 G (0-255)
      backgroundB: 255, // 背景颜色 B (0-255)
    },

    // 高级毛玻璃效果
    advancedGlass: {
      noiseEnabled: true, // 是否启用噪点效果
      noiseOpacity: 0.02, // 噪点透明度 (0-0.1)
      chromaticAberration: 2, // 色差效果 (0-5px)
      frostedEnabled: true, // 是否启用磨砂效果
      frostedScale: 0.5, // 磨砂缩放 (0.5-2)
      reflectionEnabled: true, // 是否启用反射效果
      reflectionOpacity: 0.1, // 反射透明度 (0-0.3)
    },

    // 动画毛玻璃效果
    animatedGlass: {
      enabled: true, // 是否启用动画效果
      pulseEnabled: true, // 是否启用脉冲效果
      pulseSpeed: 5, // 脉冲速度 (0.5-5)
      pulseIntensity: 0.03, // 脉冲强度 (0-0.3)
      shimmerEnabled: false, // 是否启用微光效果
      shimmerSpeed: 10, // 微光速度 (1-10)
    },
  },

  camera: {
    mode: 'perspective',
    view: 'free',
    fov: 75,
    initialDistance: 5, // 相机到原点的距离
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
