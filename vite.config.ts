// import { defineConfig } from 'vite'

// // https://vitejs.dev/config/
// export default defineConfig(({ command }) => {
//   if (command === 'build') {
//     // build a project for production
//     return {
//       base: '/LangtonAnt3D_dist/', // 你的部署仓库名
//     }
//   } else {
//     // serve a project for development
//     return {
//       // 在开发模式下，base 路径默认为 '/'，所以这里可以留空或者显式设置为 '/'
//       base: '/',
//     }
//   }
// })

/**
 * @file vite.config.ts
 * @description Vite 配置文件 (TypeScript版本)
 */
import { defineConfig } from 'vite'
import path from 'path'

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
  }
})
