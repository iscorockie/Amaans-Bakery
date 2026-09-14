/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette — warm, artisanal, premium African bakery.
        primary: {
          DEFAULT: "#7B1E1E",
          50: "#FBF0F0",
          100: "#F5DCDC",
          200: "#E9B7B7",
          300: "#D98C8C",
          400: "#B95252",
          500: "#9A3434",
          600: "#7B1E1E",
          700: "#641818",
          800: "#4C1212",
          900: "#360D0D",
        },
        cream: {
          DEFAULT: "#F8F1E3",
          dark: "#F0E6D2",
        },
        gold: {
          DEFAULT: "#D4A373",
          light: "#E5C9A8",
          dark: "#B9854F",
        },
        cocoa: {
          DEFAULT: "#3E2723",
          light: "#5D4037",
        },
        beige: "#EFE7D8",
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FEF2F2",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        body: ['"Nunito Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(62, 39, 35, 0.18)",
        card: "0 10px 30px -12px rgba(62, 39, 35, 0.25)",
        drawer: "-12px 0 40px -12px rgba(62, 39, 35, 0.35)",
      },
      backgroundImage: {
        "grain": "radial-gradient(rgba(62,39,35,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
