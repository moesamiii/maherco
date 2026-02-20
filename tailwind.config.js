/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        kickGreen: "#00FF66",
        darkBg: "#0D0D0D",
      },
    },
  },
  plugins: [],
};
