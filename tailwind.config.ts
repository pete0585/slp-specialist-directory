import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          emerald: '#059669',
          'emerald-dark': '#047857',
          'emerald-light': '#ECFDF5',
          'emerald-mid': '#D1FAE5',
          amber: '#D97706',
          'amber-dark': '#B45309',
          'amber-light': '#FEF3C7',
          slate: '#1E293B',
          'slate-mid': '#334155',
          'slate-light': '#F1F5F9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
