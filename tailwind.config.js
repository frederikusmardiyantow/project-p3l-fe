/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern':
          "linear-gradient(rgba(0,0,0,.5), rgba(166, 166, 166,.5), rgba(0,0,0,.5)), url('hotel/hotel-resep.jpg')",
        'login-bg': "linear-gradient( rgba(0,0,0,.1), rgba(0,0,0,.3)), url('hotel/bagian-atas.jpg')",
      },
      height: {
        '128': '32rem',
      },
      colors: {
        'primary' : '#0046b6',
        'secondary' : '#fc993a',
        'black-1' : '#252525',
      },
      dropShadow: {
        'logo-shadow' : "0 0px 15px #000"
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

