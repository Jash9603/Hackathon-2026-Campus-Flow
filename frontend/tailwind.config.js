/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                stranger: {
                    red: '#ff0033',      // Iconic neon red
                    black: '#0a0a0a',    // Deep void black
                    gray: '#1a1a1a',     // Background gray
                    glow: '#ff4d4d',     // Text glow/Soft red
                },
                retro: {
                    blue: '#2c3e50',      // Stranger things hazy blue
                    cyan: '#00ffff',      // 80s Cyberpunk cyan
                    amber: '#ffbf00'      // Amber monitor text
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                retro: ['"Press Start 2P"', 'monospace'], // Suggestion for retro font
                title: ['"Benguiat"', 'serif'], // Stranger Things Title Font (will import)
            },
            animation: {
                'crt-flicker': 'crt-flicker 0.15s infinite',
                'text-glow': 'text-glow 2s ease-in-out infinite alternate',
                'scanline': 'scanline 8s linear infinite',
            },
            keyframes: {
                'crt-flicker': {
                    '0%': { opacity: '0.97' },
                    '5%': { opacity: '0.95' },
                    '10%': { opacity: '0.9' },
                    '15%': { opacity: '0.95' },
                    '20%': { opacity: '0.99' },
                    '25%': { opacity: '0.95' },
                    '30%': { opacity: '0.9' },
                    '35%': { opacity: '0.96' },
                    '40%': { opacity: '0.98' },
                    '45%': { opacity: '0.95' },
                    '50%': { opacity: '0.99' },
                    '55%': { opacity: '0.93' },
                    '60%': { opacity: '0.9' },
                    '65%': { opacity: '0.96' },
                    '70%': { opacity: '1' },
                    '75%': { opacity: '0.97' },
                    '80%': { opacity: '0.95' },
                    '85%': { opacity: '0.9' },
                    '90%': { opacity: '0.95' },
                    '95%': { opacity: '0.99' },
                    '100%': { opacity: '0.95' },
                },
                'text-glow': {
                    'from': { textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff0033, 0 0 20px #ff0033' },
                    'to': { textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff0033, 0 0 40px #ff0033' }
                },
                'scanline': {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' }
                }
            }
        },
    },
    plugins: [],
}
