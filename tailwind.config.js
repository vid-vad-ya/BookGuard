/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#0f172a",      // slate-900
        "bg-card": "rgba(255,255,255,0.06)",
        "border-card": "rgba(255,255,255,0.12)",

        "accent-teal": "#14b8a6",
        "accent-cyan": "#22d3ee",
        "accent-cyan-bright": "#5af9ff",

        "text-main": "#e2e8f0",
        "text-muted": "#94a3b8",
      },

      boxShadow: {
        "glow-teal": "0 0 25px rgba(20,184,166,0.45)",
        "glow-cyan": "0 0 25px rgba(34,211,238,0.45)",
        "glow-strong": "0 0 45px rgba(34,211,238,0.65)",
      },

      backgroundImage: {
        "gradient-cyan": "linear-gradient(135deg, #14b8a6 0%, #22d3ee 50%, #5af9ff 100%)",
        "gradient-dark": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      },
    },
  },
  plugins: [],
};
