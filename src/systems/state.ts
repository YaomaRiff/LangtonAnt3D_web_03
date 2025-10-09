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
