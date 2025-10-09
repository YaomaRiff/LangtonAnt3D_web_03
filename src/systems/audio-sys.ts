/**
 * @file audio-sys.ts
 * @description 音频系统 - 背景音乐管理与播放控制
 * @🔧 修正: 修复了因未正确解析资源URL导致音频加载失败的问题。
 * @🔧 修正: 规范化了模块导入，移除了.js后缀。
 * @✨ 优化: 延迟创建AudioContext，直到用户首次交互，以符合浏览器策略。
 */
import * as THREE from 'three';
import logger from '../utils/logger';
import config from '../config';
import { resolveAssetUrl } from '../utils/url-resolver'; // ✅ 核心修正：导入URL解析工具

class AudioSystem {
  private eventBus: any;
  private camera: THREE.Camera | null;
  private listener: THREE.AudioListener | null;
  private sound: THREE.Audio | null;
  private audioLoader: THREE.AudioLoader;
  private initialized: boolean;
  
  private isPlaying: boolean;
  private volume: number;
  private currentUrl: string | null;
  private audioContext: AudioContext | null;
  
  private listenerCreated: boolean;

  constructor() {
    this.eventBus = null;
    this.camera = null;
    this.listener = null;
    this.sound = null;
    this.audioLoader = new THREE.AudioLoader();
    this.initialized = false;
    
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentUrl = null;
    this.audioContext = null;
    
    this.listenerCreated = false;
  }

  async init({ eventBus, camera }: { eventBus: any, camera: THREE.Camera }) {
    if (this.initialized) {
      logger.warn('AudioSystem', '音频系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.camera = camera;
      
      this._bindEvents();
      
      this.initialized = true;
      logger.info('AudioSystem', '音频系统初始化完成(延迟创建 AudioContext)');
      
      return this;
    } catch (err) {
      logger.error('AudioSystem', `初始化失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _ensureListenerCreated() {
    if (this.listenerCreated || !this.camera) return;
    
    try {
      this.listener = new THREE.AudioListener();
      this.camera.add(this.listener);
      
      this.audioContext = this.listener.context;
      this.sound = new THREE.Audio(this.listener);
      
      this.listenerCreated = true;
      logger.info('AudioSystem', 'AudioListener 已创建');
    } catch (err) {
      logger.error('AudioSystem', `创建 AudioListener 失败: ${(err as Error).message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('audio-toggle', () => {
      this._ensureListenerCreated(); // 确保在切换时已创建
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.eventBus.on('audio-load', (url: string) => {
      this.loadAudio(url);
    });

    this.eventBus.on('audio-volume-changed', (volume: number) => {
      this.setVolume(volume);
    });

    this.eventBus.on('audio-stop', () => {
      this.stop();
    });
  }

  loadAudio(url: string) {
    if (!url) {
      logger.warn('AudioSystem', '音频 URL 为空');
      return;
    }

    this._ensureListenerCreated();
    if (!this.sound) return;

    // ✅ 核心修正: 使用 resolveAssetUrl 包装路径
    const fetchUrl = resolveAssetUrl(url);

    logger.info('AudioSystem', `开始加载音频: ${fetchUrl}`);

    this.audioLoader.load(
      fetchUrl,
      (buffer) => {
        if (!this.sound) return;
        if (this.sound.isPlaying) {
          this.sound.stop();
        }
        
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(this.volume);
        this.currentUrl = url;
        
        logger.info('AudioSystem', '✅ 音频加载成功');
        this.eventBus.emit('audio-loaded', url);
      },
      undefined,
      (error) => {
        logger.error('AudioSystem', `加载失败: ${error.message || '未知错误'}`);
        this.eventBus.emit('audio-load-error', error);
      }
    );
  }

  async play() {
    if (!this.sound || !this.sound.buffer) {
      logger.warn('AudioSystem', '没有加载音频，无法播放');
      return;
    }

    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        logger.info('AudioSystem', 'AudioContext 已恢复');
      } catch (err) {
        logger.error('AudioSystem', `恢复 AudioContext 失败: ${(err as Error).message}`);
        return;
      }
    }

    if (!this.sound.isPlaying) {
      this.sound.play();
      this.isPlaying = true;
      logger.info('AudioSystem', '开始播放');
      this.eventBus.emit('audio-playing', true);
    }
  }

  pause() {
    if (this.sound && this.sound.isPlaying) {
      this.sound.pause();
      this.isPlaying = false;
      logger.info('AudioSystem', '暂停播放');
      this.eventBus.emit('audio-playing', false);
    }
  }

  stop() {
    if (this.sound && this.sound.isPlaying) {
      this.sound.stop();
      this.isPlaying = false;
      logger.info('AudioSystem', '停止播放');
      this.eventBus.emit('audio-playing', false);
    }
  }

  setVolume(volume: number) {
    this.volume = THREE.MathUtils.clamp(volume, 0, 1);
    if (this.sound) {
      this.sound.setVolume(this.volume);
      logger.debug('AudioSystem', `音量: ${(this.volume * 100).toFixed(0)}%`);
    }
  }

  dispose() {
    this.stop();

    if (this.listener && this.camera) {
      this.camera.remove(this.listener);
    }

    this.sound = null;
    this.listener = null;
    this.audioContext = null;
    this.listenerCreated = false;
    this.initialized = false;
    logger.info('AudioSystem', '音频系统已销毁');
  }
}

const audioSys = new AudioSystem();
export default audioSys;
