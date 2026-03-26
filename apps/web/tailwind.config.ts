import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens từ css/design-system.css cũ
        sage:     '#4a7c59',   // --sage: màu xanh lá chủ đạo
        'sage-dark': '#2d5a3d',
        'sage-light': '#ddeee3',
        'warm-bg': '#f9f9f7',  // --bg-warm
        'warm-surface': '#f3f2ee',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
export default config;
