/**
 * @file camera-sys.ts
 * @description 相机系统 - 透视/正交切换 + camera-controls 集成
 * ✅ 核心简化:
 *   1. 完全移除旧的坐标模式（camera.position）
 *   2. 统一使用 initialDistance 在球面上初始化相机
 *   3. 删除了所有冗余的初始化逻辑
 */
import * as THREE from 'three';
import CameraControls from 'camera-controls';
import logger from '../utils/logger';
import config from '../config';
import { applyPerspMouseMapping, applyOrthoMouseMapping } from './controls-util';

CameraControls.install({ THREE });

class CameraSystem {
  private eventBus: any;
  public scene: THREE.Scene | null = null;
  private renderer: THREE.WebGLRenderer | null;
  private initialized: boolean;

  private perspectiveCamera: THREE.PerspectiveCamera | null;
  private orthographicCamera: THREE.OrthographicCamera | null;
  private activeCamera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null;
  private controls: CameraControls | null;
  private currentMode: string;

  private orthoFrustumSize: number;
  private particleSystemRadius: number;

  constructor() {
    this.eventBus = null;
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

  init({
    eventBus,
    scene,
    renderer,
  }: {
    eventBus: any;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
  }) {
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
    } catch (err: unknown) {
      logger.error('CameraSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  /**
   * ✅ 核心方法：创建相机（纯距离模式）
   */
  _createCameras() {
    const aspect = 16 / 9; // 占位符，将在 handleResize 时更新
    const fov = config.get('camera.fov') || 75;
    const near = config.get('camera.near') || 0.1;
    const far = config.get('camera.far') || 2000;

    this.perspectiveCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // ✅ 统一使用距离模式初始化
    const distance = config.get('camera.initialDistance') || 50;
    const phi = Math.PI / 4; // 45° 仰角
    const theta = Math.PI / 4; // 45° 方位角

    const x = distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.cos(phi);
    const z = distance * Math.sin(phi) * Math.sin(theta);

    this.perspectiveCamera.position.set(x, y, z);
    this.perspectiveCamera.name = 'PerspectiveCamera';

    logger.info(
      'CameraSystem',
      `透视相机已创建 | 初始距离: ${distance.toFixed(2)} | 位置: (${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)})`
    );

    // 创建正交相机
    const height = this.orthoFrustumSize;
    const width = height * aspect;

    this.orthographicCamera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      near,
      far
    );
    this.orthographicCamera.position.set(0, 50, 0);
    this.orthographicCamera.name = 'OrthographicCamera';
    this.orthographicCamera.zoom = 1.0;

    logger.debug('CameraSystem', '正交相机已创建');
  }

  /**
   * ✅ 核心方法：创建控制器（纯距离模式）
   */
  _createControls() {
    this.controls = new CameraControls(this.activeCamera!, this.renderer!.domElement);
    applyPerspMouseMapping(this.controls);

    const controlsConfig = config.get('camera.controls');
    this.controls.smoothTime = controlsConfig.smoothTime || 0.05;
    this.controls.draggingSmoothTime = controlsConfig.draggingSmoothTime || 0.25;
    this.controls.minDistance = controlsConfig.minDistance || 1;

    // 设置 maxDistance
    this._updateMaxDistance();

    // ✅ 统一使用距离模式设置初始位置
    const distance = config.get('camera.initialDistance') || 50;
    const phi = Math.PI / 4;
    const theta = Math.PI / 4;

    const x = distance * Math.sin(phi) * Math.cos(theta);
    const y = distance * Math.cos(phi);
    const z = distance * Math.sin(phi) * Math.sin(theta);

    this.controls.setPosition(x, y, z, false);
    this.controls.setTarget(0, 0, 0, false);

    logger.info('CameraSystem', `Controls 初始位置已设置 | 距离: ${distance.toFixed(2)}`);
  }

  /**
   * ✅ 更新 maxDistance
   */
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

  /**
   * ✅ 锁定旋转中心到世界原点
   */
  _setRotationCenterToOrigin() {
    if (this.controls) {
      this.controls.setTarget(0, 0, 0, false);
      logger.info('CameraSystem', '旋转中心锁定到世界原点 (0,0,0)');
    }
  }

  /**
   * ✅ 绑定事件监听
   */
  _bindEvents() {
    this.eventBus.on('config-changed', this._handleConfigChange.bind(this));
    this.eventBus.on('view-changed', (viewKey: string) => this._applyViewPreset(viewKey));
    this.eventBus.on('flip-view', () => this._flipView());

    this.eventBus.on('coordinate-system-updated', ({ type }: { type: string }) => {
      if (type === 'position') {
        this._setRotationCenterToOrigin();
      }
    });

    this.eventBus.on('data-processing-completed', () => {
      this._setRotationCenterToOrigin();
      logger.info('CameraSystem', '数据处理完成后已锁定旋转中心');
    });
  }

  /**
   * ✅ 处理配置变更
   */
  _handleConfigChange({ key, value }: { key: string; value: any }) {
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

      case 'camera.initialDistance':
        this._updateCameraDistance(value);
        break;

      case 'particles.systemScale':
      case 'particles.sphereRadius':
        this._updateMaxDistance();
        break;
    }
  }

  /**
   * ✅ 动态更新相机距离（保持当前朝向）
   */
  private _updateCameraDistance(distance: number) {
    if (!this.controls || !this.perspectiveCamera || distance <= 0) return;

    const target = new THREE.Vector3();
    this.controls.getTarget(target);

    const direction = new THREE.Vector3()
      .subVectors(this.perspectiveCamera.position, target)
      .normalize();

    const newPosition = direction.multiplyScalar(distance).add(target);

    this.controls.setPosition(newPosition.x, newPosition.y, newPosition.z, true);

    logger.info('CameraSystem', `相机距离已更新: ${distance.toFixed(2)}`);
  }

  /**
   * ✅ 切换相机模式
   */
  _switchToMode(mode: string) {
    if (mode === this.currentMode || !this.controls) return;

    const prevCamera = this.activeCamera;
    this.currentMode = mode;

    if (mode === 'perspective') {
      this.activeCamera = this.perspectiveCamera;
      this.controls.camera = this.activeCamera!;
      applyPerspMouseMapping(this.controls);
      if (prevCamera) {
        const position = prevCamera.position.clone();
        this.controls.setPosition(position.x, position.y, position.z, false);
        this.controls.setTarget(0, 0, 0, false);
      }
    } else if (mode === 'orthographic') {
      this.activeCamera = this.orthographicCamera;
      this.controls.camera = this.activeCamera!;
      applyOrthoMouseMapping(this.controls);
      this._applyViewPreset('top');
    }

    this.eventBus.emit('camera-mode-switched', mode);
    this.eventBus.emit('camera-changed', this.activeCamera);
    logger.info('CameraSystem', `切换到${mode}相机`);
  }

  /**
   * ✅ 应用视图预设
   */
  _applyViewPreset(viewKey: string) {
    if (!this.controls) return;
    const distance = 50;
    let position;
    switch (viewKey) {
      case 'top':
        position = new THREE.Vector3(0, distance, 0);
        break;
      case 'front':
        position = new THREE.Vector3(0, 0, distance);
        break;
      case 'side':
        position = new THREE.Vector3(distance, 0, 0);
        break;
      default:
        return;
    }
    this.controls.setLookAt(position.x, position.y, position.z, 0, 0, 0, true);
  }

  /**
   * ✅ 翻转视图
   */
  _flipView() {
    if (!this.controls || !this.activeCamera) return;
    const currentPos = this.activeCamera.position.clone();
    const target = new THREE.Vector3();
    this.controls.getTarget(target);
    const newPos = target.clone().add(currentPos.sub(target).negate());
    this.controls.setLookAt(newPos.x, newPos.y, newPos.z, target.x, target.y, target.z, true);
  }

  /**
   * ✅ 处理窗口大小变化
   */
  handleResize(width: number, height: number) {
    if (!this.perspectiveCamera || !this.orthographicCamera) return;

    const aspect = width / height;

    this.perspectiveCamera.aspect = aspect;
    this.perspectiveCamera.updateProjectionMatrix();

    const orthoHeight = this.orthoFrustumSize / this.orthographicCamera.zoom;
    const orthoWidth = orthoHeight * aspect;
    this.orthographicCamera.left = -orthoWidth / 2;
    this.orthographicCamera.right = orthoWidth / 2;
    this.orthographicCamera.top = orthoHeight / 2;
    this.orthographicCamera.bottom = -orthoHeight / 2;
    this.orthographicCamera.updateProjectionMatrix();
  }

  /**
   * ✅ 每帧更新
   */
  update(delta: number) {
    if (this.controls) this.controls.update(delta);
  }

  /**
   * ✅ 获取当前相机
   */
  getActiveCamera(): THREE.PerspectiveCamera | THREE.OrthographicCamera {
    return this.activeCamera!;
  }

  /**
   * ✅ 获取控制器
   */
  getControls(): CameraControls {
    return this.controls!;
  }

  /**
   * ✅ 销毁系统
   */
  dispose() {
    if (this.controls) this.controls.dispose();
    this.initialized = false;
    logger.info('CameraSystem', '相机系统已销毁');
  }
}

const cameraSys = new CameraSystem();
export default cameraSys;
