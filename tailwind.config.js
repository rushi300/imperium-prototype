/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        surface: "#14141C",
        elevated: "#1E1E28",
        line: "#2A2A38",
        "line-strong": "#3D3D4E",
        ink: "#FFFFFF",
        "ink-2": "#B4B4C8",
        "ink-3": "#7A7A92",
        "ink-dis": "#4A4A5C",
        magenta: "#FF2D77",
        "magenta-h": "#FF5590",
        "magenta-d": "#C41E5A",
        flame: "#FF8A3D",
        open: "#34D399",
        closing: "#FBBF24",
        closed: "#7A7A92",
        live: "#60A5FA",
        results: "#F5C542",
        danger: "#F87171",
      },
      fontFamily: {
        display: ['Archivo', 'Anton', 'system-ui', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "24px" },
      maxWidth: { shell: "1200px", prose: "680px" },
      boxShadow: {
        modal: "0 16px 48px rgba(0,0,0,0.6)",
        glow: "0 0 24px rgba(255,45,119,0.25)",
      },
      transitionTimingFunction: { imp: "cubic-bezier(0.16,1,0.3,1)" },
      keyframes: {
        pulseDot: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
        riseIn: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "none" } },
      },
      animation: { pulseDot: "pulseDot 2s ease-in-out infinite", riseIn: "riseIn 250ms cubic-bezier(0.16,1,0.3,1)" },
    },
  },
  plugins: [],
};
