/**
 * @file types/index.ts
 * @description 全局类型定义
 */

import * as THREE from 'three';

// 基础类型定义
export type EventHandler<T = unknown> = (...args: T[]) => void;

// 配置对象结构
export interface SceneComposition {
  type: 'math-path' | 'math-light' | 'particle-dust' | 'model-light';
  enabled: boolean;
  name?: string;
  path?: string;
}

// 完整的配置类型
export interface AppConfig {
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
    isPlaying?: boolean;
    currentStep?: number;
  };
  coordinates: {
    dataSpace: {
      scale: number;
      rotation: { x: number; y: number; z: number };
      position: { x: number; y: number; z: number };
    };
  };
  material: {
    path: {
      emissiveColor: string;
    };
    particles: {
      emissiveColor: string;
    };
    movingLight: {
      emissiveColor: string;
    };
  };
  lighting: {
    ambient: {
      color: string;
      intensity: number;
    };
    directional: {
      color: string;
      intensity: number;
      position: { x: number; y: number; z: number };
    };
  };
  path: {
    depthIntensity: number;
    depthEnhanced: boolean;
    scale: number;
  };
  environment: {
    skybox: {
      enabled: boolean;
      path: string;
    };
    fogDensity: number;
    fogVolumeScale: number;
    pathFogIntensity: number;
    pathColor: string;
    dustColor: string;
    positionScale: number;
    yScale: number;
    cameraDistFactor: number;
    ambientLightIntensity: number;
    directionalLightIntensity: number;
  };
  visualEffects: {
    rocketJitter: {
      enabled: boolean;
      runOnReady: boolean;
    };
    flameJitter: {
      enabled: boolean;
      runOnReady: boolean;
    };
    exhaustFlame: {
      enabled: boolean;
      runOnReady: boolean;
    };
  };
  camera: {
    mode: 'perspective' | 'orthographic';
    view?: string;
    fov?: number;
    initialDistance?: number;
    autoRotate?: boolean;
    near?: number;
    far?: number;
    controls: {
      enabled?: boolean;
      dollySpeed?: number;
      truckSpeed?: number;
      smoothTime?: number;
      draggingSmoothTime?: number;
      minDistance?: number;
      maxDistance?: number;
    };
  };
  audio: {
    isMuted?: boolean;
    volume?: number;
    backgroundMusic?: {
      enabled?: boolean;
      url?: string;
      loop?: boolean;
    };
  };
  particles: {
    enabled?: boolean;
    count?: number;
    systemScale?: number;
    sphereRadius?: number;
    floatIntensity?: number;
    breathIntensity?: number;
    dustCount?: number;
    dustSize?: number;
    dustOpacity?: number;
    dustColor?: string;
    pathPointColor?: string;
    pathPointSize?: number;
    pathPointOpacity?: number;
    rotationSpeed?: number;
    rotationTiltXZ?: number;
    rotationTiltXY?: number;
  };
  exhaust: {
    enabled?: boolean;
    debug?: {
      showEmitterAxis?: boolean;
      axisSize?: number;
    };
    flame: {
      baseColor?: string;
      tipColor?: string;
      intensity?: number;
      speedMultiplier?: number;
      length?: number;
      radius?: number;
      offsetX?: number;
      offsetY?: number;
      offsetZ?: number;
    };
    smoke: {
      maxParticles?: number;
      emitRate?: number;
      particleLifetime?: number;
      sizeGrowth?: number;
      initialSize?: number;
      emitOnlyWhenMoving?: boolean;
      velocityMultiplier?: number;
      initialVelocity?: number;
      randomSpread?: number;
      swirlIntensity?: number;
      emitterOffsetX?: number;
      emitterOffsetY?: number;
      emitterOffsetZ?: number;
    };
    vibration?: {
      intensity?: number;
      frequency?: number;
      timeVariation?: number;
    };
    rocketJitter?: {
      intensity?: number;
      frequency?: number;
      timeVariation?: number;
    };
    flameJitter?: {
      intensity?: number;
      frequency?: number;
      timeVariation?: number;
    };
  };
  landingPage: {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    customText?: string;
    buttonText?: string;
    jumpUrl?: string;
    layout: {
      glassPanelPosition?: string;
      glassPanelWidth?: string;
      glassPanelHeight?: string;
      glassPanelMaxWidth?: string;
      glassPanelMaxHeight?: string;
      fullScreenGlass?: boolean;
      glassTop?: string;
      glassLeft?: string;
      textAlign?: string;
      titleMarginBottom?: string;
      subtitleMarginBottom?: string;
      customTextMarginTop?: string;
      customTextMarginBottom?: string;
      buttonAlign?: string;
      buttonMarginTop?: string;
      buttonGap?: string;
      buttonWrap?: string;
    };
    glassPanel: {
      backgroundR?: number;
      backgroundG?: number;
      backgroundB?: number;
      backgroundOpacity?: number;
      borderOpacity?: number;
      borderRadius?: number;
      blur?: number;
      padding?: number;
    };
    advancedGlass: {
      noiseEnabled?: boolean;
      noiseOpacity?: number;
      chromaticAberration?: number;
      frostedEnabled?: boolean;
      frostedScale?: number;
      reflectionEnabled?: boolean;
      reflectionOpacity?: number;
    };
    animatedGlass: {
      enabled?: boolean;
      pulseEnabled?: boolean;
      pulseSpeed?: number;
      pulseIntensity?: number;
      shimmerEnabled?: boolean;
      shimmerSpeed?: number;
    };
  };
  postprocess: {
    enabled?: boolean;
    bloom?: {
      enabled?: boolean;
      intensity?: number;
      luminanceThreshold?: number;
      luminanceSmoothing?: number;
      mipmapBlur?: boolean;
    };
    bokeh?: {
      enabled?: boolean;
      focus?: number;
      dof?: number;
      aperture?: number;
      maxBlur?: number;
    };
    chromaticAberration?: {
      enabled?: boolean;
      offset?: { x: number; y: number };
    };
    film?: {
      enabled?: boolean;
      scanlineIntensity?: number;
      noiseIntensity?: number;
      scanlineCount?: number;
      grayscale?: boolean;
    };
    brightnessContrast?: {
      enabled?: boolean;
      brightness?: number;
      contrast?: number;
    };
  };
  [key: string]: unknown;
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

// 数据点类型
export interface DataPoint {
  step: number;
  x: number;
  y: number;
  z: number;
  color: number;
  direction: number;
}

// EventBus 事件类型
export interface ConfigChangedEvent<T = unknown> {
  key: string;
  value: T;
}

export interface StateChangedEvent<T = unknown> {
  key: string;
  value: T;
}

export interface DataLoadedEvent {
  points: DataPoint[];
  totalSteps: number;
}

export interface StepChangedEvent {
  step: number;
  percent: number;
}

// 系统初始化参数类型
export interface SystemInitParams {
  eventBus: EventBus;
  scene?: THREE.Scene;
  camera?: THREE.Camera;
  renderer?: THREE.WebGLRenderer;
  [key: string]: unknown;
}

// 系统特定的初始化参数
export interface AnimationSystemInitParams {
  eventBus: EventBus;
}

export interface CameraSystemInitParams {
  eventBus: EventBus;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
}

export interface DataSystemInitParams {
  eventBus: EventBus;
  scene: THREE.Scene;
  camera: THREE.Camera;
}

export interface PathSystemInitParams {
  eventBus: EventBus;
  scene: THREE.Scene;
  coordinateSystem: CoordinateSystem;
}

export interface AudioSystemInitParams {
  eventBus: EventBus;
  camera: THREE.Camera;
}

export interface LightingSystemInitParams {
  scene: THREE.Scene;
}

export interface ParticleSystemInitParams {
  eventBus: EventBus;
  scene: THREE.Scene;
  coordinateSystem: CoordinateSystem;
}

// EventBus 类型定义
export interface EventBus {
  on<T = unknown>(event: string, callback: EventHandler<T>): void;
  once<T = unknown>(event: string, callback: EventHandler<T>): void;
  off(event: string, callback: EventHandler): void;
  emit<T = unknown>(event: string, ...args: T[]): void;
  clear(): void;
}

// CoordinateSystem 类型
export interface CoordinateSystem {
  scene: THREE.Scene;
  dataSpace: THREE.Group;
  pathAnchor: THREE.Group;
  lightAnchor: THREE.Group;
  particleAnchor: THREE.Group;
  worldRoot: THREE.Group;

  addToScene(object: THREE.Object3D): void;
  removeFromScene(object: THREE.Object3D): void;
  getWorldPosition(localPos: THREE.Vector3): THREE.Vector3;
  getDataPosition(localPos: THREE.Vector3): THREE.Vector3;
}
