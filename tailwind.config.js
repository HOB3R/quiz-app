/* global module */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          400: '#4ade80',
          600: '#16a34a',
        },
      },
      backgroundImage: {
        'pattern': `
          radial-gradient(black 55%, #0000),
          linear-gradient(
            135deg,
            red,
            orange,
            yellow,
            lime,
            cyan,
            blue,
            indigo,
            deeppink
          )
        `,
      },
      backgroundSize: {
        'pattern': '100% 0.5%, contain',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-pattern'
  ],
}
