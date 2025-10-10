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
