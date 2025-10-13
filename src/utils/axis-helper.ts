/**
 * @file axis-helper.ts
 * @description 坐标轴可视化工具 - 用于调试对象位置
 * @version 1.0
 */
import * as THREE from 'three';
import logger from './logger';

/**
 * 创建带标签的坐标轴辅助线
 * @param size - 轴线长度
 * @param position - 初始位置
 * @returns 坐标轴组对象
 */
export function createAxisHelper(
  size: number = 1.0,
  position: THREE.Vector3 = new THREE.Vector3()
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'AxisHelper';
  group.position.copy(position);

  // X轴 (红色)
  const xGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(size, 0, 0),
  ]);
  const xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
  const xAxis = new THREE.Line(xGeometry, xMaterial);
  xAxis.name = 'X-Axis';
  group.add(xAxis);

  // Y轴 (绿色)
  const yGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, size, 0),
  ]);
  const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00, linewidth: 2 });
  const yAxis = new THREE.Line(yGeometry, yMaterial);
  yAxis.name = 'Y-Axis';
  group.add(yAxis);

  // Z轴 (蓝色)
  const zGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, size),
  ]);
  const zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff, linewidth: 2 });
  const zAxis = new THREE.Line(zGeometry, zMaterial);
  zAxis.name = 'Z-Axis';
  group.add(zAxis);

  // 添加端点球体作为标记
  const sphereGeometry = new THREE.SphereGeometry(size * 0.05, 8, 8);

  const xSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  xSphere.position.set(size, 0, 0);
  group.add(xSphere);

  const ySphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  ySphere.position.set(0, size, 0);
  group.add(ySphere);

  const zSphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
  zSphere.position.set(0, 0, size);
  group.add(zSphere);

  logger.debug('AxisHelper', `坐标轴已创建 | 大小: ${size}`);

  return group;
}

/**
 * 更新坐标轴辅助线的位置
 */
export function updateAxisHelper(axisGroup: THREE.Group, position: THREE.Vector3): void {
  axisGroup.position.copy(position);
}

/**
 * 切换坐标轴的可见性
 */
export function toggleAxisHelper(axisGroup: THREE.Group, visible: boolean): void {
  axisGroup.visible = visible;
}
