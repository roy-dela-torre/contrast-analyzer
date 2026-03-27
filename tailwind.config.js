/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#0a0e27',
        'cyber-darker': '#050812',
        'cyber-blue': '#00d4ff',
        'cyber-purple': '#b84fff',
        'cyber-pink': '#ff2e97',
        'cyber-green': '#00ff88',
      },
      fontFamily: {
        'display': ['Space Mono', 'monospace'],
        'body': ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #00d4ff 0%, #b84fff 50%, #ff2e97 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0e27 0%, #050812 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 20px rgba(0, 212, 255, 0.5)' },
          '100%': { 'box-shadow': '0 0 40px rgba(184, 79, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
