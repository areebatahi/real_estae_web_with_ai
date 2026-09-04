/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: {
          50: "#f5f6f7",
          100: "#e6e8ea",
          200: "#c3c8cd",
          300: "#9aa2aa",
          400: "#6b747d",
          500: "#4a525b",
          600: "#363d45",
          700: "#282d33",
          800: "#1a1e23",
          900: "#101317",
          950: "#0a0c0e",
        },
        emerald: {
          50: "#eefbf4",
          100: "#d6f5e3",
          200: "#aeeaca",
          300: "#78d8a9",
          400: "#43bf87",
          500: "#22a06d",
          600: "#158058",
          700: "#126648",
          800: "#12513b",
          900: "#0f4232",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "serif"],
      },
      boxShadow: {
        premium: "0 8px 30px -8px rgba(16, 19, 23, 0.15)",
      },
    },
  },
  plugins: [],
};
