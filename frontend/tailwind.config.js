/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      animation: {
        matrix: 'matrix 20s linear infinite',
      },
      keyframes: {
        matrix: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        },
      },
    },
  },
  // ...rest of your config
}