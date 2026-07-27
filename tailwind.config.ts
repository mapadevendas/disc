import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: { omega: { gold: '#C8A95E', blue: '#0F3D56', black: '#000000', white: '#FFFFFF' } },
      fontFamily: { sans: ['var(--font-inter)'], display: ['var(--font-poppins)'] },
      boxShadow: { glow: '0 0 80px rgba(200,169,94,.18)' },
      backgroundImage: { 'gold-gradient': 'linear-gradient(135deg,#C8A95E 0%,#f4df9f 45%,#C8A95E 100%)' }
    },
  },
  plugins: [],
};
export default config;
