/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      // 自定义品牌色彩 - 匹配现有的设计风格
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          border: 'rgba(255, 255, 255, 0.2)',
          dark: 'rgba(0, 0, 0, 0.3)',
        },
        primary: {
          DEFAULT: '#4a7c7e',
          light: '#6a9c9e',
          dark: '#2a5c5e',
        },
        accent: '#4a7c7e',
        surface: {
          DEFAULT: '#2a2a2c',
          light: '#353538',
          dark: '#1a1a1c',
        }
      },
      // 动画配置
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(74, 124, 126, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(74, 124, 126, 0.8)' },
        },
      },
      // 毛玻璃效果
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      }
    },
  },
  plugins: [],
}