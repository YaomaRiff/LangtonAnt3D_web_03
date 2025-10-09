/**
 * @file postprocess-sys.ts
 * @description 后处理系统 - 全面采用 "postprocessing" 库
 * @version 2.2
 * @🔧 修正: 彻底修复了因 BokehEffect 未配置导致的 WebGL uniform2fv 渲染崩溃问题。
 * @✨ 完善: 实现了 Bokeh (景深) 和 Film (噪点强度) 效果的参数更新逻辑。
 * @♻️ 重构: 简化了效果启用/禁用的逻辑，直接在各自的更新代码块中处理。
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
  private filmEffect: NoiseEffect | null = null; // 胶片颗粒效果
  private scanlineEffect: TextureEffect | null = null; // 扫描线效果
  private scanlineTexture: THREE.DataTexture | null = null;
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
      logger.info('PostprocessSystem', '✅ 后处理系统初始化完成 (v2.2)');
      return this;
    } catch (err) {
      logger.error('PostprocessSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  // API: 外部系统通过此方法注册辉光对象
  addGlowObject(object: THREE.Object3D) {
    this.selection.add(object);
    logger.debug('PostprocessSystem', `对象 "${object.name}" 已添加到光晕选择集`);
  }

  // API: 外部系统通过此方法移除辉光对象
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

    // 2. 创建所有效果实例
    this._createAllEffects();
    
    // 3. 将每个效果放入独立的 EffectPass，避免合并冲突
    const addEffectPass = (effect: any) => {
      if (effect) {
        const pass = new EffectPass(this.camera as THREE.Camera, effect);
        this.composer!.addPass(pass);
      }
    };

    addEffectPass(this.bloomEffect);
    addEffectPass(this.bokehEffect);
    addEffectPass(this.chromaticAberrationEffect);
    addEffectPass(this.dotScreenEffect);
    addEffectPass(this.filmEffect);
    addEffectPass(this.scanlineEffect);
    addEffectPass(this.hueSaturationEffect);
    addEffectPass(this.brightnessContrastEffect);
  }
  
  private _createAllEffects() {
    this.bloomEffect = new SelectiveBloomEffect(this.mainScene as any, this.camera as any, {
      blendFunction: BlendFunction.ADD,
      selection: this.selection,
      mipmapBlur: true,
    } as any);
    
    this.bokehEffect = new BokehEffect({
        focus: 40.0,
        dof: 0.02,
        aperture: 0.025,
        maxBlur: 0.01
    });
    this.chromaticAberrationEffect = new ChromaticAberrationEffect();
    this.dotScreenEffect = new DotScreenEffect({ blendFunction: BlendFunction.OVERLAY });
    this.filmEffect = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT });
    this.hueSaturationEffect = new HueSaturationEffect();
    this.brightnessContrastEffect = new BrightnessContrastEffect();
    
    // Scanline 是一个特殊处理
    this._createScanlineEffect();
  }

  private _createScanlineEffect() {
    const data = new Uint8Array([ 255, 255, 255, 255, 0, 0, 0, 255 ]); // 1x2 像素，上白下黑
    const texture = new THREE.DataTexture(data, 1, 2, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    this.scanlineTexture = texture;

    this.scanlineEffect = new TextureEffect({
      blendFunction: BlendFunction.SOFT_LIGHT,
      texture
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
            // 当相机切换时，需要重建 composer 和所有 Pass
            this.composer.dispose();
            this.composer = null;
            this._createComposer();
            this.updateAllEffectsFromConfig();
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

      // ✅ [核心修复] 实现了景深效果的参数更新
      case 'bokeh':
        if (this.bokehEffect) {
          this.bokehEffect.focus = cfg.focus;
          this.bokehEffect.dof = cfg.dof;
          this.bokehEffect.aperture = cfg.aperture;
          this.bokehEffect.maxBlur = cfg.maxBlur;
          // 景深效果的启用/禁用是通过将其混合函数设为 SKIP 来实现的，这样可以完全跳过其计算
          this.bokehEffect.blendMode.blendFunction = cfg.enabled ? BlendFunction.NORMAL : BlendFunction.SKIP;
        }
        break;
        
      case 'chromaticAberration':
        if (this.chromaticAberrationEffect) {
            this.chromaticAberrationEffect.offset.set(cfg.offset.x, cfg.offset.y);
            this.chromaticAberrationEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
        }
        break;
        
      case 'dotScreen':
        if (this.dotScreenEffect) {
            this.dotScreenEffect.uniforms.get('angle')!.value = cfg.angle;
            this.dotScreenEffect.uniforms.get('scale')!.value = cfg.scale;
            this.dotScreenEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
        }
        break;

      // ✅ [功能完善] 实现了噪点和扫描线的独立控制
      case 'film':
        const filmEnabled = cfg.enabled;
        if (this.filmEffect) { // Noise
            this.filmEffect.blendMode.opacity.value = filmEnabled ? cfg.noiseIntensity : 0.0;
        }
        if (this.scanlineEffect && this.scanlineTexture) { // Scanline
            this.scanlineEffect.blendMode.opacity.value = filmEnabled ? cfg.scanlineIntensity : 0.0;
            const screenHeight = this.renderer?.getDrawingBufferSize(new THREE.Vector2()).height ?? 1080;
            // 根据屏幕高度和配置的 scanlineCount 动态调整纹理重复次数
            this.scanlineTexture.repeat.y = Math.max(1, Math.floor(cfg.scanlineCount / 2));
        }
        break;
        
      case 'hueSaturation':
          if (this.hueSaturationEffect) {
              this.hueSaturationEffect.uniforms.get('hue')!.value = cfg.hue;
              this.hueSaturationEffect.uniforms.get('saturation')!.value = cfg.saturation;
              this.hueSaturationEffect.blendMode.opacity.value = cfg.enabled ? 1.0 : 0.0;
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
        Object.keys(postprocessConfig).forEach(key => {
            this.updateEffectFromConfig(`postprocess.${key}`);
        });
    }
  }

  handleResize() {
    this.composer?.setSize(window.innerWidth, window.innerHeight);
    // 更新扫描线数量以适应新的分辨率
    this.updateEffectFromConfig('postprocess.film');
    logger.debugThrottled('PostprocessSystem', 'postprocess-resize', '后处理已调整大小', 1000);
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
