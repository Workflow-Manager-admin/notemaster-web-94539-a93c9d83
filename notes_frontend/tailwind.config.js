module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#4B5563",
        accent: "#F59E42",
        background: "#ffffff",
        darkbg: "#17181B",        // Minimalist, nearly black background for dark mode
        darksurface: "#232428",   // For card/surfaces, subtle contrast
        darkfg: "#ECECEC",        // Foreground text in dark mode
        darksecondary: "#A1A1AA", // Secondary text in dark mode
        darkaccent: "#F9B44D"     // Slightly softer accent for dark mode
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'Arial', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
}
