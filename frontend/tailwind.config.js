/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:   { DEFAULT: '#FDF8F2', 50: '#FFFEF9', 100: '#FDF8F2', 200: '#FAF0E4' },
        spice:   { DEFAULT: '#FFC107', light: '#FFD54F', dark: '#FFA000', muted: '#FFF8E1' },
        leaf:    { DEFAULT: '#2E7D32', light: '#4CAF50', dark: '#1B5E20', muted: '#E8F5E9' },
        charcoal:{ DEFAULT: '#1C1C1E', soft: '#2C2C2E', muted: '#6B7280' },
        gold:    { DEFAULT: '#FFD700', light: '#FFF176', dark: '#FBC02D' },
        saffron: { DEFAULT: '#FF9933', light: '#FFB366', dark: '#CC7A29' },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow':    '0 0 40px rgba(232, 98, 26, 0.25)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'card':    '0 4px 24px rgba(0,0,0,0.07)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.14)',
        'float':   '0 8px 32px rgba(0,0,0,0.18)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(160deg, rgba(28,28,30,0.88) 0%, rgba(28,28,30,0.55) 60%, transparent 100%)',
        'section-gradient': 'linear-gradient(180deg, #FDF8F2 0%, #FAF0E4 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)',
        'premium-gradient': 'linear-gradient(135deg, #FFC107 0%, #FF9933 100%)',
        'leaf-gradient': 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
      },
      animation: {
        'fade-up':       'fadeUp 0.7s ease forwards',
        'fade-in':       'fadeIn 0.5s ease forwards',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 1.5s infinite',
        'count-up':      'countUp 2s ease-out forwards',
        'slide-right':   'slideRight 0.5s ease forwards',
      },
      keyframes: {
        fadeUp:    { '0%': { opacity: 0, transform: 'translateY(28px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        slideRight:{ '0%': { opacity: 0, transform: 'translateX(-20px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
