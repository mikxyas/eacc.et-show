/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: true, // or 'media' or 'class'
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderOpacity: {
        "light": "30%"
      },
      backgroundColor: {
        "main-content": "#1e1e1e",
        "input": "#2d2d2d"
      },
      margin: {
        "comment": "-1.09rem",
      },
      width: {
        "reply-pc": '30vw',

      },
      fontFamily: {
        "roboto": ["Source Code"],
        // "commit": ["Commit", "sans-serif"],
      },

      fontSize: {
        "2xs": "10.3px",
        "3xs": "6px",
        "4xs": "3.36px",
        "5xs": "2.8px",
      },
    },
  },
  plugins: [],
}

