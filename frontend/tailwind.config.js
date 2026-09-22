/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F97316',
        primaryHover: '#EA580C',
        freshGreen: '#16A34A',
        creamBg: '#FFF8F0',
        cardWhite: '#FFFFFF',
        darkText: '#1F2937',
        mutedGray: '#6B7280',
        borderGray: '#E5E7EB',
        warningAmber: '#F59E0B',
        errorRed: '#DC2626'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}