/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Bloomberg-inspired friendly dark theme
        terminal: {
          bg: '#0f1419',
          card: '#1a2332',
          border: '#2d3748',
          hover: '#243447',
        },
        accent: {
          primary: '#00d4aa',
          secondary: '#00b894',
          glow: 'rgba(0, 212, 170, 0.2)',
        },
        text: {
          primary: '#e7e9ea',
          secondary: '#8b98a5',
          muted: '#6b7280',
        },
        positive: '#00c853',
        negative: '#ff5252',
        warning: '#ffab00',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 170, 0.15)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
