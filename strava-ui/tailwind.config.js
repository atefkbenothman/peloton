/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*/.js"
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        "black": "#222222",
        "bgWhite": "#F2F2F2",
        "red": {
          100: "#F7A2A9",
          300: "#F26470",
          500: "#ED2839",
        },
        "orange": {
          100: "#FFCE92",
          300: "#FFAD49",
          500: "#FF8C00",
        },
        "yellow": {
          100: "#FFEF92",
          300: "#FFE449",
          500: "#FFD800",
        },
        "green": {
          100: "#85D6A8",
          300: "#50C583",
          500: "#009E60",
        },
        "blue": {
          100: "#84B1F5",
          300: "#317DEE",
          500: "#0F52BA",
        },
        "purple": {
          100: "#CDA5F3",
          300: "#AC68EA",
          500: "#8A2BE2",
        },
      },
    },
  },
  plugins: [
    require("tw-elements/dist/plugin")
  ],
}