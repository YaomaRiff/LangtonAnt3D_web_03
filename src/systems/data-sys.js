/**
 * @file data-sys.js
 * @description 数据加载系统 - CSV解析与坐标映射
 * ✅ 修复: 初始化时动态加载数据源清单 (manifest.json)，并提供主动查询方法。
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
    this.datasets = []; // ✅ 新增：用一个内部变量存储数据集列表
  }

  // init 方法保持 async 不变
  async init({ eventBus, scene, camera, controls }) {
    if (this.initialized) {
      // logger.warn('DataSystem', '数据系统已经初始化过了'); // 暂时注释掉，因为我们修复了重复调用的问题
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

      await this._loadAvailableDatasets();

      this.initialized = true;
      logger.info('DataSystem', '数据系统初始化完成');

      return this;
    } catch (err) {
      logger.error('DataSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * ✅ 新增：提供一个公共的 getter 方法
   */
  getAvailableDatasets() {
    return this.datasets;
  }
  
  async _loadAvailableDatasets() {
    try {
      // 您的vite配置中，public目录下的文件可以直接通过/访问
      const response = await fetch('/data/manifest.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const manifestData = await response.json();
      
      if (Array.isArray(manifestData) && manifestData.length > 0) {
        this.datasets = manifestData; // ✅ 修改：将数据保存在自己的实例中
        config.set('data.availableDatasets', manifestData);
        
        // 设置默认加载的数据为清单中的第一个
        const defaultPath = manifestData[0].path.replace('/data/', '../data/');
        config.set('data.csvUrl', defaultPath);
        
        logger.info('DataSystem', `成功加载 ${manifestData.length} 个数据集清单`);
      } else {
        throw new Error('清单格式无效或为空');
      }
    } catch (err) {
      logger.error('DataSystem', `加载数据集清单失败: ${err.message}`);
      this.datasets = []; // ✅ 修改：失败时也更新一下
      config.set('data.availableDatasets', []);
    } finally {
      this.eventBus.emit('datasets-list-updated', this.getAvailableDatasets());
    }
  }

  // ... loadCSV, _processData, _mapToPoints, _adjustCamera, dispose 方法保持不变 ...
  async loadCSV(csvUrl) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    const fetchUrl = csvUrl.replace('../data/', '/data/');

    logger.info('DataSystem', `开始加载 CSV: ${fetchUrl}`);

    try {
      const response = await fetch(fetchUrl);
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
      
      this.eventBus.emit('data-processing-completed');
    } catch (err)
 {
      logger.error('DataSystem', `数据处理失败: ${err.message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _mapToPoints(data) {
    const positionScale = config.get('environment.positionScale') || 2.0;

    return data.map(row => {
      return new THREE.Vector3(
        row.x * positionScale,
        row.y * positionScale,
        row.z * positionScale
      );
    });
  }

  _adjustCamera(points) {
    if (!points || points.length === 0) return;

    this.eventBus.emit('data-processing-started');

    const box = new THREE.Box3();
    points.forEach(p => box.expandByPoint(p));

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

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
