/**
 * @file postprocess-sys.ts
 * @description 后处理系统
 * @version 8.0 (Refactor)
 * @✨ 重构: 将所有效果合并到一个EffectPass中，提升性能与稳定性。
 * @✨ 重构: 优化了相机更新逻辑，避免销毁和重建composer。
 * @🔧 修正: 保留并稳定了基于TextureEffect的扫描线实现。
 * @🔧 清理: 移除了过时的注释和逻辑。
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
      this.updateAllEffectsFromConfig();

      this.initialized = true;
      logger.info('PostprocessSystem', '✅ 后处理系统初始化完成 (v8.1 Fix)');
      return this;
    } catch (err) {
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

    this.composer = new EffectComposer(this.renderer, {
      frameBufferType: THREE.UnsignedByteType
    });
    
    this.composer.setSize(window.innerWidth, window.innerHeight);

    // 1. 基础渲染通道，必须是第一个
    const renderPass = new RenderPass(this.mainScene, this.camera);
    this.composer.addPass(renderPass);

    // 2. 创建所有效果实例
    this._createAllEffects();
    
    // ✅ 核心修正：将冲突的效果分离到不同的 EffectPass 中，无冲突的合并
    if (this.bloomEffect) {
        this.composer.addPass(new EffectPass(this.camera, this.bloomEffect));
    }
    if (this.bokehEffect) {
        this.composer.addPass(new EffectPass(this.camera, this.bokehEffect));
    }
    
    // 将剩余的、无冲突的效果合并到一个 Pass 中以优化性能
    const remainingEffects = [
        this.chromaticAberrationEffect, // 色差与后面的效果无冲突
        this.filmEffect,
        this.scanlineEffect,
        this.brightnessContrastEffect
    ].filter(Boolean); // 过滤掉可能为null的效果

    if (remainingEffects.length > 0) {
        const finalPass = new EffectPass(this.camera as THREE.Camera, ...remainingEffects);
        this.composer!.addPass(finalPass);
    }
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
    this.filmEffect = new NoiseEffect({ blendFunction: BlendFunction.SOFT_LIGHT });
    this.brightnessContrastEffect = new BrightnessContrastEffect();
    
    this._createScanlineEffect();
  }

  private _createScanlineEffect() {
    // 创建一个 1x2 像素的纹理，上半部分白色，下半部分黑色
    const data = new Uint8Array([ 255, 255, 255, 255, 0, 0, 0, 255 ]);
    const texture = new THREE.DataTexture(data, 1, 2, THREE.RGBAFormat);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    this.scanlineTexture = texture;

    this.scanlineEffect = new TextureEffect({
      blendFunction: BlendFunction.OVERLAY,
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
            this.composer.passes.forEach(pass => {
                if (pass instanceof EffectPass) pass.mainCamera = camera;
                if (pass instanceof RenderPass) pass.camera = camera;
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
          this.bokehEffect.blendMode.blendFunction = cfg.enabled ? BlendFunction.NORMAL : BlendFunction.SKIP;
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
            this.scanlineTexture.repeat.y = Math.max(1, Math.floor(cfg.scanlineCount / 2));
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
        Object.keys(postprocessConfig).forEach(key => {
            if (key !== 'enabled') {
                this.updateEffectFromConfig(`postprocess.${key}`);
            }
        });
    }
  }

  handleResize() {
    this.composer?.setSize(window.innerWidth, window.innerHeight);
    this.updateEffectFromConfig('postprocess.film');
  }

  dispose() {
    this.composer?.dispose();
    this.scanlineTexture?.dispose();
    this.initialized = false;
  }
}

const postprocessSys = new PostprocessSystem();
export default postprocessSys;
