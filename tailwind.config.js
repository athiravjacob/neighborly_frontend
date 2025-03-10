/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#2A124A", // violet-950 hex code
        },
      },
    },
  plugins: [],
  darkMode: 'class', // Enables dark mode with 'dark' class
  };