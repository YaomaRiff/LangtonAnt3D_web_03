/**
 * @file ui-registry.js
 * @description UI模块注册中心 - 避免循环依赖 + 自动追踪控件
 */
import logger from '../utils/logger';

class UIRegistry {
  constructor() {
    this.modules = new Map();
  }

  /**
   * 注册UI模块
   * @param {string} name - 模块名称
   * @param {Object} module - UI模块实例(必须有controls Map)
   */
  register(name, module) {
    if (!module || !module.controls) {
      logger.warn('UIRegistry', `注册失败: ${name} 没有 controls 属性`);
      return;
    }
    
    this.modules.set(name, module);
    logger.debug('UIRegistry', `已注册 UI 模块: ${name} (${module.controls.size} 个控件)`);
  }

  /**
   * 注销UI模块
   */
  unregister(name) {
    this.modules.delete(name);
    logger.debug('UIRegistry', `已注销 UI 模块: ${name}`);
  }

  /**
   * ✅ 核心方法:收集所有控件路径(自动排除data/animation/audio)
   * @returns {string[]} 控件路径数组
   */
  getAllControls() {
    const allPaths = new Set();
    
    // ✅ 精确匹配排除列表
  const EXCLUDED_PREFIXES = [
    'data.csvUrl',
    'data.antData', 
    'data.mappedPoints',
    'animation.currentStep',
    'animation.lerpT',
    'animation.animating',
    'audio.'
  ];
  
  this.modules.forEach((module, moduleName) => {
    if (!module.controls) return;
    
    module.controls.forEach((control, path) => {
      // ✅ 使用精确前缀匹配
      if (EXCLUDED_PREFIXES.some(prefix => path.startsWith(prefix))) {
        logger.debug('UIRegistry', `跳过运行时数据: ${path}`);
        return;
      }
        
        allPaths.add(path);
      });
    });

    logger.info('UIRegistry', `收集到 ${allPaths.size} 个有效控件路径`);
    return Array.from(allPaths).sort();
  }

  /**
   * 获取所有已注册模块
   */
  getModules() {
    return Array.from(this.modules.keys());
  }

  /**
   * 清空所有注册
   */
  clear() {
    this.modules.clear();
    logger.info('UIRegistry', '所有UI模块已清空');
  }
}

const uiRegistry = new UIRegistry();
export default uiRegistry;
