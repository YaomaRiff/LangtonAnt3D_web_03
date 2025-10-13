// eslint.config.js
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,

  {
    files: ['src/**/*.ts', 'src/**/*.js'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // 浏览器环境全局变量（扩充版）
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',

        // ✅ 核心修复：添加 performance
        performance: 'readonly',

        // DOM API
        HTMLElement: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',

        // 浏览器弹窗
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',

        // 网络请求
        fetch: 'readonly',
        XMLHttpRequest: 'readonly',

        // 异步控制
        AbortController: 'readonly',
        AbortSignal: 'readonly',

        // 音频 API
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',

      // 新增：放宽一些规则
      'no-prototype-builtins': 'off', // 允许使用 hasOwnProperty
      'no-case-declarations': 'off', // 允许 case 块中声明变量
    },
  },

  prettierConfig,
];
