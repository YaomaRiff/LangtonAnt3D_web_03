# Project Snapshot
- Root: `.`
- Created: 2025-10-09 17:32:49
- Files: 44 (ext=[.js, .ts, .mjs, .json, .css, .html, .frag, .vert], maxSize=200000B)
- Force-Excluded: package-lock.json

---
## A. Directory Tree
```text
LangtonAnt3D_web_03/
├─ public/
│  ├─ data/
│  │  └─ manifest.json
│  ├─ presets/
│  │  ├─ 01.json
│  │  ├─ 02.json
│  │  └─ 03.json
│  ├─ manifest.json
│  ├─ style.css
├─ src/
│  ├─ systems/
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
│  │  ├─ lighting-sys.ts
│  │  ├─ material-sys.ts
│  │  ├─ math-light-sys.ts
│  │  ├─ model-sys.ts
│  │  ├─ particles-sys.ts
│  │  ├─ path-sys.ts
│  │  ├─ postprocess-sys.ts
│  │  ├─ scene-director-sys.ts
│  │  └─ state.ts
│  ├─ ui/
│  │  ├─ ui-basic.ts
│  │  ├─ ui-container.ts
│  │  ├─ ui-coordinates.ts
│  │  ├─ ui-post.ts
│  │  ├─ ui-presets.ts
│  │  └─ ui-registry.ts
│  ├─ utils/
│  │  ├─ logger.ts
│  │  └─ url-resolver.ts
│  ├─ config.ts
│  ├─ event-bus.ts
│  ├─ main.ts
│  ├─ preset-manager.ts
│  └─ vite-env.d.ts
├─ tools/
│  └─ snapshot.mjs
├─ index.html
├─ package.json
├─ snapshot.index.json
├─ tsconfig.json
├─ tsconfig.node.json
└─ vite.config.ts
```

---
## B. Files (selected types only)

### index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>(OUwNO)Ant</title>
  
  <!-- 样式 -->
  <link rel="stylesheet" href="/style.css">

  <!-- Favicon and Theme Color (修正位置) -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
  <link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">
  <meta name="theme-color" content="#ffffff">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>

```

### package.json

```json
{
  "name": "langtonant3d-web-03",
  "private": true,
  "version": "0.2.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "snapshot": "node tools/snapshot.mjs --root . --out snapshot.md",
    "publish": "npm run build && rimraf ../LangtonAnt3D_dist && ncp dist ../LangtonAnt3D_dist"
  },
  "devDependencies": {
    "@types/file-saver": "^2.0.7",
    "@types/howler": "^2.2.12",
    "@types/jszip": "^3.4.0",
    "@types/node": "^24.7.0",
    "@types/papaparse": "^5.3.16",
    "@types/three": "^0.180.0",
    "ncp": "^2.0.0",
    "rimraf": "^6.0.1",
    "typescript": "^5.9.3",
    "vite": "^5.4.10"
  },
  "dependencies": {
    "camera-controls": "^3.1.0",
    "file-saver": "^2.0.5",
    "glsl-noise": "^0.0.0",
    "hotkeys-js": "^3.13.15",
    "howler": "^2.2.4",
    "idb-keyval": "^6.2.2",
    "jszip": "^3.10.1",
    "papaparse": "^5.5.3",
    "postprocessing": "^6.37.8",
    "three": "^0.180.0",
    "three-mesh-bvh": "^0.9.1",
    "three-nebula": "^10.0.3",
    "three-noise": "^1.1.2",
    "three-stdlib": "^2.36.0",
    "troika-three-text": "^0.52.4",
    "tweakpane": "^4.0.5",
    "zod": "^4.1.11"
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
  "name": "Your App Name",
  "short_name": "Your App",
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
  "timestamp": "2025-10-06T20:09:28.849Z",
  "animation": {
    "loop": true,
    "speedFactor": 1.65
  },
  "camera": {
    "fov": 75,
    "mode": "perspective"
  },
  "coordinates": {
    "dataSpace": {
      "scale": 1
    }
  },
  "environment": {
    "pathColor": "#F0B7B7"
  },
  "particles": {
    "breathIntensity": 0.1,
    "dustColor": "#AF85B7",
    "dustCount": 6600,
    "dustOpacity": 0.6,
    "dustSize": 0.6,
    "floatIntensity": 0.2,
    "rotationSpeed": 0,
    "rotationTiltXY": 0,
    "rotationTiltXZ": 0,
    "systemScale": 1
  },
  "path": {
    "depthIntensity": 0.5,
    "scale": 1
  },
  "postprocess": {
    "enabled": true,
    "bloom": {
      "enabled": true,
      "intensity": 0.8,
      "luminanceSmoothing": 0.2,
      "luminanceThreshold": 0.1
    },
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": false
    },
    "film": {
      "enabled": true,
      "noiseIntensity": 0.26,
      "scanlineCount": 3654,
      "scanlineIntensity": 0.28
    },
    "hueSaturation": {
      "enabled": false,
      "hue": 0,
      "saturation": 0
    }
  }
}

```

### public/presets/02.json

```json
{
  "name": "02",
  "timestamp": "2025-10-08T11:14:32.524Z",
  "animation": {
    "loop": true,
    "speedFactor": 1.65
  },
  "camera": {
    "fov": 75,
    "mode": "perspective"
  },
  "coordinates": {
    "dataSpace": {
      "scale": 1.4
    }
  },
  "environment": {
    "pathColor": "#F0B7B7"
  },
  "particles": {
    "breathIntensity": 0.26,
    "dustColor": "#AF85B7",
    "dustCount": 2600,
    "dustOpacity": 0.83,
    "dustSize": 0.78,
    "floatIntensity": 0.64,
    "rotationSpeed": 0,
    "rotationTiltXY": -20,
    "rotationTiltXZ": 43,
    "systemScale": 1
  },
  "path": {
    "depthIntensity": 0.5,
    "scale": 1.6
  },
  "postprocess": {
    "enabled": true,
    "bloom": {
      "enabled": true,
      "intensity": 0.9,
      "luminanceSmoothing": 0.2,
      "luminanceThreshold": 0.1
    },
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": true
    },
    "film": {
      "enabled": true,
      "noiseIntensity": 0.29,
      "scanlineCount": 3136,
      "scanlineIntensity": 0.48
    },
    "hueSaturation": {
      "enabled": true,
      "hue": 0.65,
      "saturation": 0.04
    }
  }
}

```

### public/presets/03.json

```json
{
  "name": "03",
  "timestamp": "2025-10-06T17:01:18.755Z",
  "animation": {
    "loop": true
  },
  "camera": {
    "fov": 75,
    "mode": "perspective"
  },
  "coordinates": {
    "dataSpace": {
      "scale": 1
    }
  },
  "environment": {
    "pathColor": "#F0B7B7"
  },
  "particles": {
    "breathIntensity": 0.1,
    "dustColor": "#AF85B7",
    "dustCount": 3000,
    "dustOpacity": 0.6,
    "dustSize": 0.6,
    "floatIntensity": 0.2,
    "rotationSpeed": 0,
    "rotationTiltXY": 0,
    "rotationTiltXZ": 0,
    "systemScale": 1
  },
  "path": {
    "depthIntensity": 0.5,
    "scale": 1
  },
  "postprocess": {
    "enabled": true,
    "bloom": {
      "enabled": true,
      "intensity": 0.8,
      "luminanceSmoothing": 0.2,
      "luminanceThreshold": 0.1
    },
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": true
    },
    "film": {
      "enabled": true,
      "noiseIntensity": 0.06,
      "scanlineCount": 1064,
      "scanlineIntensity": 0.77
    },
    "hueSaturation": {
      "enabled": true,
      "hue": 0,
      "saturation": 0.14
    }
  }
}

```

### public/style.css

```css
body {
    margin: 0;
    background: #000000;
    font-family: Arial, sans-serif;
    overflow: hidden;
}

#three-container {
    position: fixed;
    inset: 0;
    overflow: hidden;
}

/* 加载状态UI样式 */
#loading-status {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 15px;
    border-radius: 8px;
    min-width: 250px;
    z-index: 1000;
    border: 1px solid #333;
    transition: opacity 0.3s ease;
}

.loading-header {
    font-weight: bold;
    margin-bottom: 10px;
    color: #3399ff;
    border-bottom: 1px solid #333;
    padding-bottom: 5px;
}

.status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    padding: 3px 0;
}

.status-indicator {
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    min-width: 60px;
    text-align: center;
}

.status-indicator.loading {
    background: #ffa500;
    color: #000;
}

.status-indicator.success {
    background: #4CAF50;
    color: white;
}

.status-indicator.error {
    background: #f44336;
    color: white;
}

.status-indicator.waiting {
    background: #666;
    color: #ccc;
}

/* 控制面板样式 */
.control-panel {
    position: absolute;
    top: 20px;
    left: 20px;
    background: rgba(0,0,0,0.6);
    color: white;
    padding: 12px;
    border-radius: 6px;
    font-size: 13px;
    z-index: 10;
    min-width: 320px;
    max-height: 90vh;
    overflow-y: auto;
}

.control-panel button {
    margin: 2px;
    padding: 5px 10px;
    background: #333;
    color: white;
    border: 1px solid #555;
    border-radius: 3px;
    cursor: pointer;
}

.control-panel button:hover {
    background: #555;
}

.control-panel input[type="range"] {
    width: 160px;
}

.control-panel input[type="color"] {
    margin-left: 10px;
}

.control-panel label {
    display: inline-block;
    margin-top: 8px;
}

#loading-status.hidden {
    opacity: 0;
    pointer-events: none;
}

```

### snapshot.index.json

```json
[
  {
    "id": 1,
    "path": "index.html"
  },
  {
    "id": 2,
    "path": "package-lock.json"
  },
  {
    "id": 3,
    "path": "package.json"
  },
  {
    "id": 4,
    "path": "public/manifest.json"
  },
  {
    "id": 5,
    "path": "public/style.css"
  },
  {
    "id": 6,
    "path": "src/components/animation-comp.js"
  },
  {
    "id": 7,
    "path": "src/components/audio-comp.js"
  },
  {
    "id": 8,
    "path": "src/components/camera-comp.js"
  },
  {
    "id": 9,
    "path": "src/components/data-comp.js"
  },
  {
    "id": 10,
    "path": "src/components/environment-comp.js"
  },
  {
    "id": 11,
    "path": "src/components/particles-comp.js"
  },
  {
    "id": 12,
    "path": "src/components/postprocess-comp.js"
  },
  {
    "id": 13,
    "path": "src/config.js"
  },
  {
    "id": 14,
    "path": "src/entities/core-ent.js"
  },
  {
    "id": 15,
    "path": "src/entities/light-ent.js"
  },
  {
    "id": 16,
    "path": "src/entities/marker-ent.js"
  },
  {
    "id": 17,
    "path": "src/entities/model-ent.js"
  },
  {
    "id": 18,
    "path": "src/entities/particles-ent.js"
  },
  {
    "id": 19,
    "path": "src/event-bus.js"
  },
  {
    "id": 20,
    "path": "src/main.js"
  },
  {
    "id": 21,
    "path": "src/shaders/basic-sh.js"
  },
  {
    "id": 22,
    "path": "src/shaders/crt-sh.js"
  },
  {
    "id": 23,
    "path": "src/shaders/custom-sh.js"
  },
  {
    "id": 24,
    "path": "src/shaders/fisheye-sh.js"
  },
  {
    "id": 25,
    "path": "src/shaders/progress-sh.js"
  },
  {
    "id": 26,
    "path": "src/systems/animation-sys.js"
  },
  {
    "id": 27,
    "path": "src/systems/audio-sys.js"
  },
  {
    "id": 28,
    "path": "src/systems/camera-sys.js"
  },
  {
    "id": 29,
    "path": "src/systems/controls-util.js"
  },
  {
    "id": 30,
    "path": "src/systems/data-sys.js"
  },
  {
    "id": 31,
    "path": "src/systems/filters-sys.js"
  },
  {
    "id": 32,
    "path": "src/systems/model-sys.js"
  },
  {
    "id": 33,
    "path": "src/systems/particles-sys.js"
  },
  {
    "id": 34,
    "path": "src/systems/postprocess-sys.js"
  },
  {
    "id": 35,
    "path": "src/systems/presets-sys.js"
  },
  {
    "id": 36,
    "path": "src/systems/ui-sys.js"
  },
  {
    "id": 37,
    "path": "src/systems/views-sys.js"
  },
  {
    "id": 38,
    "path": "src/utils/config-printer.js"
  },
  {
    "id": 39,
    "path": "src/utils/control-map.js"
  },
  {
    "id": 40,
    "path": "src/utils/dom-utils.js"
  },
  {
    "id": 41,
    "path": "src/utils/logger.js"
  },
  {
    "id": 42,
    "path": "src/utils/math-utils.js"
  },
  {
    "id": 43,
    "path": "src/vite.config.js"
  },
  {
    "id": 44,
    "path": "tools/snapshot.mjs"
  }
]
```

### src/config.ts

```
/**
 * @file config.ts
 * @description 配置管理器 - 全局配置存储与访问
 * 🔧 修正: 对 set 方法中的日志进行节流处理，防止UI拖动时刷屏。
 * ✨ 重构: 移除了旧的材质辉光相关配置 (emissiveIntensity)，辉光效果由 postprocess.bloom 统一控制。
 */
import logger from './utils/logger';
import eventBus from './event-bus';

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
    availableDatasets: []
  },
  
  animation: {
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
      emissiveColor: '#F0B7B7'
    },
    particles: {
      emissiveColor: '#AF85B7'
    },
    movingLight: {
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
    pathPointColor: '#F0B7B7',
    pathPointSize: 0.5,
    pathPointOpacity: 0.9,
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
  
    // ✅ [重构] 光晕效果 (Bloom)
    bloom: {
      enabled: true,
      intensity: 1.0,         // 效果强度
      luminanceThreshold: 0.1, // 亮度阈值
      luminanceSmoothing: 0.2, // 阈值平滑度
      mipmapBlur: true,         // 是否使用 Mipmap 模糊
    },

    // ✅ 新增：景深效果 (Bokeh)
    bokeh: {
      enabled: false,
      focus: 40.0,              // 焦距
      dof: 0.02,                // 景深范围
      aperture: 0.025,          // 光圈大小
      maxBlur: 0.01,            // 最大模糊
    },

    // ✅ 新增：色差效果 (Chromatic Aberration)
    chromaticAberration: {
      enabled: false,
      offset: { x: 0.001, y: 0.001 } // 颜色偏移量
    },
    
    // ✅ 新增：点阵效果 (Dot Screen)
    dotScreen: {
      enabled: false,
      angle: 1.57,              // 角度
      scale: 1.0                // 缩放
    },

    // ✅ [替代方案] 胶片效果 (Film) - 替代旧的 Noise 和 Scanline
    film: {
      enabled: false,
      scanlineIntensity: 0.3,   // 扫描线强度
      noiseIntensity: 0.3,      // 噪点强度
      scanlineCount: 2048,      // 扫描线数量
      grayscale: false          // 是否灰度
    },
  
    // ✅ [保留] 色彩调整效果
    hueSaturation: { enabled: false, hue: 0.0, saturation: 0.0 },
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
      maxDistance: 100
    }
  }
};

function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
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
    } catch (err) {
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
        if (value === null || value === undefined) return null;
        value = value[k];
      }
      return value;
    } catch (err) {
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
        if (!target[k] || typeof target[k] !== 'object') {
          target[k] = {};
        }
        target = target[k];
      }
      const lastKey = keys[keys.length - 1];
      if (target[lastKey] !== value) {
        target[lastKey] = value;
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
    } catch (err) {
      logger.error('Config', `设置配置异常 [${key}]: ${(err as Error).message}`);
      return false;
    }
  }

  applyPresetData(presetData: any) {
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
        if (JSON.stringify((oldConfig as any)[topKey]) !== JSON.stringify((DEFAULT_CONFIG as any)[topKey])) {
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
 * @file event-bus.js
 * @description 事件总线 - 系统间通信
 */
import logger from './utils/logger';

class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
    logger.debug('EventBus', `注册事件: ${event}`);
  }

  off(event, callback) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      logger.debug('EventBus', `移除事件: ${event}`);
    }
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (err) {
        logger.error('EventBus', `事件回调异常 [${event}]: ${err.message}`);
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

  getListenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
}

const eventBus = new EventBus();
export default eventBus;

```

### src/main.ts

```
/**
 * @file main.js
 * @description 应用主入口 - 系统协调与生命周期管理
 * ✨ 重构: 彻底移除了旧的 ui-material 系统。
 */
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
import mathLightSys from './systems/math-light-sys';

class Application {
  private scene: THREE.Scene | null;
  private renderer: THREE.WebGLRenderer | null;
  private clock: THREE.Clock;
  private initialized: boolean;
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

      // 1. 初始化配置
      initConfig();

      // 2. 创建场景和渲染器
      this._createScene();
      this._createRenderer();

      // 3. 初始化坐标系统（必须在相机之前）
      coordinateSystem.init({
        eventBus,
        scene: this.scene
      });

      if (this.scene) {
        this.scene.userData.coordinateSystem = coordinateSystem;
      }

      // 4. 初始化相机系统
      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer
      });

      lightingSys.init({ scene: this.scene });
      environmentSys.init({ scene: this.scene });

      const mainCamera = cameraSys.getActiveCamera();

      postprocessSys.init({
        scene: this.scene as THREE.Scene,
        camera: mainCamera as THREE.Camera,
        renderer: this.renderer as THREE.WebGLRenderer
      });

      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera()
      });

      uiContainer.init();

      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls()
      });

      // 7. 初始化基础 UI
      await uiBasic.init();
      // 8. 初始化后处理 UI
      await uiPost.init();

      await presetManager.init();

      // 9. 初始化预设系统
      await uiPresets.init();
      // 10. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });

      // 11. 初始化核心服务系统
      materialSys.init();
      modelSys.init();

      pathSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });
      
      mathLightSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });

      particlesSys.init({ 
        eventBus, 
        scene: this.scene as THREE.Scene,
        coordinateSystem 
      });

      animationSys.init({
        eventBus,
        scene: this.scene as THREE.Scene,
        renderer: this.renderer as THREE.WebGLRenderer,
        controls: cameraSys.getControls(),
        particlesSys
      });

      sceneDirector.init({ eventBus });

      this._bindEvents();
      this._startRenderLoop();

      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;
      logger.info('App', '✅ 应用初始化完成');

    } catch (err) {
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
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    const canvas = this.renderer.domElement;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '0';
    canvas.style.display = 'block';
    
    document.body.appendChild(canvas);
    
    logger.info('App', `✅ Canvas已添加 | 尺寸: ${canvas.width}x${canvas.height}`);
    logger.debug('App', '渲染器已创建');
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._handleResize();
    });

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = (coordinateSystem as any).debugInfo?.() || 'N/A';
      console.log('📊 坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    if (this.renderer) {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    postprocessSys.handleResize();
    logger.debugThrottled(
      'App',
      'window-resize',
      '窗口大小已调整',
      1000
    );
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
    mathLightSys.dispose();
    uiBasic.dispose();
    uiPost.dispose();
    uiPresets.dispose();
    uiCoordinates.dispose();
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
app.init().catch(err => {
  logger.error('App', `启动失败: ${err.message}`);
  console.error(err);
});

export default app;

```

### src/preset-manager.ts

```
/**
 * @file preset-manager.js
 * @description 预设管理器 - 加载、保存和应用配置快照。通过 config.set() 自动触发更新事件。
 * ✅ 核心改造:
 *   1. 删除了巨大的 _emitConfigEvents 方法。
 *   2. 加载预设时，通过遍历并调用 config.set() 来自动触发更新。
 */
import config from './config';
import logger from './utils/logger';
import eventBus from './event-bus';
import uiRegistry from './ui/ui-registry';
import { resolveAssetUrl } from './utils/url-resolver';

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

      const response = await fetch(resolveAssetUrl(preset.path));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const presetData = await response.json();
      
      // 1. ✅ 应用配置到内存, 这个过程会通过 config.set() 自动发出所有事件
      this._applyPresetToConfig(presetData);

      // 2. 标记当前预设
      this.currentPreset = presetName;
      
      // 3. ✅ 最后通知UI刷新 (例如刷新Tweakpane面板)
      eventBus.emit('preset-loaded', { name: presetName, data: presetData });
      
      logger.info('PresetManager', `✅ 预设已加载: ${presetName}`);
      
      return presetData;
    } catch (err) {
      logger.error('PresetManager', `加载预设失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * ✅ 核心修改: 重写此方法，通过递归调用 config.set() 应用配置
   */
  _applyPresetToConfig(presetData) {
    if (!presetData || typeof presetData !== 'object') {
      throw new Error('预设数据格式无效');
    }

    const applyRecursively = (obj, pathPrefix = '') => {
      for (const key in obj) {
        // 跳过元数据字段
        if (key === 'name' || key === 'timestamp') continue;
        
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

  /**
   * ❌ 已删除: 这个巨大的、难以维护的函数已被移除
   */
  // _emitConfigEvents(presetData) { ... }

  savePreset(presetName) {
    if (!presetName || typeof presetName !== 'string') {
      throw new Error('预设名称无效');
    }

    try {
      const presetData = {
        name: presetName,
        timestamp: new Date().toISOString()
      };

      const allPaths = uiRegistry.getAllControls();
      logger.info('PresetManager', `准备保存 ${allPaths.length} 个控件的数据`);

      const configSnapshot = config.getRaw();
      allPaths.forEach(path => {
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

    } catch (err) {
      logger.error('PresetManager', `保存预设失败: ${err.message}`);
      throw err;
    }
  }
  
  _getNestedValue(obj, path) {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value === null || value === undefined) return undefined;
      value = value[key];
    }
    return value;
  }

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

```

### src/systems/animation-sys.ts

```
/**
 * @file animation-sys.js
 * @description 动画系统 - 路径插值与步进控制
 * ✅ 核心改造: 监听统一的 'config-changed' 事件来控制动画启停。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import state from './state';

class AnimationSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private renderer: THREE.WebGLRenderer | null;
  private controls: any;
  private particlesSys: any;
  private initialized: boolean;
  private currentStep: number;
  private lerpT: number;
  private animating: boolean;
  private mappedPoints: any[];

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.renderer = null;
    this.controls = null;
    this.particlesSys = null;
    this.initialized = false;
    
    // 动画状态
    this.currentStep = 0;
    this.lerpT = 0;
    this.animating = false;
    this.mappedPoints = [];
  }

  init({ eventBus, scene, renderer, controls, particlesSys }) {
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
    } catch (err) {
      logger.error('AnimationSystem', `初始化失败: ${err.message}`);
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
    this.eventBus.on('data-loaded', (data) => {
      this.mappedPoints = data.points;
      this.currentStep = 0;
      this.lerpT = 0;
      logger.info('AnimationSystem', `数据已加载: ${this.mappedPoints.length} 个点`);
    });

    this.eventBus.on('reset-animation', () => {
      this.reset();
    });

    this.eventBus.on('step-to', (step) => {
      this.stepTo(step);
    });
  }

  //统一处理配置变更
  _handleConfigChange({ key, value }) {
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

  update(delta, elapsed) {
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

  stepTo(step) {
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

  getCurrentStep() { return this.currentStep; }
  getTotalSteps() { return this.mappedPoints.length; }
  
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

```

### src/systems/audio-sys.ts

```
/**
 * @file audio-sys.js
 * @description 音频系统 - 背景音乐管理
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class AudioSystem {
  constructor() {
    this.eventBus = null;
    this.listener = null;
    this.sound = null;
    this.audioLoader = null;
    this.initialized = false;
    
    // 音频状态
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentUrl = null;
    this.audioContext = null;
    this.contextResumed = false;
    
    // ✅ 延迟创建标记
    this.listenerCreated = false;
    this.camera = null;
  }

  async init({ eventBus, camera }) {
    if (this.initialized) {
      logger.warn('AudioSystem', '音频系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.camera = camera;
      
      // ✅ 不在这里创建 AudioListener,等用户点击播放时再创建
      this.audioLoader = new THREE.AudioLoader();
      
      this._bindEvents();
      
      this.initialized = true;
      logger.info('AudioSystem', '音频系统初始化完成(延迟创建 AudioContext)');
      
      return this;
    } catch (err) {
      logger.error('AudioSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  // ✅ 首次播放时创建 AudioListener 和 AudioContext
  _ensureListenerCreated() {
    if (this.listenerCreated) return;
    
    try {
      // 创建音频监听器（绑定到相机）
      this.listener = new THREE.AudioListener();
      this.camera.add(this.listener);
      
      // 获取 AudioContext 引用
      this.audioContext = this.listener.context;
      
      // 创建音频对象
      this.sound = new THREE.Audio(this.listener);
      
      this.listenerCreated = true;
      logger.info('AudioSystem', 'AudioListener 已创建');
    } catch (err) {
      logger.error('AudioSystem', `创建 AudioListener 失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('audio-toggle', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.eventBus.on('audio-load', (url) => {
      this.loadAudio(url);
    });

    this.eventBus.on('audio-volume-changed', (volume) => {
      this.setVolume(volume);
    });

    this.eventBus.on('audio-stop', () => {
      this.stop();
    });
  }

   loadAudio(url) {
    if (!url) {
      logger.warn('AudioSystem', '音频 URL 为空');
      return;
    }

    this._ensureListenerCreated();

    // ✅ 2. 使用 resolveAssetUrl 包装路径
    const fetchUrl = resolveAssetUrl(url);

    logger.info('AudioSystem', `开始加载音频: ${fetchUrl}`);

    this.audioLoader.load(
      fetchUrl,
      (buffer) => {
        if (this.sound.isPlaying) {
          this.sound.stop();
        }
        
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(this.volume);
        this.currentUrl = url;
        
        logger.info('AudioSystem', '音频加载成功');
        this.eventBus.emit('audio-loaded', url);
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        logger.debug('AudioSystem', `加载进度: ${progress.toFixed(1)}%`);
      },
      (error) => {
        logger.error('AudioSystem', `加载失败: ${error.message}`);
        this.eventBus.emit('audio-load-error', error);
      }
    );
  }

  async play() {
    if (!this.sound || !this.sound.buffer) {
      logger.warn('AudioSystem', '没有加载音频');
      return;
    }

    // ✅ 确保 AudioContext 已恢复
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.contextResumed = true;
        logger.info('AudioSystem', 'AudioContext 已恢复');
      } catch (err) {
        logger.error('AudioSystem', `恢复 AudioContext 失败: ${err.message}`);
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

  setVolume(volume) {
    this.volume = THREE.MathUtils.clamp(volume, 0, 1);
    if (this.sound) {
      this.sound.setVolume(this.volume);
      logger.debug('AudioSystem', `音量: ${(this.volume * 100).toFixed(0)}%`);
    }
  }

  getVolume() {
    return this.volume;
  }

  isAudioPlaying() {
    return this.isPlaying;
  }

  dispose() {
    if (this.sound) {
      this.sound.stop();
      if (this.sound.buffer) {
        this.sound.buffer = null;
      }
    }

    if (this.listener && this.listener.parent) {
      this.listener.parent.remove(this.listener);
    }

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
 * @file camera-sys.js
 * @description 相机系统 - 透视/正交切换 + camera-controls 集成
 * ✅ 核心改造: 监听统一的 'config-changed' 事件。
 */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import logger from '../utils/logger';
import config from '../config';
import { applyPerspMouseMapping, applyOrthoMouseMapping } from './controls-util';

CameraControls.install({ THREE });

class CameraSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
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

  init({ eventBus, scene, renderer }) {
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
    } catch (err) {
      logger.error('CameraSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createCameras() {
    const aspect = window.innerWidth / window.innerHeight;
    const fov = config.get('camera.fov') || 75;
    const near = config.get('camera.near') || 0.1;
    const far = config.get('camera.far') || 1000;

    this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.perspectiveCamera.position.set(10, 8, 15);
    this.perspectiveCamera.name = 'PerspectiveCamera';

    const height = this.orthoFrustumSize;
    const width = height * aspect;
    
    this.orthographicCamera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, near, far
    );
    this.orthographicCamera.position.set(0, 50, 0);
    this.orthographicCamera.name = 'OrthographicCamera';
    this.orthographicCamera.zoom = 1.0;

    logger.debug('CameraSystem', `相机已创建`);
  }

  _createControls() {
    this.controls = new CameraControls(this.activeCamera, this.renderer.domElement);
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
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // ✅ 保留命令式事件
    this.eventBus.on('view-changed', (viewKey) => this._applyViewPreset(viewKey));
    this.eventBus.on('flip-view', () => this._flipView());
    
    // ✅ 保留系统间信号
    this.eventBus.on('coordinate-system-updated', ({ type }) => {
      if (type === 'position') {
        this._setRotationCenterToOrigin();
      }
    });
    this.eventBus.on('data-processing-completed', () => {
      this._setRotationCenterToOrigin();
      logger.info('CameraSystem', '数据处理完成后已锁定旋转中心');
    });

    window.addEventListener('resize', () => this._handleResize());
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }) {
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

  _switchToMode(mode) {
    if (mode === this.currentMode) return;

    const prevCamera = this.activeCamera;
    this.currentMode = mode;

    if (mode === 'perspective') {
      this.activeCamera = this.perspectiveCamera;
      this.controls.camera = this.activeCamera;
      applyPerspMouseMapping(this.controls);
      if (prevCamera) {
        const position = prevCamera.position.clone();
        this.controls.setPosition(position.x, position.y, position.z, false);
        this.controls.setTarget(0, 0, 0, false);
      }
    } else if (mode === 'orthographic') {
      this.activeCamera = this.orthographicCamera;
      this.controls.camera = this.activeCamera;
      applyOrthoMouseMapping(this.controls);
      this._applyViewPreset('top');
    }
    
    this.eventBus.emit('camera-mode-switched', mode);
    this.eventBus.emit('camera-changed', this.activeCamera);
    logger.info('CameraSystem', `切换到${mode}相机`);
  }

  _applyViewPreset(viewKey) {
    const distance = 50;
    let position;
    switch (viewKey) {
      case 'top': position = new THREE.Vector3(0, distance, 0); break;
      case 'front': position = new THREE.Vector3(0, 0, distance); break;
      case 'side': position = new THREE.Vector3(distance, 0, 0); break;
      default: return;
    }
    this.controls.setLookAt(position.x, position.y, position.z, 0, 0, 0, true);
  }

  _flipView() {
    const currentPos = this.activeCamera.position.clone();
    const target = new THREE.Vector3();
    this.controls.getTarget(target);
    const newPos = target.clone().add(currentPos.sub(target).negate());
    this.controls.setLookAt(newPos.x, newPos.y, newPos.z, target.x, target.y, target.z, true);
  }

  _handleResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    const height = this.orthoFrustumSize / this.orthographicCamera.zoom;
    const width = height * aspect;
    this.orthographicCamera.left = -width / 2;
    this.orthographicCamera.right = width / 2;
    this.orthographicCamera.top = height / 2;
    this.orthographicCamera.bottom = -height / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update(delta) {
    if (this.controls) this.controls.update(delta);
  }

  getActiveCamera() { return this.activeCamera; }
  getControls() { return this.controls; }
  
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
export function applyPerspMouseMapping(controls) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left   = A.ROTATE;
  controls.mouseButtons.middle = A.TRUCK;     // 中键平移
  controls.mouseButtons.right  = A.TRUCK;     // 右键平移
  controls.mouseButtons.wheel  = A.DOLLY;     // 滚轮推拉（透视）

  // 触控
  controls.touches.one   = A.TOUCH_ROTATE;
  controls.touches.two   = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 手感：滚轮力度；并明确关闭“朝指针处推拉”以保 target 固定
  controls.dollySpeed     = 0.8;
  controls.dollyToCursor  = false; // ✅ 根因修复
  controls.zoomToCursor   = false;
}

// 正交：禁用旋转；滚轮用 ZOOM（必须），开启 zoomToCursor
export function applyOrthoMouseMapping(controls) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left   = A.NONE;      // 禁止左键旋转
  controls.mouseButtons.middle = A.TRUCK;     // 中键平移
  controls.mouseButtons.right  = A.TRUCK;     // 右键平移
  controls.mouseButtons.wheel  = A.ZOOM;      // ✅ 正交必须用 ZOOM

  controls.touches.one   = A.NONE;
  controls.touches.two   = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 正交缩放更有力，并以指针为中心缩放
  controls.dollySpeed     = 1.5;
  controls.zoomToCursor   = true;
  controls.dollyToCursor  = false;
}

// 默认（向后兼容）
export function applyDefaultMouseMapping(controls) {
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
import logger from '../utils/logger.js';
import config from '../config.js';

class CoordinateSystem {
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

  init({ eventBus, scene }) {
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
    } catch (err) {
      logger.error('CoordinateSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createHierarchy() {
    this.worldRoot = new THREE.Group();
    this.worldRoot.name = 'WorldRoot';
    this.scene.add(this.worldRoot);

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
    this.dataSpace.rotation.set(rotation.x || 0, rotation.y || 0, rotation.z || 0);

    const position = config.get('coordinates.dataSpace.position');
    this.dataSpace.position.set(position.x || 0, position.y || 0, position.z || 0);

    logger.info('CoordinateSystem', `✅ 配置已加载 | 缩放: ${scale}x`);
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }) {
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
          this.dataSpace.rotation.set(rot.x, rot.y, rot.z);
          break;
          
        case 'coordinates.dataSpace.position.x':
        case 'coordinates.dataSpace.position.y':
        case 'coordinates.dataSpace.position.z':
          const pos = config.get('coordinates.dataSpace.position');
          this.dataSpace.position.set(pos.x, pos.y, pos.z);
          break;
      }
    }
  }

  /**
   * 设置DataSpace整体缩放
   */
  setDataSpaceScale(scale) {
    if (scale <= 0) return;
    this.dataSpace.scale.setScalar(scale);
    // ❌ 移除 config.set 以避免循环
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

  getParticleAnchor() { return this.particleAnchor; }
  getPathAnchor() { return this.pathAnchor; }
  getLightAnchor() { return this.lightAnchor; }

  dispose() {
    if (this.worldRoot) this.scene.remove(this.worldRoot);
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
 * ✅ 修复: 初始化时动态加载数据源清单 (manifest.json)，并提供主动查询方法。
 */
import * as THREE from 'three';
import Papa from 'papaparse';
import logger from '../utils/logger';
import config from '../config';
import { resolveAssetUrl } from '../utils/url-resolver';
import state from './state';

class DataSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private camera: THREE.Camera | null;
  private controls: any;
  private initialized: boolean;
  private rawData: any[];
  private datasets: any[];

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.initialized = false;
    
    this.rawData = [];
    this.datasets = []; // ✅ 新增：用一个内部变量存储数据集列表
  }

  // init 方法保持 async 不变
  async init({ eventBus, scene, camera, controls }) {
    if (this.initialized) {
      // logger.warn('DataSystem', '数据系统已经初始化过了'); // 暂时注释掉，因为我们修复了重复调用的问题
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.camera = camera;
      this.controls = controls;

      this.eventBus.on('data-load-requested', (csvUrl) => {
        this.loadCSV(csvUrl);
      });

      await this._loadAvailableDatasets();

      this.initialized = true;
      logger.info('DataSystem', '数据系统初始化完成');

      return this;
    } catch (err) {
      logger.error('DataSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * ✅ 新增：提供一个公共的 getter 方法
   */
  getAvailableDatasets() {
    return this.datasets;
  }
  
  async _loadAvailableDatasets() {
    try {
      // ✅ 2. 使用 resolveAssetUrl 包装路径
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
    } catch (err) {
      logger.error('DataSystem', `加载数据集清单失败: ${err.message}`);
      this.datasets = [];
      config.set('data.availableDatasets', []);
    } finally {
      this.eventBus.emit('datasets-list-updated', this.getAvailableDatasets());
    }
  }

  async loadCSV(csvUrl) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    // ✅ 3. 同样，解析从 manifest.json 中读到的路径
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
        error: (error) => {
          logger.error('DataSystem', `CSV 解析错误: ${error.message}`);
          this.eventBus.emit('data-load-error', error);
        }
      });
    } catch (err) {
      logger.error('DataSystem', `CSV 加载失败: ${err.message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _processData(rawData) {
    try {
      const validData = rawData.filter(row => {
        return row.x !== null && 
               row.y !== null && 
               row.z !== null &&
               !isNaN(row.x) &&
               !isNaN(row.y) &&
               !isNaN(row.z);
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
        rawData: validData, 
        points: mappedPoints 
      });
      
      this.eventBus.emit('data-processing-completed');
    } catch (err)
 {
      logger.error('DataSystem', `数据处理失败: ${err.message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _mapToPoints(data) {
    const positionScale = config.get('environment.positionScale') || 2.0;

    return data.map(row => {
      return new THREE.Vector3(
        row.x * positionScale,
        row.y * positionScale,
        row.z * positionScale
      );
    });
  }

  _adjustCamera(points) {
    if (!points || points.length === 0) return;

    this.eventBus.emit('data-processing-started');

    const box = new THREE.Box3();
    points.forEach(p => box.expandByPoint(p));

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    const cameraDistFactor = 2.5;
    const distance = maxDim * cameraDistFactor;

    if (this.controls) {
      this.controls.setPosition(
        distance * 0.6,
        distance * 0.4,
        distance * 0.8,
        false
      );
      
      this.controls.setTarget(0, 0, 0, false);
    }

    logger.info('DataSystem', `✅ 相机已调整 | 距离: ${distance.toFixed(2)} | 目标: (0,0,0)`);
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
  constructor() {
    this.scene = null;
    this.initialized = false;
    this.cubeTextureLoader = new THREE.CubeTextureLoader();
    this.fallbackColor = new THREE.Color('#121414'); // 默认背景色
  }

  init({ scene }) {
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
    eventBus.on('bg-color-changed', (color) => {
        const skyboxEnabled = config.get('environment.skybox.enabled');
        if (!skyboxEnabled) {
            this.fallbackColor.set(color);
            this.scene.background = this.fallbackColor;
        }
    });
  }

  _loadSkybox() {
    const skyboxConfig = config.get('environment.skybox');

    if (!skyboxConfig || !skyboxConfig.enabled || !skyboxConfig.path) {
      logger.warn('EnvironmentSystem', '天空盒未配置或未启用，使用纯色背景');
      this.scene.background = this.fallbackColor;
      return;
    }

    // ✅ 2. 使用 resolveAssetUrl 包装基础路径
    const basePath = resolveAssetUrl(skyboxConfig.path);
    const urls = [
      basePath + 'px.png', basePath + 'nx.png',
      basePath + 'py.png', basePath + 'ny.png',
      basePath + 'pz.png', basePath + 'nz.png'
    ];

    logger.debug('EnvironmentSystem', `正在加载天空盒: ${basePath}`);
    
    this.cubeTextureLoader.load(
      urls,
      (texture) => {
        this.scene.background = texture;
        this.scene.environment = texture;
        logger.info('EnvironmentSystem', '✅ 天空盒加载成功并应用');
      },
      undefined,
      (error) => {
        logger.error('EnvironmentSystem', `天空盒加载失败: ${error.message}`);
        this.scene.background = this.fallbackColor;
      }
    );
  }

  dispose() {
    this.scene.background = null;
    this.scene.environment = null;
    this.initialized = false;
    logger.info('EnvironmentSystem', '环境系统已销毁');
  }
}

const environmentSys = new EnvironmentSystem();
export default environmentSys;

```

### src/systems/lighting-sys.ts

```
/**
 * @file lighting-sys.js
 * @description 光照系统 - 管理场景中的环境光与直接光
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

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

  init({ scene }) {
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
    this.ambientLight = new THREE.AmbientLight(
      ambientConfig.color,
      ambientConfig.intensity
    );
    this.ambientLight.name = 'AmbientLight';
    this.scene.add(this.ambientLight);

    // 2. 平行光 (DirectionalLight)
    // 模拟一个无限远的光源（如太阳），产生高光和阴影
    const dirConfig = config.get('lighting.directional');
    this.directionalLight = new THREE.DirectionalLight(
      dirConfig.color,
      dirConfig.intensity
    );
    this.directionalLight.name = 'DirectionalLight';
    this.directionalLight.position.set(
      dirConfig.position.x,
      dirConfig.position.y,
      dirConfig.position.z
    );
    this.scene.add(this.directionalLight);

    logger.debug('LightingSystem', '环境光和平行光已创建');
  }

  // 未来可以添加更新光照参数的方法，例如通过UI
  updateAmbient(color, intensity) {
    if (this.ambientLight) {
      this.ambientLight.color.set(color);
      this.ambientLight.intensity = intensity;
    }
  }
  
  updateDirectional(color, intensity) {
    if (this.directionalLight) {
      this.directionalLight.color.set(color);
      this.directionalLight.intensity = intensity;
    }
  }

  dispose() {
    if (this.ambientLight) this.scene.remove(this.ambientLight);
    if (this.directionalLight) this.scene.remove(this.directionalLight);
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
        uCameraPosition: { value: new THREE.Vector3() }
      },
      vertexShader: pathVertexShader,
      fragmentShader: pathFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
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
      vertexColors: false
    });
    this.materials.set('dustParticles', dustParticlesMaterial);

    // ✅ 修正：为移动光点材质提供完整的配置
    const movingLightMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(materialCfg.movingLight.emissiveColor),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.materials.set('movingLight', movingLightMaterial);
  }

  _bindEvents() {
    eventBus.on('config-changed', ({ key, value }: { key: string, value: any }) => {
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
          pathLineMat.uniforms.uEmissive.value.set(value);
        }
        break;
      case 'path.depthIntensity':
        if (pathLineMat instanceof THREE.ShaderMaterial) {
          pathLineMat.uniforms.uDepthIntensity.value = value;
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
    this.materials.forEach(material => material.dispose());
    this.materials.clear();
    this.initialized = false;
    logger.info('MaterialService', '材质服务已销毁');
  }
}

const materialSys = new MaterialService();
export default materialSys;

```

### src/systems/math-light-sys.ts

```
/**
 * @file math-light-sys.ts
 * @description 移动光点系统 (数学球体版)
 * ✅ 重构: 监听统一的 'config-changed' 事件
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';


class MathLightSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private coordinateSystem: any;
  private initialized: boolean;
  private lightMesh: any;
  private currentPosition: THREE.Vector3;

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.lightMesh = null;
    this.currentPosition = new THREE.Vector3();
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('MathLightSystem', '移动光点已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this._createLight();
      this._bindEvents();

      this.initialized = true;
      logger.info('MathLightSystem', '移动光点(数学版)初始化完成');

      return this;
    } catch (err) {
      logger.error('MathLightSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createLight() {

    // 🟢 补上丢失的 geometry 定义
    const geometry = new THREE.SphereGeometry(0.5, 16, 16);

    // 从 MaterialService 获取预创建的材质
const material = materialSys.get('movingLight');

if (!material) {
  logger.error('MathLightSystem', '无法从 MaterialService 获取 "movingLight" 材质，光点无法创建。');
  return;
}
    
    this.lightMesh = new THREE.Mesh(geometry, material);
    this.lightMesh.name = 'MovingLight_Math';
    this.lightMesh.visible = false;
    this.lightMesh.userData = { glow: true };
    
    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.lightMesh);

    postprocessSys.addGlowObject(this.lightMesh); // **注册到新的辉光系统**
    
    logger.debug('MathLightSystem', '光点球体已创建');
  }

  _bindEvents() {
    this.eventBus.on('moving-light-position-updated', (position) => {
      this.updatePosition(position);
    });

    this.eventBus.on('animation-reset', () => {
      this.hide();
    });

    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   * @param {{key: string, value: any}} param0
   */
  _handleConfigChange({ key, value }) {
    if (!this.lightMesh) return;
    
    switch (key) {
      case 'particles.pathPointSize':
        this.lightMesh.scale.setScalar(value);
        break;
    }
  }

  updatePosition(position) {
    if (this.lightMesh && position) {
      this.currentPosition.copy(position);
      this.lightMesh.position.copy(position);
      this.lightMesh.visible = true;
    }
  }

  hide() {
    if (this.lightMesh) {
      this.lightMesh.visible = false;
    }
  }

  enable() {
    // 启用光点时，只有在动画进行中才应该可见
    // AnimationSystem 会通过 'moving-light-position-updated' 事件来控制其具体可见性
    // 所以这里只是一个逻辑上的启用标记
    logger.debug('MathLightSystem', '已启用 (可见性由动画系统控制)');
  }

  disable() {
    this.hide(); // 禁用时，强制隐藏
    logger.debug('MathLightSystem', '已禁用');
  }

  dispose() {
    if (this.lightMesh && this.coordinateSystem) {
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.lightMesh);
      this.lightMesh.geometry.dispose();
      this.lightMesh.material.dispose();
    }

    this.initialized = false;
    logger.info('MathLightSystem', '移动光点已销毁');
  }
}

const mathLightSys = new MathLightSystem();
export default mathLightSys;

```

### src/systems/model-sys.ts

```
/**
 * @file model-sys.ts
 * @description 模型服务 - 负责加载、缓存和处理 GLB/GLTF 模型资源。
 */
import * as THREE from 'three';
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
  async load(relativeUrl) {
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
    } catch (error) {
      logger.error('ModelService', `加载模型失败 "${relativeUrl}": ${error.message}`);
      throw error;
    }
  }

  /**
   * 将指定名称的材质应用到模型的所有网格上
   * @param {THREE.Group} model - 目标模型
   * @param {string} materialName - 在 MaterialService 中注册的材质名称
   */
  applyMaterial(model, materialName) {
    const material = materialSys.get(materialName);
    if (!material) {
      logger.warn('ModelService', `应用材质失败: 材质 "${materialName}" 不存在`);
      return;
    }

    model.traverse((child) => {
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
const DEFAULT_SYSTEM_SCALE = 1.0;
const DEFAULT_BREATH_INTENSITY = 0.1;
const DEFAULT_BREATH_PERIOD = 3.0;
const DEFAULT_FLOAT_INTENSITY = 0.3;
const DEFAULT_FLOAT_PERIOD = 4.0;

class ParticlesSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private coordinateSystem: any;
  private initialized: boolean;
  private dustParticles: any;
  private particleContainer: any;
  private rotationAxis: THREE.Vector3;
  private rotationSpeed: number;
  private tiltXZ: number;
  private tiltXY: number;
  private baseRadius: number;
  private breathIntensity: number;
  private breathPeriod: number;
  private floatIntensity: number;
  private floatPeriod: number;
  private initialPositions: any;
  private baseSize: number;

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.dustParticles = null;
    this.particleContainer = null;
    
    this.rotationAxis = new THREE.Vector3(0, 1, 0);
    this.rotationSpeed = 0;
    this.tiltXZ = 0;
    this.tiltXY = 0;
    
    this.baseRadius = DEFAULT_SPHERE_RADIUS;
    this.breathIntensity = DEFAULT_BREATH_INTENSITY;
    this.breathPeriod = DEFAULT_BREATH_PERIOD;
    this.floatIntensity = DEFAULT_FLOAT_INTENSITY;
    this.floatPeriod = DEFAULT_FLOAT_PERIOD;
    
    this.initialPositions = null;
    this.baseSize = 0.6;
  }

  init({ eventBus, scene, coordinateSystem }) {
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
    } catch (err) {
      logger.error('ParticlesSystem', `初始化失败: ${err.message}`);
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
      logger.error('ParticlesSystem', '无法从 MaterialService 获取 "dustParticles" 材质，粒子无法创建。');
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

  _handleConfigChange({ key, value }: { key: string, value: any }) {
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
        const phaseOffset = sizes[i];
        
        const floatPhase = elapsed / this.floatPeriod + phaseOffset;
        const floatOffset = Math.sin(floatPhase * Math.PI * 2) * this.floatIntensity;
        
        positions[i * 3 + 1] = this.initialPositions[i * 3 + 1] + floatOffset;
      }
  
      this.dustParticles.geometry.attributes.position.needsUpdate = true;
  
      const globalBreath = 1.0 + Math.sin(elapsed / this.breathPeriod * Math.PI * 2) * this.breathIntensity * 0.3;
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
 * @description 路径系统 - 动态轨迹线条 + 实时绘制
 * 🔧 修正: 移除对旧辉光层 (GLOW_LAYER) 的引用，改用新的 postprocessSys.addGlowObject() 方法。
 * 🔧 修正: 移除对共享材质的 .dispose() 调用，以保护材质服务。
 * 🔧 补充: 恢复 enable/disable 方法以兼容场景导演。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import materialSys from './material-sys';
import postprocessSys from './postprocess-sys';

class PathSystem {
  private eventBus: any;
  private scene: THREE.Scene | null;
  private coordinateSystem: any;
  private initialized: boolean;
  private pathLine: THREE.Line | null;
  private allPoints: THREE.Vector3[];
  private currentDrawIndex: number;
  private pathContainer: THREE.Group | null;
  private isEnabled: boolean; // 补充

  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.pathLine = null;
    this.allPoints = [];
    this.currentDrawIndex = 0;
    
    this.pathContainer = null;
    this.isEnabled = true; // 补充
  }

  init({ eventBus, scene, coordinateSystem }: { eventBus: any; scene: THREE.Scene; coordinateSystem: any; }) {
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
      logger.info('PathSystem', '路径系统初始化完成');

      return this;
    } catch (err) {
      logger.error('PathSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('data-loaded', (data: { points: THREE.Vector3[] }) => {
      this.allPoints = data.points;
      this.currentDrawIndex = 0;
      this._createPath();
    });

    this.eventBus.on('moving-light-position-updated', (position: THREE.Vector3) => {
      this._updatePathToPosition(position);
    });

    this.eventBus.on('animation-step-updated', (step: number) => {
      this._jumpToStep(step);
    });

    this.eventBus.on('animation-reset', () => {
      this.currentDrawIndex = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });

    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
  }

  _handleConfigChange({ key, value }: { key: string; value: any; }) {
    if (!this.pathLine) return;

    switch (key) {
      case 'path.scale':
        if (this.pathContainer) {
          this.pathContainer.scale.setScalar(value);
        }
        break;
    }
  }

  _createPath() {
    if (!this.allPoints || this.allPoints.length === 0) {
      logger.warn('PathSystem', '路径点为空');
      return;
    }

    if (this.pathLine && this.pathContainer) {
      // ✅ 核心修正: 从辉光场景中移除旧对象
      postprocessSys.removeGlowObject(this.pathLine);
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      // ✅ 核心修正: 不要销毁由 materialSys 管理的共享材质
      // this.pathLine.material.dispose(); 
    }

    const geometry = new THREE.BufferGeometry();
    const maxPoints = this.allPoints.length;
    const positions = new Float32Array(maxPoints * 3);
    
    for (let i = 0; i < maxPoints; i++) {
      const point = this.allPoints[i];
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);

    const material = materialSys.get('pathLine');

    if (!material) {
      logger.error('PathSystem', '无法从 MaterialService 获取 "pathLine" 材质，路径无法创建。');
      return;
    }

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };
    
    // ✅ 核心修正: 使用新的方法将路径添加到辉光场景
    postprocessSys.addGlowObject(this.pathLine);
    
    this.pathContainer?.add(this.pathLine);

    this.currentDrawIndex = 0;
    logger.info('PathSystem', `路径已创建: 总点数 ${this.allPoints.length}`);
  }

  _updatePathToPosition(position: THREE.Vector3) {
    if (!this.pathLine || !this.allPoints.length) return;

    let closestIndex = 0;
    let minDist = Infinity;

    for (let i = this.currentDrawIndex; i < this.allPoints.length; i++) {
      const dist = position.distanceTo(this.allPoints[i]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
      if (dist > minDist && i > this.currentDrawIndex + 5) break; // 优化: 如果距离开始变大，则停止搜索
    }

    if (closestIndex > this.currentDrawIndex) {
      this.currentDrawIndex = closestIndex;
      this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
    }
  }

  _jumpToStep(step: number) {
    if (!this.pathLine || !this.allPoints.length) return;

    const targetIndex = Math.min(step, this.allPoints.length - 1);
    this.currentDrawIndex = targetIndex;
    this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
  }

  updateCameraPosition(camera: THREE.Camera) {
    if (this.pathLine && camera && this.pathContainer) {
      const material = this.pathLine.material as THREE.ShaderMaterial;
      if (material.uniforms.uCameraPosition) {
        const worldCamPos = camera.position.clone();
        const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
        material.uniforms.uCameraPosition.value.copy(localCamPos);
      }
    }
  }

  update(delta: number) {
    // 占位
  }
  
  // ✅ 补充: 恢复 enable/disable 方法以兼容 scene-director-sys
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
 * @description 后处理系统 -全面采用 "postprocessing" 库，不允许使用自制shader。
 * @version 2.1
 */
import * as THREE from 'three';
import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SelectiveBloomEffect,
  BokehEffect,
  ChromaticAberrationEffect,
  DotScreenEffect,
  TextureEffect,
  HueSaturationEffect,
  BrightnessContrastEffect,
  Selection,
  BlendFunction,
  NoiseEffect
} from 'postprocessing';
// FilmEffect 在当前 postprocessing 版本无命名导出，改用 NoiseEffect 模拟胶片颗粒
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';

class PostprocessSystem {
  private mainScene: THREE.Scene | null = null;
  private camera: THREE.Camera | null = null;
  private renderer: THREE.WebGLRenderer | null = null;
  private initialized = false;

  private composer: EffectComposer | null = null;
  private selection: Selection; // 用于选择性辉光

  // 所有效果
  private bloomEffect: SelectiveBloomEffect | null = null;
  private bokehEffect: BokehEffect | null = null;
  private chromaticAberrationEffect: ChromaticAberrationEffect | null = null;
  private dotScreenEffect: DotScreenEffect | null = null;
  private filmEffect: NoiseEffect | null = null;
  private scanlineEffect: TextureEffect | null = null;
  private scanlineTexture: THREE.Texture | null = null;
  private hueSaturationEffect: HueSaturationEffect | null = null;
  private brightnessContrastEffect: BrightnessContrastEffect | null = null;

  constructor() {
    this.selection = new Selection();
  }

  init({ scene, camera, renderer }: { scene: THREE.Scene; camera: THREE.Camera; renderer: THREE.WebGLRenderer; }) {
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
      this.updateAllEffectsFromConfig(); // 初始加载配置

      this.initialized = true;
      logger.info('PostprocessSystem', '✅ 后处理系统初始化完成 (v2.1, postprocessing库)');
      return this;
    } catch (err) {
      logger.error('PostprocessSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  // [API不变] 外部系统通过此方法注册辉光对象
  addGlowObject(object: THREE.Object3D) {
    this.selection.add(object);
    logger.debug('PostprocessSystem', `对象 "${object.name}" 已添加到光晕选择集`);
  }

  // [API不变] 外部系统通过此方法移除辉光对象
  removeGlowObject(object: THREE.Object3D) {
    this.selection.delete(object);
    logger.debug('PostprocessSystem', `对象 "${object.name}" 已从光晕选择集移除`);
  }

  private _createComposer() {
    if (!this.renderer || !this.mainScene || !this.camera) return;

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.HalfFloatType
    });

    // 1. 基础渲染通道
    const renderPass = new RenderPass(this.mainScene, this.camera);
    this.composer.addPass(renderPass);

    // 2. 创建所有效果
    this._createAllEffects();
    
    // 3. 将每个效果放入独立的 EffectPass，避免卷积合并冲突
    const camera = this.camera as THREE.Camera;
    const addEffect = (effect: any) => {
      if (effect) {
        const pass = new EffectPass(camera, effect);
        this.composer!.addPass(pass);
      }
    };

    addEffect(this.bloomEffect);
    addEffect(this.bokehEffect);
    addEffect(this.chromaticAberrationEffect);
    addEffect(this.dotScreenEffect);
    addEffect(this.filmEffect);
    addEffect(this.scanlineEffect);
    addEffect(this.hueSaturationEffect);
    addEffect(this.brightnessContrastEffect);
  }
  
  private _createAllEffects() {
    this.bloomEffect = new SelectiveBloomEffect(this.mainScene as any, this.camera as any, {
      blendFunction: BlendFunction.ADD,
      selection: this.selection,
      mipmapBlur: true,
    } as any);
    
    this.bokehEffect = new BokehEffect();
    this.chromaticAberrationEffect = new ChromaticAberrationEffect();
    this.dotScreenEffect = new DotScreenEffect({ blendFunction: BlendFunction.OVERLAY });
    this.filmEffect = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT }); // 用噪点效果模拟 Film 效果
    this._createScanlineEffect();
    this.hueSaturationEffect = new HueSaturationEffect();
    this.brightnessContrastEffect = new BrightnessContrastEffect();
  }

  private _createScanlineEffect() {
    const data = new Uint8Array([
      255, 255, 255, 255,
      0, 0, 0, 255
    ]);
    const texture = new THREE.DataTexture(data, 1, 2, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    this.scanlineTexture = texture;

    const effect = new TextureEffect({
      blendFunction: BlendFunction.SOFT_LIGHT,
      texture
    });
    const filmCfg = (config.get('postprocess.film') || {}) as any;
    if (filmCfg) {
      effect.blendMode.opacity.value = filmCfg.scanlineIntensity ?? 0.3;
      texture.repeat.set(1, Math.max(1, Math.floor((filmCfg.scanlineCount ?? 2048) / 2)));
    }
    this.scanlineEffect = effect;
  }

  render(delta: number) {
    if (!this.composer) return;

    if (config.get('postprocess.enabled')) {
      this.composer.render(delta);
    } else if (this.mainScene && this.camera) {
      this.renderer?.render(this.mainScene, this.camera);
    }
  }

  private _bindEvents() {
    eventBus.on('config-changed', this._handleConfigChange.bind(this));
    eventBus.on('camera-changed', (camera: THREE.Camera) => {
        this.camera = camera;
        if (this.composer) {
            this.composer.dispose();
            this.composer = null;
            this._createComposer();
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

    // 通用启用/禁用逻辑
    const setEnabled = (effect: any, isEnabled: boolean) => {
        if (effect) {
            effect.blendMode.opacity.value = isEnabled ? 1.0 : 0.0;
        }
    };

    switch (effectName) {
      case 'bloom':
        if (this.bloomEffect) {
          (this.bloomEffect as any).intensity = cfg.intensity;
          (this.bloomEffect as any).luminanceMaterial.threshold = cfg.luminanceThreshold;
          (this.bloomEffect as any).luminanceMaterial.smoothing = cfg.luminanceSmoothing;
          setEnabled(this.bloomEffect, cfg.enabled);
        }
        break;
      case 'bokeh':
        if (this.bokehEffect) {
            // 当前 postprocessing 版本 BokehEffect 无公开 uniforms 接口，避免直接访问
            setEnabled(this.bokehEffect, cfg.enabled);
        }
        break;
      case 'chromaticAberration':
        if (this.chromaticAberrationEffect) {
            this.chromaticAberrationEffect.offset.set(cfg.offset.x, cfg.offset.y);
            setEnabled(this.chromaticAberrationEffect, cfg.enabled);
        }
        break;
      case 'dotScreen':
        if (this.dotScreenEffect) {
            this.dotScreenEffect.uniforms.get('angle')!.value = cfg.angle;
            this.dotScreenEffect.uniforms.get('scale')!.value = cfg.scale;
            setEnabled(this.dotScreenEffect, cfg.enabled);
        }
        break;
      case 'film':
        if (this.filmEffect) {
            setEnabled(this.filmEffect, cfg.enabled);
        }
        if (this.scanlineEffect && this.scanlineTexture) {
            this.scanlineEffect.blendMode.opacity.value = cfg.scanlineIntensity ?? 0.3;
            this.scanlineTexture.repeat.set(1, Math.max(1, Math.floor((cfg.scanlineCount ?? 2048) / 2)));
        }
        break;
      case 'hueSaturation':
          if (this.hueSaturationEffect) {
              this.hueSaturationEffect.uniforms.get('hue')!.value = cfg.hue;
              this.hueSaturationEffect.uniforms.get('saturation')!.value = cfg.saturation;
              setEnabled(this.hueSaturationEffect, cfg.enabled);
          }
          break;
      case 'brightnessContrast':
          if (this.brightnessContrastEffect) {
              this.brightnessContrastEffect.uniforms.get('brightness')!.value = cfg.brightness;
              this.brightnessContrastEffect.uniforms.get('contrast')!.value = cfg.contrast;
              setEnabled(this.brightnessContrastEffect, cfg.enabled);
          }
          break;
    }
  }
  
  updateAllEffectsFromConfig() {
    const allKeys = Object.keys(config.get('postprocess'));
    allKeys.forEach(key => this.updateEffectFromConfig(`postprocess.${key}`));
  }

  handleResize() {
    this.composer?.setSize(window.innerWidth, window.innerHeight);
    logger.debugThrottled('PostprocessSystem', 'postprocess-resize', '后处理已调整大小 (v2.1)', 1000);
  }

  dispose() {
    this.composer?.dispose();
    this.initialized = false;
    logger.info('PostprocessSystem', '后处理系统已销毁 (v2.1)');
  }
}

const postprocessSys = new PostprocessSystem();
export default postprocessSys;

```

### src/systems/scene-director-sys.ts

```
/**
 * @file scene-director-sys.js
 * @description 场景导演系统 - 根据配置动态启用/禁用场景中的视觉组件
 */
import logger from '../utils/logger';
import config from '../config';

// 引入所有受其控制的视觉系统
import pathSys from './path-sys';
import mathLightSys from './math-light-sys';
import particlesSys from './particles-sys.js';
// import modelSys from './model-sys.js'; // 未来用于加载模型

class SceneDirector {
  constructor() {
    this.eventBus = null;
    this.initialized = false;
    this.components = new Map();
  }

  init({ eventBus }) {
    if (this.initialized) return this;
    
    this.eventBus = eventBus;
    this._registerComponents();
    this._bindEvents();

    // 立即应用初始配置
    this._applyCurrentComposition();

    this.initialized = true;
    logger.info('SceneDirector', '场景导演系统初始化完成');
    return this;
  }

  /**
   * 注册所有可被导演控制的视觉组件。
   * key 必须与 config.js -> sceneComposition -> type 的值完全对应。
   */
  _registerComponents() {
    this.components.set('math-path', pathSys);
    this.components.set('math-light', mathLightSys);
    this.components.set('particle-dust', particlesSys);
    // 未来可以添加 'model' 等更多类型
    logger.debug('SceneDirector', `注册了 ${this.components.size} 个视觉组件`);
  }

  _bindEvents() {
    this.eventBus.on('config-changed', ({ key, value }) => {
      if (key === 'sceneComposition.active') {
        logger.info('SceneDirector', `检测到场景构成切换: ${value}`);
        this._applyCurrentComposition();
      }
    });
  }

  /**
   * 应用当前的场景构成配置
   */
  _applyCurrentComposition() {
    const activeCompositionName = config.get('sceneComposition.active');
    const composition = config.get(`sceneComposition.compositions.${activeCompositionName}`);

    if (!composition) {
      logger.error('SceneDirector', `未找到名为 "${activeCompositionName}" 的场景构成`);
      return;
    }

    logger.info('SceneDirector', `正在应用场景构成: "${activeCompositionName}"`);

    // 1. 先禁用所有受控组件，确保一个干净的状态
    this.components.forEach(component => {
      if (typeof component.disable === 'function') {
        component.disable();
      }
    });

    // 2. 根据配置启用所需的组件
    composition.forEach(item => {
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
  }

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
  }
};

// 深度克隆函数
function deepClone(obj: any): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
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
        if (value === null || value === undefined) return null;
        value = value[k];
      }
      return value;
    } catch (err) {
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
        if (!target[k] || typeof target[k] !== 'object') {
          target[k] = {};
        }
        target = target[k];
      }
      const lastKey = keys[keys.length - 1];
      if (target[lastKey] !== value) {
        target[lastKey] = value;
        // ✅ 发出独立的 state-changed 事件
        eventBus.emit('state-changed', { key, value });
      }
      return true;
    } catch (err) {
      logger.error('State', `设置状态异常 [${key}]: ${(err as Error).message}`);
      return false;
    }
  }

  reset() {
    this._state = deepClone(DEFAULT_STATE);
    logger.info('State', '状态已重置为默认值');
    Object.keys(DEFAULT_STATE).forEach(topKey => {
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

### src/ui/ui-basic.ts

```
/**
 * @file ui-basic.js
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
      pathPointColor: { pathPointColor: this.configData.particles.pathPointColor }
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
      container: uiContainer.getScrollContent()
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
    
    this.dataControls.forEach(c => c.dispose());
    this.dataControls = [];
    this.controls.delete('data.csvUrl');

    const datasets = dataSys.getAvailableDatasets();
    
    if (datasets.length === 0) {
      const errorBlade = folder.addBlade({
        view: 'text', label: '错误', parse: (v) => String(v), value: '未找到数据源清单'
      });
      this.dataControls.push(errorBlade);
      return;
    }
    
    const datasetOptions = datasets.reduce((acc, ds) => {
      acc[ds.name] = ds.path; // ✅ 直接使用 manifest 中的路径
      return acc;
    }, {});

    const csvSelect = folder.addBinding(this.configData.data, 'csvUrl', {
      label: 'CSV文件', options: datasetOptions
    });
    
    csvSelect.on('change', (ev) => {
      // ✅ 状态变更 -> config.set
      // ✅ 命令 -> eventBus.emit
      config.set('data.csvUrl', ev.value);
      eventBus.emit('data-load-requested', ev.value);
      this._updateDatasetDescription();
    });
    
    this.controls.set('data.csvUrl', csvSelect);
    this.dataControls.push(csvSelect);
    
    const descriptionBlade = folder.addBlade({
      view: 'text', label: '描述', parse: (v) => String(v), value: ''
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
    const currentDataset = datasets.find(ds => ds.path === currentPath);
    this.descriptionBlade.value = currentDataset ? currentDataset.description : '---';
  }

    _createAnimationControls() {
    const folder = this._pane.addFolder({ title: '动画控制', expanded: true });
    
    const playButton = folder.addButton({ title: state.get('animation.animating') ? '⏸️ 暂停' : '▶️ 播放' });
    playButton.on('click', () => {
      const isPlaying = !state.get('animation.animating');
      // ✅ 直接调用 state.set
      state.set('animation.animating', isPlaying);
    });

    // 监听状态变化来更新按钮标题
    eventBus.on('state-changed', ({ key, value }) => {
        if (key === 'animation.animating') {
            playButton.title = value ? '⏸️ 暂停' : '▶️ 播放';
        }
    });
    
    const stepSlider = folder.addBinding(this.stateData.animation, 'currentStep', { // ✅ 绑定到 stateData
      label: '当前步数', min: 0, max: 100, step: 1
    });
    stepSlider.on('change', (ev) => {
      eventBus.emit('step-to', ev.value);
    });
    this.controls.set('animation.currentStep', stepSlider); // ✅ key 保持不变
    
    eventBus.on('data-loaded', (data) => {
      stepSlider.max = data.points.length - 1;
      stepSlider.refresh();
    });
    
    // speed 和 loop 仍然是配置项，所以绑定到 configData
    const speed = folder.addBinding(this.configData.animation, 'speedFactor', { 
      label: '速度', min: 0.05, max: 5, step: 0.05 
    });
    speed.on('change', (ev) => config.set('animation.speedFactor', ev.value));
    this.controls.set('animation.speedFactor', speed);
    
    const loop = folder.addBinding(this.configData.animation, 'loop', { label: '循环播放' });
    loop.on('change', (ev) => config.set('animation.loop', ev.value));
    this.controls.set('animation.loop', loop);
    
    this.folders.set('animation', folder);
  }


  _createCameraControls() {
    const folder = this._pane.addFolder({ title: '相机设置', expanded: false });
    
    const mode = folder.addBinding(this.configData.camera, 'mode', {
      label: '相机模式', options: { '透视': 'perspective', '正交': 'orthographic' }
    });
    mode.on('change', (ev) => config.set('camera.mode', ev.value)); // ✅
    this.controls.set('camera.mode', mode);
    
    const viewContainer = folder.addFolder({ title: '视图预设', expanded: false });
    ['top', 'front', 'side'].forEach(key => {
      viewContainer.addButton({ title: `${key.charAt(0).toUpperCase() + key.slice(1)} View` })
        .on('click', () => eventBus.emit('view-changed', key)); // 命令，保留
    });
    viewContainer.addButton({ title: '🔄 翻转180°' }).on('click', () => eventBus.emit('flip-view')); // 命令，保留
    
    const fovBinding = folder.addBinding(this.configData.camera, 'fov', { 
      label: '视野角度', min: 20, max: 120, step: 1 
    });
    fovBinding.on('change', (ev) => config.set('camera.fov', ev.value)); // ✅
    this.controls.set('camera.fov', fovBinding);
    
    // 动态禁用/启用UI
    const setViewControlsState = (cameraMode) => {
      const disabled = cameraMode === 'perspective';
      viewContainer.children.forEach(c => c.disabled = disabled);
      fovBinding.disabled = !disabled;
    };
    eventBus.on('config-changed', ({ key, value }) => {
        if (key === 'camera.mode') setViewControlsState(value);
    });
    setViewControlsState(config.get('camera.mode'));

    this.folders.set('camera', folder);
  }

  _createParticleControls() {
    const folder = this._pane.addFolder({ title: '粒子系统', expanded: false });
    
    const dustColor = folder.addBinding(this.tempObjects.dustColor, 'dustColor', { label: '粒子颜色', view: 'color' });
    dustColor.on('change', (ev) => config.set('particles.dustColor', ev.value)); // ✅
    this.controls.set('particles.dustColor', dustColor);
    
    const dustSize = folder.addBinding(this.configData.particles, 'dustSize', { 
      label: '粒子大小', min: 0.05, max: 1.0, step: 0.01 
    });
    dustSize.on('change', (ev) => config.set('particles.dustSize', ev.value)); // ✅
    this.controls.set('particles.dustSize', dustSize);
    
    const dustCount = folder.addBinding(this.configData.particles, 'dustCount', { 
      label: '粒子数量', min: 500, max: 10000, step: 100 
    });
    dustCount.on('change', (ev) => config.set('particles.dustCount', ev.value)); // ✅
    this.controls.set('particles.dustCount', dustCount);

    const breath = folder.addBinding(this.configData.particles, 'breathIntensity', { 
      label: '呼吸强度', min: 0, max: 0.5, step: 0.01 
    });
    breath.on('change', (ev) => config.set('particles.breathIntensity', ev.value)); // ✅
    this.controls.set('particles.breathIntensity', breath);

    const float = folder.addBinding(this.configData.particles, 'floatIntensity', { 
      label: '浮动强度', min: 0, max: 1.0, step: 0.01 
    });
    float.on('change', (ev) => config.set('particles.floatIntensity', ev.value)); // ✅
    this.controls.set('particles.floatIntensity', float);

    const rotSpeed = folder.addBinding(this.configData.particles, 'rotationSpeed', { 
      label: '自转速度', min: -5, max: 5, step: 0.1 
    });
    rotSpeed.on('change', (ev) => config.set('particles.rotationSpeed', ev.value)); // ✅
    this.controls.set('particles.rotationSpeed', rotSpeed);
    
    const rotTiltXZ = folder.addBinding(this.configData.particles, 'rotationTiltXZ', { 
      label: '自转倾斜(XZ)', min: -90, max: 90, step: 1 
    });
    rotTiltXZ.on('change', (ev) => config.set('particles.rotationTiltXZ', ev.value)); // ✅
    this.controls.set('particles.rotationTiltXZ', rotTiltXZ);
    
    const rotTiltXY = folder.addBinding(this.configData.particles, 'rotationTiltXY', { 
      label: '自转俯仰(XY)', min: -90, max: 90, step: 1 
    });
    rotTiltXY.on('change', (ev) => config.set('particles.rotationTiltXY', ev.value)); // ✅
    this.controls.set('particles.rotationTiltXY', rotTiltXY);
    
    const opacity = folder.addBinding(this.configData.particles, 'dustOpacity', { 
      label: '透明度', min: 0, max: 1, step: 0.01 
    });
    opacity.on('change', (ev) => config.set('particles.dustOpacity', ev.value)); // ✅
    this.controls.set('particles.dustOpacity', opacity);
    
    this.folders.set('particles', folder);
  }

  _createPathControls() {
    const folder = this._pane.addFolder({ title: '路径设置', expanded: false });
    
    const pathColor = folder.addBinding(this.tempObjects.pathColor, 'pathColor', { label: '路径颜色', view: 'color' });
    pathColor.on('change', (ev) => config.set('environment.pathColor', ev.value)); // ✅
    this.controls.set('environment.pathColor', pathColor);

    const pointColor = folder.addBinding(this.tempObjects.pathPointColor, 'pathPointColor', { label: '光点颜色', view: 'color' });
    pointColor.on('change', (ev) => config.set('particles.pathPointColor', ev.value)); // ✅
    this.controls.set('particles.pathPointColor', pointColor);
    
    const pointSize = folder.addBinding(this.configData.particles, 'pathPointSize', { 
      label: '光点大小', min: 0.1, max: 2.0, step: 0.05 
    });
    pointSize.on('change', (ev) => config.set('particles.pathPointSize', ev.value)); // ✅
    this.controls.set('particles.pathPointSize', pointSize);
    
    const depth = folder.addBinding(this.configData.path, 'depthIntensity', { 
      label: '景深强度', min: 0, max: 1, step: 0.01 
    });
    depth.on('change', (ev) => config.set('path.depthIntensity', ev.value)); // ✅
    this.controls.set('path.depthIntensity', depth);
    
    this.folders.set('path', folder);
  }

  _createAudioControls() {
    const folder = this._pane.addFolder({ title: '背景音乐', expanded: false });
    
    let audioLoaded = false;
    const playButton = folder.addButton({ title: '▶️ 播放音乐' });
    playButton.on('click', () => {
      // Audio controls are commands, not state changes, so they stay with eventBus
      if (!audioLoaded) {
        eventBus.emit('audio-load', '/background-music.mp3');
        audioLoaded = true;
        eventBus.once('audio-loaded', () => eventBus.emit('audio-toggle'));
      } else {
        eventBus.emit('audio-toggle');
      }
    });
    eventBus.on('audio-playing', isPlaying => playButton.title = isPlaying ? '⏸️ 暂停音乐' : '▶️ 播放音乐');

    folder.addButton({ title: '⏹️ 停止' }).on('click', () => eventBus.emit('audio-stop'));

    const volumeObj = { volume: 0.5 };
    folder.addBinding(volumeObj, 'volume', { label: '音量', min: 0, max: 1, step: 0.01 })
      .on('change', (ev) => eventBus.emit('audio-volume-changed', ev.value));
    
    this.folders.set('audio', folder);
  }

      _bindEvents() {
    eventBus.on('datasets-list-updated', () => this._rebuildDataControls());

    // 监听配置变更
    eventBus.on('config-changed', ({ key, value }) => {
      this._updateControl(key, value, this.configData, this.tempObjects);
    });
    
    // ✅ 新增: 监听状态变更
    eventBus.on('state-changed', ({ key, value }) => {
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
      if (secondarySource && (key === 'particles.dustColor' || key === 'environment.pathColor' || key === 'particles.pathPointColor')) {
          tempKey = pathParts[1]; // e.g., 'dustColor'
          target = secondarySource[tempKey];
          if (target && target[tempKey] !== value) {
              target[tempKey] = value;
              control.refresh();
          }
          return;
      }
      
      // 处理直接绑定到 primarySource (configData or stateData) 的情况
      target = primarySource;
      for (let i = 0; i < pathParts.length - 1; i++) {
        target = target[pathParts[i]];
      }
      const lastKey = pathParts[pathParts.length - 1];
      if (target && target[lastKey] !== value) {
        target[lastKey] = value;
        control.refresh();
      }
  }

  updateBindings() {
    this.tempObjects.dustColor.dustColor = config.get('particles.dustColor');
    this.tempObjects.pathColor.pathColor = config.get('environment.pathColor');
    this.tempObjects.pathPointColor.pathPointColor = config.get('particles.pathPointColor');
    
    ['particles.dustColor', 'environment.pathColor', 'particles.pathPointColor'].forEach(key => {
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
    this.dataControls.forEach(c => c.dispose());
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
 * @file ui-container.js
 * @description 统一 UI 容器系统 - 左侧可滚动面板
 */
import logger from '../utils/logger';

class UIContainer {
  constructor() {
    this.container = null;
    this.scrollContent = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) {
      logger.warn('UIContainer', '容器已初始化');
      return;
    }

    this._createContainer();
    this._applyStyles();
    this._setupScrollBehavior();
    
    this.initialized = true;
    logger.info('UIContainer', 'UI 容器已创建');
  }

  _createContainer() {
    this.container = document.createElement('div');
    this.container.id = 'ui-container';
    
    this.scrollContent = document.createElement('div');
    this.scrollContent.id = 'ui-scroll-content';
    
    this.container.appendChild(this.scrollContent);
    document.body.appendChild(this.container);
  }

  _applyStyles() {
    Object.assign(this.container.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '320px',
      maxHeight: 'calc(100vh - 40px)',
      zIndex: '10000',
      
      background: 'rgba(18, 20, 25, 0.85)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    });

    Object.assign(this.scrollContent.style, {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '12px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.2) transparent'
    });

    const style = document.createElement('style');
    style.textContent = `
      #ui-scroll-content::-webkit-scrollbar {
        width: 8px;
      }
      
      #ui-scroll-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      #ui-scroll-content::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        transition: background 0.2s;
      }
      
      #ui-scroll-content::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .tp-dfwv {
        background: transparent !important;
        margin-bottom: 8px !important;
      }
      
      .tp-rotv {
        background: rgba(255, 255, 255, 0.03) !important;
        border: 1px solid rgba(255, 255, 255, 0.06) !important;
        border-radius: 8px !important;
        margin-bottom: 8px !important;
      }
      
      .tp-rotv_t {
        color: rgba(255, 255, 255, 0.9) !important;
        background: rgba(255, 255, 255, 0.05) !important;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        padding: 8px 12px !important;
        font-weight: 500 !important;
        user-select: none !important;
        display: flex !important;
        align-items: center !important;
        line-height: 1.4 !important;
      }

      .tp-rotv_b {
        align-items: center !important;
      }
      
      .tp-lblv_l {
        color: rgba(255, 255, 255, 0.7) !important;
      }
      
      .tp-brkv {
        background: rgba(255, 255, 255, 0.02) !important;
      }
      
      .tp-btnv_b {
        background: rgba(100, 150, 255, 0.15) !important;
        border: 1px solid rgba(100, 150, 255, 0.3) !important;
        color: rgba(150, 200, 255, 1) !important;
        transition: all 0.2s !important;
      }
      
      .tp-btnv_b:hover {
        background: rgba(100, 150, 255, 0.25) !important;
        border-color: rgba(100, 150, 255, 0.5) !important;
      }
      
      .tp-btnv_b:active {
        background: rgba(100, 150, 255, 0.35) !important;
      }
    `;
    document.head.appendChild(style);
  }

  _setupScrollBehavior() {
    this.scrollContent.addEventListener('wheel', (e) => {
      e.stopPropagation();
    }, { passive: true });

    this.scrollContent.style.scrollBehavior = 'smooth';
  }

  getScrollContent() {
    return this.scrollContent;
  }

  dispose() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
    this.scrollContent = null;
    this.initialized = false;
    logger.info('UIContainer', 'UI 容器已清理');
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

  async init({ eventBus }) {
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
        container: uiContainer.getScrollContent(),
        expanded: true
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;

      const uiRegistry = (await import('./ui-registry.js')).default;
      uiRegistry.register('ui-coordinates', this);

      logger.info('UICoordinates', '坐标系统 UI 已初始化');

      return this;
    } catch (err) {
      logger.error('UICoordinates', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createControls() {
    // 整体缩放
    const dataSpaceScale = this.pane.addBinding(
      this.configData.coordinates.dataSpace,
      'scale',
      { label: '整体缩放', min: 0.1, max: 5.0, step: 0.1 }
    );
    // 🟢 改造: 使用 config.set
    dataSpaceScale.on('change', (ev) => {
      config.set('coordinates.dataSpace.scale', ev.value);
    });
    this.controls.set('coordinates.dataSpace.scale', dataSpaceScale);

    // 粒子系统缩放
    const particleScale = this.pane.addBinding(
      this.configData.particles,
      'systemScale',
      { label: '粒子缩放', min: 0.1, max: 5.0, step: 0.1 }
    );
    // 🟢 改造: 使用 config.set
    particleScale.on('change', (ev) => {
      config.set('particles.systemScale', ev.value);
    });
    this.controls.set('particles.systemScale', particleScale);

    // 路径缩放
    const pathScale = this.pane.addBinding(
      this.configData.path,
      'scale',
      { label: '路径缩放', min: 0.1, max: 3.0, step: 0.1 }
    );
    // 🟢 改造: 使用 config.set
    pathScale.on('change', (ev) => {
      config.set('path.scale', ev.value);
    });
    this.controls.set('path.scale', pathScale);

    // 重置按钮
    this.pane.addButton({
      title: '🔄 重置坐标系统'
    }).on('click', () => {
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
    this.eventBus.on('config-changed', ({ key, value }) => {
      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData;
        for (let i = 0; i < pathParts.length - 1; i++) {
          target = target[pathParts[i]];
        }
        const lastKey = pathParts[pathParts.length - 1];
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

### src/ui/ui-post.ts

```
/**
 * @file ui-post.js
 * @description 后期处理控制面板
 * ✅ [重构 v2.1] 更新UI以匹配新的 'film' 效果, 移除旧的 noise 和 scanline。
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
      container: uiContainer.getScrollContent()
    });

    this._createPostProcessingControls();
    this._bindEvents();
    this._isInitialized = true;

    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后期处理 UI 已初始化 (v2.1)');
  }

  _createPostProcessingControls() {
    // 全局开关
    const globalEnable = this._pane.addBinding(this.configData.postprocess, 'enabled', { label: '启用后期处理' });
    globalEnable.on('change', (ev) => config.set('postprocess.enabled', ev.value));
    this.controls.set('postprocess.enabled', globalEnable);

    // ---------- 辉光 (Bloom) ----------
    const bloomFolder = this._pane.addFolder({ title: '光晕 (Bloom)', expanded: true });
    const bloomEnabled = bloomFolder.addBinding(this.configData.postprocess.bloom, 'enabled', { label: '启用' });
    bloomEnabled.on('change', (ev) => config.set('postprocess.bloom.enabled', ev.value));
    this.controls.set('postprocess.bloom.enabled', bloomEnabled);

    const bloomIntensity = bloomFolder.addBinding(this.configData.postprocess.bloom, 'intensity', { label: '强度', min: 0, max: 3, step: 0.05 });
    bloomIntensity.on('change', (ev) => config.set('postprocess.bloom.intensity', ev.value));
    this.controls.set('postprocess.bloom.intensity', bloomIntensity);

    const bloomThreshold = bloomFolder.addBinding(this.configData.postprocess.bloom, 'luminanceThreshold', { label: '亮度阈值', min: 0, max: 1, step: 0.01 });
    bloomThreshold.on('change', (ev) => config.set('postprocess.bloom.luminanceThreshold', ev.value));
    this.controls.set('postprocess.bloom.luminanceThreshold', bloomThreshold);

    // ---------- 胶片效果 (Film) ----------
    const filmFolder = this._pane.addFolder({ title: '胶片效果 (Film)', expanded: false });
    const filmEnabled = filmFolder.addBinding(this.configData.postprocess.film, 'enabled', { label: '启用' });
    filmEnabled.on('change', (ev) => config.set('postprocess.film.enabled', ev.value));
    this.controls.set('postprocess.film.enabled', filmEnabled);

    const noiseIntensity = filmFolder.addBinding(this.configData.postprocess.film, 'noiseIntensity', { label: '噪点强度', min: 0, max: 1, step: 0.01 });
    noiseIntensity.on('change', (ev) => config.set('postprocess.film.noiseIntensity', ev.value));
    this.controls.set('postprocess.film.noiseIntensity', noiseIntensity);

    const scanlineIntensity = filmFolder.addBinding(this.configData.postprocess.film, 'scanlineIntensity', { label: '扫描线强度', min: 0, max: 1, step: 0.01 });
    scanlineIntensity.on('change', (ev) => config.set('postprocess.film.scanlineIntensity', ev.value));
    this.controls.set('postprocess.film.scanlineIntensity', scanlineIntensity);
    
    const scanlineCount = filmFolder.addBinding(this.configData.postprocess.film, 'scanlineCount', { label: '扫描线数量', min: 0, max: 4096, step: 64 });
    scanlineCount.on('change', (ev) => config.set('postprocess.film.scanlineCount', ev.value));
    this.controls.set('postprocess.film.scanlineCount', scanlineCount);

    // ---------- 色相/饱和度 ----------
    const hsFolder = this._pane.addFolder({ title: '色相/饱和度', expanded: false });
    const hsEnabled = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'enabled', { label: '启用' });
    hsEnabled.on('change', (ev) => config.set('postprocess.hueSaturation.enabled', ev.value));
    this.controls.set('postprocess.hueSaturation.enabled', hsEnabled);

    const hue = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'hue', { label: '色相', min: -1, max: 1, step: 0.01 });
    hue.on('change', (ev) => config.set('postprocess.hueSaturation.hue', ev.value));
    this.controls.set('postprocess.hueSaturation.hue', hue);

    const saturation = hsFolder.addBinding(this.configData.postprocess.hueSaturation, 'saturation', { label: '饱和度', min: -1, max: 1, step: 0.01 });
    saturation.on('change', (ev) => config.set('postprocess.hueSaturation.saturation', ev.value));
    this.controls.set('postprocess.hueSaturation.saturation', saturation);

    // ---------- 亮度/对比度 ----------
    const bcFolder = this._pane.addFolder({ title: '亮度/对比度', expanded: false });
    const bcEnabled = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'enabled', { label: '启用' });
    bcEnabled.on('change', (ev) => config.set('postprocess.brightnessContrast.enabled', ev.value));
    this.controls.set('postprocess.brightnessContrast.enabled', bcEnabled);

    const brightness = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'brightness', { label: '亮度', min: -1, max: 1, step: 0.01 });
    brightness.on('change', (ev) => config.set('postprocess.brightnessContrast.brightness', ev.value));
    this.controls.set('postprocess.brightnessContrast.brightness', brightness);

    const contrast = bcFolder.addBinding(this.configData.postprocess.brightnessContrast, 'contrast', { label: '对比度', min: -1, max: 1, step: 0.01 });
    contrast.on('change', (ev) => config.set('postprocess.brightnessContrast.contrast', ev.value));
    this.controls.set('postprocess.brightnessContrast.contrast', contrast);
  }

  _bindEvents() {
    const refreshControl = ({ key, value }: { key: string; value: any; }) => {
      if (!key.startsWith('postprocess.')) return;
      
      const control = this.controls.get(key);
      if (control) {
        const pathParts = key.split('.');
        let target = this.configData as any;
        for (let i = 0; i < pathParts.length - 1; i++) {
          target = target[pathParts[i]];
        }
        const lastKey = pathParts[pathParts.length - 1];
        if (target && target[lastKey] !== value) {
          target[lastKey] = value;
          control.refresh();
        }
      }
    };

    eventBus.on('config-changed', refreshControl);
    eventBus.on('preset-loaded', () => this.refresh());
  }

  updateBindings() {
    logger.debug('UIPost', '绑定检查完成（无临时对象）');
  }

  refresh() {
    this.updateBindings();
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
import uiBasic from './ui-basic';
import uiPost from './ui-post';
import uiCoordinates from './ui-coordinates';

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
        container: uiContainer.getScrollContent(),
        expanded: true
      });

      this._createControls();
      this._bindEvents();

      this.initialized = true;
      logger.info('UIPresets', '预设UI已初始化');

      return this;
    } catch (err) {
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
      preset: defaultValue
    };

    this.presetSelector = this.pane.addBinding(
      params,
      'preset',
      {
        label: '预设选择',
        options: presetOptions
      }
    );

    this.presetSelector.on('change', (ev: any) => {
      this.selectedPresetName = ev.value;
      logger.debug('UIPresets', `已选择预设: ${ev.value}`);
    });

    const loadButton = this.pane.addButton({
      title: '📥 加载预设'
    });

    loadButton.on('click', () => {
      if (!this.selectedPresetName) {
        alert('请先选择一个预设');
        return;
      }
      this._loadPreset(this.selectedPresetName);
    });

    const resetButton = this.pane.addButton({
      title: '🔄 恢复默认'
    });

    resetButton.on('click', () => {
      if (confirm('确定要恢复到默认配置吗？这将清除所有当前设置。')) {
        this._restoreDefaults();
      }
    });

    const saveFolder = this.pane.addFolder({
      title: '保存当前配置',
      expanded: false
    });

    const saveParams = {
      name: ''
    };

    this.saveNameInput = saveFolder.addBinding(
      saveParams,
      'name',
      {
        label: '预设名称'
      }
    );

    const saveButton = saveFolder.addButton({
      title: '💾 保存预设'
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
      } catch (err) {
        alert(`保存失败: ${(err as Error).message}`);
      }
    });
  }

  _loadPreset(presetName: any) {
    try {
      logger.info('UIPresets', `开始加载预设: ${presetName}`);
      
      presetManager.loadPreset(presetName)
        .then(() => {
          logger.info('UIPresets', `预设已加载: ${presetName}`);
        })
        .catch((err: any) => {
          alert(`加载预设失败: ${err.message}`);
          logger.error('UIPresets', `加载失败: ${err.message}`);
        });
    } catch (err) {
      alert(`加载预设失败: ${(err as Error).message}`);
    }
  }

  _restoreDefaults() {
    try {
      logger.info('UIPresets', '开始恢复默认配置...');
      
      config.reset();
      
      eventBus.emit('preset-loaded', { name: 'default', data: config.getRaw() });
      
      logger.info('UIPresets', '✅ 已恢复默认配置');
    } catch (err) {
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
  constructor() {
    this.modules = new Map();
  }

  /**
   * 注册UI模块
   * @param {string} name - 模块名称
   * @param {Object} module - UI模块实例(必须有controls Map)
   */
  register(name, module) {
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
  unregister(name) {
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
    'audio.'
  ];
  
  this.modules.forEach((module, moduleName) => {
    if (!module.controls) return;
    
    module.controls.forEach((control, path) => {
      // ✅ 使用精确前缀匹配
      if (EXCLUDED_PREFIXES.some(prefix => path.startsWith(prefix))) {
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

### src/utils/logger.ts

```
/**
 * @file logger.ts
 * @description 日志工具 - 统一日志输出
 * ✨ 新增: debugThrottled 方法，用于对高频日志进行节流，避免刷屏。
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  private level: number;
  private enableTimestamp: boolean;
  private throttledLogs: Map<string, number>; // ✅ 新增: 用于存储节流日志的最后时间戳

  constructor() {
    this.level = LOG_LEVELS.INFO;
    this.enableTimestamp = true;
    this.throttledLogs = new Map();
  }

  setLevel(level: string) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS] !== undefined) {
      this.level = LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS];
    }
  }

  private _format(level: string, module: string, message: string): string {
    const timestamp = this.enableTimestamp 
      ? `[${new Date().toISOString().slice(11, 23)}]` 
      : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }
  
  /**
   * ✨ 新增: 节流调试日志
   * 对同一个 key，在指定的 interval 毫秒内只打印一次。
   * @param module 模块名
   * @param key 节流的唯一标识符
   * @param message 日志消息
   * @param interval 节流间隔（毫秒），默认为 1000ms
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
      console.log(
        `%c${this._format('DEBUG', module, message)}`,
        'color: #888'
      );
    }
  }

  info(module: string, message: string) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(
        `%c${this._format('INFO', module, message)}`,
        'color: #4a9eff'
      );
    }
  }

  warn(module: string, message: string) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(
        `%c${this._format('WARN', module, message)}`,
        'color: #ff9800'
      );
    }
  }

  error(module: string, message: string) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(
        `%c${this._format('ERROR', module, message)}`,
        'color: #f44336'
      );
    }
  }
}

const logger = new Logger();

// 开发环境设置为 DEBUG
if (import.meta.env.DEV) {
  logger.setLevel('DEBUG');
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
export function resolveAssetUrl(path) {
  // import.meta.env.BASE_URL 在 vite.config.js 中配置，末尾自带'/'
  // 确保传入的路径没有开头的'/'，避免出现'//'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}

```

### src/vite-env.d.ts

```
/// <reference types="vite/client" />

declare module '*?raw' {
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

    /* 路径别名 */
    "baseUrl": ".",                // 解析非相对模块名的基准目录
    "paths": {
      "@/*": ["src/*"]            // 设置别名，例如 import ... from '@/utils/logger'
    }
  },
  "include": ["src", "vite.config.ts"], // 告诉TS编译器需要检查哪些文件
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
// import { defineConfig } from 'vite'

// // https://vitejs.dev/config/
// export default defineConfig(({ command }) => {
//   if (command === 'build') {
//     // build a project for production
//     return {
//       base: '/LangtonAnt3D_dist/', // 你的部署仓库名
//     }
//   } else {
//     // serve a project for development
//     return {
//       // 在开发模式下，base 路径默认为 '/'，所以这里可以留空或者显式设置为 '/'
//       base: '/',
//     }
//   }
// })

/**
 * @file vite.config.ts
 * @description Vite 配置文件 (TypeScript版本)
 */
import { defineConfig } from 'vite'
import path from 'path'

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
  }
})

```
