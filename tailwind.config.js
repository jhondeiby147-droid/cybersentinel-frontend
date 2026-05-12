/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-dark': '#0f172a',
                'cyber-card': '#1e293b',
                'cyber-accent': '#38bdf8',
                'sev-critical': '#ef4444',
                'sev-high': '#f97316',
                'sev-medium': '#eab308',
                'sev-low': '#22c55e'
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}