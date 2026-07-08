/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#0B0F14',
        panel: '#131A22',
        surface: '#182028',
        line: '#2A3542',
        ink: '#E7EDF2',
        'ink-muted': '#8AA0B2',
        accent: '#5EEAD4',
        safe: '#3FB67F',
        warning: '#E0A730',
        critical: '#DC4C4C',
      },
    },
  },
  plugins: [],
};
