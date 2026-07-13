/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1B2A3D',
          2: '#24344A',
          muted: '#5B6B7D'
        },
        paper: {
          DEFAULT: '#EDEFE9',
          card: '#F8F9F4'
        },
        brass: {
          DEFAULT: '#B08D57',
          light: '#D9C08F'
        },
        rust: '#A23E33',
        forest: '#3F7857',
        amber: '#C08A2E',
        hairline: '#D8DACD'
      },
      fontFamily: {
        display: ['"Source Serif 4"', 'Georgia', 'serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      boxShadow: {
        card: '0 1px 2px rgba(27,42,61,0.06), 0 1px 0 rgba(27,42,61,0.04)'
      },
      backgroundImage: {
        laid: "repeating-linear-gradient(0deg, rgba(27,42,61,0.025) 0px, rgba(27,42,61,0.025) 1px, transparent 1px, transparent 26px)"
      }
    }
  },
  plugins: []
}
