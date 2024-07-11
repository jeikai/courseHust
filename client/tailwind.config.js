/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': '#7ECCCD',
        'primary-green': '#49BBBD',
        "primary-blue": "#2F327D",
        "secondary-blue": "#EBF5FF",
      }
    },
  },
  plugins: [],
}