/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#505050',   // Cinza muito escuro
          100: '#434343',  // Cinza ainda mais profundo
          200: '#333333',  // Escuro profundo
          300: '#313131',  // Escuríssimo
          400: '#272727',  // Quase preto
          500: '#242424',  // Preto suave
          600: '#212121',  // Preto ainda mais escuro
          700: '#191919',  // Preto próximo do absoluto
          800: '#151515',  // Quase total ausência de luz
          900: '#121212',  // Preto absoluto com traços mínimos de luz
          950: '#101010',  // Preto absoluto
        },
        primary: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#7f00ff',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'dark-gradient': 'linear-gradient(to bottom right, #1a1d20, #343a40)',
      },
    },
  },
  plugins: [],
}