/**
 * @file visual-effects-sys.ts
 * @description 视觉效果管理器 - 控制抖动、尾焰等效果的启用时机
 * @version 1.0 (Minimal)
 *
 * 核心功能：
 *   - 场景准备后自动激活配置的效果
 *   - 提供统一的效果查询接口
 */
import logger from '../utils/logger';
import config from '../config';
import eventBus from '../event-bus';

interface EffectConfig {
  enabled: boolean; // 效果是否启用
  runOnReady: boolean; // 场景加载完立即运行
}

class VisualEffectsSystem {
  private effects: Map<string, EffectConfig> = new Map();
  private activeEffects: Set<string> = new Set();
  private initialized = false;

  init() {
    if (this.initialized) {
      logger.warn('VisualEffects', '视觉效果管理器已初始化');
      return this;
    }

    this._loadEffectsConfig();
    this._bindEvents();

    this.initialized = true;
    logger.info('VisualEffects', '视觉效果管理器已初始化');

    return this;
  }

  private _loadEffectsConfig() {
    const cfg = config.get('visualEffects');

    if (!cfg) {
      logger.warn('VisualEffects', '配置中未找到 visualEffects，使用默认配置');
      // 提供默认配置
      this.effects.set('rocketJitter', { enabled: true, runOnReady: true });
      this.effects.set('flameJitter', { enabled: true, runOnReady: true });
      this.effects.set('exhaustFlame', { enabled: true, runOnReady: true });
      return;
    }

    Object.keys(cfg).forEach((key) => {
      this.effects.set(key, cfg[key]);
    });

    logger.debug('VisualEffects', `已加载 ${this.effects.size} 个效果配置`);
  }

  private _bindEvents() {
    // 场景准备完成 - 激活所有 runOnReady 的效果
    eventBus.on('scene-ready', () => {
      this._activateReadyEffects();
    });

    // 配置变更 - 重新加载配置
    eventBus.on('config-changed', ({ key }: { key: string }) => {
      if (key.startsWith('visualEffects.')) {
        this._loadEffectsConfig();
      }
    });
  }

  private _activateReadyEffects() {
    this.effects.forEach((cfg, name) => {
      if (cfg.enabled && cfg.runOnReady) {
        this.activeEffects.add(name);
        logger.info('VisualEffects', `✅ 已激活效果: ${name}`);
      }
    });

    logger.info('VisualEffects', `场景准备完成，已激活 ${this.activeEffects.size} 个效果`);
  }

  /**
   * 检查某个效果是否处于激活状态
   */
  isEffectActive(name: string): boolean {
    return this.activeEffects.has(name);
  }

  /**
   * 手动激活某个效果（用于特殊情况）
   */
  activateEffect(name: string) {
    const cfg = this.effects.get(name);
    if (cfg && cfg.enabled) {
      this.activeEffects.add(name);
      logger.debug('VisualEffects', `手动激活效果: ${name}`);
    }
  }

  /**
   * 手动停用某个效果
   */
  deactivateEffect(name: string) {
    this.activeEffects.delete(name);
    logger.debug('VisualEffects', `停用效果: ${name}`);
  }

  dispose() {
    this.effects.clear();
    this.activeEffects.clear();
    this.initialized = false;
    logger.info('VisualEffects', '视觉效果管理器已销毁');
  }
}

const visualEffectsSys = new VisualEffectsSystem();
export default visualEffectsSys;
