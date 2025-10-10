/// <reference types="vite/client" />

// ✅ 新增: Vite 环境变量类型
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 添加其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ✅ 保留原有的原生资源导入
declare module '*?raw' {
  const content: string;
  export default content;
}

// ✅ 新增: GLSL 着色器导入支持
declare module '*.vert?raw' {
  const content: string;
  export default content;
}

declare module '*.frag?raw' {
  const content: string;
  export default content;
}
