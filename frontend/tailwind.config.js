/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '13px',
      },
      borderRadius: {
        'badge': '6px',
        'card': '8px',
        'panel': '12px',
        'pill': '20px',
      },
      colors: {
        gray: {
          750: '#2d3748', // intermediate gray if needed
        }
      }
    },
  },
  plugins: [],
}
