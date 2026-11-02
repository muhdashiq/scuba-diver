import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '1rem', screens: { '2xl': '1400px' } },
    extend: {
      fontFamily: {
        // SF Pro on Apple devices; Inter is the closest match elsewhere.
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', 'Inter', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      opacity: { 8: '0.08', 12: '0.12', 14: '0.14', 18: '0.18', 85: '0.85' },
      // iOS Dynamic Type scale
      fontSize: {
        'large-title': ['2.125rem', { lineHeight: '2.625rem', letterSpacing: '-0.022em', fontWeight: '700' }],
        title1: ['1.75rem', { lineHeight: '2.125rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        title2: ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.016em', fontWeight: '600' }],
        title3: ['1.25rem', { lineHeight: '1.5625rem', letterSpacing: '-0.012em', fontWeight: '600' }],
        headline: ['1.0625rem', { lineHeight: '1.375rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['1.0625rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        callout: ['1rem', { lineHeight: '1.3125rem', letterSpacing: '-0.008em' }],
        subhead: ['0.9375rem', { lineHeight: '1.25rem', letterSpacing: '-0.006em' }],
        footnote: ['0.8125rem', { lineHeight: '1.125rem' }],
        caption: ['0.75rem', { lineHeight: '1rem' }],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        success: { DEFAULT: 'hsl(var(--success))', foreground: 'hsl(var(--success-foreground))' },
        fill: 'hsl(var(--fill))',
        separator: 'hsl(var(--separator))',
        teal: { DEFAULT: 'hsl(var(--teal))', foreground: 'hsl(var(--teal-foreground))' },
        warning: { DEFAULT: 'hsl(var(--warning))', foreground: 'hsl(var(--warning-foreground))' },
        ocean: {
          50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 300: '#67e8f9', 400: '#22d3ee',
          500: '#06b6d4', 600: '#0891b2', 700: '#0e7490', 800: '#155e75', 900: '#0b3b55', 950: '#04192b',
        },
        abyss: { 700: '#0a2540', 800: '#071a2f', 900: '#040f1f', 950: '#020814' },
        coral: { 400: '#fb7185', 500: '#f43f5e' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        xl: '0.875rem',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        caustics: { '0%': { transform: 'translate3d(0,0,0) scale(1)' }, '50%': { transform: 'translate3d(-2%,1%,0) scale(1.05)' }, '100%': { transform: 'translate3d(0,0,0) scale(1)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        caustics: 'caustics 18s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [animate],
};
