/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg)",
                surface: "var(--surface)",
                surface2: "var(--surface2)",
                border: "var(--border)",
                accent: "var(--accent)",
                accent2: "var(--accent2)",
                text: "var(--text)",
                textMuted: "var(--text-muted)",
                green: "var(--green)",
                yellow: "var(--yellow)",
                red: "var(--red)",
            },
            fontFamily: {
                sans: ['DM Sans', 'sans-serif'],
                mono: ['Share Tech Mono', 'monospace'],
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(28px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceDots: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-6px)' },
                }
            },
            animation: {
                fadeUp: 'fadeUp 0.7s ease-out forwards',
                bounceDots: 'bounceDots 0.6s infinite ease-in-out',
            }
        },
    },
    plugins: [],
};
