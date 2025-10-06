/**
 * @file logger.js
 * @description 日志工具 - 统一日志输出
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

class Logger {
  constructor() {
    this.level = LOG_LEVELS.INFO;
    this.enableTimestamp = true;
  }

  setLevel(level) {
    if (LOG_LEVELS[level.toUpperCase()] !== undefined) {
      this.level = LOG_LEVELS[level.toUpperCase()];
    }
  }

  _format(level, module, message) {
    const timestamp = this.enableTimestamp 
      ? `[${new Date().toISOString().slice(11, 23)}]` 
      : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }

  debug(module, message) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(
        `%c${this._format('DEBUG', module, message)}`,
        'color: #888'
      );
    }
  }

  info(module, message) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(
        `%c${this._format('INFO', module, message)}`,
        'color: #4a9eff'
      );
    }
  }

  warn(module, message) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(
        `%c${this._format('WARN', module, message)}`,
        'color: #ff9800'
      );
    }
  }

  error(module, message) {
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
