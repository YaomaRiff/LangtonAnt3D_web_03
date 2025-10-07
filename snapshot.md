# Project Snapshot
- Root: `.`
- Created: 2025-10-07 11:55:05
- Files: 36 (ext=[.js, .mjs, .json, .css, .html], maxSize=200000B)
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
│  ├─ entities/
│  │  ├─ moving-light.js
│  │  └─ path-entity.js
│  ├─ systems/
│  │  ├─ animation-sys.js
│  │  ├─ audio-sys.js
│  │  ├─ camera-sys.js
│  │  ├─ controls-util.js
│  │  ├─ coordinates-sys.js
│  │  ├─ data-sys.js
│  │  ├─ environment-sys.js
│  │  ├─ lighting-sys.js
│  │  ├─ material-sys.js
│  │  ├─ model-sys.js
│  │  ├─ particles-sys.js
│  │  └─ postprocess-sys.js
│  ├─ ui/
│  │  ├─ ui-basic.js
│  │  ├─ ui-container.js
│  │  ├─ ui-coordinates.js
│  │  ├─ ui-material.js
│  │  ├─ ui-post.js
│  │  ├─ ui-presets.js
│  │  └─ ui-registry.js
│  ├─ utils/
│  │  └─ logger.js
│  ├─ config.js
│  ├─ event-bus.js
│  ├─ main.js
│  └─ preset-manager.js
├─ tools/
│  └─ snapshot.mjs
├─ index.html
├─ package.json
├─ snapshot.index.json
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
  <script type="module" src="/src/main.js"></script>
</body>
</html>

```

### package.json

```json
{
  "name": "langtonant3d-web-03",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "snapshot": "node tools/snapshot.mjs --root . --out snapshot.md"
  },
  "devDependencies": {
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
    "path": "/data/data.csv",
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
  "material": {
    "movingLight": {
      "emissiveIntensity": 1.5,
      "enabled": true
    },
    "particles": {
      "emissiveIntensity": 0.3,
      "enabled": true
    },
    "path": {
      "emissiveIntensity": 0.8,
      "enabled": true
    }
  },
  "particles": {
    "breathIntensity": 0.1,
    "dustColor": "#AF85B7",
    "dustCount": 6600,
    "dustOpacity": 0.6,
    "dustSize": 0.6,
    "floatIntensity": 0.2,
    "pathPointColor": "#FFFFFF",
    "pathPointSize": 0.5,
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
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": false
    },
    "chromaticAberration": {
      "enabled": false
    },
    "hueSaturation": {
      "enabled": false,
      "hue": 0,
      "saturation": 0
    },
    "noise": {
      "enabled": true,
      "intensity": 0.088
    },
    "scanline": {
      "density": 228.4,
      "enabled": true,
      "intensity": 0.28
    }
  }
}
```

### public/presets/02.json

```json
{
  "name": "02",
  "timestamp": "2025-10-06T20:10:04.371Z",
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
  "material": {
    "movingLight": {
      "emissiveIntensity": 1.5,
      "enabled": true
    },
    "particles": {
      "emissiveIntensity": 0.3,
      "enabled": true
    },
    "path": {
      "emissiveIntensity": 0.8,
      "enabled": true
    }
  },
  "particles": {
    "breathIntensity": 0.1,
    "dustColor": "#AF85B7",
    "dustCount": 6600,
    "dustOpacity": 0.6,
    "dustSize": 0.6,
    "floatIntensity": 0.2,
    "pathPointColor": "#FFFFFF",
    "pathPointSize": 0.5,
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
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": false
    },
    "chromaticAberration": {
      "enabled": false
    },
    "hueSaturation": {
      "enabled": false,
      "hue": 0,
      "saturation": 0
    },
    "noise": {
      "enabled": true,
      "intensity": 0.088
    },
    "scanline": {
      "density": 228.4,
      "enabled": true,
      "intensity": 0.28
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
    "bgColor": "#121414",
    "pathColor": "#F0B7B7"
  },
  "material": {
    "movingLight": {
      "emissiveIntensity": 1.5,
      "enabled": true
    },
    "particles": {
      "emissiveIntensity": 0.3,
      "enabled": true
    },
    "path": {
      "emissiveIntensity": 0.8,
      "enabled": true
    }
  },
  "particles": {
    "breathIntensity": 0.1,
    "dustColor": "#AF85B7",
    "dustCount": 3000,
    "dustOpacity": 0.6,
    "dustSize": 0.6,
    "floatIntensity": 0.2,
    "pathPointColor": "#FFFFFF",
    "pathPointSize": 0.5,
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
    "brightnessContrast": {
      "brightness": 0,
      "contrast": 0,
      "enabled": true
    },
    "chromaticAberration": {
      "enabled": false
    },
    "hueSaturation": {
      "enabled": true,
      "hue": 0,
      "saturation": 0.14
    },
    "noise": {
      "enabled": true,
      "intensity": 0.02
    },
    "scanline": {
      "density": 66.5,
      "enabled": true,
      "intensity": 0.77
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

### src/config.js

```javascript
/**
 * @file config.js
 * @description 配置管理器 - 全局配置存储与访问
 * ✅ 已删除：postprocess.bloom 残留对象
 */
import logger from './utils/logger.js';

const DEFAULT_CONFIG = {
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
      rotation: {
        x: 0,
        y: 0,
        z: 0
      },
      position: {
        x: 0,
        y: 0,
        z: 0
      }
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
    //bgColor: '#121414',
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
    // ✅ 已删除：bloom 配置对象（已由选择性辉光系统替代）
    hueSaturation: {
      enabled: false,
      hue: 0.0,
      saturation: 0.0
    },
    brightnessContrast: {
      enabled: false,
      brightness: 0.0,
      contrast: 0.0
    },
    noise: {
      enabled: false,
      intensity: 0.02
    },
    chromaticAberration: {
      enabled: false,
      offsetX: 0.002,
      offsetY: 0.002
    },
    scanline: {
      enabled: false,
      intensity: 0.1,
      density: 100
    }
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
        if (value === null || value === undefined) {
          return null;
        }
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
      target[lastKey] = value;
      
      logger.debug('Config', `配置已更新: ${key} = ${JSON.stringify(value)}`);
      return true;
    } catch (err) {
      logger.error('Config', `设置配置异常 [${key}]: ${err.message}`);
      return false;
    }
  }

  applyPresetData(presetData) {
    if (!presetData || !presetData.config) {
      logger.error('Config', '预设数据格式无效');
      return false;
    }

    try {
      const { type, config: presetConfig } = presetData;

      if (type === 'basic') {
        if (presetConfig.animation) {
          Object.keys(presetConfig.animation).forEach(key => {
            this.set(`animation.${key}`, presetConfig.animation[key]);
          });
        }

        if (presetConfig.camera) {
          Object.keys(presetConfig.camera).forEach(key => {
            this.set(`camera.${key}`, presetConfig.camera[key]);
          });
        }

        if (presetConfig.particles) {
          Object.keys(presetConfig.particles).forEach(key => {
            this.set(`particles.${key}`, presetConfig.particles[key]);
          });
        }

        if (presetConfig.path) {
          Object.keys(presetConfig.path).forEach(key => {
            this.set(`path.${key}`, presetConfig.path[key]);
          });
        }

        if (presetConfig.environment) {
          Object.keys(presetConfig.environment).forEach(key => {
            this.set(`environment.${key}`, presetConfig.environment[key]);
          });
        }

      } else if (type === 'post') {
        if (presetConfig.postprocess) {
          Object.keys(presetConfig.postprocess).forEach(key => {
            this.set(`postprocess.${key}`, presetConfig.postprocess[key]);
          });
        }
      }

      logger.info('Config', `预设已应用: ${type}`);
      return true;
    } catch (err) {
      logger.error('Config', `应用预设失败: ${err.message}`);
      return false;
    }
  }

  reset() {
    this._config = deepClone(DEFAULT_CONFIG);
    logger.info('Config', '配置已重置为默认值');
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

```

### src/entities/moving-light.js

```javascript
/**
 * @file moving-light.js
 * @description 移动光点实体 - 沿路径移动的单一发光粒子
 * ✅ 修复材质警告
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class MovingLight {
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
      logger.warn('MovingLight', '移动光点已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      this._createLight();
      this._bindEvents();

      this.initialized = true;
      logger.info('MovingLight', '移动光点初始化完成（已接入坐标系统）');

      return this;
    } catch (err) {
      logger.error('MovingLight', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createLight() {
    const geometry = new THREE.SphereGeometry(0.3, 16, 16);
    
    const lightColor = config.get('particles.pathPointColor') || '#FFFFFF';
    
    // ✅ MeshBasicMaterial 只需要 color，不需要 emissive
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(lightColor),
      transparent: true,
      opacity: 0.9
    });

    // ✅ 无需额外标记,userData.glow 已足够
    
    this.lightMesh = new THREE.Mesh(geometry, material);
    this.lightMesh.name = 'MovingLight';
    this.lightMesh.visible = false;
    this.lightMesh.userData = { glow: true }; // ✅ 标记为辉光对象
    
    const lightAnchor = this.coordinateSystem.getLightAnchor();
    lightAnchor.add(this.lightMesh);

    // ✅ 注册材质到 MaterialSystem
  this.eventBus.emit('material-registered', {
    name: 'movingLight',
    material: material
  });
    
    logger.debug('MovingLight', '光点已创建');
  }

  _bindEvents() {
    this.eventBus.on('moving-light-position-updated', (position) => {
      this.updatePosition(position);
    });

    this.eventBus.on('animation-reset', () => {
      this.hide();
    });

    this.eventBus.on('path-point-color-changed', (color) => {
      if (this.lightMesh) {
        this.lightMesh.material.color.set(color);
      }
    });

    // ✅ 移除不必要的 emissive 事件监听
    // this.eventBus.on('moving-light-emissive-intensity-changed', ...)

    this.eventBus.on('path-point-size-changed', (size) => {
      if (this.lightMesh) {
        this.lightMesh.scale.setScalar(size);
      }
    });
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

  dispose() {
    if (this.lightMesh && this.coordinateSystem) {
      const lightAnchor = this.coordinateSystem.getLightAnchor();
      lightAnchor.remove(this.lightMesh);
      this.lightMesh.geometry.dispose();
      this.lightMesh.material.dispose();
    }

    this.initialized = false;
    logger.info('MovingLight', '移动光点已销毁');
  }
}

const movingLight = new MovingLight();
export default movingLight;

```

### src/entities/path-entity.js

```javascript
/**
 * @file path-entity.js
 * @description 路径实体 - 动态轨迹线条 + 实时绘制 + 材质辉光注册
 * ✅ 使用容器缩放而非数据重映射
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class PathEntity {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.coordinateSystem = null;
    this.initialized = false;
    
    this.pathLine = null;
    this.allPoints = [];
    this.currentDrawIndex = 0;
    
    this.pathContainer = null; // ✅ 独立缩放容器
  }

  init({ eventBus, scene, coordinateSystem }) {
    if (this.initialized) {
      logger.warn('PathEntity', '路径实体已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.coordinateSystem = coordinateSystem;

      // ✅ 创建独立缩放容器并挂载到路径锚点
      this.pathContainer = new THREE.Group();
      this.pathContainer.name = 'PathContainer';
      
      // ✅ 初始化时设置一次缩放
      const initialScale = config.get('path.scale') || 1.0;
      this.pathContainer.scale.setScalar(initialScale);
      
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.add(this.pathContainer);

      this._bindEvents();

      this.initialized = true;
      logger.info('PathEntity', '路径实体初始化完成（已接入坐标系统）');

      return this;
    } catch (err) {
      logger.error('PathEntity', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('data-loaded', (data) => {
      this.allPoints = data.points;
      this.currentDrawIndex = 0;
      this._createPath();
    });

    // ❌ 删除：不再监听 data-scaled
    // this.eventBus.on('data-scaled', (data) => { ... });

    this.eventBus.on('moving-light-position-updated', (position) => {
      this._updatePathToPosition(position);
    });

    this.eventBus.on('animation-step-updated', (step) => {
      this._jumpToStep(step);
    });

    this.eventBus.on('path-color-changed', (color) => {
      if (this.pathLine) {
        this.pathLine.material.uniforms.uColor.value.set(color);
        this.pathLine.material.uniforms.uEmissive.value.set(color);
      }
    });

    this.eventBus.on('path-depth-intensity-changed', (intensity) => {
      if (this.pathLine) {
        this.pathLine.material.uniforms.uDepthIntensity.value = intensity;
      }
    });

    this.eventBus.on('animation-reset', () => {
      this.currentDrawIndex = 0;
      if (this.pathLine) {
        this.pathLine.geometry.setDrawRange(0, 0);
      }
    });

    // ✅ 路径独立缩放（核心逻辑）
    this.eventBus.on('path-scale-changed', (scale) => {
      if (this.pathContainer) {
        this.pathContainer.scale.setScalar(scale);
        logger.debug('PathEntity', `路径已缩放: ${scale.toFixed(2)}x`);
      }
    });
  }

  _createPath() {
    if (!this.allPoints || this.allPoints.length === 0) {
      logger.warn('PathEntity', '路径点为空');
      return;
    }

    if (this.pathLine) {
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      this.pathLine.material.dispose();
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

    const pathColor = config.get('environment.pathColor') || '#F0B7B7';
    const depthIntensity = config.get('path.depthIntensity') || 0.5;
    const emissiveIntensity = config.get('material.path.emissiveIntensity') || 0.8;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(pathColor) },
        uEmissive: { value: new THREE.Color(pathColor) },
        uEmissiveIntensity: { value: emissiveIntensity },
        uDepthIntensity: { value: depthIntensity },
        uCameraPosition: { value: new THREE.Vector3() },
        uMaxDistance: { value: 100.0 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        
        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uEmissive;
        uniform float uEmissiveIntensity;
        uniform float uDepthIntensity;
        uniform vec3 uCameraPosition;
        uniform float uMaxDistance;
        
        varying vec3 vWorldPosition;
        
        void main() {
          vec3 finalColor = uColor + uEmissive * uEmissiveIntensity;
          
          float distToCamera = length(vWorldPosition - uCameraPosition);
          float fade = smoothstep(0.0, uMaxDistance, distToCamera);
          float alpha = 1.0 - fade * uDepthIntensity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pathLine = new THREE.Line(geometry, material);
    this.pathLine.name = 'PathLine';
    this.pathLine.userData = { glow: true };
    
    this.pathContainer.add(this.pathLine);

    this.eventBus.emit('material-registered', {
      name: 'path',
      material: material
    });

    // ✅ 移除：不再每次创建路径时重新设置缩放

    this.currentDrawIndex = 0;

    logger.info('PathEntity', `路径已创建: 总点数 ${this.allPoints.length}`);
  }

  _updatePathToPosition(position) {
    if (!this.pathLine || !this.allPoints.length) return;

    let closestIndex = 0;
    let minDist = Infinity;

    for (let i = this.currentDrawIndex; i < this.allPoints.length; i++) {
      const dist = position.distanceTo(this.allPoints[i]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
      if (dist > minDist) break;
    }

    if (closestIndex > this.currentDrawIndex) {
      this.currentDrawIndex = closestIndex;
      this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
    }
  }

  _jumpToStep(step) {
    if (!this.pathLine || !this.allPoints.length) return;

    const targetIndex = Math.min(step, this.allPoints.length - 1);
    this.currentDrawIndex = targetIndex;
    this.pathLine.geometry.setDrawRange(0, this.currentDrawIndex + 1);
  }

  updateCameraPosition(camera) {
    if (this.pathLine && camera) {
      const worldCamPos = camera.position.clone();
      const localCamPos = this.pathContainer.worldToLocal(worldCamPos);
      this.pathLine.material.uniforms.uCameraPosition.value.copy(localCamPos);
    }
  }

  update(delta) {
    // 占位
  }

  dispose() {
    if (this.pathLine) {
      this.pathContainer.remove(this.pathLine);
      this.pathLine.geometry.dispose();
      this.pathLine.material.dispose();
    }

    if (this.pathContainer && this.coordinateSystem) {
      const pathAnchor = this.coordinateSystem.getPathAnchor();
      pathAnchor.remove(this.pathContainer);
    }

    this.initialized = false;
    logger.info('PathEntity', '路径实体已销毁');
  }
}

const pathEntity = new PathEntity();
export default pathEntity;

```

### src/event-bus.js

```javascript
/**
 * @file event-bus.js
 * @description 事件总线 - 系统间通信
 */
import logger from './utils/logger.js';

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

### src/main.js

```javascript
/**
 * @file main.js
 * @description 应用主入口 - 系统协调与生命周期管理
 * ✅ 已集成坐标系统和音频系统
 */
import * as THREE from 'three';
import logger from './utils/logger.js';
import config, { initConfig } from './config.js';
import eventBus from './event-bus.js';
import presetManager from './preset-manager.js';

// UI 系统
import uiContainer from './ui/ui-container.js';
import uiBasic from './ui/ui-basic.js';
import uiMaterial from './ui/ui-material.js';
import uiPost from './ui/ui-post.js';
import uiPresets from './ui/ui-presets.js';
import uiCoordinates from './ui/ui-coordinates.js';

// 核心系统
import coordinateSystem from './systems/coordinates-sys.js';
import cameraSys from './systems/camera-sys.js';
import dataSys from './systems/data-sys.js';
import animationSys from './systems/animation-sys.js';
import particlesSys from './systems/particles-sys.js';
import materialSys from './systems/material-sys.js';
import postprocessSys from './systems/postprocess-sys.js';
import audioSys from './systems/audio-sys.js';
import lightingSys from './systems/lighting-sys.js';
import environmentSys from './systems/environment-sys.js';

// 实体
import pathEntity from './entities/path-entity.js';
import movingLight from './entities/moving-light.js';

class Application {
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

      // 将坐标系统存入scene.userData供camera-sys访问
      this.scene.userData.coordinateSystem = coordinateSystem;

      // 4. 初始化相机系统
      cameraSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer
      });

      // 4.5 初始化光照系统 (新)
      lightingSys.init({ scene: this.scene });

       // 4.6 初始化环境系统 (天空盒)
      environmentSys.init({ scene: this.scene });

      // 5. 初始化音频系统（在相机之后）
      audioSys.init({
        eventBus,
        camera: cameraSys.getActiveCamera()
      });

      // 6. 初始化 UI 容器
      uiContainer.init();

      // 核心修复：优先初始化数据系统
      // 这样后续的UI系统就能在第一时间拿到数据
      await dataSys.init({
        eventBus,
        scene: this.scene,
        camera: cameraSys.getActiveCamera(),
        controls: cameraSys.getControls()
      });

      // 7. 初始化基础 UI
      await uiBasic.init();

      // 8. 初始化材质 UI
      await uiMaterial.init();

      // 9. 初始化后处理 UI
      await uiPost.init();

      await presetManager.init();

      // 10. 初始化预设系统
      await uiPresets.init();

      // 11. 初始化坐标系统UI
      await uiCoordinates.init({ eventBus });

      // 13. 初始化材质系统(必须在实体之前)
      materialSys.init({ eventBus });

      // 14. 初始化实体（传入coordinateSystem）
      pathEntity.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });
      
      movingLight.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });

      // 15. 初始化粒子系统（传入coordinateSystem）
      particlesSys.init({ 
        eventBus, 
        scene: this.scene,
        coordinateSystem 
      });

      // 16. 初始化动画系统
      animationSys.init({
        eventBus,
        scene: this.scene,
        renderer: this.renderer,
        controls: cameraSys.getControls(),
        particlesSys
      });

      // 17. 初始化后处理系统
      postprocessSys.init({
        eventBus,
        scene: this.scene,
        camera: () => cameraSys.getActiveCamera(),
        renderer: this.renderer
      });

      // 18. 绑定事件
      this._bindEvents();

      // 19. 启动渲染循环
      this._startRenderLoop();

      // 20. 加载默认数据
      const defaultCSV = config.get('data.csvUrl');
      if (defaultCSV) {
        dataSys.loadCSV(defaultCSV);
      }

      this.initialized = true;
      logger.info('App', '✅ 应用初始化完成');

    } catch (err) {
      logger.error('App', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createScene() {
    this.scene = new THREE.Scene();
    // 背景色现在由 environment-sys 管理
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

    // eventBus.on('bg-color-changed', (color) => {
    //   this.scene.background = new THREE.Color(color);
    // });

    eventBus.on('show-coordinate-debug', () => {
      const debugInfo = coordinateSystem.debugInfo();
      console.log('📊 坐标系统调试信息:', debugInfo);
      logger.info('App', '坐标系统调试信息已输出到控制台');
    });

    logger.debug('App', '事件已绑定');
  }

  _handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    postprocessSys.handleResize();
    logger.debug('App', '窗口大小已调整');
  }

  _startRenderLoop() {
    const animate = () => {
      requestAnimationFrame(animate);

      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      cameraSys.update(delta);
      pathEntity.updateCameraPosition(cameraSys.getActiveCamera());
      pathEntity.update(delta);
      animationSys.update(delta, elapsed);
      particlesSys.update(elapsed);

      if (config.get('postprocess.enabled')) {
        postprocessSys.render(delta);
      } else {
        this.renderer.render(this.scene, cameraSys.getActiveCamera());
      }
    };

    animate();
    logger.info('App', '渲染循环已启动');
  }

  dispose() {
    logger.info('App', '应用正在销毁...');

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
    pathEntity.dispose();
    movingLight.dispose();
    uiBasic.dispose();
    uiMaterial.dispose();
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

### src/preset-manager.js

```javascript
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

```

### src/systems/animation-sys.js

```javascript
/**
 * @file animation-sys.js
 * @description 动画系统 - 路径插值与步进控制
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class AnimationSystem {
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

      // 监听数据加载
      this.eventBus.on('data-loaded', (data) => {
        this.mappedPoints = data.points;
        this.currentStep = 0;
        this.lerpT = 0;
        logger.info('AnimationSystem', `数据已加载: ${this.mappedPoints.length} 个点`);
      });

      this.eventBus.on('animation-toggled', (shouldAnimate) => {
        this.animating = shouldAnimate;
        config.set('animation.animating', shouldAnimate);
        logger.info('AnimationSystem', `动画${shouldAnimate ? '开始' : '暂停'}`);
      });

      this.eventBus.on('reset-animation', () => {
        this.reset();
      });

      this.eventBus.on('step-to', (step) => {
        this.stepTo(step);
      });

      this.initialized = true;
      logger.info('AnimationSystem', '动画系统初始化完成');

      return this;
    } catch (err) {
      logger.error('AnimationSystem', `初始化失败: ${err.message}`);
      throw err;
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
          this.animating = false;
          config.set('animation.animating', false);
          this.eventBus.emit('animation-completed');
          logger.info('AnimationSystem', '动画播放完成');
          return;
        }
      }
    }

    // 更新当前位置
    this._updatePosition();
    
    // 更新配置状态(触发UI刷新)
    config.set('animation.currentStep', this.currentStep);
    config.set('animation.lerpT', this.lerpT);

    // 发送步数更新事件
    this.eventBus.emit('animation-step-updated', this.currentStep);
  }

  _updatePosition() {
    if (this.currentStep >= this.mappedPoints.length - 1) return;

    const current = this.mappedPoints[this.currentStep];
    const next = this.mappedPoints[this.currentStep + 1];

    // 插值计算当前位置
    const interpolated = new THREE.Vector3().lerpVectors(current, next, this.lerpT);

    // ✅ 修改:发送给移动光点的位置更新事件
    this.eventBus.emit('moving-light-position-updated', interpolated);
  }

  reset() {
    this.currentStep = 0;
    this.lerpT = 0;
    this.animating = false;

    config.set('animation.currentStep', 0);
    config.set('animation.lerpT', 0);
    config.set('animation.animating', false);

    logger.info('AnimationSystem', '动画已重置');
    this.eventBus.emit('animation-reset');
  }

  stepTo(step) {
    if (step < 0 || step >= this.mappedPoints.length) {
      logger.warn('AnimationSystem', `无效的步骤: ${step}`);
      return;
    }

    this.currentStep = step;
    this.lerpT = 0;
    config.set('animation.currentStep', step);
    config.set('animation.lerpT', 0);

    this._updatePosition();
    logger.debug('AnimationSystem', `跳转到步骤: ${step}`);
  }

  getCurrentStep() {
    return this.currentStep;
  }

  getTotalSteps() {
    return this.mappedPoints.length;
  }

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

### src/systems/audio-sys.js

```javascript
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

    // ✅ 加载音频时创建 AudioListener
    this._ensureListenerCreated();

    logger.info('AudioSystem', `开始加载音频: ${url}`);

    this.audioLoader.load(
      url,
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

### src/systems/camera-sys.js

```javascript
/**
 * @file camera-sys.js
 * @description 相机系统 - 透视/正交切换 + camera-controls 集成
 * ✅ 修复：maxDistance动态计算 + 旋转中心锁定世界原点
 */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import logger from '../utils/logger.js';
import config from '../config.js';
import { applyPerspMouseMapping, applyOrthoMouseMapping } from './controls-util.js';

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
      
      // ✅ 初始化时强制设置旋转中心为世界原点
      this._setRotationCenterToOrigin();
      
      const initialMode = config.get('camera.mode') || 'perspective';
      if (initialMode !== 'perspective') {
        this._switchToMode(initialMode);
      } else {
        config.set('camera.mode', 'perspective');
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

    logger.debug('CameraSystem', `相机已创建 | 透视初始位置: (15, 15, 25)`);
  }

  _createControls() {
    this.controls = new CameraControls(
      this.activeCamera,
      this.renderer.domElement
    );

    applyPerspMouseMapping(this.controls);

    const controlsConfig = config.get('camera.controls');
    this.controls.smoothTime = controlsConfig.smoothTime || 0.05;
    this.controls.draggingSmoothTime = controlsConfig.draggingSmoothTime || 0.25;
    this.controls.minDistance = controlsConfig.minDistance || 1;
    
    // ✅ 延迟计算 maxDistance（等待预设加载完成）
    setTimeout(() => {
      this._updateMaxDistance();
    }, 100);

    logger.debug('CameraSystem', 'camera-controls 初始化完成');
  }

  /**
   * ✅ 核心方法：根据粒子系统半径更新 maxDistance
   */
  _updateMaxDistance() {
    const sphereRadius = config.get('particles.sphereRadius') || 100;
    const systemScale = config.get('particles.systemScale') || 4.0;
    
    this.particleSystemRadius = sphereRadius * systemScale;
    const calculatedMaxDistance = this.particleSystemRadius * 0.8;
    
    if (this.controls) {
      this.controls.maxDistance = calculatedMaxDistance;
      logger.info('CameraSystem', 
        `✅ maxDistance 已更新: ${calculatedMaxDistance.toFixed(2)} ` +
        `(半径=${sphereRadius} × 缩放=${systemScale.toFixed(2)})`
      );
    }
  }

  /**
   * ✅ 强制旋转中心为世界原点
   */
  _setRotationCenterToOrigin() {
    if (this.controls) {
      this.controls.setTarget(0, 0, 0, false);
      logger.info('CameraSystem', '✅ 旋转中心已锁定到世界原点 (0,0,0)');
    }
  }

  _bindEvents() {
    this.eventBus.on('camera-mode-changed', (mode) => {
      this._switchToMode(mode);
    });

    this.eventBus.on('camera-fov-changed', (fov) => {
      if (this.perspectiveCamera && this.currentMode === 'perspective') {
        this.perspectiveCamera.fov = fov;
        this.perspectiveCamera.updateProjectionMatrix();
        logger.debug('CameraSystem', `FOV 更新: ${fov}`);
      }
    });

    this.eventBus.on('view-changed', (viewKey) => {
      this._applyViewPreset(viewKey);
    });

    this.eventBus.on('flip-view', () => {
      this._flipView();
    });

    // ✅ 监听坐标系统更新（确保旋转中心不被破坏）
    this.eventBus.on('coordinate-system-updated', ({ type }) => {
      if (type === 'position') {
        this._setRotationCenterToOrigin();
      }
    });

    // ✅ 监听粒子系统缩放（重新计算 maxDistance）
    this.eventBus.on('particle-system-scale-changed', (scale) => {
      logger.info('CameraSystem', `收到粒子缩放事件: ${scale.toFixed(2)}x`);
      this._updateMaxDistance();
    });

    // ✅ 改用事件链代替延迟
this.eventBus.on('data-processing-completed', () => {
  this._setRotationCenterToOrigin();
  logger.info('CameraSystem', '✅ 数据处理完成后已锁定旋转中心');
});


    window.addEventListener('resize', () => {
      this._handleResize();
    });
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

    config.set('camera.mode', mode);
    
    this.eventBus.emit('camera-mode-switched', mode);
    this.eventBus.emit('camera-changed', this.activeCamera);
    
    logger.info('CameraSystem', `切换到${mode === 'perspective' ? '透视' : '正交'}相机`);
  }

  _applyViewPreset(viewKey) {
    let position, target;
    const distance = 50;

    switch (viewKey) {
      case 'top':
        position = new THREE.Vector3(0, distance, 0);
        target = new THREE.Vector3(0, 0, 0);
        break;
      
      case 'front':
        position = new THREE.Vector3(0, 0, distance);
        target = new THREE.Vector3(0, 0, 0);
        break;
      
      case 'side':
        position = new THREE.Vector3(distance, 0, 0);
        target = new THREE.Vector3(0, 0, 0);
        break;
      
      default:
        logger.warn('CameraSystem', `未知视图预设: ${viewKey}`);
        return;
    }

    this.controls.setLookAt(
      position.x, position.y, position.z,
      target.x, target.y, target.z,
      true
    );

    logger.debug('CameraSystem', `应用视图预设: ${viewKey}`);
  }

  _flipView() {
    const currentPos = this.activeCamera.position.clone();
    const target = new THREE.Vector3();
    this.controls.getTarget(target);

    const direction = currentPos.sub(target);
    direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
    
    const newPos = target.clone().add(direction);

    this.controls.setLookAt(
      newPos.x, newPos.y, newPos.z,
      target.x, target.y, target.z,
      true
    );

    logger.debug('CameraSystem', '视图已翻转180度');
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

    logger.debug('CameraSystem', `相机已调整 | 宽高比: ${aspect.toFixed(2)}`);
  }

  update(delta) {
    if (this.controls) {
      this.controls.update(delta);
    }
  }

  getActiveCamera() {
    return this.activeCamera;
  }

  getControls() {
    return this.controls;
  }

  getCurrentMode() {
    return this.currentMode;
  }

  setPosition(x, y, z, smooth = true) {
    if (this.controls) {
      this.controls.setPosition(x, y, z, smooth);
    }
  }

  setTarget(x, y, z, smooth = true) {
    if (this.controls) {
      this.controls.setTarget(x, y, z, smooth);
    }
  }

  getMaxDistance() {
    return this.controls ? this.controls.maxDistance : 0;
  }

  getParticleSystemRadius() {
    return this.particleSystemRadius;
  }

  dispose() {
    if (this.controls) {
      this.controls.dispose();
      this.controls = null;
    }
    this.initialized = false;
    logger.info('CameraSystem', '相机系统已销毁');
  }
}

const cameraSys = new CameraSystem();
export default cameraSys;

```

### src/systems/controls-util.js

```javascript
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

### src/systems/coordinates-sys.js

```javascript
/**
 * @file coordinates-sys.js
 * @description 统一坐标系统 - 管理所有3D对象的坐标空间
 * 
 * 架构说明:
 * Scene (全局场景)
 *   └─ WorldRoot (世界根节点, position=[0,0,0], scale=1)
 *       └─ DataSpace (数据坐标空间, 可整体缩放/旋转/平移)
 *           ├─ ParticleSystemAnchor (粒子系统锚点)
 *           │   └─ ParticleSystem (独立缩放)
 *           ├─ PathSystemAnchor (路径系统锚点)
 *           │   └─ PathLine (独立缩放)
 *           └─ LightSystemAnchor (移动光点锚点)
 *               └─ MovingLight
 * 
 * Camera (独立于WorldRoot, 避免正交相机视锥体问题)
 * 已删除：整体旋转功能
 */

import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class CoordinateSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.initialized = false;

    // 坐标层级节点
    this.worldRoot = null;      // 世界根节点
    this.dataSpace = null;       // 数据坐标空间
    
    // 子系统锚点
    this.particleAnchor = null;
    this.pathAnchor = null;
    this.lightAnchor = null;

    // 坐标系统状态
    this.dataSpaceScale = 1.0;
    this.dataSpaceRotation = new THREE.Euler(0, 0, 0);
    this.dataSpacePosition = new THREE.Vector3(0, 0, 0);
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
      this._loadConfig();

      this.initialized = true;
      logger.info('CoordinateSystem', '坐标系统初始化完成');

      return this;
    } catch (err) {
      logger.error('CoordinateSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * 创建坐标层级结构
   */
  _createHierarchy() {
    // 1. 世界根节点
    this.worldRoot = new THREE.Group();
    this.worldRoot.name = 'WorldRoot';
    this.scene.add(this.worldRoot);

    // 2. 数据坐标空间
    this.dataSpace = new THREE.Group();
    this.dataSpace.name = 'DataSpace';
    this.worldRoot.add(this.dataSpace);

    // 3. 粒子系统锚点
    this.particleAnchor = new THREE.Group();
    this.particleAnchor.name = 'ParticleSystemAnchor';
    this.dataSpace.add(this.particleAnchor);

    // 4. 路径系统锚点
    this.pathAnchor = new THREE.Group();
    this.pathAnchor.name = 'PathSystemAnchor';
    this.dataSpace.add(this.pathAnchor);

    // 5. 移动光点锚点
    this.lightAnchor = new THREE.Group();
    this.lightAnchor.name = 'LightSystemAnchor';
    this.dataSpace.add(this.lightAnchor);

    logger.debug('CoordinateSystem', '坐标层级结构已创建');
  }

  /**
   * 绑定事件监听
   */
  _bindEvents() {
    // 监听DataSpace缩放
    this.eventBus.on('dataspace-scale-changed', (scale) => {
      this.setDataSpaceScale(scale);
    });

    // 监听DataSpace旋转
    this.eventBus.on('dataspace-rotation-changed', ({ axis, angle }) => {
      this.setDataSpaceRotation(axis, angle);
    });

    // 监听DataSpace位置
    this.eventBus.on('dataspace-position-changed', (position) => {
      this.setDataSpacePosition(position);
    });

    // 监听坐标系统重置
    this.eventBus.on('coordinate-system-reset', () => {
      this.reset();
    });
  }

  /**
   * 从配置加载初始状态
   */
  _loadConfig() {
    const scale = config.get('coordinates.dataSpace.scale');
    const rotation = config.get('coordinates.dataSpace.rotation');
    const position = config.get('coordinates.dataSpace.position');

    if (scale !== undefined) {
      this.setDataSpaceScale(scale);
    }

    if (rotation) {
      this.dataSpace.rotation.set(
        rotation.x || 0,
        rotation.y || 0,
        rotation.z || 0
      );
      this.dataSpaceRotation.copy(this.dataSpace.rotation);
    }

    if (position) {
      this.dataSpace.position.set(
        position.x || 0,
        position.y || 0,
        position.z || 0
      );
      this.dataSpacePosition.copy(this.dataSpace.position);
    }

    logger.info('CoordinateSystem', `✅ 配置已加载 | 缩放: ${this.dataSpaceScale}x`);
  }

  /**
   * 设置DataSpace整体缩放
   */
  setDataSpaceScale(scale) {
    if (scale <= 0) {
      logger.warn('CoordinateSystem', '缩放值必须大于0');
      return;
    }

    this.dataSpaceScale = scale;
    this.dataSpace.scale.setScalar(scale);
    
    config.set('coordinates.dataSpace.scale', scale);
    this.eventBus.emit('coordinate-system-updated', { type: 'scale', value: scale });
    
    logger.debug('CoordinateSystem', `DataSpace缩放: ${scale}`);
  }

  /**
   * 设置DataSpace旋转
   * @param {string} axis - 'x', 'y', 或 'z'
   * @param {number} angle - 弧度值
   */
  setDataSpaceRotation(axis, angle) {
    if (!['x', 'y', 'z'].includes(axis)) {
      logger.warn('CoordinateSystem', '无效的旋转轴');
      return;
    }

    this.dataSpaceRotation[axis] = angle;
    this.dataSpace.rotation[axis] = angle;

    config.set(`coordinates.dataSpace.rotation.${axis}`, angle);
    this.eventBus.emit('coordinate-system-updated', { 
      type: 'rotation', 
      axis, 
      value: angle 
    });

    logger.debug('CoordinateSystem', `DataSpace旋转 ${axis}: ${angle}`);
  }

  /**
   * 设置DataSpace位置
   */
  setDataSpacePosition(position) {
    this.dataSpacePosition.copy(position);
    this.dataSpace.position.copy(position);

    config.set('coordinates.dataSpace.position', {
      x: position.x,
      y: position.y,
      z: position.z
    });

    this.eventBus.emit('coordinate-system-updated', { 
      type: 'position', 
      value: position 
    });

    logger.debug('CoordinateSystem', 'DataSpace位置:', position);
  }

  /**
   * 重置坐标系统到初始状态
   */
  reset() {
    this.setDataSpaceScale(1.0);
    this.dataSpace.rotation.set(0, 0, 0);
    this.dataSpace.position.set(0, 0, 0);
    this.dataSpaceRotation.set(0, 0, 0);
    this.dataSpacePosition.set(0, 0, 0);

    logger.info('CoordinateSystem', '坐标系统已重置');
    this.eventBus.emit('coordinate-system-reset-completed');
  }

  /**
   * 获取锚点（供子系统挂载对象）
   */
  getParticleAnchor() { return this.particleAnchor; }
  getPathAnchor() { return this.pathAnchor; }
  getLightAnchor() { return this.lightAnchor; }

  /**
   * 获取DataSpace的世界坐标位置（用于相机lookAt）
   */
  getWorldPosition(target = new THREE.Vector3()) {
    return this.dataSpace.getWorldPosition(target);
  }

  /**
   * 获取当前状态
   */
  getState() {
    return {
      scale: this.dataSpaceScale,
      rotation: this.dataSpaceRotation.clone(),
      position: this.dataSpacePosition.clone()
    };
  }

  /**
   * 调试信息
   */
  debugInfo() {
    return {
      worldRoot: {
        position: this.worldRoot.position.toArray(),
        scale: this.worldRoot.scale.toArray()
      },
      dataSpace: {
        position: this.dataSpace.position.toArray(),
        rotation: [
          this.dataSpace.rotation.x,
          this.dataSpace.rotation.y,
          this.dataSpace.rotation.z
        ],
        scale: this.dataSpace.scale.toArray()
      },
      anchors: {
        particle: this.particleAnchor.children.length,
        path: this.pathAnchor.children.length,
        light: this.lightAnchor.children.length
      }
    };
  }

  dispose() {
    if (this.worldRoot) {
      this.scene.remove(this.worldRoot);
    }

    this.initialized = false;
    logger.info('CoordinateSystem', '坐标系统已销毁');
  }
}

const coordinateSystem = new CoordinateSystem();
export default coordinateSystem;

```

### src/systems/data-sys.js

```javascript
/**
 * @file data-sys.js
 * @description 数据加载系统 - CSV解析与坐标映射
 * ✅ 修复: 初始化时动态加载数据源清单 (manifest.json)，并提供主动查询方法。
 */
import * as THREE from 'three';
import Papa from 'papaparse';
import logger from '../utils/logger.js';
import config from '../config.js';

class DataSystem {
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
      // 您的vite配置中，public目录下的文件可以直接通过/访问
      const response = await fetch('/data/manifest.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const manifestData = await response.json();
      
      if (Array.isArray(manifestData) && manifestData.length > 0) {
        this.datasets = manifestData; // ✅ 修改：将数据保存在自己的实例中
        config.set('data.availableDatasets', manifestData);
        
        // 设置默认加载的数据为清单中的第一个
        const defaultPath = manifestData[0].path.replace('/data/', '../data/');
        config.set('data.csvUrl', defaultPath);
        
        logger.info('DataSystem', `成功加载 ${manifestData.length} 个数据集清单`);
      } else {
        throw new Error('清单格式无效或为空');
      }
    } catch (err) {
      logger.error('DataSystem', `加载数据集清单失败: ${err.message}`);
      this.datasets = []; // ✅ 修改：失败时也更新一下
      config.set('data.availableDatasets', []);
    } finally {
      this.eventBus.emit('datasets-list-updated', this.getAvailableDatasets());
    }
  }

  // ... loadCSV, _processData, _mapToPoints, _adjustCamera, dispose 方法保持不变 ...
  async loadCSV(csvUrl) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    const fetchUrl = csvUrl.replace('../data/', '/data/');

    logger.info('DataSystem', `开始加载 CSV: ${fetchUrl}`);

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }

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
      config.set('data.antData', validData);

      const mappedPoints = this._mapToPoints(validData);
      config.set('data.mappedPoints', mappedPoints);

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

### src/systems/environment-sys.js

```javascript
/**
 * @file environment-sys.js
 * @description 环境系统 - 负责管理天空盒、背景和环境反射
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';
import eventBus from '../event-bus.js';

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

    const path = skyboxConfig.path;
    const urls = [
      path + 'px.png', path + 'nx.png',
      path + 'py.png', path + 'ny.png',
      path + 'pz.png', path + 'nz.png'
    ];

    logger.debug('EnvironmentSystem', `正在加载天空盒: ${path}`);
    
    this.cubeTextureLoader.load(
      urls,
      (texture) => {
        // 设置为场景背景（我们能看到的）
        this.scene.background = texture;
        // 设置为环境贴图（用于PBR材质的反射）
        this.scene.environment = texture;

        logger.info('EnvironmentSystem', '✅ 天空盒加载成功并应用');
      },
      undefined, // onProgress callback can be ignored
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

### src/systems/lighting-sys.js

```javascript
/**
 * @file lighting-sys.js
 * @description 光照系统 - 管理场景中的环境光与直接光
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class LightingSystem {
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

### src/systems/material-sys.js

```javascript
/**
 * @file material-sys.js
 * @description 材质辉光管理系统 - 统一管理 emissive 属性
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class MaterialSystem {
  constructor() {
    this.eventBus = null;
    this.initialized = false;
    
    // 注册的材质对象
    this.materials = new Map();
  }

  init({ eventBus }) {
    if (this.initialized) {
      logger.warn('MaterialSystem', '材质系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this._bindEvents();

      this.initialized = true;
      logger.info('MaterialSystem', '材质系统初始化完成');

      return this;
    } catch (err) {
      logger.error('MaterialSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    // 监听材质注册事件
    this.eventBus.on('material-registered', ({ name, material }) => {
      this.registerMaterial(name, material);
    });

    // 监听辉光开关
    this.eventBus.on('material-glow-enabled-changed', ({ target, enabled }) => {
      this.setGlowEnabled(target, enabled);
    });

    // 监听辉光强度
    this.eventBus.on('material-glow-intensity-changed', ({ target, intensity }) => {
      this.setGlowIntensity(target, intensity);
    });

    // 监听辉光颜色
    this.eventBus.on('material-glow-color-changed', ({ target, color }) => {
      this.setGlowColor(target, color);
    });
  }

  registerMaterial(name, material) {
    if (!material) {
      logger.warn('MaterialSystem', `注册失败: 材质 ${name} 无效`);
      return;
    }

    this.materials.set(name, material);
    logger.debug('MaterialSystem', `材质已注册: ${name}`);
  }

  setGlowEnabled(target, enabled) {
    const material = this.materials.get(target);
    if (!material) {
      logger.warn('MaterialSystem', `未找到材质: ${target}`);
      return;
    }

    if (material.emissive) {
      if (enabled) {
        const color = config.get(`material.${target}.emissiveColor`) || material.color;
        material.emissive.set(color);
      } else {
        material.emissive.set(0x000000);
      }
    }

    config.set(`material.${target}.enabled`, enabled);
    logger.debug('MaterialSystem', `${target} 辉光: ${enabled ? '开启' : '关闭'}`);
  }

  setGlowIntensity(target, intensity) {
    const material = this.materials.get(target);
    if (!material) {
      logger.warn('MaterialSystem', `未找到材质: ${target}`);
      return;
    }

    if (material.emissiveIntensity !== undefined) {
      material.emissiveIntensity = intensity;
    } else if (material.userData) {
      material.userData.emissiveIntensity = intensity;
    }

    config.set(`material.${target}.emissiveIntensity`, intensity);
    logger.debug('MaterialSystem', `${target} 辉光强度: ${intensity.toFixed(2)}`);
  }

  setGlowColor(target, color) {
    const material = this.materials.get(target);
    if (!material) {
      logger.warn('MaterialSystem', `未找到材质: ${target}`);
      return;
    }

    if (material.emissive) {
      material.emissive.set(color);
    }

    config.set(`material.${target}.emissiveColor`, color);
    logger.debug('MaterialSystem', `${target} 辉光颜色: ${color}`);
  }

  getMaterial(name) {
    return this.materials.get(name);
  }

  dispose() {
    this.materials.clear();
    this.initialized = false;
    logger.info('MaterialSystem', '材质系统已销毁');
  }
}

const materialSys = new MaterialSystem();
export default materialSys;

```

### src/systems/model-sys.js

```javascript
// 文件：src/systems/model-sys.js
// 说明：可替换模型系统（统一 {mount, unmount, update, getActive}）
// baseline = 你现有的 “粒子 + 路径/标记” 组合

import { info, warn, error } from '../utils/logger.js';

const REG = new Map();

export function createBaselineFactory({ createParticlesEnt, createMarkerEnt, initParticlesSys }) {
  return function baselineFactory(ctx) {
    const { scene, eventBus } = ctx;

    // 实体
    const particlesEnt = createParticlesEnt({ scene });
    const markerEnt = createMarkerEnt({ scene });

    // 系统
    const particlesSys = initParticlesSys({
      eventBus,
      dustPoints: particlesEnt.dustPoints,
      baseDustPositions: particlesEnt.baseDustPositions
    });

    return {
      key: 'baseline',
      update: (nowMs) => { particlesSys?.update?.(nowMs); },
      dispose: () => {
        try {
          particlesEnt?.dustPoints?.geometry?.dispose?.();
          particlesEnt?.dustPoints?.material?.dispose?.();
          scene.remove(particlesEnt?.dustPoints);

          markerEnt?.lineGroup?.clear?.();
          scene.remove(markerEnt?.currentMarker);
          markerEnt?.currentMarker?.geometry?.dispose?.();
          markerEnt?.currentMarker?.material?.dispose?.();
        } catch (e) {
          warn('ModelSys', 'baseline dispose 异常：' + e.message);
        }
      },
      // 给 animation-sys 用
      markerEnt
    };
  };
}

export function registerModel(key, factory) {
  REG.set(key, factory);
  info('ModelSys', `注册模型：${key}`);
}

export function initModelSys({ eventBus, scene }) {
  let active = null;
  const ctx = { eventBus, scene };

  function mount(key) {
    if (!REG.has(key)) { error('ModelSys', `未注册模型：${key}`); return null; }
    if (active) unmount();
    const inst = REG.get(key)(ctx);
    active = { key, inst };
    info('ModelSys', `已挂载模型：${key}`);
    return inst;
  }

  function unmount() {
    if (!active) return;
    try { active.inst?.dispose?.(); } catch {}
    info('ModelSys', `已卸载模型：${active.key}`);
    active = null;
  }

  function update(nowMs) { active?.inst?.update?.(nowMs); }
  function getActive() { return active?.inst || null; }

  eventBus.on('model:switch', (key) => mount(key), 'ModelSys');

  return { registerModel, mount, unmount, update, getActive };
}

```

### src/systems/particles-sys.js

```javascript
/**
 * @file particles-sys.js
 * @description 粒子系统 - 球形分布 + 自转 + 呼吸 + 浮动效果
 * ✅ 修改：sphereRadius 默认1600，systemScale 默认1.0
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

const DEFAULT_SPHERE_RADIUS = 1600;
const DEFAULT_SYSTEM_SCALE = 1.0;
const DEFAULT_BREATH_INTENSITY = 0.1;
const DEFAULT_BREATH_PERIOD = 3.0;
const DEFAULT_FLOAT_INTENSITY = 0.3;
const DEFAULT_FLOAT_PERIOD = 4.0;

class ParticlesSystem {
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

      // ✅ 默认缩放改回1.0
      const initialScale = config.get('particles.systemScale') ?? 1.0;
      this.particleContainer.scale.setScalar(initialScale);
      logger.info('ParticlesSystem', `✅ 初始粒子缩放: ${initialScale}x`);

      this._createDustParticles();
      this._bindEvents();

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
    const radius = config.get('particles.sphereRadius') ?? DEFAULT_SPHERE_RADIUS;  // ✅ 使用常量
    
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
    
    const dustColor = config.get('particles.dustColor') ?? '#AF85B7';
    this.baseSize = config.get('particles.dustSize') ?? 0.6;
    const dustOpacity = config.get('particles.dustOpacity') ?? 0.6;
    const emissiveIntensity = config.get('material.particles.emissiveIntensity') ?? 0.3;
    
    const material = new THREE.PointsMaterial({
      color: new THREE.Color(dustColor),
      size: this.baseSize,
      opacity: dustOpacity,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false,
      sizeAttenuation: true
    });
    
    material.userData = {
      emissive: new THREE.Color(dustColor),
      emissiveIntensity: emissiveIntensity,
       isParticleMaterial: true  // ✅ 标记为粒子材质
    };
    
    this.dustParticles = new THREE.Points(geometry, material);
    this.dustParticles.name = 'DustParticles';
    this.dustParticles.userData = { glow: true };  // ✅ 标记为辉光对象
    
    this.particleContainer.add(this.dustParticles);

    // ✅ 注册材质到 MaterialSystem
  this.eventBus.emit('material-registered', {
    name: 'particles',
    material: material
  });
    
    logger.debug('ParticlesSystem', `尘埃粒子已创建: ${count} 个`);
  }

  _bindEvents() {
    this.eventBus.on('dust-color-changed', (color) => {
      if (this.dustParticles) {
        this.dustParticles.material.color.set(color);
        this.dustParticles.material.userData.emissive.set(color);
      }
    });

    this.eventBus.on('dust-size-changed', (size) => {
      this.baseSize = size;
      if (this.dustParticles) {
        this.dustParticles.material.size = size;
      }
    });

    this.eventBus.on('dust-opacity-changed', (opacity) => {
      if (this.dustParticles) {
        this.dustParticles.material.opacity = opacity;
      }
    });

    this.eventBus.on('particle-system-scale-changed', (scale) => {
      if (this.particleContainer) {
        this.particleContainer.scale.setScalar(scale);
        logger.debug('ParticlesSystem', `粒子容器已缩放: ${scale}x`);
      }
    });

    this.eventBus.on('dust-count-changed', (count) => {
      this._rebuildDustParticles(count);
    });

    this.eventBus.on('rotation-speed-changed', (speed) => {
      this.rotationSpeed = speed;
    });

    this.eventBus.on('rotation-tilt-xz-changed', (angle) => {
      this.tiltXZ = angle;
      this._updateRotationAxis();
    });

    this.eventBus.on('rotation-tilt-xy-changed', (angle) => {
      this.tiltXY = angle;
      this._updateRotationAxis();
    });

    // ✅ 保留呼吸和浮动事件监听
    this.eventBus.on('particle-breath-intensity-changed', (intensity) => {
      this.breathIntensity = intensity;
      config.set('particles.breathIntensity', intensity);
    });

    this.eventBus.on('particle-float-intensity-changed', (intensity) => {
      this.floatIntensity = intensity;
      config.set('particles.floatIntensity', intensity);
    });

    this.eventBus.on('particle-emissive-intensity-changed', (intensity) => {
      if (this.dustParticles) {
        this.dustParticles.material.userData.emissiveIntensity = intensity;
      }
    });
  }

  _updateRotationAxis() {
    const radXZ = (this.tiltXZ * Math.PI) / 180;
    const radXY = (this.tiltXY * Math.PI) / 180;
    
    const axisXZ = new THREE.Vector3(Math.sin(radXZ), Math.cos(radXZ), 0);
    
    const axisXY = new THREE.Vector3(
      axisXZ.x,
      axisXZ.y * Math.cos(radXY) - axisXZ.z * Math.sin(radXY),
      axisXZ.y * Math.sin(radXY) + axisXZ.z * Math.cos(radXY)
    );
    
    this.rotationAxis.copy(axisXY.normalize());
  }

  _rebuildDustParticles(count) {
    if (this.dustParticles) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
      this.dustParticles.material.dispose();
    }

    config.set('particles.dustCount', count);
    this._createDustParticles();
    
    const currentScale = this.particleContainer.scale.x;
    logger.debug('ParticlesSystem', `粒子重建后保持缩放: ${currentScale}x`);
    
    logger.info('ParticlesSystem', `粒子系统已重建: ${count} 个`);
  }

  update(elapsed) {
    // 自转
    if (this.dustParticles && this.rotationSpeed !== 0) {
      this.dustParticles.rotateOnAxis(this.rotationAxis, this.rotationSpeed * 0.01);
    }

    // ✅ 保留粒子呼吸和浮动效果
    if (this.dustParticles && this.initialPositions) {
      const positions = this.dustParticles.geometry.attributes.position.array;
      const sizes = this.dustParticles.geometry.attributes.size.array;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        const phaseOffset = sizes[i];
        
        const breathPhase = elapsed / this.breathPeriod + phaseOffset;
        const breathScale = 1.0 + Math.sin(breathPhase * Math.PI * 2) * this.breathIntensity;
        
        const floatPhase = elapsed / this.floatPeriod + phaseOffset;
        const floatOffset = Math.sin(floatPhase * Math.PI * 2) * this.floatIntensity;
        
        positions[i * 3 + 1] = this.initialPositions[i * 3 + 1] + floatOffset;
      }

      this.dustParticles.geometry.attributes.position.needsUpdate = true;

      const globalBreath = 1.0 + Math.sin(elapsed / this.breathPeriod * Math.PI * 2) * this.breathIntensity * 0.3;
      this.dustParticles.material.size = this.baseSize * globalBreath;
    }
  }

  dispose() {
    if (this.dustParticles) {
      this.particleContainer.remove(this.dustParticles);
      this.dustParticles.geometry.dispose();
      this.dustParticles.material.dispose();
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

### src/systems/postprocess-sys.js

```javascript
/**
 * @file postprocess-sys.js
 * @description 后处理系统 - 选择性辉光 + 色相 + 噪点等效果
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import logger from '../utils/logger.js';
import config from '../config.js';

// 抑制 UniformsUtils 无害警告
const originalWarn = console.warn;
console.warn = (...args) => {
  const message = args[0];
  if (typeof message === 'string' &&
      (message.includes('UniformsUtils') ||
       message.includes('Textures of render targets'))) {
    return;
  }
  originalWarn.apply(console, args);
};

class PostprocessSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.initialized = false;

    this.composer = null;
    this.renderPass = null;

    // 选择性辉光相关
    this.glowRenderTarget = null;
    this.glowScene = null;
    this.glowMaterial = null;
    this.glowCombinePass = null;

    // 自定义Pass
    this.hueSaturationPass = null;
    this.brightnessContrastPass = null;
    this.noisePass = null;
    this.chromaticAberrationPass = null;
    this.scanlinePass = null;

    // 色相抖动节流
    this.lastHueUpdate = 0;
    this.hueUpdateInterval = 100;

    this.getCameraFn = null;
    this.cameraReady = false;
    this._loggedWaiting = false;
  }

  init({ eventBus, scene, camera, renderer }) {
    if (this.initialized) {
      logger.warn('PostprocessSystem', '后处理系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;

      if (typeof camera === 'function') {
        this.getCameraFn = camera;
      } else {
        this.getCameraFn = () => camera;
      }

      const initialCamera = this.getCameraFn();
      if (initialCamera) {
        this.cameraReady = true;
        logger.debug('PostprocessSystem', '相机已就绪');
      } else {
        logger.warn('PostprocessSystem', '初始化时相机未就绪，等待相机准备完成');
      }

      this._createComposer();
      this._createSelectiveGlow();
      this._createPasses();
      this._bindEvents();

      this.initialized = true;
      logger.info('PostprocessSystem', '后处理系统初始化完成(选择性辉光模式)');

      return this;
    } catch (err) {
      logger.error('PostprocessSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createComposer() {
    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, null);
    this.composer.addPass(this.renderPass);

    logger.debug('PostprocessSystem', 'EffectComposer已创建');
  }

  // 创建选择性辉光系统
  _createSelectiveGlow() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  this.glowRenderTarget = new THREE.WebGLRenderTarget(width, height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat
  });

  this.glowScene = new THREE.Scene();

  this.glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    depthWrite: false
  });

  // ✅ 恢复正确的辉光合成着色器
  this.glowCombinePass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      tGlow: { value: this.glowRenderTarget.texture },
      glowIntensity: { value: config.get('postprocess.bloom.intensity') || 0.8 },
      resolution: { value: new THREE.Vector2(1 / width, 1 / height) },
      blurSize: { value: config.get('postprocess.bloom.smoothing') || 2.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform sampler2D tGlow;
      uniform float glowIntensity;
      uniform vec2 resolution;
      uniform float blurSize;
      varying vec2 vUv;

      void main() {
        vec4 base = texture2D(tDiffuse, vUv);
        
        // 5-tap 模糊采样辉光纹理
        vec4 glow = vec4(0.0);
        float total = 0.0;
        for(float x = -2.0; x <= 2.0; x++) {
          for(float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * resolution * blurSize;
            glow += texture2D(tGlow, vUv + offset);
            total += 1.0;
          }
        }
        glow /= total;
        
        // 叠加辉光到主场景
        gl_FragColor = base + glow * glowIntensity;
      }
    `
  });

  this.composer.addPass(this.glowCombinePass);

  logger.debug('PostprocessSystem', '选择性辉光系统已创建（含内置模糊采样）');
}

  _createPasses() {
    this._createHueSaturationPass();
    this._createBrightnessContrastPass();
    this._createNoisePass();
    this._createChromaticAberrationPass();
    this._createScanlinePass();
  }

  _createHueSaturationPass() {
    const hsConfig = config.get('postprocess.hueSaturation');

    this.hueSaturationPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        hue: { value: hsConfig.hue },
        saturation: { value: hsConfig.saturation }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float hue;
        uniform float saturation;
        varying vec2 vUv;

        vec3 rgb2hsv(vec3 c) {
          vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
          vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
          vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
          float d = q.x - min(q.w, q.y);
          float e = 1.0e-10;
          return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
        }

        vec3 hsv2rgb(vec3 c) {
          vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
          vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
          return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
        }

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 hsv = rgb2hsv(texel.rgb);
          hsv.x = fract(hsv.x + hue);
          hsv.y = clamp(hsv.y * (1.0 + saturation), 0.0, 1.0);
          gl_FragColor = vec4(hsv2rgb(hsv), texel.a);
        }
      `
    });

    this.hueSaturationPass.enabled = hsConfig.enabled;
    this.composer.addPass(this.hueSaturationPass);
  }

  _createBrightnessContrastPass() {
    const bcConfig = config.get('postprocess.brightnessContrast');

    this.brightnessContrastPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        brightness: { value: bcConfig.brightness },
        contrast: { value: bcConfig.contrast }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float brightness;
        uniform float contrast;
        varying vec2 vUv;

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 color = texel.rgb;

          color += brightness;
          color = (color - 0.5) * (1.0 + contrast) + 0.5;

          gl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a);
        }
      `
    });

    this.brightnessContrastPass.enabled = bcConfig.enabled;
    this.composer.addPass(this.brightnessContrastPass);
  }

  _createNoisePass() {
    const noiseConfig = config.get('postprocess.noise');

    this.noisePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: noiseConfig.intensity },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float intensity;
        uniform float time;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          float noise = random(vUv + time) * intensity;
          gl_FragColor = vec4(texel.rgb + noise, texel.a);
        }
      `
    });

    this.noisePass.enabled = noiseConfig.enabled;
    this.composer.addPass(this.noisePass);
  }

  _createChromaticAberrationPass() {
  const caConfig = config.get('postprocess.chromaticAberration');

  this.chromaticAberrationPass = new ShaderPass({
    uniforms: {
      tDiffuse: { value: null },
      offsetX: { value: caConfig.offsetX || 0.002 },
      offsetY: { value: caConfig.offsetY || 0.002 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float offsetX;
      uniform float offsetY;
      varying vec2 vUv;

      void main() {
        vec2 offset = vec2(offsetX, offsetY);
        
        vec2 uvR = clamp(vUv + offset, 0.0, 1.0);
        vec2 uvB = clamp(vUv - offset, 0.0, 1.0);
        
        float r = texture2D(tDiffuse, uvR).r;
        float g = texture2D(tDiffuse, vUv).g;
        float b = texture2D(tDiffuse, uvB).b;
        float a = texture2D(tDiffuse, vUv).a;
        
        gl_FragColor = vec4(r, g, b, a);
      }
    `
  });

  this.chromaticAberrationPass.enabled = caConfig.enabled;
  this.composer.addPass(this.chromaticAberrationPass);
}


  _createScanlinePass() {
    const slConfig = config.get('postprocess.scanline');

    this.scanlinePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        intensity: { value: slConfig.intensity },
        density: { value: slConfig.density },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float intensity;
        uniform float density;
        uniform float time;
        varying vec2 vUv;

        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          // density 的缩放系数调整，使用 2PI * time 以产生滚动效果
          float scanline = sin((vUv.y * density + time * 0.5) * 6.28318530718) * intensity;
          gl_FragColor = vec4(texel.rgb * (1.0 - scanline * 0.5), texel.a);
        }
      `
    });

    this.scanlinePass.enabled = slConfig.enabled;
    this.composer.addPass(this.scanlinePass);
  }

  _bindEvents() {
    this.eventBus.on('postprocess-enabled-changed', (enabled) => {
      config.set('postprocess.enabled', enabled);
    });

    // 辉光强度控制
    this.eventBus.on('bloom-intensity-changed', (value) => {
      if (this.glowCombinePass) {
        this.glowCombinePass.uniforms.glowIntensity.value = value;
      }
      config.set('postprocess.bloom.intensity', value);
    });

    // 辉光模糊大小
    this.eventBus.on('bloom-smoothing-changed', (value) => {
      if (this.glowCombinePass) {
        this.glowCombinePass.uniforms.blurSize.value = value;
      }
      config.set('postprocess.bloom.smoothing', value);
    });

    this.eventBus.on('hue-saturation-enabled-changed', (enabled) => {
      this.hueSaturationPass.enabled = enabled;
      config.set('postprocess.hueSaturation.enabled', enabled);
    });

    this.eventBus.on('hue-changed', (value) => {
      const now = Date.now();
      if (now - this.lastHueUpdate >= this.hueUpdateInterval) {
        this.hueSaturationPass.uniforms.hue.value = value;
        config.set('postprocess.hueSaturation.hue', value);
        this.lastHueUpdate = now;
      }
    });

    this.eventBus.on('saturation-changed', (value) => {
      this.hueSaturationPass.uniforms.saturation.value = value;
      config.set('postprocess.hueSaturation.saturation', value);
    });

    this.eventBus.on('brightness-contrast-enabled-changed', (enabled) => {
      this.brightnessContrastPass.enabled = enabled;
      config.set('postprocess.brightnessContrast.enabled', enabled);
    });

    this.eventBus.on('brightness-changed', (value) => {
      this.brightnessContrastPass.uniforms.brightness.value = value;
      config.set('postprocess.brightnessContrast.brightness', value);
    });

    this.eventBus.on('contrast-changed', (value) => {
      this.brightnessContrastPass.uniforms.contrast.value = value;
      config.set('postprocess.brightnessContrast.contrast', value);
    });

    this.eventBus.on('noise-enabled-changed', (enabled) => {
      this.noisePass.enabled = enabled;
      config.set('postprocess.noise.enabled', enabled);
    });

    this.eventBus.on('noise-intensity-changed', (value) => {
      this.noisePass.uniforms.intensity.value = value;
      config.set('postprocess.noise.intensity', value);
    });

    this.eventBus.on('chromatic-aberration-enabled-changed', (enabled) => {
      this.chromaticAberrationPass.enabled = enabled;
      config.set('postprocess.chromaticAberration.enabled', enabled);
    });

    this.eventBus.on('chromatic-aberration-offset-changed', ({ offsetX, offsetY }) => {
      this.chromaticAberrationPass.uniforms.offsetX.value = offsetX;
      this.chromaticAberrationPass.uniforms.offsetY.value = offsetY;
      config.set('postprocess.chromaticAberration.offsetX', offsetX);
      config.set('postprocess.chromaticAberration.offsetY', offsetY);
    });

    this.eventBus.on('scanline-enabled-changed', (enabled) => {
      this.scanlinePass.enabled = enabled;
      config.set('postprocess.scanline.enabled', enabled);
    });

    this.eventBus.on('scanline-intensity-changed', (value) => {
      this.scanlinePass.uniforms.intensity.value = value;
      config.set('postprocess.scanline.intensity', value);
    });

    this.eventBus.on('scanline-density-changed', (value) => {
      this.scanlinePass.uniforms.density.value = value;
      config.set('postprocess.scanline.density', value);
    });

    // 支持外部注册材质事件（若需要在别处维护材质注册）
    this.eventBus.on('material-registered', (payload) => {
      // 暂时不做额外处理，但保留事件钩子以便扩展
      // payload: { name, material }
      logger.debug('PostprocessSystem', `material-registered: ${payload.name}`);
    });
  }

    // 渲染辉光层 —— 会将仅标记为 glow 的对象渲染到 glowRenderTarget
  _renderGlowLayer() {
    const camera = this.getCameraFn();
    if (!camera) return;

    // 清空辉光场景
    while (this.glowScene.children.length > 0) {
      this.glowScene.remove(this.glowScene.children[0]);
    }

    // 遍历主场景,复制标记为 glow 的对象
    this.scene.traverse((obj) => {
      if (!obj.userData || !obj.userData.glow) return;
      if (!obj.visible) return;

      // ================== 新增：处理路径线条 (Line + ShaderMaterial) ==================
      if (obj.isLine && obj.material && obj.material.isShaderMaterial) {
        const originalMaterial = obj.material;
        
        // 检查uniforms是否存在
        if (originalMaterial.uniforms.uEmissive && originalMaterial.uniforms.uEmissiveIntensity) {
          const emitColor = originalMaterial.uniforms.uEmissive.value.clone();
          const emitIntensity = originalMaterial.uniforms.uEmissiveIntensity.value;
          
          // 创建一个简单的LineBasicMaterial用于辉光渲染
          const glowLineMat = new THREE.LineBasicMaterial({
            color: emitColor,
            transparent: true,
            opacity: Math.min(1.0, emitIntensity * 2.0), // 乘以2让线条辉光更明显
            depthWrite: false,
            blending: THREE.AdditiveBlending
          });

          // 共享几何体创建新的Line对象
          const lineClone = new THREE.Line(obj.geometry, glowLineMat);
          lineClone.matrix.copy(obj.matrixWorld);
          lineClone.matrixAutoUpdate = false;
          this.glowScene.add(lineClone);
        }
      } 
      // ======================== 处理点 (Points) ========================
      else if (obj.type === 'Points' || obj instanceof THREE.Points) {
        const origMat = obj.material;
        const userEmissive = origMat?.userData?.emissive;
        const emissiveIntensity = origMat?.userData?.emissiveIntensity || 1.0;

        let color = new THREE.Color(0xffffff);
        if (userEmissive) {
          color.set(userEmissive);
        } else if (origMat?.color) {
          color.copy(origMat.color);
        }

        const glowPointMat = new THREE.PointsMaterial({
          color: color,
          size: origMat?.size ?? 1.0,
          transparent: true,
          opacity: Math.min(1.0, emissiveIntensity),
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true
        });

        const pointsClone = new THREE.Points(obj.geometry, glowPointMat);
        pointsClone.matrix.copy(obj.matrixWorld);
        pointsClone.matrixAutoUpdate = false;
        this.glowScene.add(pointsClone);
      } 
      // ======================== 处理网格 (Mesh) ========================
      else if (obj.isMesh || obj instanceof THREE.Mesh) {
        const originalMaterial = obj.material;

        let emitColor = new THREE.Color(0xffffff);
        if (originalMaterial?.userData?.emissive) {
          emitColor.set(originalMaterial.userData.emissive);
        } else if (originalMaterial?.emissive) {
          emitColor.copy(originalMaterial.emissive);
        } else if (originalMaterial?.color) {
          emitColor.copy(originalMaterial.color);
        }

        const emitIntensity = originalMaterial?.emissiveIntensity || 1.0;

        const mat = this.glowMaterial.clone();
        mat.color.copy(emitColor);
        mat.opacity = Math.min(1.0, emitIntensity);
        mat.blending = THREE.AdditiveBlending;

        const meshClone = new THREE.Mesh(obj.geometry, mat);
        meshClone.matrix.copy(obj.matrixWorld);
        meshClone.matrixAutoUpdate = false;
        this.glowScene.add(meshClone);
      }
    });

    // 渲染辉光层到 RenderTarget
    this.renderer.setRenderTarget(this.glowRenderTarget);
    this.renderer.clear();
    this.renderer.render(this.glowScene, this.getCameraFn());
    this.renderer.setRenderTarget(null);

    // 更新合成 pass 的 tGlow
    if (this.glowCombinePass) {
      this.glowCombinePass.uniforms.tGlow.value = this.glowRenderTarget.texture;
    }
  }


  render(delta) {
    if (!this.cameraReady || !this.getCameraFn) {
      const camera = this.getCameraFn ? this.getCameraFn() : null;

      if (!camera) {
        if (!this._loggedWaiting) {
          logger.debug('PostprocessSystem', '等待相机初始化...');
          this._loggedWaiting = true;
        }
        return;
      }

      this.cameraReady = true;
      this.renderPass.camera = camera;
      logger.info('PostprocessSystem', '相机已就绪，开始后处理渲染');
    }

    if (this.renderPass && this.getCameraFn) {
      const camera = this.getCameraFn();
      if (camera) {
        this.renderPass.camera = camera;
      }
    }

    // 渲染辉光层（如果开启）
    if (config.get('postprocess.bloom.enabled')) {
      this._renderGlowLayer();
    }

    // 更新时间相关的uniform
    if (this.noisePass && this.noisePass.enabled) {
      this.noisePass.uniforms.time.value += delta;
    }

    if (this.scanlinePass && this.scanlinePass.enabled) {
      this.scanlinePass.uniforms.time.value += delta;
    }

    // 若合成 pass 依赖分辨率或 blurSize 更新，可在外部通过事件更新 uniforms
    // 渲染 composer（包含所有 pass）
    this.composer.render(delta);
  }

  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.composer.setSize(width, height);

    if (this.glowRenderTarget) {
      this.glowRenderTarget.setSize(width, height);
    }

    if (this.glowCombinePass && this.glowCombinePass.uniforms && this.glowCombinePass.uniforms.resolution) {
      this.glowCombinePass.uniforms.resolution.value.set(1 / width, 1 / height);
    }

    if (this.renderPass && this.getCameraFn && this.cameraReady) {
      const camera = this.getCameraFn();
      if (camera) {
        this.renderPass.camera = camera;
      }
    }

    logger.debug('PostprocessSystem', '后处理已调整大小');
  }

  dispose() {
    if (this.composer) {
      try { this.composer.dispose(); } catch (e) { /* ignore */ }
    }

    if (this.glowRenderTarget) {
      try { this.glowRenderTarget.dispose(); } catch (e) { /* ignore */ }
    }

    this.initialized = false;
    this.cameraReady = false;
    logger.info('PostprocessSystem', '后处理系统已销毁');
  }
}

const postprocessSys = new PostprocessSystem();
export default postprocessSys;

```

### src/ui/ui-basic.js

```javascript
/**
 * @file ui-basic.js
 * @description 基础 UI 控制面板 - 动态数据源 + 预设加载同步
 * ✅ 修复:
 *   1. 数据源下拉框动态生成
 *   2. 添加 updateBindings() 方法，在预设加载后手动更新颜色等临时对象
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';
import dataSys from '../systems/data-sys.js';
class UIBasic {
  constructor() {
    this.controls = new Map();
    this.folders = new Map();
    this._pane = null;
    this._isInitialized = false;
    
    this.configData = config.getRaw();
    
    this.tempObjects = {
      dustColor: { dustColor: this.configData.particles.dustColor },
      pathColor: { pathColor: this.configData.environment.pathColor },
      //bgColor: { bgColor: this.configData.environment.bgColor },
      pathPointColor: { pathPointColor: this.configData.particles.pathPointColor },
      rotationSpeed: { rotationSpeed: this.configData.particles.rotationSpeed },
      rotationTiltXZ: { rotationTiltXZ: this.configData.particles.rotationTiltXZ },
      rotationTiltXY: { rotationTiltXY: this.configData.particles.rotationTiltXY },
      pathPointSize: { pathPointSize: this.configData.particles.pathPointSize },
      depthIntensity: { depthIntensity: this.configData.path.depthIntensity }
    };

    // ✅ 用于存放数据源文件夹中的控件
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

    // ✅ 先创建空的文件夹
    const dataFolder = this._pane.addFolder({ title: '数据源', expanded: true });
    this.folders.set('data', dataFolder);

    this._rebuildDataControls(); // ✅ 首次构建
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
  
  /**
   * ✅ 核心修改: 重建数据源UI部分
   */
  _rebuildDataControls() {
    const folder = this.folders.get('data');
    if (!folder) return;
    
    // 清空旧控件
    this.dataControls.forEach(c => c.dispose());
    this.dataControls = [];
    this.controls.delete('data.csvUrl');

    // ✅核心修改：数据源从 config 变为直接从 dataSys 查询
    const datasets = dataSys.getAvailableDatasets();
    
    if (datasets.length === 0) {
      const errorBlade = folder.addBlade({
        view: 'text',
        label: '错误',
        parse: (v) => String(v),
        value: '未找到数据源清单'
      });
      this.dataControls.push(errorBlade);
      logger.warn('UIBasic', '数据源未配置: availableDatasets 为空');
      return;
    }
    
    const datasetOptions = datasets.reduce((acc, ds) => {
      // tweakpane 的 options 需要 key-value 对
      // key 是显示名, value 是实际值
      acc[ds.name] = ds.path.replace('/data/', '../data/');
      return acc;
    }, {});

    const csvSelect = folder.addBinding(
      this.configData.data,
      'csvUrl',
      {
        label: 'CSV文件',
        options: datasetOptions
      }
    );
    
    csvSelect.on('change', (ev) => {
      eventBus.emit('data-load-requested', ev.value);
      this._updateDatasetDescription(); // ✅ 切换后更新描述
      logger.info('UIBasic', `切换CSV: ${ev.value}`);
    });
    
    this.controls.set('data.csvUrl', csvSelect);
    this.dataControls.push(csvSelect);
    
    const descriptionBlade = folder.addBlade({
      view: 'text',
      label: '描述',
      parse: (v) => String(v),
      value: ''
    });
    this.dataControls.push(descriptionBlade);
    this.descriptionBlade = descriptionBlade; // 保存引用以便更新
    
    this._updateDatasetDescription(); // ✅ 首次加载时更新描述

    const loadBtn = folder.addButton({ title: '🔄 重新加载' });
    loadBtn.on('click', () => {
      const currentPath = config.get('data.csvUrl');
      eventBus.emit('data-load-requested', currentPath);
      logger.info('UIBasic', `重新加载数据: ${currentPath}`);
    });
    this.dataControls.push(loadBtn);

    logger.debug('UIBasic', '数据源控件已重建');
  }

  /**
   * ✅ 新增辅助方法: 更新数据集描述
   */
  _updateDatasetDescription() {
    if (!this.descriptionBlade) return;
    
    const currentPath = config.get('data.csvUrl');
    // ✅ 数据源也从 dataSys 获取
    const datasets = dataSys.getAvailableDatasets();
    const currentDataset = datasets.find(ds => ds.path.replace('/data/', '../data/') === currentPath);
    
    if (currentDataset) {
      this.descriptionBlade.value = currentDataset.description;
    } else {
      this.descriptionBlade.value = '---';
    }
  }

  // ... _createAnimationControls, _createCameraControls 等其他方法保持不变 ...

  _bindEvents() {
    // ✅ 监听数据集列表更新事件
    eventBus.on('datasets-list-updated', () => {
      logger.info('UIBasic', '接收到数据集更新事件，准备重建UI');
      this._rebuildDataControls();
    });

    eventBus.on('step-changed', (step) => {
      const stepControl = this.controls.get('animation.currentStep');
      if (stepControl && this.configData.animation.currentStep !== step) {
        this.configData.animation.currentStep = step;
        stepControl.refresh();
      }
    });

    eventBus.on('animation-state-changed', (animating) => {
      if (this.configData.animation.animating !== animating) {
        this.configData.animation.animating = animating;
      }
    });

    eventBus.on('camera-mode-switched', (mode) => {
      if (this.configData.camera.mode !== mode) {
        this.configData.camera.mode = mode;
        const modeControl = this.controls.get('camera.mode');
        if (modeControl) {
          modeControl.refresh();
        }
      }
    });

    logger.debug('UIBasic', '事件监听已绑定');
  }
  
  // ... updateBindings, refresh, dispose 等方法保持不变 ...
  
  // ... 其他创建控件的方法保持不变 ...
  _createAnimationControls() {
    const folder = this._pane.addFolder({ title: '动画控制', expanded: true });
    
    const playButton = folder.addButton({ title: '▶️ 播放' });
    playButton.on('click', () => {
      const isPlaying = this.configData.animation.animating;
      this.configData.animation.animating = !isPlaying;
      eventBus.emit('animation-toggled', !isPlaying);
      playButton.title = !isPlaying ? '⏸️ 暂停' : '▶️ 播放';
      logger.info('UIBasic', `动画: ${!isPlaying ? '播放' : '暂停'}`);
    });
    
    const stepSlider = folder.addBinding(
      this.configData.animation,
      'currentStep',
      {
        label: '当前步数',
        min: 0,
        max: 100,
        step: 1
      }
    );
    
    stepSlider.on('change', (ev) => {
      eventBus.emit('step-to', ev.value);
    });
    
    this.controls.set('animation.currentStep', stepSlider);
    
    eventBus.on('data-loaded', (data) => {
      stepSlider.max = data.points.length - 1;
      stepSlider.refresh();
    });
    
    const speed = folder.addBinding(
      this.configData.animation,
      'speedFactor',
      { label: '速度', min: 0.05, max: 2, step: 0.05 }
    );
    
    speed.on('change', (ev) => {
      eventBus.emit('animation-speed-changed', ev.value);
    });
    
    this.controls.set('animation.speedFactor', speed);
    
    const loop = folder.addBinding(
      this.configData.animation,
      'loop',
      { label: '循环播放' }
    );
    
    loop.on('change', (ev) => {
      eventBus.emit('animation-loop-changed', ev.value);
    });
    
    this.controls.set('animation.loop', loop);
    
    this.folders.set('animation', folder);
  }

  _createCameraControls() {
    const folder = this._pane.addFolder({ title: '相机设置', expanded: false });
    
    const mode = folder.addBinding(
      this.configData.camera,
      'mode',
      {
        label: '相机模式',
        options: {
          '透视相机': 'perspective',
          '正交相机': 'orthographic'
        }
      }
    );
    
    mode.on('change', (ev) => {
      eventBus.emit('camera-mode-changed', ev.value);
    });
    
    this.controls.set('camera.mode', mode);
    
    const viewContainer = folder.addFolder({ title: '视图预设', expanded: false });
    
    const viewButtons = [];
    
    const views = [
      { name: '俯视图', key: 'top' },
      { name: '正视图', key: 'front' },
      { name: '侧视图', key: 'side' }
    ];
    
    views.forEach(view => {
      const btn = viewContainer.addButton({ title: view.name });
      btn.on('click', () => {
        eventBus.emit('view-changed', view.key);
        logger.info('UIBasic', `切换视图: ${view.name}`);
      });
      viewButtons.push(btn);
    });
    
    const flipBtn = viewContainer.addButton({ title: '🔄 翻转180°' });
    flipBtn.on('click', () => {
      eventBus.emit('flip-view');
      logger.info('UIBasic', '翻转视图');
    });
    viewButtons.push(flipBtn);
    
    eventBus.on('camera-mode-switched', (cameraMode) => {
      const disabled = cameraMode === 'perspective';
      viewButtons.forEach(btn => {
        btn.disabled = disabled;
      });
      
      viewContainer.title = disabled 
        ? '视图预设 (仅正交模式)'
        : '视图预设';
    });
    
    const fovBinding = folder.addBinding(
      this.configData.camera,
      'fov',
      { label: '视野角度 (透视)', min: 20, max: 120, step: 1 }
    );
    
    fovBinding.on('change', (ev) => {
      eventBus.emit('camera-fov-changed', ev.value);
    });
    
    this.controls.set('camera.fov', fovBinding);
    
    eventBus.on('camera-mode-switched', (cameraMode) => {
      fovBinding.disabled = cameraMode !== 'perspective';
    });
    
    const initialMode = config.get('camera.mode') || 'perspective';
    viewButtons.forEach(btn => {
      btn.disabled = initialMode === 'perspective';
    });
    fovBinding.disabled = initialMode !== 'perspective';
    
    this.folders.set('camera', folder);
  }

  _createParticleControls() {
    const folder = this._pane.addFolder({ title: '粒子系统', expanded: false });
    
    const dustColor = folder.addBinding(
      this.tempObjects.dustColor,
      'dustColor',
      { label: '粒子颜色' }
    );
    
    dustColor.on('change', (ev) => {
      this.configData.particles.dustColor = ev.value;
      eventBus.emit('dust-color-changed', ev.value);
    });
    
    this.controls.set('particles.dustColor', dustColor);
    
    const dustSize = folder.addBinding(
      this.configData.particles,
      'dustSize',
      { label: '粒子大小', min: 0.05, max: 1.0, step: 0.01 }
    );
    
    dustSize.on('change', (ev) => {
      eventBus.emit('dust-size-changed', ev.value);
    });
    
    this.controls.set('particles.dustSize', dustSize);
    
    const dustCount = folder.addBinding(
      this.configData.particles,
      'dustCount',
      { label: '粒子数量', min: 500, max: 10000, step: 100 }
    );
    
    dustCount.on('change', (ev) => {
      eventBus.emit('dust-count-changed', ev.value);
    });
    
    this.controls.set('particles.dustCount', dustCount);

    const breathIntensity = folder.addBinding(
      this.configData.particles,
      'breathIntensity',
      { label: '呼吸强度', min: 0, max: 0.5, step: 0.01 }
    );
    
    breathIntensity.on('change', (ev) => {
      eventBus.emit('particle-breath-intensity-changed', ev.value);
    });
    
    this.controls.set('particles.breathIntensity', breathIntensity);

    const floatIntensity = folder.addBinding(
      this.configData.particles,
      'floatIntensity',
      { label: '浮动强度', min: 0, max: 1.0, step: 0.01 }
    );
    
    floatIntensity.on('change', (ev) => {
      eventBus.emit('particle-float-intensity-changed', ev.value);
    });
    
    this.controls.set('particles.floatIntensity', floatIntensity);

    const rotationSpeed = folder.addBinding(
      this.tempObjects.rotationSpeed,
      'rotationSpeed',
      { label: '自转速度', min: -5, max: 5, step: 0.1 }
    );
    
    rotationSpeed.on('change', (ev) => {
      this.configData.particles.rotationSpeed = ev.value;
      eventBus.emit('rotation-speed-changed', ev.value);
    });
    
    this.controls.set('particles.rotationSpeed', rotationSpeed);
    
    const rotationTiltXZ = folder.addBinding(
      this.tempObjects.rotationTiltXZ,
      'rotationTiltXZ',
      { label: '自转倾斜(XZ)', min: -90, max: 90, step: 1 }
    );
    
    rotationTiltXZ.on('change', (ev) => {
      this.configData.particles.rotationTiltXZ = ev.value;
      eventBus.emit('rotation-tilt-xz-changed', ev.value);
    });
    
    this.controls.set('particles.rotationTiltXZ', rotationTiltXZ);
    
    const rotationTiltXY = folder.addBinding(
      this.tempObjects.rotationTiltXY,
      'rotationTiltXY',
      { label: '自转俯仰(XY)', min: -90, max: 90, step: 1 }
    );
    
    rotationTiltXY.on('change', (ev) => {
      this.configData.particles.rotationTiltXY = ev.value;
      eventBus.emit('rotation-tilt-xy-changed', ev.value);
    });
    
    this.controls.set('particles.rotationTiltXY', rotationTiltXY);
    
    const dustOpacity = folder.addBinding(
      this.configData.particles,
      'dustOpacity',
      { label: '透明度', min: 0, max: 1, step: 0.01 }
    );
    
    dustOpacity.on('change', (ev) => {
      eventBus.emit('dust-opacity-changed', ev.value);
    });
    
    this.controls.set('particles.dustOpacity', dustOpacity);
    
    this.folders.set('particles', folder);
  }

  _createPathControls() {
    const folder = this._pane.addFolder({ title: '路径设置', expanded: false });
    
    const pathColor = folder.addBinding(
      this.tempObjects.pathColor,
      'pathColor',
      { label: '路径颜色' }
    );
    
    pathColor.on('change', (ev) => {
      this.configData.environment.pathColor = ev.value;
      eventBus.emit('path-color-changed', ev.value);
    });
    
    this.controls.set('environment.pathColor', pathColor);

    const pathPointColor = folder.addBinding(
      this.tempObjects.pathPointColor,
      'pathPointColor',
      { label: '光点颜色' }
    );
    
    pathPointColor.on('change', (ev) => {
      this.configData.particles.pathPointColor = ev.value;
      eventBus.emit('path-point-color-changed', ev.value);
    });
    
    this.controls.set('particles.pathPointColor', pathPointColor);
    
    const pathPointSize = folder.addBinding(
      this.tempObjects.pathPointSize,
      'pathPointSize',
      { label: '光点大小', min: 0.1, max: 2.0, step: 0.05 }
    );
    
    pathPointSize.on('change', (ev) => {
      this.configData.particles.pathPointSize = ev.value;
      eventBus.emit('path-point-size-changed', ev.value);
    });
    
    this.controls.set('particles.pathPointSize', pathPointSize);
    
    const depthIntensity = folder.addBinding(
      this.tempObjects.depthIntensity,
      'depthIntensity',
      { label: '景深强度', min: 0, max: 1, step: 0.01 }
    );
    
    depthIntensity.on('change', (ev) => {
      this.configData.path.depthIntensity = ev.value;
      eventBus.emit('path-depth-intensity-changed', ev.value);
    });
    
    this.controls.set('path.depthIntensity', depthIntensity);
    
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
        
        eventBus.once('audio-loaded', () => {
          eventBus.emit('audio-toggle');
        });
      } else {
        eventBus.emit('audio-toggle');
      }
    });
    
    eventBus.on('audio-playing', (isPlaying) => {
      playButton.title = isPlaying ? '⏸️ 暂停音乐' : '▶️ 播放音乐';
    });

    const stopButton = folder.addButton({ title: '⏹️ 停止' });
    stopButton.on('click', () => {
      eventBus.emit('audio-stop');
    });

    const volumeObj = { volume: 0.5 };
    const volumeBinding = folder.addBinding(
      volumeObj,
      'volume',
      { label: '音量', min: 0, max: 1, step: 0.01 }
    );
    
    volumeBinding.on('change', (ev) => {
      eventBus.emit('audio-volume-changed', ev.value);
    });
    
    this.folders.set('audio', folder);
  }

  updateBindings() {
    this.tempObjects.dustColor.dustColor = this.configData.particles.dustColor;
    this.tempObjects.pathColor.pathColor = this.configData.environment.pathColor;
    //this.tempObjects.bgColor.bgColor = this.configData.environment.bgColor;
    this.tempObjects.pathPointColor.pathPointColor = this.configData.particles.pathPointColor;
    this.tempObjects.rotationSpeed.rotationSpeed = this.configData.particles.rotationSpeed;
    this.tempObjects.rotationTiltXZ.rotationTiltXZ = this.configData.particles.rotationTiltXZ;
    this.tempObjects.rotationTiltXY.rotationTiltXY = this.configData.particles.rotationTiltXY;
    this.tempObjects.pathPointSize.pathPointSize = this.configData.particles.pathPointSize;
    this.tempObjects.depthIntensity.depthIntensity = this.configData.path.depthIntensity;
    
    const controlsToRefresh = [
      'particles.dustColor',
      'environment.pathColor',
      //'environment.bgColor',
      'particles.pathPointColor',
      'particles.rotationSpeed',
      'particles.rotationTiltXZ',
      'particles.rotationTiltXY',
      'particles.pathPointSize',
      'path.depthIntensity'
    ];
    
    controlsToRefresh.forEach(key => {
      const control = this.controls.get(key);
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    
    logger.debug('UIBasic', '✅ 临时对象已更新并刷新');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIBasic', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    
    this.controls.clear();
    this.folders.clear();
    this.dataControls.forEach(c => c.dispose());
    this.dataControls = [];
    this._isInitialized = false;
    
    logger.info('UIBasic', 'UI 已销毁');
  }

  getPane() {
    return this._pane;
  }

  isInitialized() {
    return this._isInitialized;
  }
}

const uiBasic = new UIBasic();
export default uiBasic;

```

### src/ui/ui-container.js

```javascript
/**
 * @file ui-container.js
 * @description 统一 UI 容器系统 - 左侧可滚动面板
 */
import logger from '../utils/logger.js';

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

### src/ui/ui-coordinates.js

```javascript
/**
 * @file ui-coordinates.js
 * @description 坐标系统 UI 面板 - 缩放控制
 * ✅ 已删除：整体旋转、调试信息按钮
 */
import { Pane } from 'tweakpane';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';
import config from '../config.js';

class UICoordinates {
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
      {
        label: '整体缩放',
        min: 0.1,
        max: 5.0,
        step: 0.1
      }
    );
    
    dataSpaceScale.on('change', (ev) => {
      this.eventBus.emit('dataspace-scale-changed', ev.value);
    });
    
    this.controls.set('coordinates.dataSpace.scale', dataSpaceScale);

    // 粒子系统缩放
    const particleScale = this.pane.addBinding(
      this.configData.particles,
      'systemScale',
      {
        label: '粒子缩放',
        min: 0.1,
        max: 5.0,
        step: 0.1
      }
    );
    
    particleScale.on('change', (ev) => {
      this.eventBus.emit('particle-system-scale-changed', ev.value);
      logger.debug('UICoordinates', `粒子缩放: ${ev.value.toFixed(2)}x`);
    });
    
    this.controls.set('particles.systemScale', particleScale);

    // 路径缩放
    const pathScale = this.pane.addBinding(
      this.configData.path,
      'scale',
      {
        label: '路径缩放',
        min: 0.1,
        max: 3.0,
        step: 0.1
      }
    );
    
    pathScale.on('change', (ev) => {
      this.eventBus.emit('path-scale-changed', ev.value);
      logger.debug('UICoordinates', `路径缩放: ${ev.value.toFixed(2)}x`);
    });
    
    this.controls.set('path.scale', pathScale);

    // 重置按钮
    this.pane.addButton({
      title: '🔄 重置坐标系统'
    }).on('click', () => {
      this.eventBus.emit('coordinate-system-reset');
    });
  }

  _bindEvents() {
    this.eventBus.on('coordinate-system-reset-completed', () => {
      this.pane.refresh();
      logger.info('UICoordinates', '坐标系统 UI 已刷新');
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

### src/ui/ui-material.js

```javascript
/**
 * @file ui-material.js
 * @description 材质辉光控制面板 - 直接绑定到 config._config + 手动更新临时对象
 * ✅ 修复：在 constructor 中获取配置 + 添加 updateBindings() 方法
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIMaterial {
  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    
    // ✅ 在 constructor 中获取配置引用
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIMaterial', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    
    this._pane = new Pane({
      title: '材质辉光',
      expanded: false,
      container: uiContainer.getScrollContent()
    });

    this._createMaterialControls();

    this._isInitialized = true;

    // ✅ 注册到UIRegistry
    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-material', this);
    
    logger.info('UIMaterial', '材质辉光 UI 已初始化(直接绑定)');
  }

  _createMaterialControls() {
    // ========== 路径辉光 ==========
    const pathFolder = this._pane.addFolder({ title: '路径辉光', expanded: true });
    
    const pathEnabled = pathFolder.addBinding(
      this.configData.material.path,
      'enabled',
      { label: '启用' }
    );
    
    pathEnabled.on('change', (ev) => {
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'path', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.path.enabled', pathEnabled);
    
    const pathIntensity = pathFolder.addBinding(
      this.configData.material.path,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    
    pathIntensity.on('change', (ev) => {
      eventBus.emit('material-glow-intensity-changed', { 
        target: 'path', 
        intensity: ev.value 
      });
    });
    
    this.controls.set('material.path.emissiveIntensity', pathIntensity);
    
    // ========== 粒子辉光 ==========
    const particlesFolder = this._pane.addFolder({ title: '粒子辉光', expanded: false });
    
    const particlesEnabled = particlesFolder.addBinding(
      this.configData.material.particles,
      'enabled',
      { label: '启用' }
    );
    
    particlesEnabled.on('change', (ev) => {
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'particles', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.particles.enabled', particlesEnabled);
    
    const particlesIntensity = particlesFolder.addBinding(
      this.configData.material.particles,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 2, step: 0.1 }
    );
    
    particlesIntensity.on('change', (ev) => {
      eventBus.emit('particle-emissive-intensity-changed', ev.value);
    });
    
    this.controls.set('material.particles.emissiveIntensity', particlesIntensity);
    
    // ========== 移动光点辉光 ==========
    const movingLightFolder = this._pane.addFolder({ title: '移动光点辉光', expanded: false });
    
    const movingLightEnabled = movingLightFolder.addBinding(
      this.configData.material.movingLight,
      'enabled',
      { label: '启用' }
    );
    
    movingLightEnabled.on('change', (ev) => {
      eventBus.emit('material-glow-enabled-changed', { 
        target: 'movingLight', 
        enabled: ev.value 
      });
    });
    
    this.controls.set('material.movingLight.enabled', movingLightEnabled);
    
    const movingLightIntensity = movingLightFolder.addBinding(
      this.configData.material.movingLight,
      'emissiveIntensity',
      { label: '发光强度', min: 0, max: 3, step: 0.1 }
    );
    
    movingLightIntensity.on('change', (ev) => {
      eventBus.emit('moving-light-emissive-intensity-changed', ev.value);
    });
    
    this.controls.set('material.movingLight.emissiveIntensity', movingLightIntensity);
  }

  // ✅ 新增：手动更新所有绑定（材质辉光没有临时对象，直接刷新即可）
  updateBindings() {
    // 材质辉光直接绑定到 configData，无需手动更新
    logger.debug('UIMaterial', '绑定检查完成（无临时对象）');
  }

  refresh() {
    this.updateBindings();
    this.controls.forEach((control) => {
      if (control && typeof control.refresh === 'function') {
        control.refresh();
      }
    });
    logger.debug('UIMaterial', 'UI 已刷新');
  }

  dispose() {
    if (this._pane) {
      this._pane.dispose();
      this._pane = null;
    }
    this.controls.clear();
    this._isInitialized = false;
    logger.info('UIMaterial', '材质辉光 UI 已清理');
  }
}

export default new UIMaterial();

```

### src/ui/ui-post.js

```javascript
/**
 * @file ui-post.js
 * @description 后处理效果控制面板 - 直接绑定到 config._config + 手动更新临时对象
 * ✅ 修复：在 constructor 中获取配置 + 添加 updateBindings() 方法
 * 已删除：辉光Bloom组件（已由选择性辉光系统替代）
 */
import eventBus from '../event-bus.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';

class UIPost {
  constructor() {
    this._pane = null;
    this._isInitialized = false;
    this.controls = new Map();
    
    // ✅ 在 constructor 中获取配置引用
    this.configData = config.getRaw();
  }

  async init() {
    if (this._isInitialized) {
      logger.warn('UIPost', 'UI 已初始化');
      return;
    }

    const { Pane } = await import('tweakpane');
    
    this._pane = new Pane({
      title: '后处理效果',
      expanded: false,
      container: uiContainer.getScrollContent()
    });

    this._createPostControls();
    
    this._isInitialized = true;

    // ✅ 注册到UIRegistry
    const uiRegistry = (await import('./ui-registry.js')).default;
    uiRegistry.register('ui-post', this);

    logger.info('UIPost', '后处理 UI 已初始化(直接绑定)');
  }

  _createPostControls() {
    // ========== 色相饱和度 ==========
    const hueFolder = this._pane.addFolder({ title: '色相饱和度', expanded: false });
    
    const hueEnabled = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'enabled',
      { label: '启用' }
    );
    
    hueEnabled.on('change', (ev) => {
      eventBus.emit('hue-saturation-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.enabled', hueEnabled);
    
    const hue = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'hue',
      { label: '色相', min: -1, max: 1, step: 0.01 }
    );
    
    hue.on('change', (ev) => {
      eventBus.emit('hue-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.hue', hue);
    
    const saturation = hueFolder.addBinding(
      this.configData.postprocess.hueSaturation,
      'saturation',
      { label: '饱和度', min: -1, max: 1, step: 0.01 }
    );
    
    saturation.on('change', (ev) => {
      eventBus.emit('saturation-changed', ev.value);
    });
    
    this.controls.set('postprocess.hueSaturation.saturation', saturation);
    
    // ========== 亮度对比度 ==========
    const brightFolder = this._pane.addFolder({ title: '亮度对比度', expanded: false });
    
    const brightEnabled = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'enabled',
      { label: '启用' }
    );
    
    brightEnabled.on('change', (ev) => {
      eventBus.emit('brightness-contrast-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.enabled', brightEnabled);
    
    const brightness = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'brightness',
      { label: '亮度', min: -0.5, max: 0.5, step: 0.01 }
    );
    
    brightness.on('change', (ev) => {
      eventBus.emit('brightness-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.brightness', brightness);
    
    const contrast = brightFolder.addBinding(
      this.configData.postprocess.brightnessContrast,
      'contrast',
      { label: '对比度', min: -0.5, max: 0.5, step: 0.01 }
    );
    
    contrast.on('change', (ev) => {
      eventBus.emit('contrast-changed', ev.value);
    });
    
    this.controls.set('postprocess.brightnessContrast.contrast', contrast);
    
    // ========== 噪点 ==========
    const noiseFolder = this._pane.addFolder({ title: '噪点', expanded: false });
    
    const noiseEnabled = noiseFolder.addBinding(
      this.configData.postprocess.noise,
      'enabled',
      { label: '启用' }
    );
    
    noiseEnabled.on('change', (ev) => {
      eventBus.emit('noise-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.noise.enabled', noiseEnabled);
    
    const noiseIntensity = noiseFolder.addBinding(
      this.configData.postprocess.noise,
      'intensity',
      { label: '强度', min: 0, max: 0.1, step: 0.001 }
    );
    
    noiseIntensity.on('change', (ev) => {
      eventBus.emit('noise-intensity-changed', ev.value);
    });
    
    this.controls.set('postprocess.noise.intensity', noiseIntensity);
    
    // ========== 色差 ==========
    const caFolder = this._pane.addFolder({ title: '色差', expanded: false });
    
    const caEnabled = caFolder.addBinding(
      this.configData.postprocess.chromaticAberration,
      'enabled',
      { label: '启用' }
    );
    
    caEnabled.on('change', (ev) => {
      eventBus.emit('chromatic-aberration-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.chromaticAberration.enabled', caEnabled);
    
    // const caOffsetX = caFolder.addBinding(
    //   this.configData.postprocess.chromaticAberration,
    //   'offsetX',
    //   { label: 'X偏移', min: 0, max: 0.02, step: 0.001 }
    // );
    
    // caOffsetX.on('change', (ev) => {
    //   eventBus.emit('chromatic-aberration-offset-changed', {
    //     x: ev.value,
    //     y: this.configData.postprocess.chromaticAberration.offsetY
    //   });
    // });
    
    // this.controls.set('postprocess.chromaticAberration.offsetX', caOffsetX);
    
    // const caOffsetY = caFolder.addBinding(
    //   this.configData.postprocess.chromaticAberration,
    //   'offsetY',
    //   { label: 'Y偏移', min: 0, max: 0.02, step: 0.001 }
    // );
    
    // caOffsetY.on('change', (ev) => {
    //   eventBus.emit('chromatic-aberration-offset-changed', {
    //     x: this.configData.postprocess.chromaticAberration.offsetX,
    //     y: ev.value
    //   });
    // });
    
    // this.controls.set('postprocess.chromaticAberration.offsetY', caOffsetY);
    
    // ========== 扫描线 ==========
    const scanFolder = this._pane.addFolder({ title: '扫描线', expanded: false });
    
    const scanEnabled = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'enabled',
      { label: '启用' }
    );
    
    scanEnabled.on('change', (ev) => {
      eventBus.emit('scanline-enabled-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.enabled', scanEnabled);
    
    const scanIntensity = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'intensity',
      { label: '强度', min: 0, max: 1, step: 0.01 }
    );
    
    scanIntensity.on('change', (ev) => {
      eventBus.emit('scanline-intensity-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.intensity', scanIntensity);
    
    const scanDensity = scanFolder.addBinding(
      this.configData.postprocess.scanline,
      'density',
      { label: '密度', min: 10, max: 500, step: 0.1 }
    );
    
    scanDensity.on('change', (ev) => {
      eventBus.emit('scanline-density-changed', ev.value);
    });
    
    this.controls.set('postprocess.scanline.density', scanDensity);
  }

  // ✅ 新增：手动更新所有绑定（后处理也是直接绑定，无需手动更新）
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
    logger.info('UIPost', '后处理 UI 已清理');
  }
}

export default new UIPost();

```

### src/ui/ui-presets.js

```javascript
/**
 * @file ui-presets.js
 * @description 预设系统UI - 手动加载 + 保持UI顺序 + 手动更新绑定
 * ✅ 修复：在预设加载后调用所有 UI 的 updateBindings() 方法
 */
import { Pane } from 'tweakpane';
import eventBus from '../event-bus.js';
import presetManager from '../preset-manager.js';
import config from '../config.js';
import logger from '../utils/logger.js';
import uiContainer from './ui-container.js';
import uiBasic from './ui-basic.js';
import uiMaterial from './ui-material.js';
import uiPost from './ui-post.js';
import uiCoordinates from './ui-coordinates.js';

class UIPresets {
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
      logger.error('UIPresets', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createControls() {
    const presets = presetManager.getAvailablePresets();
    
    const presetOptions = {};
    presets.forEach(preset => {
      presetOptions[preset.name] = preset.name;
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

    this.presetSelector.on('change', (ev) => {
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
        alert(`保存失败: ${err.message}`);
      }
    });
  }

  _loadPreset(presetName) {
    try {
      logger.info('UIPresets', `开始加载预设: ${presetName}`);
      
      presetManager.loadPreset(presetName)
        .then(() => {
          logger.info('UIPresets', `预设已加载: ${presetName}`);
        })
        .catch(err => {
          alert(`加载预设失败: ${err.message}`);
          logger.error('UIPresets', `加载失败: ${err.message}`);
        });
    } catch (err) {
      alert(`加载预设失败: ${err.message}`);
    }
  }

  _restoreDefaults() {
    try {
      logger.info('UIPresets', '开始恢复默认配置...');
      
      config.reset();
      this._emitDefaultEvents();
      this._refreshAllUI();
      
      logger.info('UIPresets', '✅ 已恢复默认配置');
    } catch (err) {
      logger.error('UIPresets', `恢复默认失败: ${err.message}`);
      alert(`恢复默认失败: ${err.message}`);
    }
  }

  _emitDefaultEvents() {
    const cfg = config.getRaw();
    
    eventBus.emit('dust-color-changed', cfg.particles.dustColor);
    eventBus.emit('dust-size-changed', cfg.particles.dustSize);
    eventBus.emit('dust-opacity-changed', cfg.particles.dustOpacity);
    eventBus.emit('dust-count-changed', cfg.particles.dustCount);
    eventBus.emit('particle-system-scale-changed', cfg.particles.systemScale);
    eventBus.emit('particle-breath-intensity-changed', cfg.particles.breathIntensity);
    eventBus.emit('particle-float-intensity-changed', cfg.particles.floatIntensity);
    eventBus.emit('rotation-speed-changed', cfg.particles.rotationSpeed);
    eventBus.emit('rotation-tilt-xz-changed', cfg.particles.rotationTiltXZ);
    eventBus.emit('rotation-tilt-xy-changed', cfg.particles.rotationTiltXY);
    eventBus.emit('path-point-color-changed', cfg.particles.pathPointColor);
    eventBus.emit('path-point-size-changed', cfg.particles.pathPointSize);
    eventBus.emit('path-scale-changed', cfg.path.scale);
    eventBus.emit('path-depth-intensity-changed', cfg.path.depthIntensity);
    eventBus.emit('bg-color-changed', cfg.environment.bgColor);
    eventBus.emit('path-color-changed', cfg.environment.pathColor);
    eventBus.emit('material-glow-enabled-changed', { target: 'path', enabled: cfg.material.path.enabled });
    eventBus.emit('material-glow-intensity-changed', { target: 'path', intensity: cfg.material.path.emissiveIntensity });
    eventBus.emit('material-glow-enabled-changed', { target: 'particles', enabled: cfg.material.particles.enabled });
    eventBus.emit('particle-emissive-intensity-changed', cfg.material.particles.emissiveIntensity);
    eventBus.emit('material-glow-enabled-changed', { target: 'movingLight', enabled: cfg.material.movingLight.enabled });
    eventBus.emit('dataspace-scale-changed', cfg.coordinates.dataSpace.scale);
    ['x', 'y', 'z'].forEach(axis => {
      eventBus.emit('dataspace-rotation-changed', { 
        axis, 
        angle: cfg.coordinates.dataSpace.rotation[axis] 
      });
    });
    eventBus.emit('dataspace-position-changed', cfg.coordinates.dataSpace.position);
    eventBus.emit('bloom-intensity-changed', cfg.postprocess.bloom.intensity);
    eventBus.emit('bloom-smoothing-changed', cfg.postprocess.bloom.smoothing);
    eventBus.emit('hue-saturation-enabled-changed', cfg.postprocess.hueSaturation.enabled);
    eventBus.emit('brightness-contrast-enabled-changed', cfg.postprocess.brightnessContrast.enabled);
    eventBus.emit('noise-enabled-changed', cfg.postprocess.noise.enabled);
    eventBus.emit('chromatic-aberration-enabled-changed', cfg.postprocess.chromaticAberration.enabled);
    eventBus.emit('scanline-enabled-changed', cfg.postprocess.scanline.enabled);
    eventBus.emit('camera-mode-changed', cfg.camera.mode);
    eventBus.emit('camera-fov-changed', cfg.camera.fov);
    eventBus.emit('animation-speed-changed', cfg.animation.speedFactor);
    eventBus.emit('animation-loop-changed', cfg.animation.loop);
    
    logger.debug('UIPresets', '默认事件已全部触发');
  }

  _bindEvents() {
    eventBus.on('preset-loaded', () => {
      // ✅ 核心修复：先调用 updateBindings()，再刷新 Pane
      this._updateAllBindings();
      this._refreshAllPanes();
    });
  }

  /**
   * ✅ 核心方法：手动更新所有 UI 模块的临时对象
   */
  _updateAllBindings() {
    logger.info('UIPresets', '开始更新所有UI绑定...');

    const uiModules = [
      { module: uiBasic, name: 'uiBasic' },
      { module: uiMaterial, name: 'uiMaterial' },
      { module: uiPost, name: 'uiPost' },
      { module: uiCoordinates, name: 'uiCoordinates' }
    ];

    uiModules.forEach(({ module, name }) => {
      if (module && typeof module.updateBindings === 'function') {
        module.updateBindings();
        logger.debug('UIPresets', `${name} 绑定已更新`);
      }
    });

    logger.info('UIPresets', '✅ 所有UI绑定已更新');
  }

  /**
 * ✅ 正确的刷新逻辑：先更新绑定，再刷新控件，最后刷新 Pane
 */
_refreshAllPanes() {
  logger.info('UIPresets', '开始刷新所有UI面板...');

  const uiModules = [
    { module: uiBasic, name: 'uiBasic' },
    { module: uiMaterial, name: 'uiMaterial' },
    { module: uiPost, name: 'uiPost' },
    { module: uiCoordinates, name: 'uiCoordinates' }
  ];

  uiModules.forEach(({ module, name }) => {
    // 1. 刷新所有控件
    if (module && module.controls) {
      module.controls.forEach((control) => {
        if (control && typeof control.refresh === 'function') {
          control.refresh();
        }
      });
    }
    
    // 2. 刷新 Pane 本身
    if (module && module._pane && typeof module._pane.refresh === 'function') {
      module._pane.refresh();
    } else if (module && module.pane && typeof module.pane.refresh === 'function') {
      module.pane.refresh();
    }
    
    logger.debug('UIPresets', `${name} 已刷新`);
  });

  logger.info('UIPresets', '✅ 所有UI已刷新');
}

  /**
   * 仅在恢复默认时使用（完全重建）
   */
  async _refreshAllUI() {
    logger.info('UIPresets', '开始重建所有UI...');

    const uiModules = [
      { module: uiBasic, name: 'uiBasic' },
      { module: uiMaterial, name: 'uiMaterial' },
      { module: uiPost, name: 'uiPost' },
      { module: uiCoordinates, name: 'uiCoordinates' }
    ];

    for (const { module, name } of uiModules) {
      if (module && typeof module.dispose === 'function') {
        module.dispose();
        logger.debug('UIPresets', `${name} 已销毁`);
      }

      if (module && typeof module.init === 'function') {
        await module.init({ eventBus });
        logger.debug('UIPresets', `${name} 已重建`);
      }
    }

    logger.info('UIPresets', '✅ 所有UI已重建');
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

### src/ui/ui-registry.js

```javascript
/**
 * @file ui-registry.js
 * @description UI模块注册中心 - 避免循环依赖 + 自动追踪控件
 */
import logger from '../utils/logger.js';

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

### src/utils/logger.js

```javascript
/**
 * @file logger.js
 * @description 日志工具 - 统一日志输出
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS.INFO;
    this.enableTimestamp = true;
  }

  setLevel(level) {
    if (LOG_LEVELS[level.toUpperCase()] !== undefined) {
      this.level = LOG_LEVELS[level.toUpperCase()];
    }
  }

  _format(level, module, message) {
    const timestamp = this.enableTimestamp 
      ? `[${new Date().toISOString().slice(11, 23)}]` 
      : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }

  debug(module, message) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(
        `%c${this._format('DEBUG', module, message)}`,
        'color: #888'
      );
    }
  }

  info(module, message) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(
        `%c${this._format('INFO', module, message)}`,
        'color: #4a9eff'
      );
    }
  }

  warn(module, message) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(
        `%c${this._format('WARN', module, message)}`,
        'color: #ff9800'
      );
    }
  }

  error(module, message) {
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

const DEFAULT_EXT = '.js,.mjs,.json,.css,.html';
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
