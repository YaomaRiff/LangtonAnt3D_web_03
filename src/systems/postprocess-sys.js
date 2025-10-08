/**
 * @file postprocess-sys.js
 * @description 后处理系统 - 选择性辉光 + 色相 + 噪点等效果
 * ✅ 最终修复: 采用直接依赖注入相机对象，移除所有复杂的就绪检查。
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import logger from '../utils/logger.js';
import config from '../config.js';

class PostprocessSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.camera = null; // ✅ 直接存储相机对象
    this.renderer = null;
    this.initialized = false;
    this.composer = null;
    this.renderPass = null;
    
    // 以下属性保持不变
    this.glowRenderTarget = null;
    this.glowScene = null;
    this.glowMaterial = null;
    this.glowCombinePass = null;
    this.hueSaturationPass = null;
    this.brightnessContrastPass = null;
    this.noisePass = null;
    this.chromaticAberrationPass = null;
    this.scanlinePass = null;
  }

  // ✅ [修改] init 方法大幅简化
  init({ eventBus, scene, camera, renderer }) {
    if (this.initialized) return this;
    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.renderer = renderer;
      this.camera = camera; // ✅ 直接接收并存储相机对象

      if (!this.camera) {
        throw new Error('相机对象未提供，无法初始化后处理系统');
      }

      this._createComposer();
      this._createSelectiveGlow();
      this._createPasses();
      this._bindEvents();

      this.initialized = true;
      logger.info('PostprocessSystem', '后处理系统初始化完成');
      return this;
    } catch (err) {
      logger.error('PostprocessSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  // ✅ [修改] _createComposer 使用存储的相机对象
  _createComposer() {
    this.composer = new EffectComposer(this.renderer);
    // ✅ 直接使用 this.camera，不再需要函数调用
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
  }
  
  // ✅ [修改] render 方法大幅简化
  render(delta) {
    if (!this.composer || !config.get('postprocess.enabled')) return;

    // 辉光层现在由一个全局开关控制
    const bloomEnabled = config.get('postprocess.bloom.enabled') ?? true;
    if (this.glowCombinePass && bloomEnabled) {
      this._renderGlowLayer();
    }
    
    if (this.noisePass && this.noisePass.enabled) this.noisePass.uniforms.time.value += delta;
    if (this.scanlinePass && this.scanlinePass.enabled) this.scanlinePass.uniforms.time.value += delta;

    this.composer.render(delta);
  }

  // --- 以下方法保持不变，无需修改 ---
  
  _createSelectiveGlow() {
    const { innerWidth: width, innerHeight: height } = window;
    this.glowRenderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat
    });
    this.glowScene = new THREE.Scene();
    this.glowMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false });

    const bloomEnabled = config.get('postprocess.bloom.enabled') ?? true;

    this.glowCombinePass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        tGlow: { value: this.glowRenderTarget.texture },
        glowIntensity: { value: 1.0 },
        resolution: { value: new THREE.Vector2(1 / width, 1 / height) },
        blurSize: { value: 2.0 }
      },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform sampler2D tGlow; uniform float glowIntensity;
        uniform vec2 resolution; uniform float blurSize; varying vec2 vUv;
        void main() {
          vec4 base = texture2D(tDiffuse, vUv); vec4 glow = vec4(0.0); float total = 0.0;
          for(float x = -2.0; x <= 2.0; x++) { for(float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * resolution * blurSize;
            glow += texture2D(tGlow, vUv + offset); total += 1.0;
          }}
          glow /= total;
          gl_FragColor = base + glow * glowIntensity;
        }`
    });
    this.glowCombinePass.enabled = bloomEnabled;
    this.composer.addPass(this.glowCombinePass);
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
      uniforms: { tDiffuse: { value: null }, hue: { value: hsConfig.hue }, saturation: { value: hsConfig.saturation } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float hue; uniform float saturation; varying vec2 vUv;
        vec3 rgb2hsv(vec3 c) { vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0); vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g)); vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r)); float d = q.x - min(q.w, q.y); float e = 1.0e-10; return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x); }
        vec3 hsv2rgb(vec3 c) { vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0); vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); }
        void main() { vec4 texel = texture2D(tDiffuse, vUv); vec3 hsv = rgb2hsv(texel.rgb); hsv.x = fract(hsv.x + hue); hsv.y = clamp(hsv.y * (1.0 + saturation), 0.0, 1.0); gl_FragColor = vec4(hsv2rgb(hsv), texel.a); }`
    });
    this.hueSaturationPass.enabled = hsConfig.enabled; this.composer.addPass(this.hueSaturationPass);
  }

  _createBrightnessContrastPass() {
    const bcConfig = config.get('postprocess.brightnessContrast');
    this.brightnessContrastPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, brightness: { value: bcConfig.brightness }, contrast: { value: bcConfig.contrast } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float brightness; uniform float contrast; varying vec2 vUv;
        void main() { vec4 texel = texture2D(tDiffuse, vUv); vec3 color = texel.rgb; color += brightness; color = (color - 0.5) * (1.0 + contrast) + 0.5; gl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a); }`
    });
    this.brightnessContrastPass.enabled = bcConfig.enabled; this.composer.addPass(this.brightnessContrastPass);
  }

  _createNoisePass() {
    const noiseConfig = config.get('postprocess.noise');
    this.noisePass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, intensity: { value: noiseConfig.intensity }, time: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float intensity; uniform float time; varying vec2 vUv;
        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
        void main() { vec4 texel = texture2D(tDiffuse, vUv); float noise = random(vUv + time) * intensity; gl_FragColor = vec4(texel.rgb + noise, texel.a); }`
    });
    this.noisePass.enabled = noiseConfig.enabled; this.composer.addPass(this.noisePass);
  }

  _createChromaticAberrationPass() {
    const caConfig = config.get('postprocess.chromaticAberration');
    this.chromaticAberrationPass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, offsetX: { value: caConfig.offsetX || 0.002 }, offsetY: { value: caConfig.offsetY || 0.002 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float offsetX; uniform float offsetY; varying vec2 vUv;
        void main() { vec2 offset = vec2(offsetX, offsetY); vec2 uvR = clamp(vUv + offset, 0.0, 1.0); vec2 uvB = clamp(vUv - offset, 0.0, 1.0); float r = texture2D(tDiffuse, uvR).r; float g = texture2D(tDiffuse, vUv).g; float b = texture2D(tDiffuse, uvB).b; float a = texture2D(tDiffuse, vUv).a; gl_FragColor = vec4(r, g, b, a); }`
    });
    this.chromaticAberrationPass.enabled = caConfig.enabled; this.composer.addPass(this.chromaticAberrationPass);
  }
  
  _createScanlinePass() {
    const slConfig = config.get('postprocess.scanline');
    this.scanlinePass = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, intensity: { value: slConfig.intensity }, density: { value: slConfig.density }, time: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tDiffuse; uniform float intensity; uniform float density; uniform float time; varying vec2 vUv;
        void main() { vec4 texel = texture2D(tDiffuse, vUv); float scanline = sin((vUv.y * density + time * 0.5) * 6.28318530718) * intensity; gl_FragColor = vec4(texel.rgb * (1.0 - scanline * 0.5), texel.a); }`
    });
    this.scanlinePass.enabled = slConfig.enabled; this.composer.addPass(this.scanlinePass);
  }

  _bindEvents() {
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
    this.eventBus.on('camera-changed', (camera) => {
      if (this.renderPass) {
        this.renderPass.camera = camera;
        this.camera = camera; // 同步内部引用
      }
    });
  }
  
  _handleConfigChange({ key, value }) {
    if (!key.startsWith('postprocess.')) return;
    const parts = key.split('.');
    if (parts.length < 3) return;
    const effectName = parts[1];
    const property = parts[2];
    
    switch (effectName) {
      case 'bloom':
        if (this.glowCombinePass) {
          if (property === 'enabled') this.glowCombinePass.enabled = value;
          else if (property === 'intensity') this.glowCombinePass.uniforms.glowIntensity.value = value;
          else if (property === 'smoothing') this.glowCombinePass.uniforms.blurSize.value = value;
        }
        break;
      case 'hueSaturation':
        if (property === 'enabled') this.hueSaturationPass.enabled = value;
        else if (property === 'hue') this.hueSaturationPass.uniforms.hue.value = value;
        else if (property === 'saturation') this.hueSaturationPass.uniforms.saturation.value = value;
        break;
      case 'brightnessContrast':
        if (property === 'enabled') this.brightnessContrastPass.enabled = value;
        else if (property === 'brightness') this.brightnessContrastPass.uniforms.brightness.value = value;
        else if (property === 'contrast') this.brightnessContrastPass.uniforms.contrast.value = value;
        break;
      case 'noise':
        if (property === 'enabled') this.noisePass.enabled = value;
        else if (property === 'intensity') this.noisePass.uniforms.intensity.value = value;
        break;
      case 'chromaticAberration':
        if (property === 'enabled') this.chromaticAberrationPass.enabled = value;
        else if (property === 'offsetX') this.chromaticAberrationPass.uniforms.offsetX.value = value;
        else if (property === 'offsetY') this.chromaticAberrationPass.uniforms.offsetY.value = value;
        break;
      case 'scanline':
        if (property === 'enabled') this.scanlinePass.enabled = value;
        else if (property === 'intensity') this.scanlinePass.uniforms.intensity.value = value;
        else if (property === 'density') this.scanlinePass.uniforms.density.value = value;
        break;
    }
  }

  _renderGlowLayer() {
    if (!this.camera) return;
    while (this.glowScene.children.length > 0) { this.glowScene.remove(this.glowScene.children[0]); }
    this.scene.traverse((obj) => {
      if (!obj.userData || !obj.userData.glow || !obj.visible) return;
      if (obj.isLine && obj.material && obj.material.isShaderMaterial) {
        const originalMaterial = obj.material;
        if (originalMaterial.uniforms.uEmissive && originalMaterial.uniforms.uEmissiveIntensity) {
          const emitColor = originalMaterial.uniforms.uEmissive.value.clone();
          const emitIntensity = originalMaterial.uniforms.uEmissiveIntensity.value;
          const glowLineMat = new THREE.LineBasicMaterial({ color: emitColor, transparent: true, opacity: Math.min(1.0, emitIntensity * 2.0), depthWrite: false, blending: THREE.AdditiveBlending });
          const lineClone = new THREE.Line(obj.geometry, glowLineMat);
          lineClone.matrix.copy(obj.matrixWorld); lineClone.matrixAutoUpdate = false; this.glowScene.add(lineClone);
        }
      } else if (obj.type === 'Points' || obj instanceof THREE.Points) {
        const origMat = obj.material; const userEmissive = origMat?.userData?.emissive; const emissiveIntensity = origMat?.userData?.emissiveIntensity || 1.0;
        let color = new THREE.Color(0xffffff);
        if (userEmissive) { color.set(userEmissive); } else if (origMat?.color) { color.copy(origMat.color); }
        const glowPointMat = new THREE.PointsMaterial({ color: color, size: origMat?.size ?? 1.0, transparent: true, opacity: Math.min(1.0, emissiveIntensity), depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
        const pointsClone = new THREE.Points(obj.geometry, glowPointMat);
        pointsClone.matrix.copy(obj.matrixWorld); pointsClone.matrixAutoUpdate = false; this.glowScene.add(pointsClone);
      } else if (obj.isMesh || obj instanceof THREE.Mesh) {
        const originalMaterial = obj.material;
        let emitColor = new THREE.Color(0xffffff);
        if (originalMaterial?.userData?.emissive) { emitColor.set(originalMaterial.userData.emissive); }
        else if (originalMaterial?.emissive) { emitColor.copy(originalMaterial.emissive); }
        else if (originalMaterial?.color) { emitColor.copy(originalMaterial.color); }
        const emitIntensity = originalMaterial?.emissiveIntensity || 1.0;
        const mat = this.glowMaterial.clone();
        mat.color.copy(emitColor); mat.opacity = Math.min(1.0, emitIntensity); mat.blending = THREE.AdditiveBlending;
        const meshClone = new THREE.Mesh(obj.geometry, mat);
        meshClone.matrix.copy(obj.matrixWorld); meshClone.matrixAutoUpdate = false; this.glowScene.add(meshClone);
      }
    });
    this.renderer.setRenderTarget(this.glowRenderTarget); this.renderer.clear();
    this.renderer.render(this.glowScene, this.camera); this.renderer.setRenderTarget(null);
    if (this.glowCombinePass) { this.glowCombinePass.uniforms.tGlow.value = this.glowRenderTarget.texture; }
  }
  
  handleResize() {
    const { innerWidth: width, innerHeight: height } = window;
    this.composer.setSize(width, height);
    if (this.glowRenderTarget) this.glowRenderTarget.setSize(width, height);
    if (this.glowCombinePass) this.glowCombinePass.uniforms.resolution.value.set(1 / width, 1 / height);
    logger.debug('PostprocessSystem', '后处理已调整大小');
  }

  dispose() {
    if (this.composer) this.composer.dispose();
    if (this.glowRenderTarget) this.glowRenderTarget.dispose();
    this.initialized = false;
    logger.info('PostprocessSystem', '后处理系统已销毁');
  }
}

const postprocessSys = new PostprocessSystem();
export default postprocessSys;
