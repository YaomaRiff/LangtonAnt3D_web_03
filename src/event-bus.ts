/**
 * @file event-bus.js
 * @description 事件总线 - 系统间通信
 */
import logger from './utils/logger';

class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
    logger.debug('EventBus', `注册事件: ${event}`);
  }

  off(event, callback) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      logger.debug('EventBus', `移除事件: ${event}`);
    }
  }

  emit(event, ...args) {
    if (!this.events.has(event)) return;
    
    const callbacks = this.events.get(event);
    callbacks.forEach(callback => {
      try {
        callback(...args);
      } catch (err) {
        logger.error('EventBus', `事件回调异常 [${event}]: ${err.message}`);
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

  getListenerCount(event) {
    return this.events.has(event) ? this.events.get(event).length : 0;
  }
}

const eventBus = new EventBus();
export default eventBus;
