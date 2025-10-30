/**
 * @file enhanced-utils.ts
 * @description 增强工具函数库 - 整合Chroma.js、Lodash-es和GL-Matrix
 * 提供颜色处理、数学运算和常用工具函数
 */

import chroma from 'chroma-js';
import { debounce, throttle, cloneDeep, random } from 'lodash-es';
// import { vec3 } from 'gl-matrix'; // 未使用，已注释

// ==================== 颜色处理工具 ====================

export class ColorUtils {
  /**
   * 生成颜色渐变
   * @param colors 颜色数组
   * @param steps 渐变步数
   * @returns 渐变颜色数组
   */
  static generateGradient(colors: string[], steps: number = 10): string[] {
    return chroma.scale(colors).mode('lch').colors(steps);
  }

  /**
   * 生成互补色
   * @param color 基础颜色
   * @returns 互补色
   */
  static getComplementaryColor(color: string): string {
    return chroma(color).set('hsl.h', '+180').hex();
  }

  /**
   * 生成类似色方案
   * @param baseColor 基础颜色
   * @param count 颜色数量
   * @returns 类似色数组
   */
  static generateAnalogousColors(baseColor: string, count: number = 5): string[] {
    const baseHue = chroma(baseColor).get('hsl.h') as number;
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
      const hue = (baseHue + i * 30 - 60) % 360;
      colors.push(chroma.hsl(hue, 0.7, 0.7).hex());
    }

    return colors;
  }

  /**
   * 生成三元色方案
   * @param baseColor 基础颜色
   * @returns 三元色数组
   */
  static generateTriadicColors(baseColor: string): string[] {
    const baseHue = chroma(baseColor).get('hsl.h') as number;
    return [
      baseColor,
      chroma.hsl((baseHue + 120) % 360, 0.7, 0.7).hex(),
      chroma.hsl((baseHue + 240) % 360, 0.7, 0.7).hex(),
    ];
  }

  /**
   * 调整颜色亮度
   * @param color 原始颜色
   * @param amount 亮度调整量 (-1 到 1)
   * @returns 调整后的颜色
   */
  static adjustBrightness(color: string, amount: number): string {
    const l = chroma(color).get('hsl.l') as number;
    return chroma(color)
      .set('hsl.l', l + amount)
      .hex();
  }

  /**
   * 调整颜色饱和度
   * @param color 原始颜色
   * @param amount 饱和度调整量 (-1 到 1)
   * @returns 调整后的颜色
   */
  static adjustSaturation(color: string, amount: number): string {
    const s = chroma(color).get('hsl.s') as number;
    return chroma(color)
      .set('hsl.s', Math.max(0, Math.min(1, s + amount)))
      .hex();
  }

  /**
   * 生成随机配色方案
   * @returns 配色方案对象
   */
  static generateRandomPalette(): {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  } {
    const baseHue = random(0, 360);

    return {
      primary: chroma.hsl(baseHue, 0.8, 0.6).hex(),
      secondary: chroma.hsl(baseHue + 120, 0.7, 0.7).hex(),
      accent: chroma.hsl(baseHue + 240, 0.6, 0.8).hex(),
      background: chroma.hsl(baseHue, 0.1, 0.1).hex(),
      text: chroma.hsl(baseHue, 0.2, 0.9).hex(),
    };
  }

  /**
   * 分析颜色
   * @param color 颜色值
   * @returns 颜色分析结果
   */
  static analyzeColor(color: string): {
    hex: string;
    rgb: [number, number, number];
    hsl: [number, number, number];
    luminance: number;
    brightness: string;
  } {
    const rgb = chroma(color).rgb();
    const hsl = chroma(color).hsl();
    const luminance = chroma(color).luminance();

    return {
      hex: chroma(color).hex(),
      rgb: rgb as [number, number, number],
      hsl: hsl as [number, number, number],
      luminance,
      brightness: luminance > 0.5 ? 'light' : 'dark',
    };
  }
}

// ==================== 数学运算工具 ====================

export class MathUtils {
  /**
   * 创建3D向量
   */
  static createVec3(x = 0, y = 0, z = 0): Float32Array {
    return new Float32Array([x, y, z]);
  }

  /**
   * 向量加法
   */
  static addVec3(a: Float32Array, b: Float32Array): Float32Array {
    return new Float32Array([a[0]! + b[0]!, a[1]! + b[1]!, a[2]! + b[2]!]);
  }

  /**
   * 向量减法
   */
  static subtractVec3(a: Float32Array, b: Float32Array): Float32Array {
    return new Float32Array([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
  }

  /**
   * 向量点积
   */
  static dotVec3(a: Float32Array, b: Float32Array): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }

  /**
   * 向量叉积
   */
  static crossVec3(a: Float32Array, b: Float32Array): Float32Array {
    return new Float32Array([
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0],
    ]);
  }

  /**
   * 向量归一化
   */
  static normalizeVec3(v: Float32Array): Float32Array {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    if (length === 0) return new Float32Array([0, 0, 0]);
    return new Float32Array([v[0] / length, v[1] / length, v[2] / length]);
  }

  /**
   * 向量长度
   */
  static vec3Length(v: Float32Array): number {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  /**
   * 向量距离
   */
  static vec3Distance(a: Float32Array, b: Float32Array): number {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const dz = a[2] - b[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  /**
   * 创建4x4矩阵
   */
  static createMat4(): Float32Array {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  /**
   * 创建平移矩阵
   */
  static createTranslationMatrix(x: number, y: number, z: number): Float32Array {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
  }

  /**
   * 创建旋转矩阵
   */
  static createRotationMatrix(angle: number, axis: [number, number, number]): Float32Array {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const t = 1 - c;
    const [x, y, z] = axis;

    return new Float32Array([
      t * x * x + c,
      t * x * y - s * z,
      t * x * z + s * y,
      0,
      t * x * y + s * z,
      t * y * y + c,
      t * y * z - s * x,
      0,
      t * x * z - s * y,
      t * y * z + s * x,
      t * z * z + c,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  /**
   * 创建缩放矩阵
   */
  static createScaleMatrix(x: number, y: number, z: number): Float32Array {
    return new Float32Array([x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1]);
  }

  /**
   * 矩阵乘法
   */
  static multiplyMat4(a: Float32Array, b: Float32Array): Float32Array {
    const result = new Float32Array(16);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i * 4 + k] * b[k * 4 + j];
        }
        result[i * 4 + j] = sum;
      }
    }
    return result;
  }

  /**
   * 矩阵转置
   */
  static transposeMat4(m: Float32Array): Float32Array {
    return new Float32Array([
      m[0],
      m[4],
      m[8],
      m[12],
      m[1],
      m[5],
      m[9],
      m[13],
      m[2],
      m[6],
      m[10],
      m[14],
      m[3],
      m[7],
      m[11],
      m[15],
    ]);
  }

  /**
   * 创建四元数
   */
  static createQuat(x = 0, y = 0, z = 0, w = 1): Float32Array {
    return new Float32Array([x, y, z, w]);
  }

  /**
   * 从欧拉角创建四元数
   */
  static quatFromEuler(x: number, y: number, z: number): Float32Array {
    const cx = Math.cos(x * 0.5);
    const cy = Math.cos(y * 0.5);
    const cz = Math.cos(z * 0.5);
    const sx = Math.sin(x * 0.5);
    const sy = Math.sin(y * 0.5);
    const sz = Math.sin(z * 0.5);

    return new Float32Array([
      sx * cy * cz - cx * sy * sz,
      cx * sy * cz + sx * cy * sz,
      cx * cy * sz - sx * sy * cz,
      cx * cy * cz + sx * sy * sz,
    ]);
  }

  /**
   * 球面线性插值
   */
  static slerpQuat(a: Float32Array, b: Float32Array, t: number): Float32Array {
    let dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];

    if (dot < 0) {
      dot = -dot;
      b = new Float32Array([-b[0], -b[1], -b[2], -b[3]]);
    }

    const angle = Math.acos(Math.min(dot, 1));
    const sinAngle = Math.sin(angle);
    const a1 = Math.sin((1 - t) * angle) / sinAngle;
    const a2 = Math.sin(t * angle) / sinAngle;

    return new Float32Array([
      a1 * a[0] + a2 * b[0],
      a1 * a[1] + a2 * b[1],
      a1 * a[2] + a2 * b[2],
      a1 * a[3] + a2 * b[3],
    ]);
  }

  /**
   * 线性插值
   */
  static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  /**
   * 平滑插值 (Smoothstep)
   */
  static smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
  }

  /**
   * 限制数值在范围内
   */
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  /**
   * 弧度转角度
   */
  static radToDeg(rad: number): number {
    return rad * (180 / Math.PI);
  }

  /**
   * 角度转弧度
   */
  static degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * 生成随机向量
   */
  static randomVec3(min: number = -1, max: number = 1): Float32Array {
    return new Float32Array([random(min, max), random(min, max), random(min, max)]);
  }

  /**
   * 生成球面上的随机点
   */
  static randomPointOnSphere(radius: number = 1): Float32Array {
    const theta = random(0, 2 * Math.PI);
    const phi = Math.acos(1 - 2 * random(0, 1));

    return new Float32Array([
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    ]);
  }
}

// ==================== 性能优化工具 ====================

export class PerformanceUtils {
  /**
   * 创建防抖函数
   */
  static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    return debounce(func, wait);
  }

  /**
   * 创建节流函数
   */
  static throttle<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    return throttle(func, wait);
  }

  /**
   * 深拷贝对象
   */
  static deepClone<T>(obj: T): T {
    return cloneDeep(obj);
  }

  /**
   * 创建缓存函数
   */
  static memoize<T extends (...args: any[]) => any>(func: T): T {
    const cache = new Map();

    return ((...args: any[]) => {
      const key = JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  }

  /**
   * 简单的性能监控器
   */
  static createProfiler() {
    const times: Record<string, number> = {};

    return {
      start(name: string) {
        times[name] = performance.now();
      },

      end(name: string): number {
        const start = times[name];
        if (start === undefined) {
          console.warn(`Profiler: "${name}" was not started`);
          return 0;
        }
        const duration = performance.now() - start;
        console.log(`Profiler: ${name} took ${duration.toFixed(2)}ms`);
        delete times[name];
        return duration;
      },

      lap(name: string): number {
        const start = times[name];
        if (start === undefined) {
          console.warn(`Profiler: "${name}" was not started`);
          return 0;
        }
        return performance.now() - start;
      },
    };
  }
}

// ==================== 工具函数 ====================

export class Utils {
  /**
   * 格式化数字
   */
  static formatNumber(num: number, decimals: number = 2): string {
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * 格式化文件大小
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 生成唯一ID
   */
  static generateId(prefix: string = 'id'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 睡眠函数
   */
  static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 重试函数
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt} failed:`, error);

        if (attempt < maxAttempts) {
          await this.sleep(delay * attempt);
        }
      }
    }

    throw lastError!;
  }

  /**
   * 安全的JSON解析
   */
  static safeJsonParse<T>(json: string, defaultValue: T): T {
    try {
      return JSON.parse(json);
    } catch (error) {
      console.warn('JSON解析失败:', error);
      return defaultValue;
    }
  }

  /**
   * 检查是否为有效的URL
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 下载文件
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  /**
   * 复制到剪贴板
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('复制到剪贴板失败:', error);
      return false;
    }
  }

  /**
   * 检查设备类型
   */
  static getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;

    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  /**
   * 检查是否为触摸设备
   */
  static isTouchDevice(): boolean {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /**
   * 获取颜色对比度
   */
  static getColorContrast(color1: string, color2: string): number {
    const lum1 = chroma(color1).luminance();
    const lum2 = chroma(color2).luminance();
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * 检查颜色是否具有足够的对比度
   */
  static hasGoodContrast(foreground: string, background: string, threshold: number = 4.5): boolean {
    return this.getColorContrast(foreground, background) >= threshold;
  }
}

// 导出常用函数的快捷方式
export const {
  generateGradient,
  getComplementaryColor,
  generateAnalogousColors,
  generateTriadicColors,
  adjustBrightness,
  adjustSaturation,
  generateRandomPalette,
  analyzeColor,
} = ColorUtils;

export const {
  createVec3,
  addVec3,
  subtractVec3,
  dotVec3,
  crossVec3,
  normalizeVec3,
  vec3Length,
  vec3Distance,
  createMat4,
  createTranslationMatrix,
  createRotationMatrix,
  createScaleMatrix,
  multiplyMat4,
  transposeMat4,
  createQuat,
  quatFromEuler,
  slerpQuat,
  lerp,
  smoothstep,
  clamp,
  radToDeg,
  degToRad,
  randomVec3,
  randomPointOnSphere,
} = MathUtils;

export const {
  debounce: perfDebounce,
  throttle: perfThrottle,
  deepClone,
  memoize,
  createProfiler,
} = PerformanceUtils;

export const {
  formatNumber,
  formatFileSize,
  generateId,
  sleep,
  retry,
  safeJsonParse,
  isValidUrl,
  downloadFile,
  copyToClipboard,
  getDeviceType,
  isTouchDevice,
  getColorContrast,
  hasGoodContrast,
} = Utils;
