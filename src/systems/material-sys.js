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
