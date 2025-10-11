//这个项目的dist分支网页托管方案失败了
//所以生成dist文件之后，要手动复制内容粘贴到LangtonAnt3D_dist文件夹下
//LangtonAnt3D_dist文件新建了一个仓库用于github网页托管

/**
 * @file vite.config.ts
 * @description Vite 配置文件 (TypeScript版本)
 */
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';

  return {
    base: isProduction ? '/LangtonAnt3D_dist/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // 可以添加更多配置...
  };
});
