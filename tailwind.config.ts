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
				borderBackgroundColor: "rgb(33 44 50)",
				borderSeparatorColor: "rgb(56, 69, 74)",
				inputBorderColor: "rgb(86, 106, 115)",
				inputBackgroundColor: "rgb(43 57 65)",
				buttonBorderColor: "rgb(255, 209, 17)",
				buttonBackgroundColor: "rgb(68, 64, 51)",
				backgroundColor: "rgba(19, 31, 37, 1);",
				textColor: "rgba(255, 255, 255, 1)",
				hoverColor: "rgb(121, 150, 163)",
			},
		},
	},
	plugins: [],
};
export default config;
