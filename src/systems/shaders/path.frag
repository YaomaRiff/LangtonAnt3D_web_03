/**
 * @file path.frag
 * @description 路径线段的片元着色器
 * ✨ 重构: 移除了 uEmissiveIntensity 和 uColor uniform，辉光由后处理 bloom 效果决定。
 */
uniform vec3 uEmissive; // 路径的颜色
uniform float uDepthIntensity;
uniform vec3 uCameraPosition;
varying vec3 vWorldPosition;

void main() {
  // 最终颜色直接使用 uEmissive。如果该颜色足够亮，后处理系统中的 Bloom 效果会自动捕捉它。
  vec3 finalColor = uEmissive;
  
  // 根据与相机的距离计算 alpha 透明度，实现景深效果
  float distToCamera = length(vWorldPosition - uCameraPosition);
  float fade = smoothstep(0.0, 200.0, distToCamera); // 在200个单位的距离内渐变
  float alpha = 1.0 - fade * uDepthIntensity;
  
  gl_FragColor = vec4(finalColor, alpha);
}
