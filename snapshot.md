# Project Snapshot
- Root: `.`
- Created: 2025-10-13 02:54:03
- Files: 49 (ext=[.js, .ts, .mjs, .json, .css, .html, .frag, .vert], maxSize=200000B)
- Force-Excluded: package-lock.json

---
## A. Directory Tree
```text
LangtonAnt3D_web_03/
├─ public/
│  ├─ data/
│  │  └─ manifest.json
│  ├─ presets/
│  │  └─ 01.json
│  ├─ manifest.json
├─ src/
│  ├─ systems/
│  │  ├─ renderers/
│  │  │  ├─ light-renderer.ts
│  │  │  ├─ math-light-renderer.ts
│  │  │  └─ model-light-renderer.ts
│  │  ├─ shaders/
│  │  │  ├─ path.frag
│  │  │  └─ path.vert
│  │  ├─ animation-sys.ts
│  │  ├─ audio-sys.ts
│  │  ├─ camera-sys.ts
│  │  ├─ controls-util.ts
│  │  ├─ coordinates-sys.ts
│  │  ├─ data-sys.ts
│  │  ├─ environment-sys.ts
│  │  ├─ light-sys.ts
│  │  ├─ lighting-sys.ts
│  │  ├─ material-sys.ts
│  │  ├─ model-sys.ts
│  │  ├─ particles-sys.ts
│  │  ├─ path-sys.ts
│  │  ├─ postprocess-sys.ts
│  │  ├─ scene-director-sys.ts
│  │  └─ state.ts
│  ├─ types/
│  │  └─ index.ts
│  ├─ ui/
│  │  ├─ ui-basic.ts
│  │  ├─ ui-container.ts
│  │  ├─ ui-coordinates.ts
│  │  ├─ ui-monitor.ts
│  │  ├─ ui-post.ts
│  │  ├─ ui-presets.ts
│  │  ├─ ui-registry.ts
│  │  └─ ui-scene.ts
│  ├─ utils/
│  │  ├─ logger.ts
│  │  └─ url-resolver.ts
│  ├─ config.ts
│  ├─ event-bus.ts
│  ├─ main.ts
│  ├─ preset-manager.ts
│  ├─ style.css
│  └─ vite-env.d.ts
├─ tools/
│  └─ snapshot.mjs
├─ .prettierrc.json
├─ eslint.config.js
├─ index.html
├─ package.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

---
## B. Files (selected types only)

### .prettierrc.json

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}

```

### eslint.config.js

```javascript
// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,

  {
    files: ['src/**/*.ts', 'src/**/*.js'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // 浏览器环境全局变量（扩充版）
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // ✅ 核心修复：添加 performance
        performance: 'readonly',

        // DOM API
        HTMLElement: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',

        // 浏览器弹窗
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',

        // 网络请求
        fetch: 'readonly',
        XMLHttpRequest: 'readonly',

        // 异步控制
        AbortController: 'readonly',
        AbortSignal: 'readonly',

        // 音频 API
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

      // 新增：放宽一些规则
      'no-prototype-builtins': 'off', // 允许使用 hasOwnProperty
      'no-case-declarations': 'off', // 允许 case 块中声明变量
    },
  },

  prettierConfig,
];

```

### index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>(OUwNO)Ant</title>

  <!-- Favicon and Theme Color -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
  <meta name="theme-color" content="#1a1a1a">
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
</head>
<body>

  <!-- ✅ 正确的结构: #main-layout 必须在 #app-wrapper 内部 -->
  <div id="app-wrapper">
        <div id="main-layout">
      <!-- 左侧控制面板 -->
      <div id="left-panel">
        <!-- UI 容器将在这里创建其内容 -->
      </div>
      
      <!-- 右侧监视器 -->
      <div id="monitor-container">
        <!-- 3D Canvas 将被添加到这里 -->

        <!-- 监视器覆盖层UI的挂载点 -->
        <div id="monitor-overlay-ui">
          <!-- ui-monitor.ts 将在这里创建内容 -->
        </div>
      </div>
    </div>
  </div>

  <script type="module" src="/src/main.ts"></script>
</body>
</html>

```

### package.json

```json
{
  "name": "langtonant3d-web-03",
  "private": true,
  "version": "0.2.5",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "snapshot": "node tools/snapshot.mjs --root . --out snapshot.md",
    "lint": "eslint src --ext .ts,.js",
    "lint:fix": "eslint src --ext .ts,.js --fix",
    "format": "prettier --write src/**/*.{ts,js}"
  },
  "devDependencies": {
    "@tweakpane/core": "^2.0.5",
    "@types/file-saver": "^2.0.7",
    "@types/howler": "^2.2.12",
    "@types/jszip": "^3.4.0",
    "@types/node": "^24.7.0",
    "@types/papaparse": "^5.3.16",
    "@types/three": "^0.180.0",
    "@types/tween.js": "^18.5.1",
    "@typescript-eslint/eslint-plugin": "^8.46.0",
    "@typescript-eslint/parser": "^8.46.0",
    "eslint": "^9.37.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "prettier": "^3.6.2",
    "typescript": "^5.9.3",
    "vite": "^5.4.10"
  },
  "dependencies": {
    "@tweenjs/tween.js": "^25.0.0",
    "camera-controls": "^3.1.0",
    "file-saver": "^2.0.5",
    "glsl-noise": "^0.0.0",
    "hotkeys-js": "^3.13.15",
    "howler": "^2.2.4",
    "idb-keyval": "^6.2.2",
    "jszip": "^3.10.1",
    "papaparse": "^5.5.3",
    "postprocessing": "^6.37.8",
    "terminal.css": "^0.7.5",
    "three": "^0.180.0",
    "three-mesh-bvh": "^0.9.1",
    "three-nebula": "^10.0.3",
    "three-stdlib": "^2.36.0",
    "troika-three-text": "^0.52.4",
    "tweakpane": "^4.0.5",
    "zod": "^4.1.11"
  },
  "overrides": {
    "three": "^0.180.0"
  }
}

```

### public/data/manifest.json

```json
[
  {
    "name": "双蚂蚁驱动",
    "path": "data/data.csv",
    "description": "测试用的数据。"
  }
]
```

### public/manifest.json

```json
{
  "name": "(OUwNO) Ant 3D Visualizer",
  "short_name": "(OUwNO)Ant",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

### public/presets/01.json

```json
{
  "name": "01",
  "timestamp": "2025-10-09T20:38:04.915Z",
  "animation": {
    "loop": true,
    "speedFactor": 3.3
  },
  "camera": {
    "fov": 75,
    "mode": "perspective"
  },
  "coordinates": {
    "dataSpace": {
      "scale": 2.6999999999999997
    }
  },
  "environment": {
    "pathColor": "#a5abca"
  },
  "particles": {
    "breathIntensity": 0.14,
    "dustColor": "#d2b5d7",
    "dustCount": 2000,
    "dustOpacity": 0.63,
    "dustSize": 0.6,
    "floatIntensity": 0.33,
    "pathPointColor": "#caddcb",
    "pathPointSize": 0.35000000000000003,
    "rotationSpeed": 0.1,
    "rotationTiltXY": -27,
    "rotationTiltXZ": 33,
    "systemScale": 1
  },
  "path": {
    "depthIntensity": 0.8300000000000001,
    "scale": 2.1
  },
  "postprocess": {
    "bloom": {
      "enabled": true,
      "intensity": 2.8,
      "luminanceThreshold": 3.469446951953614e-18
    },
    "bokeh": {
      "aperture": 0.039,
      "dof": 0.029,
      "enabled": false,
      "focus": 35.9,
      "maxBlur": 0.012
    },
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0.07,
      "enabled": true
    },
    "chromaticAberration": {
      "enabled": true,
      "offset": {
        "x": 0.0011,
        "y": -0.0004
      }
    },
    "enabled": true,
    "film": {
      "enabled": true,
      "noiseIntensity": 0.29000000000000004,
      "scanlineCount": 1408,
      "scanlineIntensity": 0.21999999999999997
    }
  }
}
```

### src/config.ts

```
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

  data: {
    csvUrl: '../data/data.csv',
    availableDatasets: [],
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

```

### src/event-bus.ts

```
/**
 * @file event-bus.ts
 * @description 事件总线 - 系统间通信
 * @🔧 修正: 补充实现了 'once' 方法，修复了UI因调用不存在的方法而导致的崩溃。
 */
import logger from './utils/logger';

class EventBus {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
    logger.debug('EventBus', `注册事件: ${event}`);
  }

  /**
   * 注册一个只执行一次的事件监听器。
   * @param {string} event - 事件名称。
   * @param {Function} callback - 回调函数。
   */
  once(event: string, callback: Function) {
    const onceCallback = (...args: any[]) => {
      this.off(event, onceCallback); // 执行后立即移除自身
      callback(...args);
    };
    this.on(event, onceCallback);
    logger.debug('EventBus', `注册一次性事件: ${event}`);
  }

  off(event: string, callback: Function) {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event)!;
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
      logger.debug('EventBus', `移除事件: ${event}`);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;

    // 创建回调数组的副本，以防回调函数内部修改原始数组（如在 once 中调用 off）
    const callbacks = [...this.events.get(event)!];
    callbacks.forEach((callback) => {
      try {
        callback(...args);
      } catch (err: unknown) {
        logger.error('EventBus', `事件回调异常 [${event}]: ${(err as Error).message}`);
      }
    });
  }

  clear() {
    this.events.clear();
    logger.info('EventBus', '事件总线已清空');
  }

  getEventCount() {
    return this.events.size;
  }

  getListenerCount(event: string) {
    return this.events.has(event) ? this.events.get(event)!.length : 0;
  }
}

const eventBus = new EventBus();
export default eventBus;

```

### src/main.ts

```
/**
 * @file main.ts
 * @description 应用主入口 - 系统协调与生命周期管理
 * @✨ 重构: 彻底移除了旧的 ui-material 系统。
 * @✨ 重构: 适配了新的监视器布局，修改了渲染器挂载和尺寸调整逻辑。
 */

import './style.css';

import * as THREE from 'three';
import logger from './utils/logger';
import config, { initConfig } from './config';
import eventBus from './event-bus';
import presetManager from './preset-manager';

// UI 系统
import uiContainer from './ui/ui-container';
import uiBasic from './ui/ui-basic';
import uiPost from './ui/ui-post';
import uiPresets from './ui/ui-presets';
import uiCoordinates from './ui/ui-coordinates';
import uiMonitor from './ui/ui-monitor';
import uiScene from './ui/ui-scene';

// 核心系统
import coordinateSystem from './systems/coordinates-sys';
import cameraSys from './systems/camera-sys';
import dataSys from './systems/data-sys';
import animationSys from './systems/animation-sys';
import particlesSys from './systems/particles-sys';
import postprocessSys from './systems/postprocess-sys';
import audioSys from './systems/audio-sys';
import lightingSys from './systems/lighting-sys';
import environmentSys from './systems/environment-sys';
import materialSys from './systems/material-sys';
import modelSys from './systems/model-sys';
import sceneDirector from './systems/scene-director-sys';

// 实体
import pathSys from './systems/path-sys';
import lightSys from './systems/light-sys';

class Application {
  private scene: THREE.Scene | null;
  private renderer: THREE.WebGLRenderer | null;
  private clock: THREE.Clock;
  private initialized: boolean;
  private monitorContainer: HTMLElement | null = null; // 新增：监视器容器引用

  constructor() {
    this.scene = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    this.initialized = false;
  }

  async init() {
    if (this.initialized) {
      logger.warn('App', '应用已经初始化过了');
      return;
    }

    try {
      logger.info('App', '🚀 应用启动中...');

      this.monitorContainer = document.getElementById('monitor-container');
      if (!this.monitorContainer) {
        throw new Error('启动失败: 未在DOM中找到 #monitor-container。');
      }

      // 1. 初始化配置
      initConfig();

      // 2. 创建场景和渲染器 (现在在新的容器中)
      this._createScene();
      this._createRenderer();

      // 3. 初始化坐标系统（必须在相机之前）
      coordinateSystem.init({
        eventBus,
        scene: this.scene,
      });

      if (this.scene) {
        this.scene.userData.coordinateSystem = coordinateSystem;
      }

      // 4. 初始化UI容器 (现在它会找到自己的位置)
      uiContainer.init();

      // 5. 初始化相机系统
      if (!this.scene || !this.renderer) {
        throw new Error('场景或渲染器未初始化');
      }

      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer!,
      });

      lightingSys.init({ scene: this.scene });
      environmentSys.init({ scene: this.scene });

      const mainCamera = cameraSys.getActiveCamera();

      this._handleResize();

      postprocessSys.init({
        scene: this.scene as THREE.Scene,
        camera: mainCamera as THREE.Camera,
        renderer: this.renderer as THREE.WebGLRenderer,
      });

      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera(),
      });

      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls(),
      });

      // 7. 初始化基础 UI
      await uiBasic.init();
      await uiScene.init();
      // 8. 初始化后处理 UI
      await uiPost.init();
      await presetManager.init();
      // 9. 初始化预设系统
      await uiPresets.init();
      // 10. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });
      //10.5. 初始化监视器UI
      uiMonitor.init();

      // 11. 初始化核心服务系统
      materialSys.init();
      modelSys.init();

      pathSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        coordinateSystem,
      });

      await lightSys.init({
        eventBus,
        coordinateSystem,
      });

      particlesSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        coordinateSystem,
      });

      animationSys.init({
        eventBus,
      });

      sceneDirector.init({ eventBus });

      this._bindEvents();
      this._handleResize(); // 第一次手动调用以设置正确尺寸
      this._startRenderLoop();

      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;
      logger.info('App', '✅ 应用初始化完成');
    } catch (err: unknown) {
      logger.error('App', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createScene() {
    this.scene = new THREE.Scene();
    logger.debug('App', '场景已创建');
  }

  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });

    // 尺寸将在 _handleResize 中设置
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const canvas = this.renderer.domElement;
    // 移除所有内联定位样式，交给 CSS 处理
    canvas.style.display = 'block';

    //将 Canvas 添加到右侧监视器容器
    this.monitorContainer!.appendChild(canvas);

    // 立即设置初始尺寸，防止 Framebuffer 错误
    const initialWidth = this.monitorContainer!.clientWidth || window.innerWidth;
    const initialHeight = this.monitorContainer!.clientHeight || window.innerHeight;
    this.renderer.setSize(initialWidth, initialHeight);

    logger.info('App', `Canvas 已添加到 #monitor-container`);
    logger.debug('App', '渲染器已创建');
  }

  _bindEvents() {
    // 监听全局窗口大小变化事件，以便调整渲染器和相机
    window.addEventListener('resize', this._handleResize.bind(this));

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = (coordinateSystem as any).debugInfo?.() || 'N/A';
      console.log('坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    if (!this.renderer || !this.monitorContainer) return;

    //监视器容器获取尺寸
    const width = this.monitorContainer.clientWidth;
    const height = this.monitorContainer.clientHeight;

    // 更新渲染器
    this.renderer.setSize(width, height);

    //将新尺寸传递给下游系统
    cameraSys.handleResize(width, height);
    postprocessSys.handleResize(width, height);

    logger.debugThrottled('App', 'window-resize', `窗口大小已调整: ${width}x${height}`, 1000);
  }

  _startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      cameraSys.update(delta);
      pathSys.updateCameraPosition(cameraSys.getActiveCamera());
      pathSys.update(delta);
      animationSys.update(delta, elapsed);
      particlesSys.update(elapsed);

      if (config.get('postprocess.enabled')) {
        postprocessSys.render(delta);
      } else if (this.renderer && this.scene) {
        this.renderer.render(this.scene, cameraSys.getActiveCamera());
      }
    };

    animate();
    logger.info('App', '渲染循环已启动');
  }

  dispose() {
    logger.info('App', '应用正在销毁...');

    window.removeEventListener('resize', this._handleResize.bind(this));

    sceneDirector.dispose();
    coordinateSystem.dispose();
    cameraSys.dispose();
    dataSys.dispose();
    animationSys.dispose();
    particlesSys.dispose();
    materialSys.dispose();
    postprocessSys.dispose();
    audioSys.dispose();
    lightingSys.dispose();
    environmentSys.dispose();
    pathSys.dispose();
    lightSys.dispose();
    uiBasic.dispose();
    uiScene.dispose();
    uiPost.dispose();
    uiPresets.dispose();
    uiCoordinates.dispose();
    uiMonitor.dispose();
    uiContainer.dispose();

    if (this.renderer) {
      this.renderer.dispose();
      if (this.renderer.domElement.parentNode) {
        this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
      }
    }

    this.initialized = false;
    logger.info('App', '应用已销毁');
  }
}

const app = new Application();
app.init().catch((err) => {
  logger.error('App', `启动失败: ${(err as Error).message}`);
  console.error(err);
});

export default app;

```

### src/preset-manager.ts

```
/**
 * @file preset-manager.ts
 * @description 预设管理器 - 加载、保存和应用配置快照
 * ✅ 修复: 添加了完整的类型守卫，修复所有 TypeScript 严格模式错误
 */
import config from './config';
import logger from './utils/logger';
import eventBus from './event-bus';
import uiRegistry from './ui/ui-registry';
import { resolveAssetUrl } from './utils/url-resolver';

class PresetManager {
  private initialized = false;
  private availablePresets: any[] = [];
  private currentPreset: string | null = null;
  private presetBaseUrl = '/presets';

  async init() {
    if (this.initialized) {
      logger.warn('PresetManager', '预设管理器已初始化');
      return this;
    }

    try {
      await this._scanPresets();

      this.initialized = true;
      logger.info(
        'PresetManager',
        `预设管理器已初始化 | 发现 ${this.availablePresets.length} 个预设`
      );

      return this;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `初始化失败: ${errorMsg}`);
      throw err;
    }
  }

  async _scanPresets() {
    try {
      const presetFiles = ['01.json', '02.json', '03.json'];

      this.availablePresets = presetFiles.map((filename) => ({
        name: filename.replace('.json', ''),
        filename: filename,
        path: `${this.presetBaseUrl}/${filename}`,
      }));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.warn('PresetManager', `扫描预设失败: ${errorMsg}`);
      this.availablePresets = [];
    }
  }

  getAvailablePresets() {
    return this.availablePresets;
  }

  async loadPreset(presetName: string) {
    try {
      const preset = this.availablePresets.find((p) => p.name === presetName);
      if (!preset) {
        throw new Error(`预设不存在: ${presetName}`);
      }

      logger.info('PresetManager', `正在加载预设: ${presetName}`);

      const response = await fetch(resolveAssetUrl(preset.path));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presetData = await response.json();

      this._applyPresetToConfig(presetData);
      this.currentPreset = presetName;

      eventBus.emit('preset-loaded', { name: presetName, data: presetData });

      logger.info('PresetManager', `✅ 预设已加载: ${presetName}`);

      return presetData;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `加载预设失败: ${errorMsg}`);
      throw err;
    }
  }

  _applyPresetToConfig(presetData: any) {
    if (!presetData || typeof presetData !== 'object') {
      throw new Error('预设数据格式无效');
    }

    const applyRecursively = (obj: any, pathPrefix = '') => {
      for (const key in obj) {
        if (key === 'name' || key === 'timestamp') continue;
        if (!key) continue;

        const value = obj[key];
        const fullPath = pathPrefix ? `${pathPrefix}.${key}` : key;

        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          applyRecursively(value, fullPath);
        } else {
          config.set(fullPath, value);
        }
      }
    };

    applyRecursively(presetData);
    logger.debug('PresetManager', '配置已通过 config.set() 应用完成');
  }

  savePreset(presetName: string) {
    if (!presetName || typeof presetName !== 'string') {
      throw new Error('预设名称无效');
    }

    try {
      const presetData = {
        name: presetName,
        timestamp: new Date().toISOString(),
      };

      const allPaths = uiRegistry.getAllControls();
      logger.info('PresetManager', `准备保存 ${allPaths.length} 个控件的数据`);

      const configSnapshot = config.getRaw();
      allPaths.forEach((path) => {
        // ✅ 添加类型守卫
        if (typeof path !== 'string') {
          logger.warn('PresetManager', `跳过无效路径: ${path}`);
          return;
        }

        const value = this._getNestedValue(configSnapshot, path);
        if (value !== undefined) {
          this._setNestedValue(presetData, path, value);
        }
      });

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
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      logger.error('PresetManager', `保存预设失败: ${errorMsg}`);
      throw err;
    }
  }

  _getNestedValue(obj: any, path: string) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }
    return value;
  }

  _setNestedValue(obj: any, path: string, value: any) {
    const keys = path.split('.');
    let target = obj;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      // ✅ 核心修复：添加类型守卫
      if (!key) continue;
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      target = target[key];
    }

    // ✅ 核心修复：确保 lastKey 存在
    const lastKey = keys[keys.length - 1];
    if (lastKey) {
      target[lastKey] = JSON.parse(JSON.stringify(value));
    }
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

```

### src/style.css

```css
/**
 * @file style.css
 * @description 全局样式表 - 仅布局 + Terminal 变量
 * @version 6.0 (Clean Tweakpane)
 */

/* ==================== CSS 变量（为未来准备）==================== */
:root {
  /* Terminal 配色（监视器 HUD 使用） */
  --terminal-bg: #273030;
  --terminal-fg: #eceae5;
  --terminal-accent: #32858b;
  --terminal-border: #24222a;
  --terminal-hover: #252321;
  
  /* 字体 */
  --font-mono: 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* ==================== 全局重置 ==================== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: var(--font-mono);
  background: var(--terminal-bg);
  color: var(--terminal-fg);
  line-height: 1.6;
  font-size: 14px;
}

/* ==================== 主布局 ==================== */
#app-wrapper {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
}

#main-layout {
  display: flex;
  width: 100%;
  height: 100%;
  gap: 10px;
}

/* ==================== 左侧面板（Tweakpane 容器）==================== */
#left-panel {
  width: 320px;
  flex-shrink: 0;
  background-color: #273030;
  border: 1px solid #292c2c;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 滚动内容容器 */
#ui-scroll-content {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px;
  box-sizing: border-box;
}

/* ==================== 右侧监视器 ==================== */
#monitor-container {
  flex: 1;
  position: relative;
  border: 2px solid var(--terminal-border);
  background-color: #000;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 3D Canvas */
#monitor-container canvas {
  display: block;
  width: 100% !important;
  height: 100% !important;
}

/* 监视器覆盖层UI（使用 Terminal 风格）*/
#monitor-overlay-ui {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
}

/* ==================== HUD 监视器样式（Terminal 风格）==================== */
.monitor-info-item {
  display: flex;
  align-items: baseline;
  gap: 3px;
  background: rgba(0, 20, 40, 0.5);
  padding: 2px 5px;
  border: 1px solid rgba(0, 255, 98, 0.3);
  border-radius: 0;
  text-transform: uppercase;
  box-shadow: 
    0 0 8px rgba(0, 255, 145, 0.15),
    inset 0 0 8px rgba(0, 255, 89, 0.05);
}

.monitor-info-item .label {
  color: rgba(0, 255, 98, 0.5);
  opacity: 0.7;
  font-size: 8px;
  letter-spacing: 0.75px;
  text-shadow: 0 0 2px rgba(0, 255, 68, 0.25);
}

.monitor-info-item .value {
  color: #00ff62;
  font-size: 8px;
  font-weight: bold;
  min-width: 40px;
  text-align: right;
  text-shadow: 
    0 0 4px rgba(0, 255, 102, 0.4),
    0 0 8px rgba(0, 255, 55, 0.2);
  opacity: 0.8;
}

/* ==================== 滚动条样式（左侧面板）==================== */
#left-panel::-webkit-scrollbar,
#ui-scroll-content::-webkit-scrollbar {
  width: 10px;
}

#left-panel::-webkit-scrollbar-track,
#ui-scroll-content::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-left: 1px solid #ddd;
}

#left-panel::-webkit-scrollbar-thumb,
#ui-scroll-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border: 2px solid #f0f0f0;
  border-radius: 4px;
}

#left-panel::-webkit-scrollbar-thumb:hover,
#ui-scroll-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* ==================== 响应式适配 ==================== */
@media (max-width: 768px) {
  #left-panel {
    width: 100%;
    height: auto;
    max-height: 40vh;
    border-right: none;
    border-bottom: 2px solid #ddd;
  }
  
  #monitor-container {
    height: 60vh;
  }
  
  #monitor-overlay-ui {
    padding: 10px;
  }
  
  .monitor-info-item .value {
    font-size: 14px;
    min-width: 70px;
  }
}

```

### src/systems/animation-sys.ts

```
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

```

### src/systems/audio-sys.ts

```
/**
 * @file audio-sys.ts
 * @description 音频系统 - 背景音乐管理与播放控制
 * @🔧 修正: 修复了因未正确解析资源URL导致音频加载失败的问题。
 * @🔧 修正: 规范化了模块导入，移除了.js后缀。
 * @✨ 优化: 延迟创建AudioContext，直到用户首次交互，以符合浏览器策略。
 */
import * as THREE from 'three';
import logger from '../utils/logger';

import { resolveAssetUrl } from '../utils/url-resolver'; // ✅ 核心修正：导入URL解析工具

class AudioSystem {
  private eventBus: any;
  private camera: THREE.Camera | null;
  private listener: THREE.AudioListener | null;
  private sound: THREE.Audio | null;
  private audioLoader: THREE.AudioLoader;
  private initialized: boolean;

  private isPlaying: boolean;
  private volume: number;
  private audioContext: AudioContext | null;

  private listenerCreated: boolean;

  constructor() {
    this.eventBus = null;
    this.camera = null;
    this.listener = null;
    this.sound = null;
    this.audioLoader = new THREE.AudioLoader();
    this.initialized = false;

    this.isPlaying = false;
    this.volume = 0.5;

    this.audioContext = null;

    this.listenerCreated = false;
  }

  async init({ eventBus, camera }: { eventBus: any; camera: THREE.Camera }) {
    if (this.initialized) {
      logger.warn('AudioSystem', '音频系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.camera = camera;

      this._bindEvents();

      this.initialized = true;
      logger.info('AudioSystem', '音频系统初始化完成(延迟创建 AudioContext)');

      return this;
    } catch (err: unknown) {
      logger.error('AudioSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _ensureListenerCreated() {
    if (this.listenerCreated || !this.camera) return;

    try {
      this.listener = new THREE.AudioListener();
      this.camera.add(this.listener);

      this.audioContext = this.listener.context;
      this.sound = new THREE.Audio(this.listener);

      this.listenerCreated = true;
      logger.info('AudioSystem', 'AudioListener 已创建');
    } catch (err: unknown) {
      logger.error('AudioSystem', `创建 AudioListener 失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('audio-toggle', () => {
      this._ensureListenerCreated(); // 确保在切换时已创建
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.eventBus.on('audio-load', (url: string) => {
      this.loadAudio(url);
    });

    this.eventBus.on('audio-volume-changed', (volume: number) => {
      this.setVolume(volume);
    });

    this.eventBus.on('audio-stop', () => {
      this.stop();
    });
  }

  loadAudio(url: string) {
    if (!url) {
      logger.warn('AudioSystem', '音频 URL 为空');
      return;
    }

    this._ensureListenerCreated();
    if (!this.sound) return;

    // 核心修正: 使用 resolveAssetUrl 包装路径
    const fetchUrl = resolveAssetUrl(url);

    logger.info('AudioSystem', `开始加载音频: ${fetchUrl}`);

    this.audioLoader.load(
      fetchUrl,
      (buffer) => {
        if (!this.sound) return;
        if (this.sound.isPlaying) {
          this.sound.stop();
        }

        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(this.volume);

        logger.info('AudioSystem', '音频加载成功');
        this.eventBus.emit('audio-loaded', url);
      },
      undefined,
      (error: unknown) => {
        logger.error('AudioSystem', `加载失败: ${(error as Error).message || '未知错误'}`);
        this.eventBus.emit('audio-load-error', error);
      }
    );
  }

  async play() {
    if (!this.sound || !this.sound.buffer) {
      logger.warn('AudioSystem', '没有加载音频，无法播放');
      return;
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        logger.info('AudioSystem', 'AudioContext 已恢复');
      } catch (err: unknown) {
        logger.error('AudioSystem', `恢复 AudioContext 失败: ${(err as Error).message}`);
        return;
      }
    }

    if (!this.sound.isPlaying) {
      this.sound.play();
      this.isPlaying = true;
      logger.info('AudioSystem', '开始播放');
      this.eventBus.emit('audio-playing', true);
    }
  }

  pause() {
    if (this.sound && this.sound.isPlaying) {
      this.sound.pause();
      this.isPlaying = false;
      logger.info('AudioSystem', '暂停播放');
      this.eventBus.emit('audio-playing', false);
    }
  }

  stop() {
    if (this.sound && this.sound.isPlaying) {
      this.sound.stop();
      this.isPlaying = false;
      logger.info('AudioSystem', '停止播放');
      this.eventBus.emit('audio-playing', false);
    }
  }

  setVolume(volume: number) {
    this.volume = THREE.MathUtils.clamp(volume, 0, 1);
    if (this.sound) {
      this.sound.setVolume(this.volume);
      logger.debug('AudioSystem', `音量: ${(this.volume * 100).toFixed(0)}%`);
    }
  }

  dispose() {
    this.stop();

    if (this.listener && this.camera) {
      this.camera.remove(this.listener);
    }

    this.sound = null;
    this.listener = null;
    this.audioContext = null;
    this.listenerCreated = false;
    this.initialized = false;
    logger.info('AudioSystem', '音频系统已销毁');
  }
}

const audioSys = new AudioSystem();
export default audioSys;

```

### src/systems/camera-sys.ts

```
/**
 * @file camera-sys.ts
 * @description 相机系统 - 透视/正交切换 + camera-controls 集成
 * @✅ 核心改造: 监听统一的 'config-changed' 事件。
 * @✅ 核心改造: 修改 handleResize 方法以接收外部尺寸。
 */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import logger from '../utils/logger';
import config from '../config';
import { applyPerspMouseMapping, applyOrthoMouseMapping } from './controls-util';

CameraControls.install({ THREE });

class CameraSystem {
  private eventBus: any;

  // ✅ 公共属性
  public scene: THREE.Scene | null = null;

  private renderer: THREE.WebGLRenderer | null;
  private initialized: boolean;

  private perspectiveCamera: THREE.PerspectiveCamera | null;
  private orthographicCamera: THREE.OrthographicCamera | null;
  private activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
  private controls: CameraControls | null;
  private currentMode: string;

  private orthoFrustumSize: number;
  private particleSystemRadius: number;

  constructor() {
    this.eventBus = null;

    this.renderer = null;
    this.initialized = false;

    this.perspectiveCamera = null;
    this.orthographicCamera = null;
    this.activeCamera = null;
    this.controls = null;
    this.currentMode = 'perspective';

    this.orthoFrustumSize = 50;
    this.particleSystemRadius = 100;
  }

  init({
    eventBus,
    scene,
    renderer,
  }: {
    eventBus: any;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
  }) {
    if (this.initialized) {
      logger.warn('CameraSystem', '相机系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.renderer = renderer;

      this._createCameras();
      this.activeCamera = this.perspectiveCamera;
      this._createControls();
      this._bindEvents();

      this._setRotationCenterToOrigin();

      const initialMode = config.get('camera.mode') || 'perspective';
      if (initialMode !== 'perspective') {
        this._switchToMode(initialMode);
      }

      this.initialized = true;
      logger.info('CameraSystem', '相机系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('CameraSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createCameras() {
    // 初始 aspect 只是一个占位符，将在第一次 handleResize 时被正确设置
    const aspect = 16 / 9;
    const fov = config.get('camera.fov') || 75;
    const near = config.get('camera.near') || 0.1;
    const far = config.get('camera.far') || 2000;

    this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.perspectiveCamera.position.set(10, 8, 15);
    this.perspectiveCamera.name = 'PerspectiveCamera';

    const height = this.orthoFrustumSize;
    const width = height * aspect;

    this.orthographicCamera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far
    );
    this.orthographicCamera.position.set(0, 50, 0);
    this.orthographicCamera.name = 'OrthographicCamera';
    this.orthographicCamera.zoom = 1.0;

    logger.debug('CameraSystem', `相机已创建`);
  }

  _createControls() {
    this.controls = new CameraControls(this.activeCamera!, this.renderer!.domElement);
    applyPerspMouseMapping(this.controls);

    const controlsConfig = config.get('camera.controls');
    this.controls.smoothTime = controlsConfig.smoothTime || 0.05;
    this.controls.draggingSmoothTime = controlsConfig.draggingSmoothTime || 0.25;
    this.controls.minDistance = controlsConfig.minDistance || 1;

    setTimeout(() => this._updateMaxDistance(), 100);

    logger.debug('CameraSystem', 'camera-controls 初始化完成');
  }

  _updateMaxDistance() {
    const sphereRadius = config.get('particles.sphereRadius') || 100;
    const systemScale = config.get('particles.systemScale') || 1.0;

    this.particleSystemRadius = sphereRadius * systemScale;
    const calculatedMaxDistance = this.particleSystemRadius * 0.8;

    if (this.controls) {
      this.controls.maxDistance = calculatedMaxDistance;
      logger.info('CameraSystem', `maxDistance 更新: ${calculatedMaxDistance.toFixed(2)}`);
    }
  }

  _setRotationCenterToOrigin() {
    if (this.controls) {
      this.controls.setTarget(0, 0, 0, false);
      logger.info('CameraSystem', '旋转中心锁定到世界原点 (0,0,0)');
    }
  }

  _bindEvents() {
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
    this.eventBus.on('view-changed', (viewKey: string) => this._applyViewPreset(viewKey));
    this.eventBus.on('flip-view', () => this._flipView());

    this.eventBus.on('coordinate-system-updated', ({ type }: { type: string }) => {
      if (type === 'position') {
        this._setRotationCenterToOrigin();
      }
    });
    this.eventBus.on('data-processing-completed', () => {
      this._setRotationCenterToOrigin();
      logger.info('CameraSystem', '数据处理完成后已锁定旋转中心');
    });

    // 不再直接监听 window.resize，由 main.ts 统一调度
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
    switch (key) {
      case 'camera.mode':
        this._switchToMode(value);
        break;

      case 'camera.fov':
        if (this.perspectiveCamera && this.currentMode === 'perspective') {
          this.perspectiveCamera.fov = value;
          this.perspectiveCamera.updateProjectionMatrix();
        }
        break;

      case 'particles.systemScale':
      case 'particles.sphereRadius':
        this._updateMaxDistance();
        break;
    }
  }

  _switchToMode(mode: string) {
    if (mode === this.currentMode || !this.controls) return;

    const prevCamera = this.activeCamera;
    this.currentMode = mode;

    if (mode === 'perspective') {
      this.activeCamera = this.perspectiveCamera;
      this.controls.camera = this.activeCamera!;
      applyPerspMouseMapping(this.controls);
      if (prevCamera) {
        const position = prevCamera.position.clone();
        this.controls.setPosition(position.x, position.y, position.z, false);
        this.controls.setTarget(0, 0, 0, false);
      }
    } else if (mode === 'orthographic') {
      this.activeCamera = this.orthographicCamera;
      this.controls.camera = this.activeCamera!;
      applyOrthoMouseMapping(this.controls);
      this._applyViewPreset('top');
    }

    this.eventBus.emit('camera-mode-switched', mode);
    this.eventBus.emit('camera-changed', this.activeCamera);
    logger.info('CameraSystem', `切换到${mode}相机`);
  }

  _applyViewPreset(viewKey: string) {
    if (!this.controls) return;
    const distance = 50;
    let position;
    switch (viewKey) {
      case 'top':
        position = new THREE.Vector3(0, distance, 0);
        break;
      case 'front':
        position = new THREE.Vector3(0, 0, distance);
        break;
      case 'side':
        position = new THREE.Vector3(distance, 0, 0);
        break;
      default:
        return;
    }
    this.controls.setLookAt(position.x, position.y, position.z, 0, 0, 0, true);
  }

  _flipView() {
    if (!this.controls || !this.activeCamera) return;
    const currentPos = this.activeCamera.position.clone();
    const target = new THREE.Vector3();
    this.controls.getTarget(target);
    const newPos = target.clone().add(currentPos.sub(target).negate());
    this.controls.setLookAt(newPos.x, newPos.y, newPos.z, target.x, target.y, target.z, true);
  }

  // ✅ 核心修改: 接收 width 和 height
  handleResize(width: number, height: number) {
    if (!this.perspectiveCamera || !this.orthographicCamera) return;

    const aspect = width / height;

    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    const orthoHeight = this.orthoFrustumSize / this.orthographicCamera.zoom;
    const orthoWidth = orthoHeight * aspect;
    this.orthographicCamera.left = -orthoWidth / 2;
    this.orthographicCamera.right = orthoWidth / 2;
    this.orthographicCamera.top = orthoHeight / 2;
    this.orthographicCamera.bottom = -orthoHeight / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update(delta: number) {
    if (this.controls) this.controls.update(delta);
  }

  getActiveCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    return this.activeCamera!;
  }
  getControls(): CameraControls {
    return this.controls!;
  }

  dispose() {
    if (this.controls) this.controls.dispose();
    this.initialized = false;
    logger.info('CameraSystem', '相机系统已销毁');
  }
}

const cameraSys = new CameraSystem();
export default cameraSys;

```

### src/systems/controls-util.ts

```
// 说明：集中封装 CameraControls 的鼠标/触控映射
import CameraControls from 'camera-controls';

// 透视：常规轨道（滚轮：DOLLY；禁用 dollyToCursor，避免 target 被推偏）
export function applyPerspMouseMapping(controls: any) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left = A.ROTATE;
  controls.mouseButtons.middle = A.TRUCK; // 中键平移
  controls.mouseButtons.right = A.TRUCK; // 右键平移
  controls.mouseButtons.wheel = A.DOLLY; // 滚轮推拉（透视）

  // 触控
  controls.touches.one = A.TOUCH_ROTATE;
  controls.touches.two = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 手感：滚轮力度；并明确关闭“朝指针处推拉”以保 target 固定
  controls.dollySpeed = 0.8;
  controls.dollyToCursor = false; // ✅ 根因修复
  controls.zoomToCursor = false;
}

// 正交：禁用旋转；滚轮用 ZOOM（必须），开启 zoomToCursor
export function applyOrthoMouseMapping(controls: any) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left = A.NONE; // 禁止左键旋转
  controls.mouseButtons.middle = A.TRUCK; // 中键平移
  controls.mouseButtons.right = A.TRUCK; // 右键平移
  controls.mouseButtons.wheel = A.ZOOM; // ✅ 正交必须用 ZOOM

  controls.touches.one = A.NONE;
  controls.touches.two = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 正交缩放更有力，并以指针为中心缩放
  controls.dollySpeed = 1.5;
  controls.zoomToCursor = true;
  controls.dollyToCursor = false;
}

// 默认（向后兼容）
export function applyDefaultMouseMapping(controls: any) {
  applyPerspMouseMapping(controls);
}

```

### src/systems/coordinates-sys.ts

```
/**
 * @file coordinates-sys.js
 * @description 统一坐标系统 - 管理所有3D对象的坐标空间
 * ✅ 核心改造:
 *   1. 监听统一的 'config-changed' 事件。
 *   2. 移除了方法内的 config.set() 调用，确保单向数据流。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';

class CoordinateSystem {
  private eventBus: any = null;
  private scene: THREE.Scene | null = null;
  private initialized = false;
  private worldRoot: THREE.Group | null = null;
  private dataSpace: THREE.Group | null = null;
  private particleAnchor: THREE.Group | null = null;
  private pathAnchor: THREE.Group | null = null;
  private lightAnchor: THREE.Group | null = null;

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.initialized = false;

    this.worldRoot = null;
    this.dataSpace = null;
    this.particleAnchor = null;
    this.pathAnchor = null;
    this.lightAnchor = null;
  }

  init({ eventBus, scene }: any) {
    if (this.initialized) {
      logger.warn('CoordinateSystem', '坐标系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;

      this._createHierarchy();
      this._bindEvents();
      this._loadInitialConfig();

      this.initialized = true;
      logger.info('CoordinateSystem', '坐标系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('CoordinateSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createHierarchy() {
    this.worldRoot = new THREE.Group();
    this.worldRoot.name = 'WorldRoot';
    if (this.scene && this.worldRoot) this.scene.add(this.worldRoot);

    this.dataSpace = new THREE.Group();
    this.dataSpace.name = 'DataSpace';
    this.worldRoot.add(this.dataSpace);

    this.particleAnchor = new THREE.Group();
    this.particleAnchor.name = 'ParticleSystemAnchor';
    this.dataSpace.add(this.particleAnchor);

    this.pathAnchor = new THREE.Group();
    this.pathAnchor.name = 'PathSystemAnchor';
    this.dataSpace.add(this.pathAnchor);

    this.lightAnchor = new THREE.Group();
    this.lightAnchor.name = 'LightSystemAnchor';
    this.dataSpace.add(this.lightAnchor);

    logger.debug('CoordinateSystem', '坐标层级结构已创建');
  }

  _bindEvents() {
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // ✅ 保留命令式事件
    this.eventBus.on('coordinate-system-reset', () => this.reset());
  }

  _loadInitialConfig() {
    const scale = config.get('coordinates.dataSpace.scale');
    this.setDataSpaceScale(scale);

    const rotation = config.get('coordinates.dataSpace.rotation');
    if (this.dataSpace)
      this.dataSpace.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

    const position = config.get('coordinates.dataSpace.position');
    if (this.dataSpace)
      this.dataSpace.position.set(position.x || 0, position.y || 0, position.z || 0);

    logger.info('CoordinateSystem', `✅ 配置已加载 | 缩放: ${scale}x`);
  }

  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }: { key: string; value: any }) {
    // 使用 startsWith 来捕获对对象内部属性（如 rotation.x）的更改
    if (key.startsWith('coordinates.dataSpace')) {
      switch (key) {
        case 'coordinates.dataSpace.scale':
          this.setDataSpaceScale(value);
          break;

        // 当 rotation 或 position 的任何子属性变化时，都完整更新
        case 'coordinates.dataSpace.rotation.x':
        case 'coordinates.dataSpace.rotation.y':
        case 'coordinates.dataSpace.rotation.z':
          const rot = config.get('coordinates.dataSpace.rotation');
          if (this.dataSpace && rot) {
            this.dataSpace.rotation.set(rot.x ?? 0, rot.y ?? 0, rot.z ?? 0);
          }
          break;

        case 'coordinates.dataSpace.position.x':
        case 'coordinates.dataSpace.position.y':
        case 'coordinates.dataSpace.position.z':
          const pos = config.get('coordinates.dataSpace.position');
          if (this.dataSpace) this.dataSpace.position.set(pos.x, pos.y, pos.z);
          break;
      }
    }
  }

  /**
   * 设置DataSpace整体缩放
   */
  setDataSpaceScale(scale: number) {
    if (scale <= 0) return;
    // ✅ 添加空值检查
    if (this.dataSpace) {
      this.dataSpace.scale.setScalar(scale);
    }
    this.eventBus.emit('coordinate-system-updated', { type: 'scale', value: scale });
  }

  /**
   * 重置坐标系统到初始状态
   */
  reset() {
    // 通过 config.set 触发更新，让数据流保持一致
    config.set('coordinates.dataSpace.scale', 1.0);
    config.set('coordinates.dataSpace.rotation', { x: 0, y: 0, z: 0 });
    config.set('coordinates.dataSpace.position', { x: 0, y: 0, z: 0 });

    logger.info('CoordinateSystem', '坐标系统重置请求已发送');
    this.eventBus.emit('coordinate-system-reset-completed');
  }

  getParticleAnchor() {
    return this.particleAnchor;
  }
  getPathAnchor() {
    return this.pathAnchor;
  }
  getLightAnchor() {
    return this.lightAnchor;
  }

  dispose() {
    // ✅ 添加空值检查
    if (this.worldRoot && this.scene) {
      this.scene.remove(this.worldRoot);
    }
    this.initialized = false;
    logger.info('CoordinateSystem', '坐标系统已销毁');
  }
}

const coordinateSystem = new CoordinateSystem();
export default coordinateSystem;

```

### src/systems/data-sys.ts

```
/**
 * @file data-sys.js
 * @description 数据加载系统 - CSV解析与坐标映射
 * 修复: 初始化时动态加载数据源清单 (manifest.json)，并提供主动查询方法。
 */
import * as THREE from 'three';
import Papa from 'papaparse';
import logger from '../utils/logger';
import config from '../config';
import { resolveAssetUrl } from '../utils/url-resolver';
import state from './state';

class DataSystem {
  private eventBus: any;

  // 公共属性
  public scene: THREE.Scene | null = null;
  public camera: THREE.Camera | null = null;
  public rawData: any[] = [];

  private controls: any;
  private initialized: boolean;

  private datasets: any[];

  constructor() {
    this.eventBus = null;

    this.controls = null;
    this.initialized = false;

    this.datasets = []; // 新增：用一个内部变量存储数据集列表
  }

  // init 方法保持 async 不变
  async init({ eventBus, scene, camera, controls }: any) {
    if (this.initialized) {
      // logger.warn('DataSystem', '数据系统已经初始化过了'); // 暂时注释掉，因为我们修复了重复调用的问题
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.camera = camera;
      this.controls = controls;

      this.eventBus.on('data-load-requested', (csvUrl: string) => {
        this.loadCSV(csvUrl);
      });

      await this._loadAvailableDatasets();

      this.initialized = true;
      logger.info('DataSystem', '数据系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('DataSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * 新增：提供一个公共的 getter 方法
   */
  getAvailableDatasets() {
    return this.datasets;
  }

  async _loadAvailableDatasets() {
    try {
      // 2. 使用 resolveAssetUrl 包装路径
      const response = await fetch(resolveAssetUrl('data/manifest.json'));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const manifestData = await response.json();

      if (Array.isArray(manifestData) && manifestData.length > 0) {
        this.datasets = manifestData;
        config.set('data.availableDatasets', manifestData);

        // 设置默认加载的数据为清单中的第一个
        // 注意：这里的路径现在是相对于 public 的，不再需要 '../'
        const defaultPath = manifestData[0].path;
        config.set('data.csvUrl', defaultPath);

        logger.info('DataSystem', `成功加载 ${manifestData.length} 个数据集清单`);
      } else {
        throw new Error('清单格式无效或为空');
      }
    } catch (err: unknown) {
      logger.error('DataSystem', `加载数据集清单失败: ${(err as Error).message}`);
      this.datasets = [];
      config.set('data.availableDatasets', []);
    } finally {
      this.eventBus.emit('datasets-list-updated', this.getAvailableDatasets());
    }
  }

  async loadCSV(csvUrl: string) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    // 3. 同样，解析从 manifest.json 中读到的路径
    const fetchUrl = resolveAssetUrl(csvUrl);

    logger.info('DataSystem', `开始加载 CSV: ${fetchUrl}`);

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
      // ... 函数剩余部分保持不变 ...
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          this._processData(results.data);
        },
        error: (error: any) => {
          logger.error('DataSystem', `CSV 解析错误: ${(error as Error).message}`);
          this.eventBus.emit('data-load-error', error);
        },
      });
    } catch (err: unknown) {
      logger.error('DataSystem', `CSV 加载失败: ${(err as Error).message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _processData(rawData: any[]) {
    try {
      const validData = rawData.filter((row) => {
        return (
          row.x !== null &&
          row.y !== null &&
          row.z !== null &&
          !isNaN(row.x) &&
          !isNaN(row.y) &&
          !isNaN(row.z)
        );
      });

      if (validData.length === 0) {
        throw new Error('没有有效的数据点');
      }

      this.rawData = validData;
      state.set('data.antData', validData);

      const mappedPoints = this._mapToPoints(validData);
      state.set('data.mappedPoints', mappedPoints);

      this._adjustCamera(mappedPoints);

      logger.info('DataSystem', `数据处理完成: ${validData.length} 个点`);
      this.eventBus.emit('data-loaded', {
        _rawData: validData,
        points: mappedPoints,
      });

      this.eventBus.emit('data-processing-completed');
    } catch (err: unknown) {
      logger.error('DataSystem', `数据处理失败: ${(err as Error).message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _mapToPoints(data: any[]) {
    const positionScale = config.get('environment.positionScale') || 2.0;

    return data.map((row) => {
      return new THREE.Vector3(row.x * positionScale, row.y * positionScale, row.z * positionScale);
    });
  }

  _adjustCamera(points: THREE.Vector3[]) {
    if (!points || points.length === 0) return;

    this.eventBus.emit('data-processing-started');

    const box = new THREE.Box3();
    points.forEach((p: THREE.Vector3) => box.expandByPoint(p));

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const cameraDistFactor = 2.5;
    const distance = maxDim * cameraDistFactor;

    if (this.controls) {
      this.controls.setPosition(distance * 0.6, distance * 0.4, distance * 0.8, false);

      this.controls.setTarget(0, 0, 0, false);
    }

    logger.info('DataSystem', `相机已调整 | 距离: ${distance.toFixed(2)} | 目标: (0,0,0)`);
  }

  dispose() {
    this.rawData = [];
    this.initialized = false;
    logger.info('DataSystem', '数据系统已销毁');
  }
}

const dataSys = new DataSystem();
export default dataSys;

```

### src/systems/environment-sys.ts

```
/**
 * @file environment-sys.js
 * @description 环境系统 - 负责管理天空盒、背景和环境反射
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';
import { resolveAssetUrl } from '../utils/url-resolver';

class EnvironmentSystem {
  private scene: THREE.Scene | null = null;
  private initialized = false;
  private cubeTextureLoader: THREE.CubeTextureLoader;
  private fallbackColor: THREE.Color;

  constructor() {
    this.scene = null;
    this.initialized = false;
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.fallbackColor = new THREE.Color('#121414'); // 默认背景色
  }

  init({ scene }: any) {
    if (this.initialized) return this;
    this.scene = scene;

    this._loadSkybox();
    this._bindEvents();

    this.initialized = true;
    logger.info('EnvironmentSystem', '环境系统初始化完成');
    return this;
  }

  _bindEvents() {
    // 监听背景颜色变化，用于在禁用天空盒时切换
    eventBus.on('bg-color-changed', (color: any) => {
      const skyboxEnabled = config.get('environment.skybox.enabled');
      if (!skyboxEnabled) {
        this.fallbackColor.set(color);
        if (this.scene) this.scene.background = this.fallbackColor;
      }
    });
  }

  _loadSkybox() {
    const skyboxConfig = config.get('environment.skybox');

    if (!skyboxConfig || !skyboxConfig.enabled || !skyboxConfig.path) {
      logger.warn('EnvironmentSystem', '天空盒未配置或未启用，使用纯色背景');
      if (this.scene) this.scene.background = this.fallbackColor;
      return;
    }

    // ✅ 2. 使用 resolveAssetUrl 包装基础路径
    const basePath = resolveAssetUrl(skyboxConfig.path);
    const urls = [
      basePath + 'px.png',
      basePath + 'nx.png', // 右, 左
      basePath + 'py.png',
      basePath + 'ny.png', // 上, 下
      basePath + 'nz.png',
      basePath + 'pz.png', // 前, 后
    ];

    logger.debug('EnvironmentSystem', `正在加载天空盒: ${basePath}`);

    this.cubeTextureLoader.load(
      urls,
      (texture) => {
        if (this.scene) {
          this.scene.background = texture;
          this.scene.environment = texture;
        }
        logger.info('EnvironmentSystem', '✅ 天空盒加载成功并应用');
      },
      undefined,
      (error) => {
        logger.error('EnvironmentSystem', `天空盒加载失败: ${(error as Error).message}`);
        // ✅ 添加空值检查
        if (this.scene) {
          this.scene.background = this.fallbackColor;
        }
      }
    );
  }

  dispose() {
    if (this.scene) this.scene.background = null;
    if (this.scene) this.scene.environment = null;
    this.initialized = false;
    logger.info('EnvironmentSystem', '环境系统已销毁');
  }
}

const environmentSys = new EnvironmentSystem();
export default environmentSys;

```

### src/systems/light-sys.ts

```
/**
 * @file light-sys.ts
 * @description 统一光点管理器 - 只负责接收位置更新
 * @version 2.0 (Simplified)
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import { ILightRenderer } from './renderers/light-renderer';
import { MathLightRenderer } from './renderers/math-light-renderer';
import { ModelLightRenderer } from './renderers/model-light-renderer';

type RendererType = 'math' | 'model';

class LightSystem {
  private eventBus: any = null;
  private initialized = false;

  // 渲染器管理
  private renderers: Map<RendererType, ILightRenderer> = new Map();
  private activeRenderer: ILightRenderer | null = null;
  private currentType: RendererType = 'math';

  // 状态缓存
  private currentPosition: THREE.Vector3 = new THREE.Vector3();
  private isEnabled = true;

  constructor() {}

  async init({ eventBus, coordinateSystem }: { eventBus: any; coordinateSystem: any }) {
    if (this.initialized) {
      logger.warn('LightSystem', '光点系统已初始化');
      return this;
    }

    try {
      this.eventBus = eventBus;

      // 创建所有渲染器实例
      this.renderers.set('math', new MathLightRenderer(coordinateSystem));
      this.renderers.set('model', new ModelLightRenderer(coordinateSystem));

      // 根据配置决定默认激活哪个渲染器
      const activeComposition = config.get('sceneComposition.active');
      const defaultType = activeComposition === 'modelAnt' ? 'model' : 'math';

      await this._switchRenderer(defaultType);

      this._bindEvents();

      this.initialized = true;
      logger.info('LightSystem', '统一光点系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('LightSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * 🔥 核心方法：切换渲染器
   */
  private async _switchRenderer(type: RendererType) {
    if (this.currentType === type && this.activeRenderer?.isReady) {
      return;
    }

    // 销毁旧渲染器
    if (this.activeRenderer) {
      this.activeRenderer.dispose();
    }

    // 激活新渲染器
    const newRenderer = this.renderers.get(type);
    if (!newRenderer) {
      logger.error('LightSystem', `未知的渲染器类型: ${type}`);
      return;
    }

    if (!newRenderer.isReady) {
      await newRenderer.create();
    }

    this.activeRenderer = newRenderer;
    this.currentType = type;

    // 恢复到当前位置
    if (this.isEnabled && this.currentPosition.lengthSq() > 0) {
      this.activeRenderer.updatePosition(this.currentPosition);
    }

    logger.info('LightSystem', `✅ 已切换到 ${type} 渲染器`);
  }

  /**
   * 🔥 核心方法：绑定事件
   */
  private _bindEvents() {
    // 监听位置更新（新格式）
    this.eventBus.on('moving-light-position-updated', (data: any) => {
      const position = data.position || data;
      this.updatePosition(position);
    });

    // 监听场景切换
    this.eventBus.on('config-changed', async ({ key }: { key: string }) => {
      if (key === 'sceneComposition.active') {
        const compositionName = config.get('sceneComposition.active');
        const targetType = compositionName === 'modelAnt' ? 'model' : 'math';
        await this._switchRenderer(targetType);
      }
    });

    // 监听动画重置
    this.eventBus.on('animation-reset', () => {
      this.hide();
    });
  }

  /**
   * 更新光点位置
   */
  updatePosition(position: THREE.Vector3) {
    if (!this.isEnabled || !this.activeRenderer) return;

    this.currentPosition.copy(position);

    if (this.activeRenderer.isReady) {
      this.activeRenderer.updatePosition(position);
    }
  }

  show() {
    if (this.activeRenderer) {
      this.activeRenderer.show();
    }
  }

  hide() {
    if (this.activeRenderer) {
      this.activeRenderer.hide();
    }
  }

  enable() {
    this.isEnabled = true;
    this.show();
  }

  disable() {
    this.isEnabled = false;
    this.hide();
  }

  dispose() {
    this.renderers.forEach((renderer) => renderer.dispose());
    this.renderers.clear();
    this.activeRenderer = null;
    this.initialized = false;
    logger.info('LightSystem', '统一光点系统已销毁');
  }
}

const lightSys = new LightSystem();
export default lightSys;

```

### src/systems/lighting-sys.ts

```
/**
 * @file lighting-sys.js
 * @description 光照系统 - 管理场景中的环境光与直接光
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';

class LightingSystem {
  private scene: THREE.Scene | null;
  private initialized: boolean;
  private ambientLight: THREE.AmbientLight | null;
  private directionalLight: THREE.DirectionalLight | null;

  constructor() {
    this.scene = null;
    this.initialized = false;
    this.ambientLight = null;
    this.directionalLight = null;
  }

  init({ scene }: any) {
    if (this.initialized) return this;
    this.scene = scene;

    // 从配置创建光源
    this._createLights();

    this.initialized = true;
    logger.info('LightingSystem', '光照系统初始化完成');
    return this;
  }

  _createLights() {
    // 1. 环境光 (AmbientLight)
    // 为整个场景提供基础光照，防止模型暗部全黑
    const ambientConfig = config.get('lighting.ambient');
    this.ambientLight = new THREE.AmbientLight(ambientConfig.color, ambientConfig.intensity);
    this.ambientLight.name = 'AmbientLight';
    if (this.scene) {
      this.scene.add(this.ambientLight);
    }

    // 2. 平行光 (DirectionalLight)
    // 模拟一个无限远的光源（如太阳），产生高光和阴影
    const dirConfig = config.get('lighting.directional');
    this.directionalLight = new THREE.DirectionalLight(dirConfig.color, dirConfig.intensity);
    this.directionalLight.name = 'DirectionalLight';
    this.directionalLight.position.set(
      dirConfig.position.x,
      dirConfig.position.y,
      dirConfig.position.z
    );
    if (this.scene) {
      this.scene.add(this.directionalLight);
    }

    logger.debug('LightingSystem', '环境光和平行光已创建');
  }

  // 未来可以添加更新光照参数的方法，例如通过UI
  updateAmbient(color: any, intensity: number) {
    if (this.ambientLight) {
      this.ambientLight.color.set(color);
      this.ambientLight.intensity = intensity;
    }
  }

  updateDirectional(color: any, intensity: number) {
    if (this.directionalLight) {
      this.directionalLight.color.set(color);
      this.directionalLight.intensity = intensity;
    }
  }

  dispose() {
    // ✅ 添加空值检查
    if (this.ambientLight && this.scene) {
      this.scene.remove(this.ambientLight);
    }
    if (this.directionalLight && this.scene) {
      this.scene.remove(this.directionalLight);
    }
    this.ambientLight = null;
    this.directionalLight = null;
    this.initialized = false;
    logger.info('LightingSystem', '光照系统已销毁');
  }
}

const lightingSys = new LightingSystem();
export default lightingSys;

```

### src/systems/material-sys.ts

```
/**
 * @file material-sys.ts
 * @description 材质服务 - 预创建、管理和更新项目中所有共享材质的中央库。
 * ✨ 重构: 移除了与旧辉光系统相关的 emissiveIntensity 逻辑，并简化了路径着色器 uniform。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';

// 导入外部化的 GLSL 文件
import pathVertexShader from './shaders/path.vert?raw';
import pathFragmentShader from './shaders/path.frag?raw';

class MaterialService {
  private initialized: boolean;
  private materials: Map<string, THREE.Material>;

  constructor() {
    this.initialized = false;
    this.materials = new Map();
  }

  init() {
    if (this.initialized) {
      logger.warn('MaterialService', '材质服务已经初始化过了');
      return this;
    }

    this._createAllMaterials();
    this._bindEvents();

    this.initialized = true;
    logger.info('MaterialService', `材质服务初始化完成 | 创建了 ${this.materials.size} 个材质`);
    return this;
  }

  _createAllMaterials() {
    // 从 config 中一次性获取所有需要的配置节
    const pathCfg = config.get('path');
    const materialCfg = config.get('material');
    const particlesCfg = config.get('particles');
    const envCfg = config.get('environment');

    // 1. 路径材质 (PathLine)
    const pathMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uEmissive: { value: new THREE.Color(envCfg.pathColor) },
        uDepthIntensity: { value: pathCfg.depthIntensity },
        uCameraPosition: { value: new THREE.Vector3() },
      },
      vertexShader: pathVertexShader,
      fragmentShader: pathFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.materials.set('pathLine', pathMaterial);

    // ✅ 修正：为尘埃粒子材质提供完整的配置
    const dustParticlesMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(particlesCfg.dustColor),
      size: particlesCfg.dustSize,
      opacity: particlesCfg.dustOpacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true, // 粒子大小随距离衰减
      vertexColors: false,
    });
    this.materials.set('dustParticles', dustParticlesMaterial);

    // ✅ 修正：为移动光点材质提供完整的配置
    const movingLightMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(materialCfg.movingLight.emissiveColor),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.materials.set('movingLight', movingLightMaterial);
  }

  _bindEvents() {
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      this._updateMaterialProperty(key, value);
    });
  }

  _updateMaterialProperty(key: string, value: any) {
    const pathLineMat = this.materials.get('pathLine');
    const dustMat = this.materials.get('dustParticles');
    const lightMat = this.materials.get('movingLight');

    if (!pathLineMat || !dustMat || !lightMat) return;

    switch (key) {
      // PathLine Material updates
      case 'environment.pathColor':
        if (pathLineMat instanceof THREE.ShaderMaterial) {
          pathLineMat.uniforms?.uEmissive?.value.set(value);
        }
        break;
      case 'path.depthIntensity':
        if (pathLineMat instanceof THREE.ShaderMaterial) {
          pathLineMat.uniforms?.uDepthIntensity &&
            (pathLineMat.uniforms.uDepthIntensity.value = value);
        }
        break;

      // Dust Particles Material updates
      case 'particles.dustColor':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.color.set(value);
        }
        break;
      case 'particles.dustSize':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.size = value;
        }
        break;
      case 'particles.dustOpacity':
        if (dustMat instanceof THREE.PointsMaterial) {
          dustMat.opacity = value;
        }
        break;

      // Moving Light Material updates
      case 'material.movingLight.emissiveColor':
        if (lightMat instanceof THREE.MeshBasicMaterial) {
          lightMat.color.set(value);
        }
        break;
    }
  }

  get(name: string): THREE.Material | null {
    const material = this.materials.get(name);
    if (!material) {
      logger.warn('MaterialService', `请求的材质不存在: "${name}"`);
      return null;
    }
    return material;
  }

  dispose() {
    this.materials.forEach((material) => material.dispose());
    this.materials.clear();
    this.initialized = false;
    logger.info('MaterialService', '材质服务已销毁');
  }
}

const materialSys = new MaterialService();
export default materialSys;

```

### src/systems/model-sys.ts

```
/**
 * @file model-sys.ts
 * @description 模型服务 - 负责加载、缓存和处理 GLB/GLTF 模型资源。
 */
// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import logger from '../utils/logger';
import materialSys from './material-sys';
import { resolveAssetUrl } from '../utils/url-resolver';

class ModelService {
  private initialized: boolean;
  private loader: GLTFLoader;
  private cache: Map<string, any>;

  constructor() {
    this.initialized = false;
    this.loader = new GLTFLoader();
    this.cache = new Map(); // 用于缓存已加载的GLTF结果
  }

  init() {
    if (this.initialized) {
      logger.warn('ModelService', '模型服务已经初始化过了');
      return this;
    }
    this.initialized = true;
    logger.info('ModelService', '模型服务初始化完成');
    return this;
  }

  /**
   * 异步加载一个GLTF/GLB模型
   * @param {string} relativeUrl - 相对于/public目录的模型路径
   * @returns {Promise<THREE.Group>} 返回一个包含模型场景的Promise
   */
  async load(relativeUrl: string) {
    const url = resolveAssetUrl(relativeUrl);

    if (this.cache.has(url)) {
      const cachedGltf = this.cache.get(url);
      const modelClone = cachedGltf.scene.clone(true);
      logger.debug('ModelService', `从缓存加载模型: ${relativeUrl}`);
      return modelClone;
    }

    try {
      logger.info('ModelService', `开始加载模型: ${relativeUrl}`);
      const gltf = await this.loader.loadAsync(url);

      // 缓存原始加载结果
      this.cache.set(url, gltf);

      // 返回场景的克隆，以防原始缓存被修改
      const modelClone = gltf.scene.clone(true);
      logger.info('ModelService', `✅ 模型加载成功: ${relativeUrl}`);

      return modelClone;
    } catch (error: unknown) {
      logger.error('ModelService', `加载模型失败 "${relativeUrl}": ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * 将指定名称的材质应用到模型的所有网格上
   * @param {THREE.Group} model - 目标模型
   * @param {string} materialName - 在 MaterialService 中注册的材质名称
   */
  applyMaterial(model: any, materialName: string) {
    const material = materialSys.get(materialName);
    if (!material) {
      logger.warn('ModelService', `应用材质失败: 材质 "${materialName}" 不存在`);
      return;
    }

    model.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
    logger.debug('ModelService', `已将材质 "${materialName}" 应用到模型上`);
  }

  dispose() {
    this.cache.clear();
    this.initialized = false;
    logger.info('ModelService', '模型服务已销毁');
  }
}

const modelSys = new ModelService();
export default modelSys;

```

### src/systems/particles-sys.ts

```
/**
 * @file particles-sys.ts
 * @description 粒子系统 - 球形分布 + 自转 + 呼吸 + 浮动效果
 * ✨ 重构: 移除了对旧辉光属性 material.particles.emissiveIntensity 的监听。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

const DEFAULT_SPHERE_RADIUS = 1600;
// const _DEFAULT_SYSTEM_SCALE = 1.0;
const DEFAULT_BREATH_INTENSITY = 0.1;
const DEFAULT_BREATH_PERIOD = 3.0;
const DEFAULT_FLOAT_INTENSITY = 0.3;
const DEFAULT_FLOAT_PERIOD = 4.0;

class ParticlesSystem {
  private eventBus: any;

  // ✅ 公共属性
  public scene: THREE.Scene | null = null;
  public baseRadius: number = 1600;

  private coordinateSystem: any;
  private initialized: boolean;
  private dustParticles: any;
  private particleContainer: any;
  private rotationAxis: THREE.Vector3;
  private rotationSpeed: number;
  private tiltXZ: number;
  private tiltXY: number;

  private breathIntensity: number;
  private breathPeriod: number;
  private floatIntensity: number;
  private floatPeriod: number;
  private initialPositions: any;
  private baseSize: number;

  constructor() {
    this.eventBus = null;

    this.coordinateSystem = null;
    this.initialized = false;

    this.dustParticles = null;
    this.particleContainer = null;

    this.rotationAxis = new THREE.Vector3(0, 1, 0);
    this.rotationSpeed = 0;
    this.tiltXZ = 0;
    this.tiltXY = 0;

    this.breathIntensity = DEFAULT_BREATH_INTENSITY;
    this.breathPeriod = DEFAULT_BREATH_PERIOD;
    this.floatIntensity = DEFAULT_FLOAT_INTENSITY;
    this.floatPeriod = DEFAULT_FLOAT_PERIOD;

    this.initialPositions = null;
    this.baseSize = 0.6;
  }

  init({
    eventBus,
    scene,
    coordinateSystem,
  }: {
    eventBus: any;
    scene: THREE.Scene;
    coordinateSystem: any;
  }) {
    if (this.initialized) {
      logger.warn('ParticlesSystem', '粒子系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this.particleContainer = new THREE.Group();
      this.particleContainer.name = 'ParticleContainer';

      const particleAnchor = this.coordinateSystem.getParticleAnchor();
      particleAnchor.add(this.particleContainer);

      const initialScale = config.get('particles.systemScale') ?? 1.0;
      this.particleContainer.scale.setScalar(initialScale);
      logger.info('ParticlesSystem', `初始粒子缩放: ${initialScale}x`);

      this._createDustParticles();
      this._bindEvents();
      this._loadInitialConfig();

      this.initialized = true;
      logger.info('ParticlesSystem', '粒子系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('ParticlesSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createDustParticles() {
    const count = config.get('particles.dustCount') ?? 3000;
    const radius = config.get('particles.sphereRadius') ?? DEFAULT_SPHERE_RADIUS;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius * Math.cbrt(Math.random());

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    this.initialPositions = positions.slice();

    const material = materialSys.get('dustParticles');

    if (!material) {
      logger.error(
        'ParticlesSystem',
        '无法从 MaterialService 获取 "dustParticles" 材质，粒子无法创建。'
      );
      return;
    }

    this.baseSize = config.get('particles.dustSize') ?? 0.6;

    this.dustParticles = new THREE.Points(geometry, material);
    this.dustParticles.name = 'DustParticles';
    this.dustParticles.userData = { glow: true };

    this.particleContainer.add(this.dustParticles);

    postprocessSys.addGlowObject(this.dustParticles);

    logger.debug('ParticlesSystem', `尘埃粒子已创建: ${count} 个`);
  }

  _bindEvents() {
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }

  _loadInitialConfig() {
    this.breathIntensity = config.get('particles.breathIntensity');
    this.floatIntensity = config.get('particles.floatIntensity');
    this.rotationSpeed = config.get('particles.rotationSpeed');
    this.tiltXZ = config.get('particles.rotationTiltXZ');
    this.tiltXY = config.get('particles.rotationTiltXY');
    this._updateRotationAxis();
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
    if (!this.dustParticles) return;

    switch (key) {
      case 'particles.dustColor':
        (this.dustParticles.material as THREE.PointsMaterial).color.set(value);
        break;

      case 'particles.dustSize':
        this.baseSize = value;
        (this.dustParticles.material as THREE.PointsMaterial).size = value;
        break;

      case 'particles.dustOpacity':
        (this.dustParticles.material as THREE.PointsMaterial).opacity = value;
        break;

      case 'particles.systemScale':
        if (this.particleContainer) {
          this.particleContainer.scale.setScalar(value);
        }
        break;

      case 'particles.dustCount':
        this._rebuildDustParticles(value);
        break;

      case 'particles.rotationSpeed':
        this.rotationSpeed = value;
        break;

      case 'particles.rotationTiltXZ':
        this.tiltXZ = value;
        this._updateRotationAxis();
        break;

      case 'particles.rotationTiltXY':
        this.tiltXY = value;
        this._updateRotationAxis();
        break;

      case 'particles.breathIntensity':
        this.breathIntensity = value;
        break;

      case 'particles.floatIntensity':
        this.floatIntensity = value;
        break;
    }
  }

  _updateRotationAxis() {
    const radXZ = (this.tiltXZ * Math.PI) / 180;
    const radXY = (this.tiltXY * Math.PI) / 180;

    const axis = new THREE.Vector3(0, 1, 0);
    axis.applyAxisAngle(new THREE.Vector3(1, 0, 0), radXY);
    axis.applyAxisAngle(new THREE.Vector3(0, 0, 1), radXZ);

    this.rotationAxis.copy(axis.normalize());
  }

  _rebuildDustParticles(count: number) {
    if (this.dustParticles) {
      this.particleContainer?.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
    }

    this._createDustParticles();

    logger.info('ParticlesSystem', `粒子系统已重建: ${count} 个`);
  }

  update(elapsed: number) {
    if (this.dustParticles && this.rotationSpeed !== 0) {
      // Note: The rotation is not frame-rate independent here. For smoother results, multiply by delta in the main loop.
      this.dustParticles.rotateOnAxis(this.rotationAxis, this.rotationSpeed * 0.001);
    }

    if (this.dustParticles && this.initialPositions) {
      const positions = this.dustParticles.geometry.attributes.position.array as Float32Array;
      const sizes = this.dustParticles.geometry.attributes.size.array as Float32Array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const phaseOffset = sizes[i] ?? 0; // ✅ 提供默认值

        const floatPhase = elapsed / this.floatPeriod + phaseOffset;
        const floatOffset = Math.sin(floatPhase * Math.PI * 2) * this.floatIntensity;

        positions[i * 3 + 1] = this.initialPositions[i * 3 + 1] + floatOffset;
      }

      this.dustParticles.geometry.attributes.position.needsUpdate = true;

      const globalBreath =
        1.0 + Math.sin((elapsed / this.breathPeriod) * Math.PI * 2) * this.breathIntensity * 0.3;
      (this.dustParticles.material as THREE.PointsMaterial).size = this.baseSize * globalBreath;
    }
  }

  enable() {
    if (this.particleContainer) {
      this.particleContainer.visible = true;
      logger.debug('ParticlesSystem', '已启用');
    }
  }

  disable() {
    if (this.particleContainer) {
      this.particleContainer.visible = false;
      logger.debug('ParticlesSystem', '已禁用');
    }
  }

  dispose() {
    if (this.dustParticles && this.particleContainer) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
    }

    if (this.particleContainer && this.coordinateSystem) {
      const particleAnchor = this.coordinateSystem.getParticleAnchor();
      particleAnchor.remove(this.particleContainer);
    }

    this.initialized = false;
    logger.info('ParticlesSystem', '粒子系统已销毁');
  }
}

const particlesSys = new ParticlesSystem();
export default particlesSys;

```

### src/systems/path-sys.ts

```
/**
 * @file path-sys.ts
 * @description 极简路径系统 - 火箭轨迹的可视化
 * @version 5.1 (Type Safety Fix)
 *
 * 核心逻辑：
 *   1. 预分配足够的顶点空间（基于节点数量）
 *   2. 监听火箭位置更新，动态扩展绘制范围
 *   3. 使用 drawRange 控制可见部分
 *   4. ✅ 添加完整的类型守卫，修复所有 undefined 错误
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

class PathSystem {
  private eventBus: any;
  public scene: THREE.Scene | null = null;
  public isEnabled: boolean = true;

  private coordinateSystem: any;
  private initialized: boolean;
  private pathLine: THREE.Line | null;
  private pathContainer: THREE.Group | null;

  // 核心数据
  private rawPoints: THREE.Vector3[] = []; // CSV原始节点
  private samplesPerSegment: number = 10; // 每段插值点数
  private currentDrawCount: number = 0; // 当前绘制的顶点数
  private totalSamples: number = 0; // 总采样点数

  constructor() {
    this.eventBus = null;
    this.coordinateSystem = null;
    this.initialized = false;
    this.pathLine = null;
    this.pathContainer = null;
  }

  init({
    eventBus,
    scene,
    coordinateSystem,
  }: {
    eventBus: any;
    scene: THREE.Scene;
    coordinateSystem: any;
  }) {
    if (this.initialized) {
      logger.warn('PathSystem', '路径系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this.pathContainer = new THREE.Group();
      this.pathContainer.name = 'PathContainer';

      const initialScale = config.get('path.scale') || 1.0;
      this.pathContainer.scale.setScalar(initialScale);

      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.add(this.pathContainer);

      this._bindEvents();

      this.initialized = true;
      logger.info('PathSystem', '✅ 极简路径系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('PathSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    // 🔥 核心事件1：数据加载完成，创建路径几何体
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.rawPoints = data.points;
      this._createPath();
    });

    // 🔥 核心事件2：火箭位置更新，扩展路径绘制
    this.eventBus.on('moving-light-position-updated', ({ progress }: { progress: number }) => {
      this._updatePathByProgress(progress);
    });

    // 配置变更
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // 动画重置
    this.eventBus.on('animation-reset', () => {
      this.currentDrawCount = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });
  }

  _handleConfigChange({ key, value }: { key: string; value: any }) {
    if (key === 'path.scale' && this.pathContainer) {
      this.pathContainer.scale.setScalar(value);
    }
  }

  /**
   * 🔥 核心方法1：创建路径几何体（预分配足够空间）
   * ✅ 修复：添加完整的类型守卫
   */
  _createPath() {
    if (this.rawPoints.length < 2) {
      logger.error('PathSystem', '节点数量不足');
      return;
    }

    // 清理旧对象
    if (this.pathLine && this.pathContainer) {
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
    }

    // 计算总采样点数（每段插值 + 最后一个节点）
    const totalSegments = this.rawPoints.length - 1;
    this.totalSamples = totalSegments * this.samplesPerSegment + 1;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.totalSamples * 3);

    // 🔥 核心逻辑：预填充所有插值点
    let idx = 0;
    for (let i = 0; i < totalSegments; i++) {
      const p0 = this.rawPoints[i];
      const p1 = this.rawPoints[i + 1];

      // ✅ 核心修复：添加类型守卫
      if (!p0 || !p1) {
        logger.warn('PathSystem', `跳过无效段: index=${i}`);
        continue;
      }

      for (let j = 0; j < this.samplesPerSegment; j++) {
        const t = j / this.samplesPerSegment;
        const x = THREE.MathUtils.lerp(p0.x, p1.x, t);
        const y = THREE.MathUtils.lerp(p0.y, p1.y, t);
        const z = THREE.MathUtils.lerp(p0.z, p1.z, t);

        positions[idx * 3] = x;
        positions[idx * 3 + 1] = y;
        positions[idx * 3 + 2] = z;
        idx++;
      }
    }

    // ✅ 修复：添加最后一个节点的类型守卫
    const lastPoint = this.rawPoints[this.rawPoints.length - 1];
    if (lastPoint) {
      positions[idx * 3] = lastPoint.x;
      positions[idx * 3 + 1] = lastPoint.y;
      positions[idx * 3 + 2] = lastPoint.z;
    } else {
      logger.warn('PathSystem', '最后一个节点不存在');
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0); // 初始不绘制

    const material = materialSys.get('pathLine');

    if (!material) {
      logger.error('PathSystem', '❌ 无法获取路径材质');
      return;
    }

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };

    postprocessSys.addGlowObject(this.pathLine);
    this.pathContainer?.add(this.pathLine);

    this.currentDrawCount = 0;

    logger.info(
      'PathSystem',
      `✅ 路径已创建 | 节点数: ${this.rawPoints.length} | 总采样点: ${this.totalSamples}`
    );
  }

  /**
   * 🔥 核心方法2：根据归一化进度 [0, 1] 更新路径绘制范围
   */
  _updatePathByProgress(progress: number) {
    if (!this.pathLine || this.totalSamples === 0) return;

    // 钳制进度范围
    progress = THREE.MathUtils.clamp(progress, 0, 1);

    // 计算当前应该绘制到第几个顶点
    const targetDrawCount = Math.floor(progress * this.totalSamples);

    // 只在需要扩展时更新（避免重复刷新）
    if (targetDrawCount > this.currentDrawCount) {
      this.currentDrawCount = targetDrawCount;
      this.pathLine.geometry.setDrawRange(0, Math.max(1, this.currentDrawCount));
    }
  }

  /**
   * 更新相机位置（用于深度着色器）
   */
  updateCameraPosition(camera: THREE.Camera) {
    if (this.pathLine && camera && this.pathContainer) {
      const material = this.pathLine.material as THREE.ShaderMaterial;
      if (material.uniforms?.uCameraPosition) {
        const worldCamPos = camera.position.clone();
        const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
        material.uniforms.uCameraPosition.value.copy(localCamPos);
      }
    }
  }

  update(_delta: number) {
    // 占位方法（未来可添加动画效果）
  }

  enable() {
    this.isEnabled = true;
    if (this.pathContainer) this.pathContainer.visible = true;
    logger.debug('PathSystem', '已启用');
  }

  disable() {
    this.isEnabled = false;
    if (this.pathContainer) this.pathContainer.visible = false;
    logger.debug('PathSystem', '已禁用');
  }

  dispose() {
    if (this.pathLine && this.pathContainer) {
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
    }

    if (this.pathContainer && this.coordinateSystem) {
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.remove(this.pathContainer);
    }

    this.initialized = false;
    logger.info('PathSystem', '路径系统已销毁');
  }
}

const pathSys = new PathSystem();
export default pathSys;

```

### src/systems/postprocess-sys.ts

```
/**
 * @file postprocess-sys.ts
 * @description 后处理系统
 * @version 8.2 (Layout-Refactor)
 * @✨ 重构: 将所有效果合并到一个EffectPass中，提升性能与稳定性。
 * @✨ 重构: 优化了相机更新逻辑，避免销毁和重建composer。
 * @🔧 修正: 保留并稳定了基于TextureEffect的扫描线实现。
 * @🔧 清理: 移除了过时的注释和逻辑。
 * @✅ 改造: 修改 handleResize 方法以接收外部尺寸。
 */

// 1.只使用postprocessing库中的效果，不允许使用自制shader，这条注释不允许删除！
// 2.禁止添加不稳定的 DotScreenEffect 和 HueSaturationEffect，这条注释不允许删除！
// 3.postprocessing库没有原生的扫描线组件！这条注释不允许删除！

import * as THREE from 'three';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SelectiveBloomEffect,
  BokehEffect,
  ChromaticAberrationEffect,
  TextureEffect,
  BrightnessContrastEffect,
  Selection,
  BlendFunction,
  NoiseEffect,
} from 'postprocessing';
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';

class PostprocessSystem {
  private mainScene: THREE.Scene | null = null;
  private camera: THREE.Camera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private initialized = false;

  private composer: EffectComposer | null = null;
  private selection: Selection;

  private bloomEffect: SelectiveBloomEffect | null = null;
  private bokehEffect: BokehEffect | null = null;
  private chromaticAberrationEffect: ChromaticAberrationEffect | null = null;
  private filmEffect: NoiseEffect | null = null;
  private scanlineEffect: TextureEffect | null = null;
  private scanlineTexture: THREE.DataTexture | null = null;
  private brightnessContrastEffect: BrightnessContrastEffect | null = null;

  constructor() {
    this.selection = new Selection();
  }

  init({
    scene,
    camera,
    renderer,
  }: {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
  }) {
    if (this.initialized) return this;
    try {
      this.mainScene = scene;
      this.renderer = renderer;
      this.camera = camera;

      if (!this.camera) {
        throw new Error('相机对象未提供，无法初始化后处理系统');
      }

      this._createComposer();
      this._bindEvents();
      this.updateAllEffectsFromConfig();

      this.initialized = true;
      logger.info('PostprocessSystem', '✅ 后处理系统初始化完成 (v8.2)');
      return this;
    } catch (err: unknown) {
      logger.error('PostprocessSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  addGlowObject(object: THREE.Object3D) {
    this.selection.add(object);
  }

  removeGlowObject(object: THREE.Object3D) {
    this.selection.delete(object);
  }

  private _createComposer() {
    if (!this.renderer || !this.mainScene || !this.camera) return;

    // 确保渲染器有有效尺寸
    const size = this.renderer.getSize(new THREE.Vector2());
    if (size.width === 0 || size.height === 0) {
      logger.warn('PostprocessSystem', 'Renderer 尺寸无效，延迟创建 Composer');
      return;
    }

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.UnsignedByteType,
    });

    // 尺寸将在第一次 handleResize 时正确设置
    // this.composer.setSize(window.innerWidth, window.innerHeight);

    // 1. 基础渲染通道，必须是第一个
    const renderPass = new RenderPass(this.mainScene, this.camera);
    this.composer.addPass(renderPass);

    // 2. 创建所有效果实例
    this._createAllEffects();

    // 将效果组合到 EffectPass 中
    if (this.bloomEffect) {
      this.composer.addPass(new EffectPass(this.camera, this.bloomEffect));
    }
    if (this.bokehEffect) {
      this.composer.addPass(new EffectPass(this.camera, this.bokehEffect));
    }

    const remainingEffects = [
      this.chromaticAberrationEffect,
      this.filmEffect,
      this.scanlineEffect,
      this.brightnessContrastEffect,
    ].filter(Boolean) as any[];

    if (remainingEffects.length > 0) {
      const finalPass = new EffectPass(this.camera, ...remainingEffects);
      this.composer!.addPass(finalPass);
    }
  }

  private _createAllEffects() {
    this.bloomEffect = new SelectiveBloomEffect(this.mainScene as any, this.camera as any, {
      blendFunction: BlendFunction.ADD,
      // selection: this.selection,
      mipmapBlur: true,
    });

    this.bokehEffect = new BokehEffect({
      focus: 40.0,
      dof: 0.02,
      aperture: 0.025,
      maxBlur: 0.01,
    });

    this.chromaticAberrationEffect = new ChromaticAberrationEffect();
    this.filmEffect = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT });
    this.brightnessContrastEffect = new BrightnessContrastEffect();

    this._createScanlineEffect();
  }

  private _createScanlineEffect() {
    const data = new Uint8Array([255, 255, 255, 255, 0, 0, 0, 255]);
    const texture = new THREE.DataTexture(data, 1, 2, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    this.scanlineTexture = texture;

    this.scanlineEffect = new TextureEffect({
      blendFunction: BlendFunction.OVERLAY,
      texture,
    });
  }

  render(delta: number) {
    if (!this.composer || !this.mainScene || !this.camera) return;

    if (config.get('postprocess.enabled')) {
      this.composer.render(delta);
    } else {
      this.renderer?.render(this.mainScene, this.camera);
    }
  }

  private _bindEvents() {
    eventBus.on('config-changed', this._handleConfigChange.bind(this));

    eventBus.on('camera-changed', (camera: THREE.Camera) => {
      this.camera = camera;
      if (this.composer) {
        this.composer.passes.forEach((pass) => {
          if (pass instanceof RenderPass) (pass as any).camera = camera;
          // EffectPass 的相机是构造时传入的，通常不需要动态修改
          // 但如果需要，可以访问 pass.effects.forEach(e => e.camera = camera)
        });
        logger.info('PostprocessSystem', '相机已更新');
      }
    });
  }

  private _handleConfigChange({ key }: { key: string; value: any }) {
    if (!key.startsWith('postprocess.')) return;
    this.updateEffectFromConfig(key);
  }

  updateEffectFromConfig(key: string) {
    const parts = key.split('.');
    if (parts.length < 2) return;
    const effectName = parts[1];
    const cfg = config.get(`postprocess.${effectName}`);
    if (!cfg) return;

    switch (effectName) {
      case 'bloom':
        if (this.bloomEffect) {
          this.bloomEffect.intensity = cfg.intensity;
          this.bloomEffect.luminanceMaterial.threshold = cfg.luminanceThreshold;
          this.bloomEffect.luminanceMaterial.smoothing = cfg.luminanceSmoothing;
          this.bloomEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
        }
        break;

      case 'bokeh':
        if (this.bokehEffect) {
          this.bokehEffect.uniforms.get('focus')!.value = cfg.focus;
          this.bokehEffect.uniforms.get('dof')!.value = cfg.dof;
          this.bokehEffect.uniforms.get('aperture')!.value = cfg.aperture;
          this.bokehEffect.uniforms.get('maxBlur')!.value = cfg.maxBlur;
          this.bokehEffect.blendMode.blendFunction = cfg.enabled
            ? BlendFunction.NORMAL
            : BlendFunction.SKIP;
        }
        break;

      case 'chromaticAberration':
        if (this.chromaticAberrationEffect) {
          const offsetX = cfg.offset?.x ?? 0.0;
          const offsetY = cfg.offset?.y ?? 0.0;
          this.chromaticAberrationEffect.offset.set(offsetX, offsetY);
          this.chromaticAberrationEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
        }
        break;

      case 'film':
        const filmEnabled = cfg.enabled;
        if (this.filmEffect) {
          this.filmEffect.blendMode.opacity.value = filmEnabled ? cfg.noiseIntensity : 0.0;
        }
        if (this.scanlineEffect && this.scanlineTexture) {
          this.scanlineEffect.blendMode.opacity.value = filmEnabled ? cfg.scanlineIntensity : 0.0;
          const height = this.composer?.getRenderer().getSize(new THREE.Vector2()).height || 1080;
          this.scanlineTexture.repeat.y = Math.max(
            1,
            Math.floor((cfg.scanlineCount / 2) * (height / 1080))
          );
          this.scanlineTexture.needsUpdate = true;
        }
        break;

      case 'brightnessContrast':
        if (this.brightnessContrastEffect) {
          this.brightnessContrastEffect.uniforms.get('brightness')!.value = cfg.brightness;
          this.brightnessContrastEffect.uniforms.get('contrast')!.value = cfg.contrast;
          this.brightnessContrastEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
        }
        break;
    }
  }

  updateAllEffectsFromConfig() {
    const postprocessConfig = config.get('postprocess');
    if (postprocessConfig) {
      Object.keys(postprocessConfig).forEach((key) => {
        if (key !== 'enabled') {
          this.updateEffectFromConfig(`postprocess.${key}`);
        }
      });
    }
  }

  // ✅ 核心修改: 接收 width 和 height
  handleResize(width: number, height: number) {
    this.composer?.setSize(width, height);
    // 更新扫描线数量时也需要考虑新的高度
    this.updateEffectFromConfig('postprocess.film');
  }

  dispose() {
    this.composer?.dispose();
    this.scanlineTexture?.dispose();
    this.initialized = false;
    logger.info('PostprocessSystem', '后处理系统已销毁');
  }
}

const postprocessSys = new PostprocessSystem();
export default postprocessSys;

```

### src/systems/renderers/light-renderer.ts

```
/**
 * @file light-renderer.ts
 * @description 光点渲染器接口定义 - 策略模式的核心抽象
 */
import * as THREE from 'three';

export interface ILightRenderer {
  /**
   * 创建视觉对象（球体/模型/粒子等）
   */
  create(): Promise<void> | void;

  /**
   * 更新光点位置
   */
  updatePosition(position: THREE.Vector3): void;

  /**
   * 更新光点朝向（可选，仅3D模型需要）
   */
  updateRotation?(direction: THREE.Vector3): void;

  /**
   * 显示光点
   */
  show(): void;

  /**
   * 隐藏光点
   */
  hide(): void;

  /**
   * 销毁资源
   */
  dispose(): void;

  /**
   * 是否已准备好（异步加载完成）
   */
  readonly isReady: boolean;
}

```

### src/systems/renderers/math-light-renderer.ts

```
/**
 * @file math-light-renderer.ts
 * @description 数学球体光点渲染器 - 基于 THREE.Mesh
 */
import * as THREE from 'three';
import { ILightRenderer } from './light-renderer';
import materialSys from '../material-sys';
import postprocessSys from '../postprocess-sys';
import logger from '../../utils/logger';

export class MathLightRenderer implements ILightRenderer {
  private mesh: THREE.Mesh | null = null;
  private coordinateSystem: any;
  private _isReady = false;

  constructor(coordinateSystem: any) {
    this.coordinateSystem = coordinateSystem;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  create(): void {
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);
    const material = materialSys.get('movingLight');

    if (!material) {
      logger.error('MathLightRenderer', '无法获取材质');
      return;
    }

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.name = 'MovingLight_Math';
    this.mesh.visible = false;
    this.mesh.userData = { glow: true };

    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.mesh);

    postprocessSys.addGlowObject(this.mesh);

    this._isReady = true;
    logger.info('MathLightRenderer', '✅ 数学球体已创建');
  }

  updatePosition(position: THREE.Vector3): void {
    if (this.mesh) {
      this.mesh.position.copy(position);
      this.mesh.visible = true;
    }
  }

  show(): void {
    if (this.mesh) this.mesh.visible = true;
  }

  hide(): void {
    if (this.mesh) this.mesh.visible = false;
  }

  dispose(): void {
    if (this.mesh) {
      postprocessSys.removeGlowObject(this.mesh);
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.mesh);
      this.mesh.geometry.dispose();
      // 不销毁共享材质
    }
    this._isReady = false;
    logger.info('MathLightRenderer', '数学球体已销毁');
  }
}

```

### src/systems/renderers/model-light-renderer.ts

```
/**
 * @file model-light-renderer.ts
 * @description 3D模型光点渲染器 - 组合方案：跟随点光源 + 轻微自发光
 * @version 3.0 (Combined Lighting Solution)
 *
 * 核心改进：
 *   1. ✅ 添加跟随火箭的点光源（方案1）
 *   2. ✅ 为模型材质添加轻微自发光（方案3）
 *   3. ✅ 使用 Three.js r152+ 的新 API (colorSpace 替代 encoding)
 *   4. ✅ 平滑朝向插值 + 竞态条件防护
 */

import * as THREE from 'three';
import { ILightRenderer } from './light-renderer';
import modelSys from '../model-sys';
import postprocessSys from '../postprocess-sys';
import logger from '../../utils/logger';

export class ModelLightRenderer implements ILightRenderer {
  private group: THREE.Group | null = null;
  private followLight: THREE.PointLight | null = null; // ✅ 新增：跟随光源
  private coordinateSystem: any;
  private modelPath: string;
  private previousPosition = new THREE.Vector3();
  private _isReady = false;
  private pendingPosition: THREE.Vector3 | null = null;

  // 竞态条件防护
  private loadAbortController: AbortController | null = null;
  private currentLoadId: number = 0;

  // 朝向平滑插值
  private targetRotation = new THREE.Quaternion();
  private currentRotation = new THREE.Quaternion();
  private baseLerpAlpha = 0.15;

  constructor(coordinateSystem: any, modelPath = '/models/rocket.glb') {
    this.coordinateSystem = coordinateSystem;
    this.modelPath = modelPath;
  }

  get isReady(): boolean {
    return this._isReady;
  }

  async create(): Promise<void> {
    try {
      // 取消旧的加载请求
      if (this.loadAbortController) {
        this.loadAbortController.abort();
      }
      this.loadAbortController = new AbortController();

      const loadId = ++this.currentLoadId;
      logger.info('ModelLightRenderer', `开始加载模型 (loadId=${loadId}): ${this.modelPath}`);

      const loadedModel = await modelSys.load(this.modelPath);

      // 检查是否被中止
      if (this.loadAbortController?.signal.aborted) {
        logger.warn('ModelLightRenderer', `加载被中止 (loadId=${loadId})`);
        this._cleanupModel(loadedModel);
        return;
      }

      if (loadId !== this.currentLoadId) {
        logger.warn('ModelLightRenderer', `新的加载请求已发出，放弃旧结果 (loadId=${loadId})`);
        return;
      }

      // 创建容器组
      this.group = new THREE.Group();
      this.group.name = 'MovingLight_Model';
      this.group.add(loadedModel);
      this.group.scale.setScalar(1.0);
      this.group.visible = false;

      // ✅ 方案1：创建跟随光源
      this.followLight = new THREE.PointLight('#ffffff', 2.0, 50);
      this.followLight.position.set(0, 5, 5); // 相对于模型的位置
      this.followLight.name = 'FollowLight';
      this.group.add(this.followLight);

      // ✅ 方案3：设置材质（包含轻微自发光）
      this._setupMaterials(loadedModel);

      // 初始化旋转四元数
      const initialDirection = new THREE.Vector3(0, 1, 0);
      const forward = new THREE.Vector3(0, 1, 0);
      this.targetRotation.setFromUnitVectors(forward, initialDirection);
      this.currentRotation.copy(this.targetRotation);
      this.group.quaternion.copy(this.currentRotation);

      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.add(this.group);

      postprocessSys.addGlowObject(this.group);

      this._isReady = true;

      // 延迟应用待处理位置
      if (this.pendingPosition) {
        const cachedPosition = this.pendingPosition.clone();
        setTimeout(() => {
          this.updatePosition(cachedPosition);
          logger.info(
            'ModelLightRenderer',
            `已应用待处理位置 (loadId=${loadId}): (${cachedPosition.x.toFixed(2)}, ${cachedPosition.y.toFixed(2)}, ${cachedPosition.z.toFixed(2)})`
          );
        }, 50);
        this.pendingPosition = null;
      }

      logger.info('ModelLightRenderer', `✅ 模型已加载并准备就绪 (loadId=${loadId})`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        logger.warn('ModelLightRenderer', `模型加载被中止`);
        return;
      }
      logger.error('ModelLightRenderer', `模型加载失败: ${(err as Error).message}`);
    }
  }

  /**
   * ✅ 方案3：设置材质（轻微自发光 + Three.js r152+ 兼容）
   */
  private _setupMaterials(model: THREE.Object3D): void {
    model.traverse((child: THREE.Object3D) => {
      if (!(child as THREE.Mesh).isMesh) return;
      const mesh = child as THREE.Mesh;

      const hasTexture =
        mesh.material && (mesh.material as THREE.MeshStandardMaterial).map !== null;

      if (hasTexture) {
        const mat = mesh.material as THREE.MeshStandardMaterial;

        // ✅ 修复：添加轻微自发光（使用原始颜色）
        mat.emissive = mat.color.clone().multiplyScalar(0.9); // 原色的30%
        mat.emissiveIntensity = 0; // 提高到0.8

        // 优化 PBR 属性
        mat.roughness = 0.65; // 更光滑
        mat.metalness = 0.8; // 增加金属感

        mat.toneMapped = true;

        // ✅ 修复: 使用 Three.js r152+ 的新 API
        if (mat.map) {
          mat.map.colorSpace = THREE.SRGBColorSpace; // 替代旧的 .encoding
        }

        mat.needsUpdate = true;
      } else {
        // ✅ 无贴图部分也使用发光材质
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#00ff88'),
          emissive: new THREE.Color('#00ff88'),
          emissiveIntensity: 0.5,
          roughness: 0.4,
          metalness: 0.3,
        });
      }
    });
  }

  /**
   * 更新位置（包含平滑朝向）
   */
  updatePosition(position: THREE.Vector3): void {
    if (!this._isReady || !this.group) {
      this.pendingPosition = position.clone();
      logger.info('ModelLightRenderer', '位置缓存中，等待渲染器就绪');
      return;
    }

    this.pendingPosition = null;

    this.group.position.copy(position);

    // 计算运动向量和速度
    const displacement = new THREE.Vector3().subVectors(position, this.previousPosition);
    const speed = displacement.length();

    if (speed > 0.01) {
      displacement.normalize();

      const forward = new THREE.Vector3(0, 1, 0);
      this.targetRotation.setFromUnitVectors(forward, displacement);

      // 根据速度动态调整插值系数
      const dynamicAlpha = THREE.MathUtils.clamp(this.baseLerpAlpha + speed * 0.02, 0.05, 0.3);

      this.currentRotation.slerp(this.targetRotation, dynamicAlpha);
      this.group.quaternion.copy(this.currentRotation);

      this.previousPosition.copy(position);
    }

    this.group.visible = true;

    logger.debug(
      'ModelLightRenderer',
      `位置已更新: (${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)})`
    );
  }

  show(): void {
    if (this.group) this.group.visible = true;
  }

  hide(): void {
    if (this.group) this.group.visible = false;
  }

  /**
   * 清理模型资源
   */
  private _cleanupModel(model: THREE.Object3D): void {
    model.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.geometry?.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material?.dispose();
        }
      }
    });
  }

  dispose(): void {
    if (this.loadAbortController) {
      this.loadAbortController.abort();
      this.loadAbortController = null;
    }

    if (this.group) {
      postprocessSys.removeGlowObject(this.group);
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.group);

      // ✅ 新增: 清理光源
      if (this.followLight) {
        this.followLight.dispose();
        this.followLight = null;
      }

      this._cleanupModel(this.group);
    }

    this._isReady = false;
    this.pendingPosition = null;
    logger.info('ModelLightRenderer', '模型已销毁');
  }
}

```

### src/systems/scene-director-sys.ts

```
/**
 * @file scene-director-sys.ts
 * @description 场景导演系统 - 根据配置动态启用/禁用场景中的视觉组件
 * 🔧 修复: 区分初始化和场景切换，只在切换时强制更新位置
 */
import logger from '../utils/logger';
import config from '../config';
import state from './state';

// 引入所有受其控制的视觉系统
import pathSys from './path-sys';
import particlesSys from './particles-sys';
import lightSys from './light-sys';

class SceneDirector {
  private eventBus: any = null;
  private initialized = false;
  private components: Map<string, any> = new Map();
  private isInitializing = true; // ✅ 标记是否在初始化阶段

  constructor() {
    this.eventBus = null;
    this.initialized = false;
    this.components = new Map();
  }

  init({ eventBus }: { eventBus: any }) {
    if (this.initialized) return this;

    this.eventBus = eventBus;
    this._registerComponents();
    this._bindEvents();

    // 在应用配置前就标记初始化完成
    this.initialized = true;
    this.isInitializing = false;

    // 立即应用初始配置（此时不会触发位置更新）
    this._applyCurrentComposition();

    logger.info('SceneDirector', '场景导演系统初始化完成');
    return this;
  }

  private _registerComponents() {
    this.components.set('math-path', pathSys);
    this.components.set('math-light', lightSys);
    this.components.set('model-light', lightSys); // 共用同一个实例
    this.components.set('particle-dust', particlesSys);
    logger.debug('SceneDirector', `注册了 ${this.components.size} 个视觉组件`);
  }

  private _bindEvents() {
    this.eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'sceneComposition.active') {
        logger.info('SceneDirector', `检测到场景构成切换: ${value}`);
        this._applyCurrentComposition();
      }
    });
  }

  private _applyCurrentComposition() {
    const activeCompositionName = config.get('sceneComposition.active');
    const composition = config.get(`sceneComposition.compositions.${activeCompositionName}`);

    if (!composition) {
      logger.error('SceneDirector', `未找到名为 "${activeCompositionName}" 的场景构成`);
      return;
    }

    logger.info('SceneDirector', `正在应用场景构成: "${activeCompositionName}"`);

    // 1. 先禁用所有受控组件
    this.components.forEach((component) => {
      if (typeof component.disable === 'function') {
        component.disable();
      }
    });

    // 2. 根据配置启用所需的组件
    composition.forEach((item: any) => {
      const component = this.components.get(item.type);
      if (component) {
        if (item.enabled && typeof component.enable === 'function') {
          component.enable();
          logger.debug('SceneDirector', `  -> 已启用: ${item.type}`);
        }
      } else {
        logger.warn('SceneDirector', `  -> 未知组件类型: ${item.type}`);
      }
    });

    // 🔧 修复：场景切换后强制刷新当前位置（Tween.js版本）
    // 🔧 核心修复：场景切换后刷新当前位置（增强版）
    if (!this.isInitializing) {
      // 第一次尝试：立即发送位置更新（用于已就绪的渲染器）
      setTimeout(() => {
        const currentStep = state.get('animation.currentStep') || 0;
        const mappedPoints = state.get('data.mappedPoints') || [];
        const totalSteps = mappedPoints.length;

        if (totalSteps > 0 && currentStep < totalSteps) {
          const position = mappedPoints[currentStep];
          if (position) {
            logger.info('SceneDirector', `场景切换后刷新位置 (快速): 步数=${currentStep}`);
            this.eventBus.emit('moving-light-position-updated', {
              position: position.clone(),
              distance: currentStep / Math.max(1, totalSteps - 1),
            });
          }
        }
      }, 100); // 第一次尝试：100ms

      // 第二次尝试：延迟发送（确保异步加载的渲染器也能收到）
      setTimeout(() => {
        const currentStep = state.get('animation.currentStep') || 0;
        const mappedPoints = state.get('data.mappedPoints') || [];
        const totalSteps = mappedPoints.length;

        if (totalSteps > 0 && currentStep < totalSteps) {
          const position = mappedPoints[currentStep];
          if (position) {
            logger.info('SceneDirector', `场景切换后刷新位置 (延迟): 步数=${currentStep}`);
            this.eventBus.emit('moving-light-position-updated', {
              position: position.clone(),
              distance: currentStep / Math.max(1, totalSteps - 1),
            });
          }
        }
      }, 350); // 第二次尝试：350ms（给模型加载足够时间）
    }
  }

  // 确保 dispose 在类内部正确结构
  dispose() {
    this.components.clear();
    this.initialized = false;
    logger.info('SceneDirector', '场景导演系统已销毁');
  }
}

const sceneDirector = new SceneDirector();
export default sceneDirector;

```

### src/systems/shaders/path.frag

```
/**
 * @file path.frag
 * @description 路径线段的片元着色器
 * ✨ 重构: 移除了 uEmissiveIntensity 和 uColor uniform，辉光由后处理 bloom 效果决定。
 */
uniform vec3 uEmissive; // 路径的颜色
uniform float uDepthIntensity;
uniform vec3 uCameraPosition;
varying vec3 vWorldPosition;

void main() {
  // 最终颜色直接使用 uEmissive。如果该颜色足够亮，后处理系统中的 Bloom 效果会自动捕捉它。
  vec3 finalColor = uEmissive;
  
  // 根据与相机的距离计算 alpha 透明度，实现景深效果
  float distToCamera = length(vWorldPosition - uCameraPosition);
  float fade = smoothstep(0.0, 200.0, distToCamera); // 在200个单位的距离内渐变
  float alpha = 1.0 - fade * uDepthIntensity;
  
  gl_FragColor = vec4(finalColor, alpha);
}

```

### src/systems/shaders/path.vert

```
varying vec3 vWorldPosition;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}

```

### src/systems/state.ts

```
/**
 * @file state.ts
 * @description 全局状态管理器 - 存储和管理运行时动态变化的数据。
 */
import eventBus from '../event-bus';
import logger from '../utils/logger';

// 默认状态
const DEFAULT_STATE = {
  data: {
    antData: [],
    mappedPoints: [],
  },
  animation: {
    currentStep: 0,
    lerpT: 0,
    animating: false,
  },
};

// 深度克隆函数
function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => deepClone(item));
  const cloned: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

class StateManager {
  private _state = deepClone(DEFAULT_STATE);

  get(key: string): any {
    try {
      if (!key) return this._state;
      const keys = key.split('.');
      let value = this._state as any;
      for (const k of keys) {
        if (!k) continue; // ✅ 跳过空字符串
        if (value === null || value === undefined) return null;
        if (value) value = value[k];
      }
      return value;
    } catch (err: unknown) {
      logger.error('State', `获取状态异常 [${key}]: ${(err as Error).message}`);
      return null;
    }
  }

  set(key: string, value: any): boolean {
    try {
      const keys = key.split('.');
      let target = this._state as any;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!k) continue; // ✅ 跳过 undefined
        if (k && (!target[k] || typeof target[k] !== 'object')) {
          target[k] = {};
        }
        target = target[k];
      }
      const lastKey = keys[keys.length - 1];
      if (target[lastKey!] !== value) {
        target[lastKey!] = value;
        // ✅ 发出独立的 state-changed 事件
        eventBus.emit('state-changed', { key, value });
      }
      return true;
    } catch (err: unknown) {
      logger.error('State', `设置状态异常 [${key}]: ${(err as Error).message}`);
      return false;
    }
  }

  reset() {
    this._state = deepClone(DEFAULT_STATE);
    logger.info('State', '状态已重置为默认值');
    Object.keys(DEFAULT_STATE).forEach((topKey) => {
      eventBus.emit('state-changed', { key: topKey, value: (DEFAULT_STATE as any)[topKey] });
    });
  }

  getRaw() {
    return this._state;
  }
}

const state = new StateManager();
export default state;

```

### src/types/index.ts

```
/**
 * @file types/index.ts
 * @description 全局类型定义
 */

import * as THREE from 'three';
// import type CameraControls from 'camera-controls';

// 配置对象结构
export interface SceneComposition {
  type: 'math-path' | 'math-light' | 'particle-dust' | 'model';
  enabled: boolean;
  name?: string;
  path?: string;
}

export interface Config {
  sceneComposition: {
    active: string;
    compositions: Record<string, SceneComposition[]>;
  };
  data: {
    csvUrl: string;
    availableDatasets: Dataset[];
  };
  animation: {
    speedFactor: number;
    loop: boolean;
  };
  // ... 其他配置字段
}

// 数据类型
export interface Dataset {
  name: string;
  path: string;
  description: string;
}

export interface AnimationState {
  currentStep: number;
  lerpT: number;
  animating: boolean;
}

// EventBus 事件类型
export interface ConfigChangedEvent {
  key: string;
  value: any;
}

export interface StateChangedEvent {
  key: string;
  value: any;
}

// 系统初始化参数类型
export interface SystemInitParams {
  eventBus: any; // EventBus 类型
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderer?: THREE.WebGLRenderer;
  [key: string]: any;
}

// EventBus 类型定义
export interface EventBus {
  on(event: string, callback: Function): void;
  once(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  emit(event: string, ...args: any[]): void;
  clear(): void;
}

```

### src/ui/ui-basic.ts

```
/**
 * @file ui-basic.ts
 * @description 基础 UI 控制面板
 * ✅ 核心改造: 所有控件的 'change' 事件现在直接调用 config.set()，
 *    不再发出独立的 eventBus 事件。
 */
import eventBus from '../event-bus';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';
import dataSys from '../systems/data-sys';
import state from '../systems/state';

class UIBasic {
  private controls: Map<string, any>;
  private folders: Map<string, any>;
  private _pane: any;
  private _isInitialized: boolean;
  private configData: any;
  private stateData: any;
  private tempObjects: any;
  private dataControls: any[];
  private descriptionBlade: any;

  constructor() {
    this.controls = new Map();
    this.folders = new Map();
    this._pane = null;
    this._isInitialized = false;

    this.configData = config.getRaw();
    this.stateData = state.getRaw();

    // 临时对象用于Tweakpane的颜色选择器等特殊控件
    this.tempObjects = {
      dustColor: { dustColor: this.configData.particles.dustColor },
      pathColor: { pathColor: this.configData.environment.pathColor },
      pathPointColor: { pathPointColor: this.configData.particles.pathPointColor },
    };

    this.dataControls = [];
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIBasic', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    this._pane = new Pane({
      title: '基础控制',
      expanded: true,
      container: uiContainer.getScrollContent() || undefined,
    });

    const dataFolder = this._pane.addFolder({ title: '数据源', expanded: true });
    this.folders.set('data', dataFolder);

    this._rebuildDataControls();
    this._createAnimationControls();
    this._createCameraControls();
    this._createParticleControls();
    this._createPathControls();
    this._createAudioControls();
    this._bindEvents();

    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-basic', this);

    logger.info('UIBasic', `基础 UI 已初始化 | 控件数量: ${this.controls.size}`);
  }

  _rebuildDataControls() {
    const folder = this.folders.get('data');
    if (!folder) return;

    this.dataControls.forEach((c) => c.dispose());
    this.dataControls = [];
    this.controls.delete('data.csvUrl');

    const datasets = dataSys.getAvailableDatasets();

    if (datasets.length === 0) {
      const errorBlade = folder.addBlade({
        view: 'text',
        label: '错误',
        parse: (v: any) => String(v),
        value: '未找到数据源清单',
      });
      this.dataControls.push(errorBlade);
      return;
    }

    const datasetOptions = datasets.reduce((acc: Record<string, string>, ds: any) => {
      acc[ds.name] = ds.path;
      return acc;
    }, {});

    const csvSelect = folder.addBinding(this.configData.data, 'csvUrl', {
      label: 'CSV文件',
      options: datasetOptions,
    });

    csvSelect.on('change', (ev: any) => {
      config.set('data.csvUrl', ev.value);
      eventBus.emit('data-load-requested', ev.value);
      this._updateDatasetDescription();
    });

    this.controls.set('data.csvUrl', csvSelect);
    this.dataControls.push(csvSelect);

    const descriptionBlade = folder.addBlade({
      view: 'text',
      label: '描述',
      parse: (v: any) => String(v),
      value: '',
    });
    this.dataControls.push(descriptionBlade);
    this.descriptionBlade = descriptionBlade;

    this._updateDatasetDescription();

    const loadBtn = folder.addButton({ title: '🔄 重新加载' });
    loadBtn.on('click', () => {
      eventBus.emit('data-load-requested', config.get('data.csvUrl'));
    });
    this.dataControls.push(loadBtn);
  }

  _updateDatasetDescription() {
    if (!this.descriptionBlade) return;
    const currentPath = config.get('data.csvUrl');
    const datasets = dataSys.getAvailableDatasets();
    const currentDataset = datasets.find((ds: any) => ds.path === currentPath);
    this.descriptionBlade.value = currentDataset ? currentDataset.description : '---';
  }

  _createAnimationControls() {
    const folder = this._pane.addFolder({ title: '动画控制', expanded: true });

    const playButton = folder.addButton({
      title: state.get('animation.animating') ? '⏸️ 暂停' : '▶️ 播放',
    });
    playButton.on('click', () => {
      const isPlaying = !state.get('animation.animating');
      state.set('animation.animating', isPlaying);
    });

    // 监听状态变化来更新按钮标题
    eventBus.on('state-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'animation.animating') {
        playButton.title = value ? '⏸️ 暂停' : '▶️ 播放';
      }
    });

    const stepSlider = folder.addBinding(this.stateData.animation, 'currentStep', {
      label: '当前步数',
      min: 0,
      max: 100,
      step: 1,
    });
    stepSlider.on('change', (ev: any) => {
      eventBus.emit('step-to', ev.value);
    });
    this.controls.set('animation.currentStep', stepSlider);

    eventBus.on('data-loaded', (data: { points: any[] }) => {
      stepSlider.max = data.points.length - 1;
      stepSlider.refresh();
    });

    const speed = folder.addBinding(this.configData.animation, 'speedFactor', {
      label: '速度',
      min: 0.05,
      max: 5,
      step: 0.05,
    });
    speed.on('change', (ev: any) => config.set('animation.speedFactor', ev.value));
    this.controls.set('animation.speedFactor', speed);

    const loop = folder.addBinding(this.configData.animation, 'loop', { label: '循环播放' });
    loop.on('change', (ev: any) => config.set('animation.loop', ev.value));
    this.controls.set('animation.loop', loop);

    this.folders.set('animation', folder);
  }

  _createCameraControls() {
    const folder = this._pane.addFolder({ title: '相机设置', expanded: false });

    const mode = folder.addBinding(this.configData.camera, 'mode', {
      label: '相机模式',
      options: { 透视: 'perspective', 正交: 'orthographic' },
    });
    mode.on('change', (ev: any) => config.set('camera.mode', ev.value));
    this.controls.set('camera.mode', mode);

    const viewContainer = folder.addFolder({ title: '视图预设', expanded: false });
    ['top', 'front', 'side'].forEach((key) => {
      viewContainer
        .addButton({ title: `${key.charAt(0).toUpperCase() + key.slice(1)} View` })
        .on('click', () => eventBus.emit('view-changed', key));
    });
    viewContainer.addButton({ title: '🔄 翻转180°' }).on('click', () => eventBus.emit('flip-view'));

    const fovBinding = folder.addBinding(this.configData.camera, 'fov', {
      label: '视野角度',
      min: 20,
      max: 120,
      step: 1,
    });
    fovBinding.on('change', (ev: any) => config.set('camera.fov', ev.value));
    this.controls.set('camera.fov', fovBinding);

    // 动态禁用/启用UI
    const setViewControlsState = (cameraMode: string) => {
      const disabled = cameraMode === 'perspective';
      viewContainer.children.forEach((c: any) => (c.disabled = disabled));
      fovBinding.disabled = !disabled;
    };
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'camera.mode') setViewControlsState(value);
    });
    setViewControlsState(config.get('camera.mode'));

    this.folders.set('camera', folder);
  }

  _createParticleControls() {
    const folder = this._pane.addFolder({ title: '粒子系统', expanded: false });

    const dustColor = folder.addBinding(this.tempObjects.dustColor, 'dustColor', {
      label: '粒子颜色',
      view: 'color',
    });
    dustColor.on('change', (ev: any) => config.set('particles.dustColor', ev.value));
    this.controls.set('particles.dustColor', dustColor);

    const dustSize = folder.addBinding(this.configData.particles, 'dustSize', {
      label: '粒子大小',
      min: 0.05,
      max: 1.0,
      step: 0.01,
    });
    dustSize.on('change', (ev: any) => config.set('particles.dustSize', ev.value));
    this.controls.set('particles.dustSize', dustSize);

    const dustCount = folder.addBinding(this.configData.particles, 'dustCount', {
      label: '粒子数量',
      min: 500,
      max: 10000,
      step: 100,
    });
    dustCount.on('change', (ev: any) => config.set('particles.dustCount', ev.value));
    this.controls.set('particles.dustCount', dustCount);

    const breath = folder.addBinding(this.configData.particles, 'breathIntensity', {
      label: '呼吸强度',
      min: 0,
      max: 0.5,
      step: 0.01,
    });
    breath.on('change', (ev: any) => config.set('particles.breathIntensity', ev.value));
    this.controls.set('particles.breathIntensity', breath);

    const float = folder.addBinding(this.configData.particles, 'floatIntensity', {
      label: '浮动强度',
      min: 0,
      max: 1.0,
      step: 0.01,
    });
    float.on('change', (ev: any) => config.set('particles.floatIntensity', ev.value));
    this.controls.set('particles.floatIntensity', float);

    const rotSpeed = folder.addBinding(this.configData.particles, 'rotationSpeed', {
      label: '自转速度',
      min: -5,
      max: 5,
      step: 0.1,
    });
    rotSpeed.on('change', (ev: any) => config.set('particles.rotationSpeed', ev.value));
    this.controls.set('particles.rotationSpeed', rotSpeed);

    const rotTiltXZ = folder.addBinding(this.configData.particles, 'rotationTiltXZ', {
      label: '自转倾斜(XZ)',
      min: -90,
      max: 90,
      step: 1,
    });
    rotTiltXZ.on('change', (ev: any) => config.set('particles.rotationTiltXZ', ev.value));
    this.controls.set('particles.rotationTiltXZ', rotTiltXZ);

    const rotTiltXY = folder.addBinding(this.configData.particles, 'rotationTiltXY', {
      label: '自转俯仰(XY)',
      min: -90,
      max: 90,
      step: 1,
    });
    rotTiltXY.on('change', (ev: any) => config.set('particles.rotationTiltXY', ev.value));
    this.controls.set('particles.rotationTiltXY', rotTiltXY);

    const opacity = folder.addBinding(this.configData.particles, 'dustOpacity', {
      label: '透明度',
      min: 0,
      max: 1,
      step: 0.01,
    });
    opacity.on('change', (ev: any) => config.set('particles.dustOpacity', ev.value));
    this.controls.set('particles.dustOpacity', opacity);

    this.folders.set('particles', folder);
  }

  _createPathControls() {
    const folder = this._pane.addFolder({ title: '路径设置', expanded: false });

    const pathColor = folder.addBinding(this.tempObjects.pathColor, 'pathColor', {
      label: '路径颜色',
      view: 'color',
    });
    pathColor.on('change', (ev: any) => config.set('environment.pathColor', ev.value));
    this.controls.set('environment.pathColor', pathColor);

    const pointColor = folder.addBinding(this.tempObjects.pathPointColor, 'pathPointColor', {
      label: '光点颜色',
      view: 'color',
    });
    pointColor.on('change', (ev: any) => config.set('particles.pathPointColor', ev.value));
    this.controls.set('particles.pathPointColor', pointColor);

    const pointSize = folder.addBinding(this.configData.particles, 'pathPointSize', {
      label: '光点大小',
      min: 0.1,
      max: 2.0,
      step: 0.05,
    });
    pointSize.on('change', (ev: any) => config.set('particles.pathPointSize', ev.value));
    this.controls.set('particles.pathPointSize', pointSize);

    const depth = folder.addBinding(this.configData.path, 'depthIntensity', {
      label: '景深强度',
      min: 0,
      max: 1,
      step: 0.01,
    });
    depth.on('change', (ev: any) => config.set('path.depthIntensity', ev.value));
    this.controls.set('path.depthIntensity', depth);

    this.folders.set('path', folder);
  }

  _createAudioControls() {
    const folder = this._pane.addFolder({ title: '背景音乐', expanded: false });

    let audioLoaded = false;
    const playButton = folder.addButton({ title: '▶️ 播放音乐' });
    playButton.on('click', () => {
      if (!audioLoaded) {
        eventBus.emit('audio-load', '/background-music.mp3');
        audioLoaded = true;
        eventBus.once('audio-loaded', () => eventBus.emit('audio-toggle'));
      } else {
        eventBus.emit('audio-toggle');
      }
    });
    eventBus.on('audio-playing', (isPlaying: boolean) => {
      playButton.title = isPlaying ? '⏸️ 暂停音乐' : '▶️ 播放音乐';
    });

    folder.addButton({ title: '⏹️ 停止' }).on('click', () => eventBus.emit('audio-stop'));

    const volumeObj = { volume: 0.5 };
    folder
      .addBinding(volumeObj, 'volume', { label: '音量', min: 0, max: 1, step: 0.01 })
      .on('change', (ev: any) => eventBus.emit('audio-volume-changed', ev.value));

    this.folders.set('audio', folder);
  }

  _bindEvents() {
    eventBus.on('datasets-list-updated', () => this._rebuildDataControls());

    // 监听配置变更
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      this._updateControl(key, value, this.configData, this.tempObjects);
    });

    // ✅ 新增: 监听状态变更
    eventBus.on('state-changed', ({ key, value }: { key: string; value: any }) => {
      this._updateControl(key, value, this.stateData);
    });

    eventBus.on('preset-loaded', () => {
      this.refresh();
    });
  }

  // ✅ 新增: 提取一个可重用的辅助方法来更新UI控件
  _updateControl(key: string, value: any, primarySource: any, secondarySource?: any) {
    const control = this.controls.get(key);
    if (!control) return;

    const pathParts = key.split('.');
    let target: any;
    let tempKey: string | undefined;

    // 特殊处理颜色等绑定到 tempObjects 的情况
    if (
      secondarySource &&
      (key === 'particles.dustColor' ||
        key === 'environment.pathColor' ||
        key === 'particles.pathPointColor')
    ) {
      tempKey = pathParts[1]; // e.g., 'dustColor'
      if (tempKey) {
        target = secondarySource[tempKey];
        if (target && target[tempKey] !== value) {
          target[tempKey] = value;
          control.refresh();
        }
      }
      return;
    }

    // 处理直接绑定到 primarySource (configData or stateData) 的情况
    target = primarySource;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (part) target = target[part];
    }
    const lastKey = pathParts[pathParts.length - 1];
    if (target && lastKey && target[lastKey] !== value) {
      target[lastKey] = value;
      control.refresh();
    }
  }

  updateBindings() {
    this.tempObjects.dustColor.dustColor = config.get('particles.dustColor');
    this.tempObjects.pathColor.pathColor = config.get('environment.pathColor');
    this.tempObjects.pathPointColor.pathPointColor = config.get('particles.pathPointColor');

    ['particles.dustColor', 'environment.pathColor', 'particles.pathPointColor'].forEach((key) => {
      const control = this.controls.get(key);
      if (control) control.refresh();
    });

    logger.debug('UIBasic', '临时对象已更新并刷新');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') control.refresh();
    });
    logger.debug('UIBasic', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) this._pane.dispose();
    this.controls.clear();
    this.folders.clear();
    this.dataControls.forEach((c) => c.dispose());
    this.dataControls = [];
    this._isInitialized = false;
    logger.info('UIBasic', 'UI 已销毁');
  }
}

const uiBasic = new UIBasic();
export default uiBasic;

```

### src/ui/ui-container.ts

```
/**
 * @file ui-container.ts
 * @description UI 容器系统 - 仅负责创建滚动区域
 * @version 4.0 (Pure Container)
 */
import logger from '../utils/logger';

class UIContainer {
  private panelContainer: HTMLElement | null = null;
  private scrollContent: HTMLElement | null = null;
  private initialized: boolean = false;

  init() {
    if (this.initialized) {
      logger.warn('UIContainer', '容器已初始化');
      return;
    }

    this.panelContainer = document.getElementById('left-panel');

    if (!this.panelContainer) {
      logger.error('UIContainer', '初始化失败: 未找到 #left-panel 元素。');
      return;
    }

    this._createScrollContent();
    this._setupScrollBehavior();

    this.initialized = true;
    logger.info('UIContainer', 'UI 容器已初始化（不干预 Tweakpane 样式）');
  }

  private _createScrollContent() {
    this.panelContainer!.innerHTML = '';
    this.scrollContent = document.createElement('div');
    this.scrollContent.id = 'ui-scroll-content';
    this.panelContainer!.appendChild(this.scrollContent);
  }

  private _setupScrollBehavior() {
    // 阻止滚轮事件冒泡到外层
    this.scrollContent!.addEventListener(
      'wheel',
      (e) => {
        e.stopPropagation();
      },
      { passive: false }
    );
  }

  getScrollContent(): HTMLElement | null {
    return this.scrollContent;
  }

  dispose() {
    if (this.panelContainer) {
      this.panelContainer.innerHTML = '';
    }
    this.panelContainer = null;
    this.scrollContent = null;
    this.initialized = false;
    logger.info('UIContainer', 'UI 容器已销毁');
  }
}

export default new UIContainer();

```

### src/ui/ui-coordinates.ts

```
/**
 * @file ui-coordinates.js
 * @description 坐标系统 UI 面板 - 缩放控制
 * ✅ 已删除：整体旋转、调试信息按钮
 */
import { Pane } from 'tweakpane';
import logger from '../utils/logger';
import uiContainer from './ui-container';
import config from '../config';

class UICoordinates {
  private pane: any;
  private eventBus: any;
  private initialized: boolean;
  private controls: Map<string, any>;
  private configData: any;

  constructor() {
    this.pane = null;
    this.eventBus = null;
    this.initialized = false;
    this.controls = new Map();

    this.configData = config.getRaw();
  }

  async init({ eventBus }: { eventBus: any }) {
    if (this.initialized) {
      logger.warn('UICoordinates', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UICoordinates', '容器未初始化');
      return;
    }

    try {
      this.eventBus = eventBus;

      this.pane = new Pane({
        title: '坐标系统',
        container: uiContainer.getScrollContent() || undefined,
        expanded: true,
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-coordinates', this);

      logger.info('UICoordinates', '坐标系统 UI 已初始化');

      return this;
    } catch (err: unknown) {
      logger.error('UICoordinates', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createControls() {
    // 整体缩放
    const dataSpaceScale = this.pane.addBinding(this.configData.coordinates.dataSpace, 'scale', {
      label: '整体缩放',
      min: 0.1,
      max: 5.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    dataSpaceScale.on('change', (ev: any) => {
      config.set('coordinates.dataSpace.scale', ev.value);
    });
    this.controls.set('coordinates.dataSpace.scale', dataSpaceScale);

    // 粒子系统缩放
    const particleScale = this.pane.addBinding(this.configData.particles, 'systemScale', {
      label: '粒子缩放',
      min: 0.1,
      max: 5.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    particleScale.on('change', (ev: any) => {
      config.set('particles.systemScale', ev.value);
    });
    this.controls.set('particles.systemScale', particleScale);

    // 路径缩放
    const pathScale = this.pane.addBinding(this.configData.path, 'scale', {
      label: '路径缩放',
      min: 0.1,
      max: 3.0,
      step: 0.1,
    });
    // 🟢 改造: 使用 config.set
    pathScale.on('change', (ev: any) => {
      config.set('path.scale', ev.value);
    });
    this.controls.set('path.scale', pathScale);

    // 重置按钮
    this.pane
      .addButton({
        title: '🔄 重置坐标系统',
      })
      .on('click', () => {
        // 🟢 改造: 通过 eventBus 发出命令
        this.eventBus.emit('coordinate-system-reset');
      });
  }

  _bindEvents() {
    // 监听 reset 命令完成
    this.eventBus.on('coordinate-system-reset-completed', () => {
      this.refresh();
      logger.info('UICoordinates', '坐标系统 UI 已刷新');
    });

    // 监听外部配置变更
    this.eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData;
        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (part) target = target[part];
        }
        const lastKey = pathParts[pathParts.length - 1]!;
        if (target && target[lastKey] !== value) {
          target[lastKey] = value;
          control.refresh();
        }
      }
    });

    // 监听预设加载
    this.eventBus.on('preset-loaded', () => {
      this.refresh();
    });
  }

  updateBindings() {
    logger.debug('UICoordinates', '绑定检查完成');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UICoordinates', 'UI 已刷新');
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.controls.clear();
    this.initialized = false;
    logger.info('UICoordinates', 'UI 已销毁');
  }
}

const uiCoordinates = new UICoordinates();
export default uiCoordinates;

```

### src/ui/ui-monitor.ts

```
/**
 * @file ui-monitor.ts
 * @description 监视器覆盖层UI - 在3D视图上显示状态信息。
 */
import eventBus from '../event-bus';
import state from '../systems/state';
import logger from '../utils/logger';

class UIMonitor {
  private container: HTMLElement | null = null;
  private stepDisplay: HTMLElement | null = null;
  private initialized: boolean = false;

  init() {
    if (this.initialized) {
      logger.warn('UIMonitor', 'UI已初始化');
      return;
    }

    this.container = document.getElementById('monitor-overlay-ui');
    if (!this.container) {
      logger.error('UIMonitor', '初始化失败: 未找到 #monitor-overlay-ui 元素。');
      return;
    }

    this._createElements();
    this._bindEvents();

    this.initialized = true;
    logger.info('UIMonitor', '监视器UI已初始化');
  }

  private _createElements() {
    // 动画步数显示
    const stepWrapper = document.createElement('div');
    stepWrapper.className = 'monitor-info-item';
    stepWrapper.innerHTML = `<span class="label">STEP:</span>`;
    this.stepDisplay = document.createElement('span');
    this.stepDisplay.className = 'value';
    this.stepDisplay.textContent = '0 / 0';
    stepWrapper.appendChild(this.stepDisplay);

    this.container!.appendChild(stepWrapper);
  }

  private _bindEvents() {
    const updateStepDisplay = () => {
      const currentStep = state.get('animation.currentStep') || 0;
      const totalSteps = (state.get('data.mappedPoints') || []).length;
      if (this.stepDisplay) {
        this.stepDisplay.textContent = `${currentStep} / ${totalSteps > 0 ? totalSteps - 1 : 0}`;
      }
    };

    eventBus.on('state-changed', ({ key }: { key: string }) => {
      if (key === 'animation.currentStep' || key === 'data.mappedPoints') {
        updateStepDisplay();
      }
    });

    // 初始化时也更新一次
    updateStepDisplay();
  }

  dispose() {
    if (this.container) {
      this.container.innerHTML = '';
    }
    this.initialized = false;
    logger.info('UIMonitor', '监视器UI已销毁');
  }
}

export default new UIMonitor();

```

### src/ui/ui-post.ts

```
/**
 * @file ui-post.ts
 * @description 后期处理控制面板
 * @✨ 新增: 添加了景深(Bokeh)和色差(Chromatic Aberration)效果的UI控件。
 * @✨ 重构: 使用辅助函数简化了控件创建流程，提高了代码可读性和可维护性。
 * @🔧 清理: 移除了过时和重复的UI创建代码。
 */
import eventBus from '../event-bus';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';

class UIPost {
  private _pane: any;
  private _isInitialized: boolean;
  private controls: Map<string, any>;
  private configData: any;

  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIPost', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');

    this._pane = new Pane({
      title: '后期处理',
      expanded: false,
      container: uiContainer.getScrollContent() || undefined,
    });

    this._createPostProcessingControls();
    this._bindEvents();
    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后期处理 UI 已初始化');
  }

  _createPostProcessingControls() {
    // 全局开关
    this.addBinding(this._pane, 'postprocess.enabled', { label: '启用后期处理' });

    // ---------- 辉光 (Bloom) ----------
    const bloomFolder = this._pane.addFolder({ title: '光晕 (Bloom)', expanded: true });
    this.addBinding(bloomFolder, 'postprocess.bloom.enabled', { label: '启用' });
    this.addBinding(bloomFolder, 'postprocess.bloom.intensity', {
      label: '强度',
      min: 0,
      max: 5,
      step: 0.05,
    });
    this.addBinding(bloomFolder, 'postprocess.bloom.luminanceThreshold', {
      label: '亮度阈值',
      min: 0,
      max: 1,
      step: 0.01,
    });

    // ---------- 景深 (Bokeh) - 新增 ----------
    const bokehFolder = this._pane.addFolder({ title: '景深 (Bokeh)', expanded: false });
    this.addBinding(bokehFolder, 'postprocess.bokeh.enabled', { label: '启用' });
    this.addBinding(bokehFolder, 'postprocess.bokeh.focus', {
      label: '焦距',
      min: 0,
      max: 100,
      step: 0.1,
    });
    this.addBinding(bokehFolder, 'postprocess.bokeh.dof', {
      label: '景深范围',
      min: 0,
      max: 0.1,
      step: 0.001,
    });
    this.addBinding(bokehFolder, 'postprocess.bokeh.aperture', {
      label: '光圈',
      min: 0,
      max: 0.1,
      step: 0.001,
    });
    this.addBinding(bokehFolder, 'postprocess.bokeh.maxBlur', {
      label: '最大模糊',
      min: 0,
      max: 0.05,
      step: 0.001,
    });

    // ---------- 色差 (Chromatic Aberration) - 新增 ----------
    const caFolder = this._pane.addFolder({
      title: '色差 (Chromatic Aberration)',
      expanded: false,
    });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.enabled', { label: '启用' });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.offset.x', {
      label: '偏移量 X',
      min: -0.01,
      max: 0.01,
      step: 0.0001,
    });
    this.addBinding(caFolder, 'postprocess.chromaticAberration.offset.y', {
      label: '偏移量 Y',
      min: -0.01,
      max: 0.01,
      step: 0.0001,
    });

    // ---------- 胶片效果 (Film) ----------
    const filmFolder = this._pane.addFolder({ title: '胶片效果 (Film)', expanded: false });
    this.addBinding(filmFolder, 'postprocess.film.enabled', { label: '启用' });
    this.addBinding(filmFolder, 'postprocess.film.noiseIntensity', {
      label: '噪点强度',
      min: 0,
      max: 1,
      step: 0.01,
    });
    this.addBinding(filmFolder, 'postprocess.film.scanlineIntensity', {
      label: '扫描线强度',
      min: 0,
      max: 1,
      step: 0.01,
    });
    this.addBinding(filmFolder, 'postprocess.film.scanlineCount', {
      label: '扫描线数量',
      min: 0,
      max: 4096,
      step: 64,
    });

    // ---------- 亮度/对比度 ----------
    const bcFolder = this._pane.addFolder({ title: '亮度/对比度', expanded: false });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.enabled', { label: '启用' });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.brightness', {
      label: '亮度',
      min: -1,
      max: 1,
      step: 0.01,
    });
    this.addBinding(bcFolder, 'postprocess.brightnessContrast.contrast', {
      label: '对比度',
      min: -1,
      max: 1,
      step: 0.01,
    });
  }

  /**
   * 辅助函数，用于创建绑定、设置事件监听并注册控件，极大简化代码。
   */
  private addBinding(folder: any, key: string, options: any) {
    const pathParts = key.split('.');
    let target = this.configData;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (part) target = target[part];
    }

    const property = pathParts[pathParts.length - 1];

    // ✅ 核心修复: 添加类型守卫
    if (!property) {
      logger.warn('UIPost', `无效的配置路径: ${key}`);
      return;
    }

    const control = folder.addBinding(target, property, options);
    control.on('change', (ev: { value: any }) => config.set(key, ev.value));
    this.controls.set(key, control);
  }

  _bindEvents() {
    const refreshControl = ({ key, value }: { key: string; value: any }) => {
      if (!key.startsWith('postprocess.')) return;

      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData as any;

        for (let i = 0; i < pathParts.length - 1; i++) {
          const part = pathParts[i];
          if (part) target = target[part]; // ✅ 已有保护
        }

        const lastKey = pathParts[pathParts.length - 1];

        // ✅ 核心修复: 添加类型守卫
        if (!lastKey) {
          logger.warn('UIPost', `无效的配置键: ${key}`);
          return;
        }

        if (target && target[lastKey] !== value) {
          target[lastKey] = value;
          control.refresh();
        }
      }
    };

    eventBus.on('config-changed', refreshControl);
    eventBus.on('preset-loaded', () => this.refresh());
  }

  refresh() {
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIPost', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    this.controls.clear();
    this._isInitialized = false;
    logger.info('UIPost', '后期处理 UI 已清理');
  }
}

const uiPost = new UIPost();
export default uiPost;

```

### src/ui/ui-presets.ts

```
/**
 * @file ui-presets.js
 * @description 预设系统UI - 手动加载 + 保持UI顺序 + 手动更新绑定
 * ✨ 重构: 移除了对已删除的 ui-material 的引用。
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus';
import presetManager from '../preset-manager';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';

class UIPresets {
  private pane: any;
  private initialized: boolean;
  private presetSelector: any;
  private saveNameInput: any;
  private selectedPresetName: string | null;

  constructor() {
    this.pane = null;
    this.initialized = false;
    this.presetSelector = null;
    this.saveNameInput = null;
    this.selectedPresetName = null;
  }

  async init() {
    if (this.initialized) {
      logger.warn('UIPresets', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UIPresets', '容器未初始化');
      return;
    }

    try {
      this.pane = new Pane({
        title: '预设管理',
        container: uiContainer.getScrollContent() || undefined,
        expanded: true,
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;
      logger.info('UIPresets', '预设UI已初始化');

      return this;
    } catch (err: unknown) {
      logger.error('UIPresets', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _createControls() {
    const presets = presetManager.getAvailablePresets();

    const presetOptions = {};
    presets.forEach((preset: any) => {
      (presetOptions as any)[preset.name] = preset.name;
    });

    const defaultValue = presets.length > 0 ? presets[0].name : '';
    this.selectedPresetName = defaultValue;

    const params = {
      preset: defaultValue,
    };

    this.presetSelector = this.pane.addBinding(params, 'preset', {
      label: '预设选择',
      options: presetOptions,
    });

    this.presetSelector.on('change', (ev: any) => {
      this.selectedPresetName = ev.value;
      logger.debug('UIPresets', `已选择预设: ${ev.value}`);
    });

    const loadButton = this.pane.addButton({
      title: '📥 加载预设',
    });

    loadButton.on('click', () => {
      if (!this.selectedPresetName) {
        alert('请先选择一个预设');
        return;
      }
      this._loadPreset(this.selectedPresetName);
    });

    const resetButton = this.pane.addButton({
      title: '🔄 恢复默认',
    });

    resetButton.on('click', () => {
      if (confirm('确定要恢复到默认配置吗？这将清除所有当前设置。')) {
        this._restoreDefaults();
      }
    });

    const saveFolder = this.pane.addFolder({
      title: '保存当前配置',
      expanded: false,
    });

    const saveParams = {
      name: '',
    };

    this.saveNameInput = saveFolder.addBinding(saveParams, 'name', {
      label: '预设名称',
    });

    const saveButton = saveFolder.addButton({
      title: '💾 保存预设',
    });

    saveButton.on('click', () => {
      const name = saveParams.name.trim();
      if (!name) {
        alert('请输入预设名称');
        return;
      }

      try {
        presetManager.savePreset(name);
        alert(`预设已保存: ${name}.json\n\n请将文件放入 /presets 文件夹`);
        saveParams.name = '';
        this.saveNameInput.refresh();
      } catch (err: unknown) {
        alert(`保存失败: ${(err as Error).message}`);
      }
    });
  }

  _loadPreset(presetName: any) {
    try {
      logger.info('UIPresets', `开始加载预设: ${presetName}`);

      presetManager
        .loadPreset(presetName)
        .then(() => {
          logger.info('UIPresets', `预设已加载: ${presetName}`);
        })
        .catch((err: any) => {
          alert(`加载预设失败: ${(err as Error).message}`);
          logger.error('UIPresets', `加载失败: ${(err as Error).message}`);
        });
    } catch (err: unknown) {
      alert(`加载预设失败: ${(err as Error).message}`);
    }
  }

  _restoreDefaults() {
    try {
      logger.info('UIPresets', '开始恢复默认配置...');

      config.reset();

      eventBus.emit('preset-loaded', { name: 'default', data: config.getRaw() });

      logger.info('UIPresets', '✅ 已恢复默认配置');
    } catch (err: unknown) {
      logger.error('UIPresets', `恢复默认失败: ${(err as Error).message}`);
      alert(`恢复默认失败: ${(err as Error).message}`);
    }
  }

  _bindEvents() {
    eventBus.on('preset-loaded', () => {
      logger.debug('UIPresets', '接收到 preset-loaded 事件，UI将各自刷新。');
    });
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.initialized = false;
    logger.info('UIPresets', 'UI已销毁');
  }
}

const uiPresets = new UIPresets();
export default uiPresets;

```

### src/ui/ui-registry.ts

```
/**
 * @file ui-registry.js
 * @description UI模块注册中心 - 避免循环依赖 + 自动追踪控件
 */
import logger from '../utils/logger';

class UIRegistry {
  private modules: Map<string, any> = new Map();

  constructor() {
    this.modules = new Map();
  }

  /**
   * 注册UI模块
   * @param {string} name - 模块名称
   * @param {Object} module - UI模块实例(必须有controls Map)
   */
  register(name: string, module: any) {
    if (!module || !module.controls) {
      logger.warn('UIRegistry', `注册失败: ${name} 没有 controls 属性`);
      return;
    }

    this.modules.set(name, module);
    logger.debug('UIRegistry', `已注册 UI 模块: ${name} (${module.controls.size} 个控件)`);
  }

  /**
   * 注销UI模块
   */
  unregister(name: string) {
    this.modules.delete(name);
    logger.debug('UIRegistry', `已注销 UI 模块: ${name}`);
  }

  /**
   * ✅ 核心方法:收集所有控件路径(自动排除data/animation/audio)
   * @returns {string[]} 控件路径数组
   */
  getAllControls() {
    const allPaths = new Set();

    // ✅ 精确匹配排除列表
    const EXCLUDED_PREFIXES = [
      'data.csvUrl',
      'data.antData',
      'data.mappedPoints',
      'animation.currentStep',
      'animation.lerpT',
      'animation.animating',
      'audio.',
    ];

    this.modules.forEach((module) => {
      if (!module.controls) return;

      module.controls.forEach((_control: any, path: string) => {
        // ✅ 使用精确前缀匹配
        if (EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))) {
          logger.debug('UIRegistry', `跳过运行时数据: ${path}`);
          return;
        }

        allPaths.add(path);
      });
    });

    logger.info('UIRegistry', `收集到 ${allPaths.size} 个有效控件路径`);
    return Array.from(allPaths).sort();
  }

  /**
   * 获取所有已注册模块
   */
  getModules() {
    return Array.from(this.modules.keys());
  }

  /**
   * 清空所有注册
   */
  clear() {
    this.modules.clear();
    logger.info('UIRegistry', '所有UI模块已清空');
  }
}

const uiRegistry = new UIRegistry();
export default uiRegistry;

```

### src/ui/ui-scene.ts

```
/**
 * @file ui-scene.ts
 * @description 场景构成切换UI - 控制光点模式（数学球体 vs 3D模型）
 * ✨ 功能：提供一个独立的UI面板来切换场景中的视觉组件
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus';
import config from '../config';
import logger from '../utils/logger';
import uiContainer from './ui-container';

class UIScene {
  private pane: Pane | null = null;
  private initialized: boolean = false;
  private controls: Map<string, any> = new Map();
  private configData: any;

  constructor() {
    this.configData = config.getRaw();
  }

  async init() {
    if (this.initialized) {
      logger.warn('UIScene', 'UI已初始化');
      return this;
    }

    if (!uiContainer.getScrollContent()) {
      logger.error('UIScene', '容器未初始化');
      return;
    }

    try {
      this.pane = new Pane({
        title: '场景构成',
        container: uiContainer.getScrollContent() || undefined,
        expanded: true,
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      // 注册到UI注册表
      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-scene', this);

      logger.info('UIScene', '场景构成 UI 已初始化');

      return this;
    } catch (err: unknown) {
      logger.error('UIScene', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  private _createControls() {
    // 场景模式选择器
    const sceneMode = this.pane!.addBinding(this.configData.sceneComposition, 'active', {
      label: '光点模式',
      options: {
        数学球体: 'defaultMath',
        '3D模型 (火箭)': 'modelAnt',
      },
    });

    sceneMode.on('change', (ev: any) => {
      config.set('sceneComposition.active', ev.value);
      logger.info('UIScene', `场景模式已切换: ${ev.value}`);
    });

    this.controls.set('sceneComposition.active', sceneMode);

    //只保留模型设置文件夹（移除使用说明）
    const modelFolder = this.pane!.addFolder({
      title: '模型设置',
      expanded: false,
    });

    modelFolder.addBlade({
      view: 'text',
      label: '当前模型',
      parse: (v: string) => String(v),
      value: 'rocket.glb',
    });
  }

  private _bindEvents() {
    // 监听外部配置变更，同步UI
    eventBus.on('config-changed', ({ key, value }: { key: string; value: any }) => {
      if (key === 'sceneComposition.active') {
        const control = this.controls.get(key);
        if (control && this.configData.sceneComposition.active !== value) {
          this.configData.sceneComposition.active = value;
          control.refresh();
        }
      }
    });

    // 监听预设加载
    eventBus.on('preset-loaded', () => {
      this.refresh();
    });
  }

  refresh() {
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIScene', 'UI 已刷新');
  }

  dispose() {
    if (this.pane) {
      this.pane.dispose();
      this.pane = null;
    }
    this.controls.clear();
    this.initialized = false;
    logger.info('UIScene', 'UI 已销毁');
  }
}

const uiScene = new UIScene();
export default uiScene;

```

### src/utils/logger.ts

```
/**
 * @file logger.ts
 * @description 日志工具 - 统一日志输出 + 诊断系统
 * ✨ 新增: 完整的诊断系统，支持缓冲、节流、链路追踪
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  // 公共属性
  public level: number = 1; // LOG_LEVELS.INFO

  private enableTimestamp: boolean;
  private throttledLogs: Map<string, number>;

  // 诊断系统属性
  private diagnosticBuffer: string[] = [];
  private maxDiagnosticPerFrame = 5; // 每帧最多显示 5 条诊断
  private diagnosticFlushInterval = 500; // 500ms 刷新一次诊断缓冲
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.enableTimestamp = true;
    this.throttledLogs = new Map();
    this._startDiagnosticFlusher();
  }

  setLevel(level: string) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS] !== undefined) {
      this.level = LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS];
    }
  }

  private _format(_level: string, module: string, message: string): string {
    const timestamp = this.enableTimestamp ? `[${new Date().toISOString().slice(11, 23)}]` : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }

  /**
   * 节流调试日志
   */
  debugThrottled(module: string, key: string, message: string, interval = 1000) {
    if (this.level > LOG_LEVELS.DEBUG) return;

    const now = Date.now();
    const lastTime = this.throttledLogs.get(key) || 0;

    if (now - lastTime > interval) {
      this.throttledLogs.set(key, now);
      this.debug(module, message);
    }
  }

  debug(module: string, message: string) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(`%c${this._format('DEBUG', module, message)}`, 'color: #888');
    }
  }

  info(module: string, message: string) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(`%c${this._format('INFO', module, message)}`, 'color: #4a9eff');
    }
  }

  warn(module: string, message: string) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`%c${this._format('WARN', module, message)}`, 'color: #ff9800');
    }
  }

  error(module: string, message: string) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`%c${this._format('ERROR', module, message)}`, 'color: #f44336');
    }
  }

  // ========== 诊断系统方法 ==========

  /**
   * 诊断日志 - 用于帧级调试，自动缓冲
   */
  diagnostic(module: string, message: string, symbol = '●') {
    const line = `${symbol} [${module}] ${message}`;

    if (this.diagnosticBuffer.length < this.maxDiagnosticPerFrame) {
      this.diagnosticBuffer.push(line);
    }
  }

  /**
   * 关键诊断 - 立即输出，不缓冲
   */
  diagnosticCritical(module: string, message: string) {
    console.log(
      `%c🔴 [${module}] ${message}`,
      'color: #ff5722; font-weight: bold; font-size: 12px;'
    );
  }

  /**
   * 成功诊断
   */
  diagnosticSuccess(module: string, message: string) {
    console.log(`%c✅ [${module}] ${message}`, 'color: #4caf50; font-size: 12px;');
  }

  /**
   * ⚠️  警告诊断
   */
  diagnosticWarning(module: string, message: string) {
    console.log(`%c⚠️  [${module}] ${message}`, 'color: #ff9800; font-size: 12px;');
  }

  /**
   * 追踪诊断 - 用于追踪事件链路
   */
  diagnosticTrace(source: string, event: string, target: string, data?: any) {
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    this.diagnostic('Trace', `${source} → ${event} → ${target}${dataStr}`, '→');
  }

  /**
   * 配置诊断系统
   */
  setDiagnosticConfig(maxPerFrame?: number, flushInterval?: number) {
    if (maxPerFrame !== undefined) this.maxDiagnosticPerFrame = maxPerFrame;
    if (flushInterval !== undefined) {
      this.diagnosticFlushInterval = flushInterval;
      // 重新启动 flusher
      this._stopDiagnosticFlusher();
      this._startDiagnosticFlusher();
    }
  }

  /**
   * 启动诊断缓冲定时刷新
   */
  private _startDiagnosticFlusher() {
    this.flushTimer = setInterval(() => {
      this._flushDiagnosticBuffer();
    }, this.diagnosticFlushInterval);
  }

  /**
   * 停止诊断缓冲定时刷新
   */
  private _stopDiagnosticFlusher() {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * 立即刷新诊断缓冲
   */
  private _flushDiagnosticBuffer() {
    if (this.diagnosticBuffer.length === 0) return;

    const timestamp = new Date().toISOString().slice(11, 23);
    const header = `%c[${timestamp}] 📋 诊断快照 (${this.diagnosticBuffer.length} items)`;

    console.group(header, 'color: #2196f3; font-weight: bold; font-size: 12px;');
    this.diagnosticBuffer.forEach((line) => {
      console.log(`%c${line}`, 'color: #666; font-family: monospace; font-size: 11px;');
    });
    console.groupEnd();

    this.diagnosticBuffer = [];
  }

  /**
   * 销毁前清理
   */
  destroy() {
    this._stopDiagnosticFlusher();
    this.diagnosticBuffer = [];
    this.throttledLogs.clear();
  }
}

const logger = new Logger();

// 开发环境设置为 DEBUG，并配置诊断系统
if (import.meta.env.DEV) {
  logger.setLevel('DEBUG');
  logger.setDiagnosticConfig(5, 500); // 每帧5条，500ms刷新
}

export default logger;

```

### src/utils/url-resolver.ts

```
/**
 * @file url-resolver.js
 * @description 统一处理应用内资源URL的工具，确保在不同部署环境下路径正确。
 */

/**
 * 将相对路径解析为基于部署环境的正确绝对路径。
 * 它利用 Vite 的 `import.meta.env.BASE_URL` 环境变量。
 * 开发时 BASE_URL 是 '/'
 * 构建后 BASE_URL 是 '/LangtonAnt3D_web_03/'
 * @param {string} path - 相对于 public 目录的资源路径，例如 'data/data.csv' 或 '/presets/01.json'
 * @returns {string} - 解析后的完整 URL 路径
 */
export function resolveAssetUrl(path: string) {
  // import.meta.env.BASE_URL 在 vite.config.js 中配置，末尾自带'/'
  // 确保传入的路径没有开头的'/'，避免出现'//'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

```

### src/vite-env.d.ts

```
/// <reference types="vite/client" />

// ✅ 新增: Vite 环境变量类型
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ✅ 保留原有的原生资源导入
declare module '*?raw' {
  const content: string;
  export default content;
}

// ✅ 新增: GLSL 着色器导入支持
declare module '*.vert?raw' {
  const content: string;
  export default content;
}

declare module '*.frag?raw' {
  const content: string;
  export default content;
}

```

### tools/snapshot.mjs

```javascript
#!/usr/bin/env node
// snapshot.mjs
// 生成当前项目的 Markdown 快照：A. 目录树 + B. 文件内容（按相对路径排序）
// 默认只收集：.js,.mjs,.json,.css,.html；强制排除 package-lock.json
// 用法：node tools/snapshot.mjs --root . --out snapshot.md
// 可选：--ext ".js,.mjs,.json,.css,.html" --ignore "node_modules,.git,dist,build,.cache" --maxSize 200000

import fs from 'fs';
import path from 'path';

const CWD = process.cwd();
const args = Object.fromEntries(
  process.argv.slice(2).map(s => {
    const m = s.match(/^--([^=]+)=(.+)$/);
    return m ? [m[1], m[2]] : [s.replace(/^--/, ''), true];
  })
);

const ROOT = path.resolve(CWD, args.root && args.root !== true ? args.root : '.');
const OUT  = path.resolve(CWD, args.out  && args.out  !== true ? args.out  : 'snapshot.md');

const DEFAULT_EXT = '.js,.ts,.mjs,.json,.css,.html,.frag,.vert';
const EXT_LIST = String(args.ext || DEFAULT_EXT).split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

const DEFAULT_IGNORE = 'node_modules,.git,.hg,.svn,dist,build,out,.cache,.parcel-cache,.turbo,.next,.nuxt,.DS_Store';
const IGNORE_DIRS = new Set(String(args.ignore || DEFAULT_IGNORE).split(',').map(s => s.trim()).filter(Boolean));

// 强制排除的文件（不随 --ignore 变化）
const FORCE_EXCLUDE_FILES = new Set(['package-lock.json']);

const MAX_SIZE = Number(args.maxSize || 200000); // 单文件最大读取字节
const MAX_FILES = Number(args.maxFiles || 2000); // 最大文件数保护
const SNAP_TIME = new Date().toISOString().replace('T', ' ').slice(0, 19);

const LANG_MAP = new Map(Object.entries({
  js:'javascript', mjs:'javascript', json:'json', css:'css', html:'html'
}));

const statSafe = p => { try { return fs.statSync(p); } catch { return null; } };

function rel(p) { return path.relative(ROOT, p).replaceAll('\\', '/'); }

function shouldIgnoreDirent(name) {
  return IGNORE_DIRS.has(name) || name === '.DS_Store';
}

function hasAllowedExt(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  return ext && EXT_LIST.includes(ext);
}

function* walk(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) {
      if (IGNORE_DIRS.has(it.name)) continue;
      yield* walk(p);
    } else if (it.isFile()) {
      if (FORCE_EXCLUDE_FILES.has(it.name)) continue;      // 强排除
      if (hasAllowedExt(it.name)) yield p;
    }
  }
}

function makeTree(dir, prefix = '') {
  // 只展示允许后缀的文件；目录若空则不展示
  const items = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => !shouldIgnoreDirent(d.name))
    .sort((a,b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

  const lines = [];
  items.forEach((it, idx) => {
    const last = idx === items.length - 1;
    const pointer = last ? '└─ ' : '├─ ';
    const p = path.join(dir, it.name);

    if (it.isDirectory()) {
      const subtree = makeTree(p, prefix + (last ? '   ' : '│  '));
      if (subtree.length) {
        lines.push(prefix + pointer + it.name + '/');
        lines.push(...subtree);
      }
    } else if (it.isFile()) {
      if (FORCE_EXCLUDE_FILES.has(it.name)) return;
      if (hasAllowedExt(it.name)) lines.push(prefix + pointer + it.name);
    }
  });
  return lines;
}

function readFileSmart(p) {
  const st = statSafe(p);
  if (!st) return { truncated:false, body:'' };
  if (st.size <= MAX_SIZE) {
    return { truncated:false, body: fs.readFileSync(p, 'utf8') };
  }
  const fd = fs.openSync(p, 'r');
  const slice = Math.min(MAX_SIZE, st.size);
  const buf = Buffer.alloc(slice);
  fs.readSync(fd, buf, 0, slice, 0);
  fs.closeSync(fd);
  const notice = `/* NOTE: file too large (${st.size} bytes). Showing first ${slice} bytes. */\n`;
  return { truncated:true, body: notice + buf.toString('utf8') };
}

function fenceLang(p) {
  const ext = path.extname(p).toLowerCase().replace('.', '');
  return LANG_MAP.get(ext) || '';
}

// -------- 主流程 --------
(function main() {
  if (!statSafe(ROOT)?.isDirectory()) {
    console.error(`[snapshot] Root not found or not a directory: ${ROOT}`);
    process.exit(1);
  }

  // 收集文件
  const files = [];
  let count = 0;
  for (const p of walk(ROOT)) {
    files.push(p);
    count++;
    if (count >= MAX_FILES) break;
  }

  // 目录树
  const treeLines = [ path.basename(ROOT) + '/', ...makeTree(ROOT) ];

  // 文件正文（按相对路径排序）
  files.sort((a,b) => rel(a).localeCompare(rel(b)));
  const chunks = files.map(absPath => {
    const rp = rel(absPath);
    const { truncated, body } = readFileSmart(absPath);
    const lang = fenceLang(absPath);
    const title = `### ${rp}${truncated ? ' (truncated)' : ''}`;
    return [
      title,
      '',
      '```' + (lang ? lang : ''),
      body.replace(/\uFEFF/g, ''), // 去 BOM
      '```',
      ''
    ].join('\n');
  });

  // 生成 Markdown
  const md = [
    `# Project Snapshot`,
    `- Root: \`${rel(ROOT) || '.'}\``,
    `- Created: ${SNAP_TIME}`,
    `- Files: ${files.length} (ext=[${EXT_LIST.join(', ')}], maxSize=${MAX_SIZE}B)`,
    `- Force-Excluded: package-lock.json`,
    '',
    '---',
    '## A. Directory Tree',
    '```text',
    treeLines.join('\n'),
    '```',
    '',
    '---',
    '## B. Files (selected types only)',
    '',
    chunks.join('\n')
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, md, 'utf8');

  console.log(`[snapshot] Done: ${rel(OUT)} (${files.length} files)`);
})();

```

### tsconfig.json

```json
{
  "compilerOptions": {
    /* 基本选项 */
    "target": "ESNext",            // 编译目标ECMAScript版本
    "useDefineForClassFields": true, // 使用标准的类字段定义
    "module": "ESNext",              // 使用的模块系统
    "lib": ["ESNext", "DOM"],      // 编译时包含的库文件
    "skipLibCheck": true,          // 跳过对所有声明文件 (*.d.ts) 的类型检查，提高编译速度

    /* 模块解析 */
    "moduleResolution": "bundler", // 现代打包工具（如Vite）推荐的模块解析策略
    "allowImportingTsExtensions": true, // 允许导入带 .ts 后缀的文件
    "resolveJsonModule": true,     // 允许导入 .json 文件
    "isolatedModules": true,       // 确保每个文件都可以被安全地独立编译，Vite要求
    "noEmit": true,                // 不生成输出文件，因为Vite/Rollup会处理打包

    /* 源代码映射 */
    "sourceMap": true,             // 生成 .map 文件，方便调试

    /* JavaScript 支持 */
    "allowJs": true,               // ✅ 关键：允许编译JS文件，这是渐进式迁移的基石
    "checkJs": false,              // 不检查JS文件中的错误

    /* 严格类型检查 */
    "strict": true,                // 启用所有严格类型检查选项
    "noUnusedLocals": true,        // 报告未使用的局部变量
    "noUnusedParameters": true,    // 报告未使用的参数
    "noFallthroughCasesInSwitch": true, // 报告switch语句中的fallthrough情况
    "noUncheckedIndexedAccess": true, // 新增：对索引访问的严格检查
    "forceConsistentCasingInFileNames": true, // 新增：文件名大小写一致

    /* 路径别名 */
    "baseUrl": ".",                // 解析非相对模块名的基准目录
    "paths": {
      "@/*": ["src/*"]            // 设置别名，例如 import ... from '@/utils/logger'
    }
  },
  "include": ["src"], // 告诉TS编译器需要检查哪些文件
  "references": [{ "path": "./tsconfig.node.json" }] // 引用Node环境的配置
}

```

### tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}

```

### vite.config.ts

```
//这个项目的dist分支网页托管方案失败了
//所以生成dist文件之后，要手动复制内容粘贴到LangtonAnt3D_dist文件夹下
//LangtonAnt3D_dist文件新建了一个仓库用于github网页托管

/**
 * @file vite.config.ts
 * @description Vite 配置文件 (TypeScript版本)
 */
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  return {
    base: isProduction ? '/LangtonAnt3D_dist/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 可以添加更多配置...
  };
});

```
