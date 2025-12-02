import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Lyxify färgtema
        primary: {
          DEFAULT: '#1E3A8A',
          50: '#E2ECFD',
          100: '#C5D9FB',
          200: '#8BB3F7',
          300: '#518DF3',
          400: '#1767EF',
          500: '#1E3A8A',
          600: '#192F70',
          700: '#142456',
          800: '#0F193D',
          900: '#0A0E23',
        },
        accent: {
          DEFAULT: '#FFD700',
          50: '#FFFBE6',
          100: '#FFF7CC',
          200: '#FFEF99',
          300: '#FFE766',
          400: '#FFDF33',
          500: '#FFD700',
          600: '#CCB000',
          700: '#998400',
          800: '#665800',
          900: '#332C00',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F8FAFC',
          dark: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
