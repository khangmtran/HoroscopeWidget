/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,tsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // NOTE: Add custom colors, fonts, etc. here.
      colors: {
        // black primary
        light: "#EBECEF",
        dark: "A9A9A9",
        blueButton: "#007AFF",
      },
    },
  },
  plugins: [],
};
