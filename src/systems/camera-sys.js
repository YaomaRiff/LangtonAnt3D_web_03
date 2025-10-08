/**
 * @file camera-sys.js
 * @description 相机系统 - 透视/正交切换 + camera-controls 集成
 * ✅ 核心改造: 监听统一的 'config-changed' 事件。
 */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import logger from '../utils/logger.js';
import config from '../config.js';
import { applyPerspMouseMapping, applyOrthoMouseMapping } from './controls-util.js';

CameraControls.install({ THREE });

class CameraSystem {
  constructor() {
    this.eventBus = null;
    this.scene = null;
    this.renderer = null;
    this.initialized = false;
    
    this.perspectiveCamera = null;
    this.orthographicCamera = null;
    this.activeCamera = null;
    this.controls = null;
    this.currentMode = 'perspective';
    
    this.orthoFrustumSize = 50;
    this.particleSystemRadius = 100;
  }

  init({ eventBus, scene, renderer }) {
    if (this.initialized) {
      logger.warn('CameraSystem', '相机系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.scene = scene;
      this.renderer = renderer;

      this._createCameras();
      this.activeCamera = this.perspectiveCamera;
      this._createControls();
      this._bindEvents();
      
      this._setRotationCenterToOrigin();
      
      const initialMode = config.get('camera.mode') || 'perspective';
      if (initialMode !== 'perspective') {
        this._switchToMode(initialMode);
      }

      this.initialized = true;
      logger.info('CameraSystem', '相机系统初始化完成');

      return this;
    } catch (err) {
      logger.error('CameraSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  _createCameras() {
    const aspect = window.innerWidth / window.innerHeight;
    const fov = config.get('camera.fov') || 75;
    const near = config.get('camera.near') || 0.1;
    const far = config.get('camera.far') || 1000;

    this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.perspectiveCamera.position.set(10, 8, 15);
    this.perspectiveCamera.name = 'PerspectiveCamera';

    const height = this.orthoFrustumSize;
    const width = height * aspect;
    
    this.orthographicCamera = new THREE.OrthographicCamera(
      -width / 2, width / 2, height / 2, -height / 2, near, far
    );
    this.orthographicCamera.position.set(0, 50, 0);
    this.orthographicCamera.name = 'OrthographicCamera';
    this.orthographicCamera.zoom = 1.0;

    logger.debug('CameraSystem', `相机已创建`);
  }

  _createControls() {
    this.controls = new CameraControls(this.activeCamera, this.renderer.domElement);
    applyPerspMouseMapping(this.controls);

    const controlsConfig = config.get('camera.controls');
    this.controls.smoothTime = controlsConfig.smoothTime || 0.05;
    this.controls.draggingSmoothTime = controlsConfig.draggingSmoothTime || 0.25;
    this.controls.minDistance = controlsConfig.minDistance || 1;
    
    setTimeout(() => this._updateMaxDistance(), 100);

    logger.debug('CameraSystem', 'camera-controls 初始化完成');
  }

  _updateMaxDistance() {
    const sphereRadius = config.get('particles.sphereRadius') || 100;
    const systemScale = config.get('particles.systemScale') || 1.0;
    
    this.particleSystemRadius = sphereRadius * systemScale;
    const calculatedMaxDistance = this.particleSystemRadius * 0.8;
    
    if (this.controls) {
      this.controls.maxDistance = calculatedMaxDistance;
      logger.info('CameraSystem', `maxDistance 更新: ${calculatedMaxDistance.toFixed(2)}`);
    }
  }

  _setRotationCenterToOrigin() {
    if (this.controls) {
      this.controls.setTarget(0, 0, 0, false);
      logger.info('CameraSystem', '旋转中心锁定到世界原点 (0,0,0)');
    }
  }

  _bindEvents() {
    // ✅ 核心改造：监听通用配置变更事件
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));

    // ✅ 保留命令式事件
    this.eventBus.on('view-changed', (viewKey) => this._applyViewPreset(viewKey));
    this.eventBus.on('flip-view', () => this._flipView());
    
    // ✅ 保留系统间信号
    this.eventBus.on('coordinate-system-updated', ({ type }) => {
      if (type === 'position') {
        this._setRotationCenterToOrigin();
      }
    });
    this.eventBus.on('data-processing-completed', () => {
      this._setRotationCenterToOrigin();
      logger.info('CameraSystem', '数据处理完成后已锁定旋转中心');
    });

    window.addEventListener('resize', () => this._handleResize());
  }
  
  /**
   * ✅ 新增: 统一处理配置变更
   */
  _handleConfigChange({ key, value }) {
    switch (key) {
      case 'camera.mode':
        this._switchToMode(value);
        break;
      
      case 'camera.fov':
        if (this.perspectiveCamera && this.currentMode === 'perspective') {
          this.perspectiveCamera.fov = value;
          this.perspectiveCamera.updateProjectionMatrix();
        }
        break;
        
      case 'particles.systemScale':
      case 'particles.sphereRadius':
        this._updateMaxDistance();
        break;
    }
  }

  _switchToMode(mode) {
    if (mode === this.currentMode) return;

    const prevCamera = this.activeCamera;
    this.currentMode = mode;

    if (mode === 'perspective') {
      this.activeCamera = this.perspectiveCamera;
      this.controls.camera = this.activeCamera;
      applyPerspMouseMapping(this.controls);
      if (prevCamera) {
        const position = prevCamera.position.clone();
        this.controls.setPosition(position.x, position.y, position.z, false);
        this.controls.setTarget(0, 0, 0, false);
      }
    } else if (mode === 'orthographic') {
      this.activeCamera = this.orthographicCamera;
      this.controls.camera = this.activeCamera;
      applyOrthoMouseMapping(this.controls);
      this._applyViewPreset('top');
    }
    
    this.eventBus.emit('camera-mode-switched', mode);
    this.eventBus.emit('camera-changed', this.activeCamera);
    logger.info('CameraSystem', `切换到${mode}相机`);
  }

  _applyViewPreset(viewKey) {
    const distance = 50;
    let position;
    switch (viewKey) {
      case 'top': position = new THREE.Vector3(0, distance, 0); break;
      case 'front': position = new THREE.Vector3(0, 0, distance); break;
      case 'side': position = new THREE.Vector3(distance, 0, 0); break;
      default: return;
    }
    this.controls.setLookAt(position.x, position.y, position.z, 0, 0, 0, true);
  }

  _flipView() {
    const currentPos = this.activeCamera.position.clone();
    const target = new THREE.Vector3();
    this.controls.getTarget(target);
    const newPos = target.clone().add(currentPos.sub(target).negate());
    this.controls.setLookAt(newPos.x, newPos.y, newPos.z, target.x, target.y, target.z, true);
  }

  _handleResize() {
    const aspect = window.innerWidth / window.innerHeight;
    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    const height = this.orthoFrustumSize / this.orthographicCamera.zoom;
    const width = height * aspect;
    this.orthographicCamera.left = -width / 2;
    this.orthographicCamera.right = width / 2;
    this.orthographicCamera.top = height / 2;
    this.orthographicCamera.bottom = -height / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  update(delta) {
    if (this.controls) this.controls.update(delta);
  }

  getActiveCamera() { return this.activeCamera; }
  getControls() { return this.controls; }
  
  dispose() {
    if (this.controls) this.controls.dispose();
    this.initialized = false;
    logger.info('CameraSystem', '相机系统已销毁');
  }
}

const cameraSys = new CameraSystem();
export default cameraSys;
