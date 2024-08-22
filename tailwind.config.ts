import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  darkMode: 'selector',

  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: [
    'dark',
    'theme-blue',
    'theme-gray',
    'theme-green',
    'theme-neutral',
    'theme-orange',
    'theme-red',
    'theme-rose',
    'theme-slate',
    'theme-stone',
    'theme-violet',
    'theme-yellow',
    'theme-zinc'
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(from var(--border) h s l / <alpha-value>)',
        input: 'hsl(from var(--input) h s l / <alpha-value>)',
        ring: 'hsl(from var(--ring) h s l / <alpha-value>)',
        background: 'hsl(from var(--background) h s l / <alpha-value>)',
        foreground: 'hsl(from var(--foreground) h s l / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(from var(--primary) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--primary-foreground) h s l / <alpha-value>)'
        },
        secondary: {
          DEFAULT: 'hsl(from var(--secondary) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--secondary-foreground) h s l / <alpha-value>)'
        },
        destructive: {
          DEFAULT: 'hsl(from var(--destructive) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--destructive-foreground) h s l / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'hsl(from var(--muted) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--muted-foreground) h s l / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'hsl(from var(--accent) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--accent-foreground) h s l / <alpha-value>)'
        },
        popover: {
          DEFAULT: 'hsl(from var(--popover) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--popover-foreground) h s l / <alpha-value>)'
        },
        card: {
          DEFAULT: 'hsl(from var(--card) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--card-foreground) h s l / <alpha-value>)'
        },
        skeleton: {
          DEFAULT: 'hsl(from var(--skeleton) h s l / <alpha-value>)',
          foreground: 'hsl(from var(--skeleton-foreground) h s l / <alpha-value>)'
        },
        success: 'hsl(from var(--success) h s l / <alpha-value>)',
        warning: 'hsl(from var(--warning) h s l / <alpha-value>)',
        error: 'hsl(from var(--error) h s l / <alpha-value>)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slow-ping': {
          '98%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(3)', opacity: '0' }
        }
      },
      animation: {
        'fade-in': 'fade-in 1s ease-in-out',
        'slow-ping': 'slow-ping 30s ease-in-out infinite'
      },
      screens: {
        '3xl': '2560px'
      }
    }
  },
  plugins: [typography]
};

export default config;
