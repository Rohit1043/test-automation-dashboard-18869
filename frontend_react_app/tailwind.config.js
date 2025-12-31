module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1E3A8A", // Corporate Navy
          secondary: "#F59E0B", // Gold accent
          success: "#059669",
          error: "#DC2626",
          background: "#F3F4F6",
          surface: "#FFFFFF",
          text: "#111827",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 8px 20px rgba(17,24,39,0.06)",
      },
    },
  },
  plugins: [],
};
