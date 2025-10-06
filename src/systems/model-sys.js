// 文件：src/systems/model-sys.js
// 说明：可替换模型系统（统一 {mount, unmount, update, getActive}）
// baseline = 你现有的 “粒子 + 路径/标记” 组合

import { info, warn, error } from '../utils/logger.js';

const REG = new Map();

export function createBaselineFactory({ createParticlesEnt, createMarkerEnt, initParticlesSys }) {
  return function baselineFactory(ctx) {
    const { scene, eventBus } = ctx;

    // 实体
    const particlesEnt = createParticlesEnt({ scene });
    const markerEnt = createMarkerEnt({ scene });

    // 系统
    const particlesSys = initParticlesSys({
      eventBus,
      dustPoints: particlesEnt.dustPoints,
      baseDustPositions: particlesEnt.baseDustPositions
    });

    return {
      key: 'baseline',
      update: (nowMs) => { particlesSys?.update?.(nowMs); },
      dispose: () => {
        try {
          particlesEnt?.dustPoints?.geometry?.dispose?.();
          particlesEnt?.dustPoints?.material?.dispose?.();
          scene.remove(particlesEnt?.dustPoints);

          markerEnt?.lineGroup?.clear?.();
          scene.remove(markerEnt?.currentMarker);
          markerEnt?.currentMarker?.geometry?.dispose?.();
          markerEnt?.currentMarker?.material?.dispose?.();
        } catch (e) {
          warn('ModelSys', 'baseline dispose 异常：' + e.message);
        }
      },
      // 给 animation-sys 用
      markerEnt
    };
  };
}

export function registerModel(key, factory) {
  REG.set(key, factory);
  info('ModelSys', `注册模型：${key}`);
}

export function initModelSys({ eventBus, scene }) {
  let active = null;
  const ctx = { eventBus, scene };

  function mount(key) {
    if (!REG.has(key)) { error('ModelSys', `未注册模型：${key}`); return null; }
    if (active) unmount();
    const inst = REG.get(key)(ctx);
    active = { key, inst };
    info('ModelSys', `已挂载模型：${key}`);
    return inst;
  }

  function unmount() {
    if (!active) return;
    try { active.inst?.dispose?.(); } catch {}
    info('ModelSys', `已卸载模型：${active.key}`);
    active = null;
  }

  function update(nowMs) { active?.inst?.update?.(nowMs); }
  function getActive() { return active?.inst || null; }

  eventBus.on('model:switch', (key) => mount(key), 'ModelSys');

  return { registerModel, mount, unmount, update, getActive };
}
