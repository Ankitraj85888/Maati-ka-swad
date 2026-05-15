/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mustard:     { DEFAULT: '#E1AD01', light: '#F5D547', dark: '#B8900A' },
        terracotta:  { DEFAULT: '#C1440E', light: '#E05A24', dark: '#8E3209' },
        deepred:     { DEFAULT: '#8B0000', light: '#B22222', dark: '#5C0000' },
        cream:       { DEFAULT: '#FFF8E7', dark: '#F5ECD0', darker: '#E8DDB8' },
        earthbrown:  { DEFAULT: '#5C4033', light: '#7A5A4A', dark: '#3E2A20' },
        darkbrown:   '#2C1810',
        warmwhite:   '#FFFDF5',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-bihar': 'linear-gradient(135deg, #2C1810 0%, #5C4033 50%, #8B0000 100%)',
        'gradient-warm':  'linear-gradient(135deg, #FFF8E7 0%, #F5ECD0 100%)',
        'gradient-hero':  'linear-gradient(135deg, #2C1810 0%, #3E2A20 40%, #5C0000 100%)',
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'float-slow':  'floatSlow 8s ease-in-out infinite',
        'fade-up':     'fadeUp 0.8s ease-out forwards',
        'fade-in':     'fadeIn 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.8s ease-out forwards',
        'pulse-soft':  'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':      { transform: 'translateY(-8px) rotate(2deg)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideRight: {
          '0%':   { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
