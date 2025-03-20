/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      screens: {
        'xs': '480px',  // Custom breakpoint for 450px
      },
    },
  },
  plugins: [],
} 