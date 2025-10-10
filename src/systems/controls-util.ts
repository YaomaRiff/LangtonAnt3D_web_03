// 说明：集中封装 CameraControls 的鼠标/触控映射
import CameraControls from 'camera-controls';

// 透视：常规轨道（滚轮：DOLLY；禁用 dollyToCursor，避免 target 被推偏）
export function applyPerspMouseMapping(controls: any) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left = A.ROTATE;
  controls.mouseButtons.middle = A.TRUCK; // 中键平移
  controls.mouseButtons.right = A.TRUCK; // 右键平移
  controls.mouseButtons.wheel = A.DOLLY; // 滚轮推拉（透视）

  // 触控
  controls.touches.one = A.TOUCH_ROTATE;
  controls.touches.two = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 手感：滚轮力度；并明确关闭“朝指针处推拉”以保 target 固定
  controls.dollySpeed = 0.8;
  controls.dollyToCursor = false; // ✅ 根因修复
  controls.zoomToCursor = false;
}

// 正交：禁用旋转；滚轮用 ZOOM（必须），开启 zoomToCursor
export function applyOrthoMouseMapping(controls: any) {
  const A = CameraControls.ACTION;
  controls.mouseButtons.left = A.NONE; // 禁止左键旋转
  controls.mouseButtons.middle = A.TRUCK; // 中键平移
  controls.mouseButtons.right = A.TRUCK; // 右键平移
  controls.mouseButtons.wheel = A.ZOOM; // ✅ 正交必须用 ZOOM

  controls.touches.one = A.NONE;
  controls.touches.two = A.TOUCH_TRUCK;
  controls.touches.three = A.TOUCH_DOLLY_TRUCK;

  // 正交缩放更有力，并以指针为中心缩放
  controls.dollySpeed = 1.5;
  controls.zoomToCursor = true;
  controls.dollyToCursor = false;
}

// 默认（向后兼容）
export function applyDefaultMouseMapping(controls: any) {
  applyPerspMouseMapping(controls);
}
