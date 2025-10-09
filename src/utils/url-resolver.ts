/**
 * @file url-resolver.js
 * @description 统一处理应用内资源URL的工具，确保在不同部署环境下路径正确。
 */

/**
 * 将相对路径解析为基于部署环境的正确绝对路径。
 * 它利用 Vite 的 `import.meta.env.BASE_URL` 环境变量。
 * 开发时 BASE_URL 是 '/'
 * 构建后 BASE_URL 是 '/LangtonAnt3D_web_03/'
 * @param {string} path - 相对于 public 目录的资源路径，例如 'data/data.csv' 或 '/presets/01.json'
 * @returns {string} - 解析后的完整 URL 路径
 */
export function resolveAssetUrl(path) {
  // import.meta.env.BASE_URL 在 vite.config.js 中配置，末尾自带'/'
  // 确保传入的路径没有开头的'/'，避免出现'//'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${cleanPath}`;
}
