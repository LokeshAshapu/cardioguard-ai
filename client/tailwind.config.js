/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode manually
  theme: {
    extend: {
      colors: {
        primary: '#FF4B4B', // Cardiac Red
        secondary: '#1F2937', // Dark Gray
        accent: '#3B82F6', // Medical Blue
        bgDark: '#111827',
        cardDark: '#1F2937',
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
