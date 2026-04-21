/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        duodi: {
          50:  '#f0f0ff',
          100: '#e0e0ff',
          200: '#c4c4ff',
          300: '#a0a0ff',
          400: '#7c7cff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        brand: {
          purple: '#7C3AED',
          blue: '#2563EB',
          indigo: '#4F46E5',
          pink: '#DB2777',
          dark: '#0B0B1A',
          surface: '#13132A',
          card: '#1A1A35',
          border: '#2A2A4A',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'duodi-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #2563EB 100%)',
        'duodi-gradient-soft': 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(124,58,237,0.2) 50%, rgba(37,99,235,0.2) 100%)',
        'card-gradient': 'linear-gradient(145deg, #1A1A35 0%, #13132A 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'duodi': '0 0 30px rgba(79, 70, 229, 0.3)',
        'duodi-sm': '0 0 15px rgba(79, 70, 229, 0.2)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
