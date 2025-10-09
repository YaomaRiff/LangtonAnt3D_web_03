/**
 * @file logger.ts
 * @description 日志工具 - 统一日志输出
 * ✨ 新增: debugThrottled 方法，用于对高频日志进行节流，避免刷屏。
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  private level: number;
  private enableTimestamp: boolean;
  private throttledLogs: Map<string, number>; // ✅ 新增: 用于存储节流日志的最后时间戳

  constructor() {
    this.level = LOG_LEVELS.INFO;
    this.enableTimestamp = true;
    this.throttledLogs = new Map();
  }

  setLevel(level: string) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS] !== undefined) {
      this.level = LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS];
    }
  }

  private _format(level: string, module: string, message: string): string {
    const timestamp = this.enableTimestamp 
      ? `[${new Date().toISOString().slice(11, 23)}]` 
      : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }
  
  /**
   * ✨ 新增: 节流调试日志
   * 对同一个 key，在指定的 interval 毫秒内只打印一次。
   * @param module 模块名
   * @param key 节流的唯一标识符
   * @param message 日志消息
   * @param interval 节流间隔（毫秒），默认为 1000ms
   */
  debugThrottled(module: string, key: string, message: string, interval = 1000) {
    if (this.level > LOG_LEVELS.DEBUG) return;

    const now = Date.now();
    const lastTime = this.throttledLogs.get(key) || 0;

    if (now - lastTime > interval) {
      this.throttledLogs.set(key, now);
      this.debug(module, message);
    }
  }

  debug(module: string, message: string) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(
        `%c${this._format('DEBUG', module, message)}`,
        'color: #888'
      );
    }
  }

  info(module: string, message: string) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(
        `%c${this._format('INFO', module, message)}`,
        'color: #4a9eff'
      );
    }
  }

  warn(module: string, message: string) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(
        `%c${this._format('WARN', module, message)}`,
        'color: #ff9800'
      );
    }
  }

  error(module: string, message: string) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(
        `%c${this._format('ERROR', module, message)}`,
        'color: #f44336'
      );
    }
  }
}

const logger = new Logger();

// 开发环境设置为 DEBUG
if (import.meta.env.DEV) {
  logger.setLevel('DEBUG');
}

export default logger;
