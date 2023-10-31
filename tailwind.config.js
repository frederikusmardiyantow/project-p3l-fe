/* eslint-disable no-undef */

import baseUrl from './src/config';


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
          `linear-gradient(rgba(255,255,255), rgba(0,0,0,.4), rgba(0,0,0,.3), rgba(0,0,0,.2), rgba(0,0,0,.1)), url(${baseUrl}hotel/hotel-resep.jpg)`,
        'login-bg': `linear-gradient( rgba(0,0,0,.1), rgba(0,0,0,.3)), url(${baseUrl}hotel/bagian-atas.jpg)`,
        'kamar-bg': `linear-gradient( rgba(0,0,0,.1), rgba(0,0,0,.3)), url(${baseUrl}hotel/kamar-6.webp)`,
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

