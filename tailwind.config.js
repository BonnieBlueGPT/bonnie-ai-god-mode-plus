/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔱 Divine Empire Color Palette
        empire: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          gray: '#2a2a2a',
          border: '#3a3a3a',
          accent: '#4a4a4a',
        },
        divine: {
          gold: '#ffd700',
          purple: '#8a2be2',
          cyan: '#00ffff',
          green: '#00ff88',
          red: '#ff4444',
          orange: '#ff8800',
        },
        soul: {
          bonnie: '#ec4899',   // Pink
          nova: '#f97316',     // Orange
          galatea: '#9333ea',  // Purple
        },
        emotion: {
          loving: '#ff69b4',
          lustful: '#dc143c',
          playful: '#ff8c00',
          curious: '#00ffff',
          divine: '#8a2be2',
          excited: '#ffff00',
          intimate: '#ff1493',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
        divine: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      animation: {
        'pulse-divine': 'pulse-divine 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-divine': 'glow-divine 3s ease-in-out infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
        'flow-data': 'flow-data 3s linear infinite',
        'fade-up': 'fade-up 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'pulse-divine': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.5',
            transform: 'scale(1.05)'
          },
        },
        'glow-divine': {
          '0%, 100%': {
            'box-shadow': '0 0 5px currentColor',
          },
          '50%': {
            'box-shadow': '0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'heartbeat': {
          '0%, 100%': { 
            transform: 'scale(1)' 
          },
          '50%': { 
            transform: 'scale(1.05)' 
          },
        },
        'flow-data': {
          '0%': { 
            transform: 'translateX(-100%)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateX(100%)',
            opacity: '0'
          },
        },
        'fade-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'shimmer': {
          '0%': { 
            transform: 'translateX(-100%)' 
          },
          '100%': { 
            transform: 'translateX(100%)' 
          },
        },
        'bounce-subtle': {
          '0%, 20%, 50%, 80%, 100%': { 
            transform: 'translateY(0)' 
          },
          '40%': { 
            transform: 'translateY(-10px)' 
          },
          '60%': { 
            transform: 'translateY(-5px)' 
          },
        },
        'float': {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-10px)' 
          },
        },
      },
      backgroundImage: {
        'gradient-divine': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        'gradient-soul': 'linear-gradient(90deg, #ec4899, #f97316, #9333ea)',
        'gradient-cosmic': 'radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(255, 105, 180, 0.05) 0%, transparent 50%)',
      },
      backdropBlur: {
        'divine': '10px',
      },
      borderRadius: {
        'divine': '8px',
        'soul': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
      transitionDuration: {
        'divine': '300ms',
      },
      zIndex: {
        'watchtower': '1000',
        'divine': '2000',
        'omniscient': '10000',
      }
    },
  },
  plugins: [
    // Custom plugin for divine utilities
    function({ addUtilities, addComponents, e, prefix, config }) {
      const newUtilities = {
        '.divine-glow': {
          animation: 'glow-divine 3s ease-in-out infinite',
        },
        '.soul-bonnie': {
          color: '#ec4899',
          backgroundColor: 'rgba(236, 72, 153, 0.1)',
        },
        '.soul-nova': {
          color: '#f97316',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
        },
        '.soul-galatea': {
          color: '#9333ea',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
        },
        '.text-gradient-divine': {
          background: 'linear-gradient(to right, #ec4899, #9333ea, #00ffff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        '.bg-glass': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.bg-glass-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }
      
      addUtilities(newUtilities)
    }
  ],
}