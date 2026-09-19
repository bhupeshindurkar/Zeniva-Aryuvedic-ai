/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        zeniva: {
          sidebar: "#1c112e",
          sidebarDark: "#130922",
          purple: "#583488",
          purpleHover: "#6e42a8",
          purpleLight: "#EDE7F6",
          purpleSubtle: "#F3EFF9",
          cream: "#FAF8F5",
          creamDark: "#F1EBE3",
          gold: "#D4AF37",
          goldLight: "#F5E9BF",
          goldDark: "#AA820A",
          charcoal: "#1F2937",
          muted: "#6B7280",
          card: "#FFFFFF",
          border: "#E9E3D8"
        },
        vata: {
          light: "#EBF3FE",
          DEFAULT: "#4A90E2",
          dark: "#2A64A8"
        },
        pitta: {
          light: "#FEF2E8",
          DEFAULT: "#E67E22",
          dark: "#B85C0A"
        },
        kapha: {
          light: "#EAF7EE",
          DEFAULT: "#27AE60",
          dark: "#1B7B43"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
      },
      boxShadow: {
        'zeniva': '0 4px 20px -2px rgba(88, 52, 136, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'zeniva-lg': '0 10px 30px -4px rgba(88, 52, 136, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'glow-purple': '0 0 25px rgba(126, 87, 194, 0.35)',
        'glow-gold': '0 0 20px rgba(212, 175, 55, 0.3)',
      }
    },
  },
  plugins: [],
}
