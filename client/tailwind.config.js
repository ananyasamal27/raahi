/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matte-black': '#0B0F19',
        'deep-indigo': '#111827',
        'neon-teal': '#14B8A6',
        'electric-cyan': '#22D3EE',
        'amber': '#F59E0B',
        'soft-red': '#EF4444',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
