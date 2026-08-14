/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FBF7F1',
        surface: {
          DEFAULT: '#FFFFFF',
          sunken: '#F3EEE5',
        },
        ink: {
          DEFAULT: '#2E2A33',
          muted: '#736A7D',
        },
        wood: {
          light: '#D4A978',
          dark: '#A87A50',
        },
        pastel: {
          // Keep the original palette for UI/backgrounds
          blush: '#F6D9DE',
          butter: '#FBE7B6',
          sage: '#D7E8CE',
          sky: '#D6E4F0',
          lavender: '#E3DBF2',
          peach: '#F9DFC8',
        },
        note: {
          1: '#CDB4DB',
          2: '#FFC8DD',
          3: '#FFAFCC',
          4: '#BDE0FE',
          5: '#A2D2FF',
          6: '#A8E6CE',
          7: '#DCEDC2',
          8: '#FFD3B5',
          9: '#FFAAA6',
          10: '#FF8C94',
        },
        glass: {
          tint: 'rgba(214, 228, 240, 0.28)',
          highlight: 'rgba(255, 255, 255, 0.55)',
          shadow: 'rgba(46, 42, 51, 0.10)',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        ui: ['Outfit', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(46,42,51,0.06)',
        md: '0 8px 20px -6px rgba(46,42,51,0.12)',
        lg: '0 24px 48px -16px rgba(46,42,51,0.18)',
      }
    },
  },
  plugins: [],
}
