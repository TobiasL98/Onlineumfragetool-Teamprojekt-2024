import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Supermarkt Umfrage",
};
export default function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: {
		Header?: React.ReactNode;
		Footer?: React.ReactNode;
	};
}>) {
	let { Header, Footer } = params;
	return (
		<html lang="en">
			<body className="h-screen flex flex-col">
			{/*<header className="flex h-10">{Header}</header>*/}
				<main className="flex flex-1 flex-col overflow-auto">{children}</main>
			{/*<footer className="flex h-10">{Footer}</footer>*/}
			</body>
		</html>
	);
}
