/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F1E8',
        darkBrown: '#3B2F2F',
        sage: '#8B9D83',
        olive: '#707C5C',
        manila: '#F4E8C1',
        dustyPink: '#D4A5A5',
      },
      fontFamily: {
        script: ['Allura', 'cursive'],
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}