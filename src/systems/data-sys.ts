/**
 * @file data-sys.js
 * @description 数据加载系统 - CSV解析与坐标映射
 * 修复: 初始化时动态加载数据源清单 (manifest.json)，并提供主动查询方法。
 */
import * as THREE from 'three';
import Papa from 'papaparse';
import logger from '../utils/logger';
import config from '../config';
import { resolveAssetUrl } from '../utils/url-resolver';
import state from './state';

class DataSystem {
  private eventBus: any;

  // 公共属性
  public scene: THREE.Scene | null = null;
  public camera: THREE.Camera | null = null;
  public rawData: any[] = [];

  private controls: any;
  private initialized: boolean;

  private datasets: any[];

  constructor() {
    this.eventBus = null;

    this.controls = null;
    this.initialized = false;

    this.datasets = []; // 新增：用一个内部变量存储数据集列表
  }

  // init 方法保持 async 不变
  async init({ eventBus, scene, camera, controls }: any) {
    if (this.initialized) {
      // logger.warn('DataSystem', '数据系统已经初始化过了'); // 暂时注释掉，因为我们修复了重复调用的问题
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.camera = camera;
      this.controls = controls;

      this.eventBus.on('data-load-requested', (csvUrl: string) => {
        this.loadCSV(csvUrl);
      });

      await this._loadAvailableDatasets();

      this.initialized = true;
      logger.info('DataSystem', '数据系统初始化完成');

      return this;
    } catch (err: unknown) {
      logger.error('DataSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * 新增：提供一个公共的 getter 方法
   */
  getAvailableDatasets() {
    return this.datasets;
  }

  async _loadAvailableDatasets() {
    try {
      // 2. 使用 resolveAssetUrl 包装路径
      const response = await fetch(resolveAssetUrl('data/manifest.json'));
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const manifestData = await response.json();

      if (Array.isArray(manifestData) && manifestData.length > 0) {
        this.datasets = manifestData;
        config.set('data.availableDatasets', manifestData);

        // 设置默认加载的数据为清单中的第一个
        // 注意：这里的路径现在是相对于 public 的，不再需要 '../'
        const defaultPath = manifestData[0].path;
        config.set('data.csvUrl', defaultPath);

        logger.info('DataSystem', `成功加载 ${manifestData.length} 个数据集清单`);
      } else {
        throw new Error('清单格式无效或为空');
      }
    } catch (err: unknown) {
      logger.error('DataSystem', `加载数据集清单失败: ${(err as Error).message}`);
      this.datasets = [];
      config.set('data.availableDatasets', []);
    } finally {
      this.eventBus.emit('datasets-list-updated', this.getAvailableDatasets());
    }
  }

  async loadCSV(csvUrl: string) {
    if (!csvUrl) {
      logger.warn('DataSystem', 'CSV URL 为空');
      return;
    }

    // 3. 同样，解析从 manifest.json 中读到的路径
    const fetchUrl = resolveAssetUrl(csvUrl);

    logger.info('DataSystem', `开始加载 CSV: ${fetchUrl}`);

    try {
      const response = await fetch(fetchUrl);
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
      // ... 函数剩余部分保持不变 ...
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          this._processData(results.data);
        },
        error: (error: any) => {
          logger.error('DataSystem', `CSV 解析错误: ${(error as Error).message}`);
          this.eventBus.emit('data-load-error', error);
        },
      });
    } catch (err: unknown) {
      logger.error('DataSystem', `CSV 加载失败: ${(err as Error).message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _processData(rawData: any[]) {
    try {
      const validData = rawData.filter((row) => {
        return (
          row.x !== null &&
          row.y !== null &&
          row.z !== null &&
          !isNaN(row.x) &&
          !isNaN(row.y) &&
          !isNaN(row.z)
        );
      });

      if (validData.length === 0) {
        throw new Error('没有有效的数据点');
      }

      this.rawData = validData;
      state.set('data.antData', validData);

      const mappedPoints = this._mapToPoints(validData);
      state.set('data.mappedPoints', mappedPoints);

      this._adjustCamera(mappedPoints);

      logger.info('DataSystem', `数据处理完成: ${validData.length} 个点`);
      this.eventBus.emit('data-loaded', {
        _rawData: validData,
        points: mappedPoints,
      });

      this.eventBus.emit('data-processing-completed');
    } catch (err: unknown) {
      logger.error('DataSystem', `数据处理失败: ${(err as Error).message}`);
      this.eventBus.emit('data-load-error', err);
    }
  }

  _mapToPoints(data: any[]) {
    const positionScale = config.get('environment.positionScale') || 2.0;

    return data.map((row) => {
      return new THREE.Vector3(row.x * positionScale, row.y * positionScale, row.z * positionScale);
    });
  }

  _adjustCamera(points: THREE.Vector3[]) {
    if (!points || points.length === 0) return;

    this.eventBus.emit('data-processing-started');

    // 移除所有自动调整逻辑
    logger.info('DataSystem', '数据已加载，保持用户设置的相机位置');
  }

  dispose() {
    this.rawData = [];
    this.initialized = false;
    logger.info('DataSystem', '数据系统已销毁');
  }
}

const dataSys = new DataSystem();
export default dataSys;
