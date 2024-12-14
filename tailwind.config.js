/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#4f46e5",
          light: "#818cf8",
          dark: "#3730a3",
          hover: "#4338ca",
          selected: "#a5b4fc",
        },
      },
    },
  },
  plugins: [],
};
