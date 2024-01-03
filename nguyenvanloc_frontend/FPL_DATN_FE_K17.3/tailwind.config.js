/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme")
const lineClamp = require("@tailwindcss/line-clamp")

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xxs:"480px",
      xs :"575px",
      
      ...defaultTheme.screens,
    },
    extend: {
    },
  },
  plugins: [lineClamp],
}