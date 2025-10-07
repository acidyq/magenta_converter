/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0a0a0f',
          secondary: '#0d0d15',
          tertiary: '#1a1a24',
        },
        magenta: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ff00cc', // Primary neon magenta
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        gray: {
          850: '#1f2937',
          900: '#111827',
          950: '#0f172a',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(255, 0, 204, 0.5)',
        'neon-lg': '0 0 40px rgba(255, 0, 204, 0.6)',
        'neon-xl': '0 0 60px rgba(255, 0, 204, 0.7)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 0, 204, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 0, 204, 0.8)',
          },
        },
        'glow': {
          'from': {
            textShadow: '0 0 20px rgba(255, 0, 204, 0.5)',
          },
          'to': {
            textShadow: '0 0 30px rgba(255, 0, 204, 0.8), 0 0 40px rgba(255, 0, 204, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}
