/**
 * @file event-bus.ts
 * @description 事件总线 - 系统间通信
 * @🔧 修正: 补充实现了 'once' 方法，修复了UI因调用不存在的方法而导致的崩溃。
 */
import logger from './utils/logger';

class EventBus {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
    logger.debug('EventBus', `注册事件: ${event}`);
  }

  /**
   * 注册一个只执行一次的事件监听器。
   * @param {string} event - 事件名称。
   * @param {Function} callback - 回调函数。
   */
  once(event: string, callback: Function) {
    const onceCallback = (...args: any[]) => {
      this.off(event, onceCallback); // 执行后立即移除自身
      callback(...args);
    };
    this.on(event, onceCallback);
    logger.debug('EventBus', `注册一次性事件: ${event}`);
  }

  off(event: string, callback: Function) {
    if (!this.events.has(event)) return;

    const callbacks = this.events.get(event)!;
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
      logger.debug('EventBus', `移除事件: ${event}`);
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events.has(event)) return;

    // 创建回调数组的副本，以防回调函数内部修改原始数组（如在 once 中调用 off）
    const callbacks = [...this.events.get(event)!];
    callbacks.forEach((callback) => {
      try {
        callback(...args);
      } catch (err: unknown) {
        logger.error('EventBus', `事件回调异常 [${event}]: ${(err as Error).message}`);
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

  getListenerCount(event: string) {
    return this.events.has(event) ? this.events.get(event)!.length : 0;
  }
}

const eventBus = new EventBus();
export default eventBus;
