import { type Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				primary: '#4779FF',
			},
		},
	},
	plugins: [],
	darkMode: 'class',
} satisfies Config;
