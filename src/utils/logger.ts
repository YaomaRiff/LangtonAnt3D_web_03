/**
 * @file logger.ts
 * @description 日志工具 - 统一日志输出 + 诊断系统
 * ✨ 新增: 完整的诊断系统，支持缓冲、节流、链路追踪
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

class Logger {
  // 公共属性
  public level: number = 1; // LOG_LEVELS.INFO

  private enableTimestamp: boolean;
  private throttledLogs: Map<string, number>;

  // 诊断系统属性
  private diagnosticBuffer: string[] = [];
  private maxDiagnosticPerFrame = 5; // 每帧最多显示 5 条诊断
  private diagnosticFlushInterval = 500; // 500ms 刷新一次诊断缓冲
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.enableTimestamp = true;
    this.throttledLogs = new Map();
    this._startDiagnosticFlusher();
  }

  setLevel(level: string) {
    const upperLevel = level.toUpperCase();
    if (LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS] !== undefined) {
      this.level = LOG_LEVELS[upperLevel as keyof typeof LOG_LEVELS];
    }
  }

  private _format(_level: string, module: string, message: string): string {
    const timestamp = this.enableTimestamp ? `[${new Date().toISOString().slice(11, 23)}]` : '';
    const moduleStr = module ? `[${module}]` : '';
    return `${timestamp}${moduleStr} ${message}`;
  }

  /**
   * 节流调试日志
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
      console.log(`%c${this._format('DEBUG', module, message)}`, 'color: #888');
    }
  }

  info(module: string, message: string) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(`%c${this._format('INFO', module, message)}`, 'color: #4a9eff');
    }
  }

  warn(module: string, message: string) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(`%c${this._format('WARN', module, message)}`, 'color: #ff9800');
    }
  }

  error(module: string, message: string) {
    if (this.level <= LOG_LEVELS.ERROR) {
      console.error(`%c${this._format('ERROR', module, message)}`, 'color: #f44336');
    }
  }

  // ========== 诊断系统方法 ==========

  /**
   * 诊断日志 - 用于帧级调试，自动缓冲
   */
  diagnostic(module: string, message: string, symbol = '●') {
    const line = `${symbol} [${module}] ${message}`;

    if (this.diagnosticBuffer.length < this.maxDiagnosticPerFrame) {
      this.diagnosticBuffer.push(line);
    }
  }

  /**
   * 关键诊断 - 立即输出，不缓冲
   */
  diagnosticCritical(module: string, message: string) {
    console.log(
      `%c🔴 [${module}] ${message}`,
      'color: #ff5722; font-weight: bold; font-size: 12px;'
    );
  }

  /**
   * 成功诊断
   */
  diagnosticSuccess(module: string, message: string) {
    console.log(`%c✅ [${module}] ${message}`, 'color: #4caf50; font-size: 12px;');
  }

  /**
   * ⚠️  警告诊断
   */
  diagnosticWarning(module: string, message: string) {
    console.log(`%c⚠️  [${module}] ${message}`, 'color: #ff9800; font-size: 12px;');
  }

  /**
   * 追踪诊断 - 用于追踪事件链路
   */
  diagnosticTrace(source: string, event: string, target: string, data?: any) {
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    this.diagnostic('Trace', `${source} → ${event} → ${target}${dataStr}`, '→');
  }

  /**
   * 配置诊断系统
   */
  setDiagnosticConfig(maxPerFrame?: number, flushInterval?: number) {
    if (maxPerFrame !== undefined) this.maxDiagnosticPerFrame = maxPerFrame;
    if (flushInterval !== undefined) {
      this.diagnosticFlushInterval = flushInterval;
      // 重新启动 flusher
      this._stopDiagnosticFlusher();
      this._startDiagnosticFlusher();
    }
  }

  /**
   * 启动诊断缓冲定时刷新
   */
  private _startDiagnosticFlusher() {
    this.flushTimer = setInterval(() => {
      this._flushDiagnosticBuffer();
    }, this.diagnosticFlushInterval);
  }

  /**
   * 停止诊断缓冲定时刷新
   */
  private _stopDiagnosticFlusher() {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * 立即刷新诊断缓冲
   */
  private _flushDiagnosticBuffer() {
    if (this.diagnosticBuffer.length === 0) return;

    const timestamp = new Date().toISOString().slice(11, 23);
    const header = `%c[${timestamp}] 📋 诊断快照 (${this.diagnosticBuffer.length} items)`;

    console.group(header, 'color: #2196f3; font-weight: bold; font-size: 12px;');
    this.diagnosticBuffer.forEach((line) => {
      console.log(`%c${line}`, 'color: #666; font-family: monospace; font-size: 11px;');
    });
    console.groupEnd();

    this.diagnosticBuffer = [];
  }

  /**
   * 销毁前清理
   */
  destroy() {
    this._stopDiagnosticFlusher();
    this.diagnosticBuffer = [];
    this.throttledLogs.clear();
  }
}

const logger = new Logger();

// 开发环境设置为 DEBUG，并配置诊断系统
if (import.meta.env.DEV) {
  logger.setLevel('DEBUG');
  logger.setDiagnosticConfig(5, 500); // 每帧5条，500ms刷新
}

export default logger;
