/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf2f8',
                    100: '#fce7f3',
                    200: '#fbcfe8',
                    300: '#f9a8d4',
                    400: '#f472b6',
                    500: '#7A0026',
                    600: '#6B0021',
                    700: '#5C001D',
                    800: '#4D0018',
                    900: '#3E0013',
                },
                accent: {
                    50: '#fffef7',
                    100: '#fffaeb',
                    200: '#fff4cc',
                    300: '#ffee99',
                    400: '#ffe666',
                    500: '#F2C200',
                    600: '#d9af00',
                    700: '#bf9b00',
                    800: '#a68800',
                    900: '#8c7400',
                },
                background: {
                    DEFAULT: '#F7F7F7',
                },
                textDark: {
                    DEFAULT: '#2C2C2C',
                }
            }
        },
    },
    plugins: [],
}
