/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        game: {
          bg: '#1a1a2e',
          panel: '#16213e',
          accent: '#0f3460',
          highlight: '#e94560',
          gold: '#ffd700',
          path: '#8b7355',
          grass: '#2d5a27',
        }
      },
      fontFamily: {
        game: ['"Press Start 2P"', 'monospace'],
        pixel: ['"VT323"', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 0.5s ease-in-out infinite',
        'shake': 'shake 0.3s ease-in-out',
        'bounce-in': 'bounceIn 0.3s ease-out',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
