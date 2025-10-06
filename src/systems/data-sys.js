/**
 * @file data-sys.js
 * @description 数据加载系统 - CSV解析与坐标映射
 * ✅ 修复：删除 yScale 压缩，使用各向同性映射 + 优化相机初始距离
 */
import * as THREE from 'three';
import Papa from 'papaparse';
import logger from '../utils/logger.js';
import config from '../config.js';

class DataSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;
    this.initialized = false;
    
    this.rawData = [];
  }

  init({ eventBus, scene, camera, controls }) {
    if (this.initialized) {
      logger.warn('DataSystem', '数据系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.camera = camera;
      this.controls = controls;

      this.eventBus.on('data-load-requested', (csvUrl) => {
        this.loadCSV(csvUrl);
      });

      this.initialized = true;
      logger.info('DataSystem', '数据系统初始化完成');

      return this;
    } catch (err) {
      logger.error('DataSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  async loadCSV(csvUrl) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    logger.info('DataSystem', `开始加载 CSV: ${csvUrl}`);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }

      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          this._processData(results.data);
        },
        error: (error) => {
          logger.error('DataSystem', `CSV 解析错误: ${error.message}`);
          this.eventBus.emit('data-load-error', error);
        }
      });
    } catch (err) {
      logger.error('DataSystem', `CSV 加载失败: ${err.message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _processData(rawData) {
    try {
      const validData = rawData.filter(row => {
        return row.x !== null && 
               row.y !== null && 
               row.z !== null &&
               !isNaN(row.x) &&
               !isNaN(row.y) &&
               !isNaN(row.z);
      });

      if (validData.length === 0) {
        throw new Error('没有有效的数据点');
      }

      this.rawData = validData;
      config.set('data.antData', validData);

      const mappedPoints = this._mapToPoints(validData);
      config.set('data.mappedPoints', mappedPoints);

      this._adjustCamera(mappedPoints);

      logger.info('DataSystem', `数据处理完成: ${validData.length} 个点`);
      this.eventBus.emit('data-loaded', { 
        rawData: validData, 
        points: mappedPoints 
      });
      
      // ✅ 新增：通知数据处理完成
      this.eventBus.emit('data-processing-completed');
    } catch (err) {
      logger.error('DataSystem', `数据处理失败: ${err.message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  /**
   * ✅ 核心修复：删除 yScale，使用各向同性映射
   */
  _mapToPoints(data) {
    const positionScale = config.get('environment.positionScale') || 2.0;

    return data.map(row => {
      return new THREE.Vector3(
        row.x * positionScale,
        row.y * positionScale,  // ✅ 统一缩放
        row.z * positionScale
      );
    });
  }

  /**
   * ✅ 修复：调整相机到合适距离并锁定旋转中心为世界原点
   */
  _adjustCamera(points) {
    if (!points || points.length === 0) return;

    this.eventBus.emit('data-processing-started');

    const box = new THREE.Box3();
    points.forEach(p => box.expandByPoint(p));

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // ✅ 使用更合理的距离系数
    const cameraDistFactor = 2.5;
    const distance = maxDim * cameraDistFactor;

    if (this.controls) {
      this.controls.setPosition(
        distance * 0.6,
        distance * 0.4,
        distance * 0.8,
        false
      );
      
      this.controls.setTarget(0, 0, 0, false);
    }

    logger.info('DataSystem', `✅ 相机已调整 | 距离: ${distance.toFixed(2)} | 目标: (0,0,0)`);
  }

  dispose() {
    this.rawData = [];
    this.initialized = false;
    logger.info('DataSystem', '数据系统已销毁');
  }
}

const dataSys = new DataSystem();
export default dataSys;
