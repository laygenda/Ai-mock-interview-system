/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna Latar Belakang (Deep Space)
        dark: {
          900: '#0B0C10', // Background Utama
          800: '#1F2833', // Card Background
          700: '#C5C6C7', // Text Muted
        },
        // Warna Aksen (Neon)
        neon: {
          purple: '#B026FF', // Glow Ungu
          blue: '#45A29E',   // Glow Cyan/Biru
          green: '#66FCF1',  // Glow Hijau (Success)
        }
      },
      fontFamily: {
        // Font futuristik yang bersih
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      // Efek Bayangan Neon
      boxShadow: {
        'neon-purple': '0 0 10px rgba(176, 38, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.3)',
        'neon-blue': '0 0 10px rgba(69, 162, 158, 0.5), 0 0 20px rgba(69, 162, 158, 0.3)',
      }
    },
  },
  plugins: [],
}