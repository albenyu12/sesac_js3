/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Pastel palette
                pastel: {
                    blue: '#A0C4FF',
                    green: '#CAFFBF',
                    red: '#FFADAD',
                    yellow: '#FDFFB6',
                    purple: '#BDB2FF',
                    pink: '#FFC6FF',
                    bg: '#F8F9FA'
                }
            }
        },
    },
    plugins: [],
}
