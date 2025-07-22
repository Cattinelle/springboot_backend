/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      boxShadow: {
        "white-shadow": "0px 0px 3px 0px #C2C2C2",
        "black-shadow": "0px 0px 1px 0px rgba(0, 0, 0, 0.25)",
      },
      colors: {
        primary: "#E95B0C",
        secondary: "#C8150C",
        tertiary: "#FBF1E8",
        neutral: {
          10: "#FFFFFF", //  White
          20: "#F5F5F5",
          30: "#EDEDED",
          40: "#E0E0E0",
          50: "#C2C2C2",
          60: "#9E9E9E",
          70: "#757575",
          80: "#616161",
          90: "#404040",
          100: "#0A0A0A", // Black
        },
      },
      fontFamily: {
        Manrope: ["Manrope"],
        Montserrat: ["Montserrat"],
      },
      fontSize: {
        Heading1: ["40px", { lineHeight: "120%" }],
        Heading2: ["32px", { lineHeight: "120%" }],
        Heading3: ["24px", { lineHeight: "120%" }],
        Heading4: ["22px", { lineHeight: "120%" }],
        Heading5: ["20px", { lineHeight: "120%" }],
        Heading6: ["18px", { lineHeight: "120%" }],
        BodyRegular: ["16px", { lineHeight: "120%" }],
        BodyBold: ["16px", { lineHeight: "120%" }],
        BodySmallRegular: ["14px", { lineHeight: "120%" }],
        BodySmallBold: ["14px", { lineHeight: "120%" }],
        Caption: ["12px", { lineHeight: "120%" }],
      },
    },
  },
  plugins: [],
};
