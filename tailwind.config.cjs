module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}", "./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        kredar: {
          50: '#effaf2',
          100: '#d8f0de',
          200: '#a6e0b5',
          300: '#66c987',
          400: '#3aae67',
          500: '#0f8b4b',
          600: '#0b6b3c',
          700: '#0d5431',
          800: '#10422a',
          900: '#0a2e1f'
        },
        surface: {
          DEFAULT: '#f7faf6',
          muted: '#eff6ed',
          strong: '#d8eae0'
        },
        neutral: {
          900: '#071c10',
          700: '#1f2e24',
          500: '#45504b'
        }
      },
      boxShadow: {
        glow: '0 20px 80px rgba(9, 58, 30, 0.16)'
      }
    }
  },
  plugins: []
}
