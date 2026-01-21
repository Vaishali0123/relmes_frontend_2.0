// tailwind.config.js
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // For App Router (Next 13+)
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'yatra-one': ['Yatra One', 'cursive'],
      },
      screens: {
        pn: "0px",
        vs: "200px",
        ss: "360px",
        pp: "500px",
        sm: "821px",
        md: "1180px",
        lg: "1440px",
        xl: "1536px",
        xxl: "1900px",
      },
      keyframes: {
        jumpAngle: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(10deg)" },
        },
      },
      animation: {
        "jump-angle": "jumpAngle 2s ease-in-out infinite",
      },
      // keyframes: {
      //   fadeIn: {
      //     "0%": { opacity: "0", transform: "translateY(-10px)" },
      //     "100%": { opacity: "1", transform: "translateY(0)" },
      //   },
      //   typingBounce: {
      //     "0%, 80%, 100%": {
      //       transform: "scale(0.8)",
      //       opacity: "0.5",
      //     },
      //     "40%": {
      //       transform: "scale(1.2)",
      //       opacity: "1",
      //     },
      //   },
      //   typingPulse: {
      //     "0%, 60%, 100%": {
      //       transform: "scale(0.9) translateY(0)",
      //       opacity: "0.4",
      //     },
      //     "30%": {
      //       transform: "scale(1.4) translateY(-6px)",
      //       opacity: "1",
      //     },
      //   },
      //   cardSpread: {
      //     "0%": {
      //       opacity: "0",
      //       transform: "translateX(0) translateY(30px) scale(0.7)",
      //     },
      //     "60%": {
      //       opacity: "0.9",
      //     },
      //     "100%": {
      //       opacity: "1",
      //       transform: "translateX(var(--spread-x, 0)) translateY(0) scale(1)",
      //     },
      //   },
      //   cardFloat: {
      //     "0%, 100%": { transform: "translateY(0)" },
      //     "50%": { transform: "translateY(-8px)" },
      //   },
      // },
      // animation: {
      //   fadeIn: "fadeIn 0.2s ease-out",
      //   "typing-bounce": "typingBounce 1.4s ease-in-out infinite",
      //   "typing-pulse": "typingPulse 1.2s ease-in-out infinite",
      //   "card-spread": "cardSpread 0.9s cubic-bezier(0.16, 1, 0.3, 1) both",
      //   "card-float": "cardFloat 4s ease-in-out infinite",
      // },
    },
  },
  plugins: [],
};