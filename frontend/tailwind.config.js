import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "lg+": "1200px",
        xs: "425px",
        "xs+": "375px",
      },
      fontFamily: {
        Grotesk: ["Cabinet Grotesk", "sans-serif"],
        Rouge: ["Rouge Script", "cursive"],
        poppins: ["Poppins", "serif"],
      },
      animation: {
        "slide-in-from-right": "slide-in-from-right .1s ease-in",
        "slide-out-to-right": "slide-out-to-right .1s ease-in",
        "fade-into-view": "fade-into-view .1s linear",
        "fade-out-from-view": "fade-out-from-view .1s linear",
      },
      keyframes: {
        "slide-in-from-right": {
          from: {
            transform: "translateX(20rem)",
            opacity: "0",
          },
          to: {
            transform: "translateX(0)",
            opacity: "100%",
          },
        },
        "slide-out-to-right": {
          from: {
            transform: "translateX(0)",
            opacity: "100%",
          },
          to: {
            transform: "translateX(20rem)",
            opacity: "0",
          },
        },
        "fade-into-view": {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "100%",
          },
        },
        "fade-out-to-view": {
          from: {
            opacity: "100%",
          },
          to: {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [forms],
};
