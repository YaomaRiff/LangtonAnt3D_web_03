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
