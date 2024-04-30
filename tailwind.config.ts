import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				borderSeparatorColor: "rgb(121, 150, 163)",
				buttonBackgroundColor: "rgb(68, 64, 51)",
				buttonBorderColor: "rgb(255, 209, 17)",
			},
		},
	},
	plugins: [],
};
export default config;
