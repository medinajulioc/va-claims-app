/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        tan: {
          DEFAULT: '#D2B48C',
          50: '#F9F5F0',
          100: '#F3EAE0',
          200: '#E8D9C5',
          300: '#DEC7AA',
          400: '#D2B48C', // Base tan color
          500: '#C6A06F',
          600: '#B68E56',
          700: '#9A7645',
          800: '#785D37',
          900: '#574429',
          950: '#46371F',
        },
        green: {
          DEFAULT: '#4B5320',
          50: '#EFF1E6',
          100: '#DFE3CE',
          200: '#BDC69D',
          300: '#9BA96C',
          400: '#788C41',
          500: '#4B5320', // Base green color
          600: '#424A1D',
          700: '#3A411A',
          800: '#313716',
          900: '#282D12',
          950: '#1F230E',
        },
        brown: {
          DEFAULT: '#654321',
          50: '#F0EAE4',
          100: '#E1D5C9',
          200: '#C3AB93',
          300: '#A5815D',
          400: '#865D32',
          500: '#654321', // Base brown color
          600: '#593C1D',
          700: '#4E3519',
          800: '#422D15',
          900: '#372511',
          950: '#2C1E0E',
        },
      },
    },
  },
  plugins: [],
} 