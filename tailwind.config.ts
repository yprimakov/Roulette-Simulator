import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'general-sans': ['GeneralSans-Variable', 'GeneralSans-Regular', 'system-ui', 'sans-serif'],
        'sans': ['GeneralSans-Variable', 'GeneralSans-Regular', 'system-ui', 'sans-serif'],
      },
      colors: {
        roulette: {
          red: "#E72C2C",
          black: "#1A1A1A",
          green: "#2D8B3C",
          gold: "#D4AF37",
          felt: "#1B5E20",
        },
      },
      keyframes: {
        'chip-win': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-50vh) scale(0.3)',
            opacity: '0',
          },
        },
        'chip-loss': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(50vh) scale(0.3)',
            opacity: '0',
          },
        },
        'bounce-in': {
          '0%': {
            transform: 'scale(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1.1)',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
      },
      animation: {
        'chip-win': 'chip-win 1s ease-in-out forwards',
        'chip-loss': 'chip-loss 1s ease-in-out forwards',
        'bounce-in': 'bounce-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
