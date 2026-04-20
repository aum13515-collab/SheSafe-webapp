/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FDF2F8',
          100: '#FCE4F2',
          200: '#F8BAD0',
          300: '#F48FB1',
          400: '#F06292',
          500: '#EC407A',
          600: '#E91E8C',
          700: '#C2185B',
          800: '#AD1457',
          900: '#880E4F',
        },
        danger: '#D32F2F',
        success: '#2E7D32',
        warning: '#F57F17'
      },
      fontFamily: {
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif']
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
