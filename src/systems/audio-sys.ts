/**
 * @file audio-sys.js
 * @description 音频系统 - 背景音乐管理
 */
import * as THREE from 'three';
import logger from '../utils/logger.js';
import config from '../config.js';

class AudioSystem {
  constructor() {
    this.eventBus = null;
    this.listener = null;
    this.sound = null;
    this.audioLoader = null;
    this.initialized = false;
    
    // 音频状态
    this.isPlaying = false;
    this.volume = 0.5;
    this.currentUrl = null;
    this.audioContext = null;
    this.contextResumed = false;
    
    // ✅ 延迟创建标记
    this.listenerCreated = false;
    this.camera = null;
  }

  async init({ eventBus, camera }) {
    if (this.initialized) {
      logger.warn('AudioSystem', '音频系统已经初始化过了');
      return this;
    }

    try {
      this.eventBus = eventBus;
      this.camera = camera;
      
      // ✅ 不在这里创建 AudioListener,等用户点击播放时再创建
      this.audioLoader = new THREE.AudioLoader();
      
      this._bindEvents();
      
      this.initialized = true;
      logger.info('AudioSystem', '音频系统初始化完成(延迟创建 AudioContext)');
      
      return this;
    } catch (err) {
      logger.error('AudioSystem', `初始化失败: ${err.message}`);
      throw err;
    }
  }

  // ✅ 首次播放时创建 AudioListener 和 AudioContext
  _ensureListenerCreated() {
    if (this.listenerCreated) return;
    
    try {
      // 创建音频监听器（绑定到相机）
      this.listener = new THREE.AudioListener();
      this.camera.add(this.listener);
      
      // 获取 AudioContext 引用
      this.audioContext = this.listener.context;
      
      // 创建音频对象
      this.sound = new THREE.Audio(this.listener);
      
      this.listenerCreated = true;
      logger.info('AudioSystem', 'AudioListener 已创建');
    } catch (err) {
      logger.error('AudioSystem', `创建 AudioListener 失败: ${err.message}`);
      throw err;
    }
  }

  _bindEvents() {
    this.eventBus.on('audio-toggle', () => {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.eventBus.on('audio-load', (url) => {
      this.loadAudio(url);
    });

    this.eventBus.on('audio-volume-changed', (volume) => {
      this.setVolume(volume);
    });

    this.eventBus.on('audio-stop', () => {
      this.stop();
    });
  }

   loadAudio(url) {
    if (!url) {
      logger.warn('AudioSystem', '音频 URL 为空');
      return;
    }

    this._ensureListenerCreated();

    // ✅ 2. 使用 resolveAssetUrl 包装路径
    const fetchUrl = resolveAssetUrl(url);

    logger.info('AudioSystem', `开始加载音频: ${fetchUrl}`);

    this.audioLoader.load(
      fetchUrl,
      (buffer) => {
        if (this.sound.isPlaying) {
          this.sound.stop();
        }
        
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(this.volume);
        this.currentUrl = url;
        
        logger.info('AudioSystem', '音频加载成功');
        this.eventBus.emit('audio-loaded', url);
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        logger.debug('AudioSystem', `加载进度: ${progress.toFixed(1)}%`);
      },
      (error) => {
        logger.error('AudioSystem', `加载失败: ${error.message}`);
        this.eventBus.emit('audio-load-error', error);
      }
    );
  }

  async play() {
    if (!this.sound || !this.sound.buffer) {
      logger.warn('AudioSystem', '没有加载音频');
      return;
    }

    // ✅ 确保 AudioContext 已恢复
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.contextResumed = true;
        logger.info('AudioSystem', 'AudioContext 已恢复');
      } catch (err) {
        logger.error('AudioSystem', `恢复 AudioContext 失败: ${err.message}`);
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

  setVolume(volume) {
    this.volume = THREE.MathUtils.clamp(volume, 0, 1);
    if (this.sound) {
      this.sound.setVolume(this.volume);
      logger.debug('AudioSystem', `音量: ${(this.volume * 100).toFixed(0)}%`);
    }
  }

  getVolume() {
    return this.volume;
  }

  isAudioPlaying() {
    return this.isPlaying;
  }

  dispose() {
    if (this.sound) {
      this.sound.stop();
      if (this.sound.buffer) {
        this.sound.buffer = null;
      }
    }

    if (this.listener && this.listener.parent) {
      this.listener.parent.remove(this.listener);
    }

    this.audioContext = null;
    this.listenerCreated = false;
    this.initialized = false;
    logger.info('AudioSystem', '音频系统已销毁');
  }
}

const audioSys = new AudioSystem();
export default audioSys;
