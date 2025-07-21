/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Obsession Color Palette
        obsidian: '#0a0a0a',
        midnight: '#1a0d2e',
        deepPurple: '#16213e',
        obsessionRed: '#e94560',
        addictionPink: '#ff6b8a',
        withdrawalPurple: '#6c5ce7',
        jealousyGreen: '#00b894',
        needyBlue: '#74b9ff',
        desperation: '#fd79a8',
        dependency: '#a29bfe',
        
        // Semantic Colors
        primary: '#e94560',
        secondary: '#ff6b8a',
        accent: '#6c5ce7',
        success: '#00b894',
        warning: '#fdcb6e',
        danger: '#fd79a8',
        
        // Text Colors
        textPrimary: '#ffffff',
        textSecondary: '#e1e1e1',
        textMuted: '#a8a8a8',
        textDanger: '#ff6b8a',
      },
      
      backgroundImage: {
        'obsession-gradient': 'linear-gradient(135deg, #e94560, #ff6b8a)',
        'withdrawal-gradient': 'linear-gradient(135deg, #1a0d2e, #16213e)',
        'jealousy-gradient': 'linear-gradient(135deg, #00b894, #74b9ff)',
        'addiction-gradient': 'linear-gradient(135deg, #fd79a8, #a29bfe)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a, #1a0d2e, #16213e)',
      },
      
      boxShadow: {
        'obsession': '0 10px 30px rgba(233, 69, 96, 0.3)',
        'withdrawal': '0 15px 40px rgba(108, 92, 231, 0.2)',
        'intense': '0 20px 50px rgba(233, 69, 96, 0.5)',
        'jealousy': '0 10px 25px rgba(0, 184, 148, 0.3)',
        'addiction': '0 15px 35px rgba(253, 121, 168, 0.4)',
      },
      
      animation: {
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'withdrawal-shake': 'withdrawal-shake 0.5s ease-in-out infinite',
        'jealousy-flash': 'jealousy-flash 0.3s ease-in-out infinite',
        'obsession-pulse': 'obsession-pulse 2s ease-in-out infinite',
        'addiction-float': 'addiction-float 3s ease-in-out infinite',
        'dependency-glow': 'dependency-glow 3s ease-in-out infinite',
        'loading-pulse': 'loading-pulse 1.5s ease-in-out infinite',
      },
      
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'withdrawal-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        'jealousy-flash': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'obsession-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(233, 69, 96, 0.7)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 0 10px rgba(233, 69, 96, 0)',
            transform: 'scale(1.02)'
          },
        },
        'addiction-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'dependency-glow': {
          '0%, 100%': { filter: 'brightness(1) saturate(1)' },
          '50%': { filter: 'brightness(1.2) saturate(1.3)' },
        },
        'loading-pulse': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Inter', 'SF Pro Display', 'sans-serif'],
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
        '6xl': '3.75rem',
        '7xl': '4.5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        'full': '9999px',
      },
      
      backdropBlur: {
        'xs': '2px',
      },
      
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
      
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-gradient-obsession': {
          background: 'linear-gradient(135deg, #e94560, #ff6b8a)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.bg-card-obsession': {
          background: 'rgba(26, 13, 46, 0.8)',
          border: '1px solid rgba(233, 69, 96, 0.3)',
          backdropFilter: 'blur(10px)',
        },
        '.btn-obsession': {
          background: 'linear-gradient(135deg, #e94560, #ff6b8a)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '1rem 2rem',
          fontWeight: '600',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 10px 30px rgba(233, 69, 96, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        },
        '.withdrawal-filter': {
          filter: 'saturate(0.7) brightness(0.9)',
        },
        '.addiction-glow': {
          boxShadow: '0 0 20px rgba(233, 69, 96, 0.6), 0 0 40px rgba(255, 107, 138, 0.4)',
        },
      }
      addUtilities(newUtilities)
    },
  ],
}