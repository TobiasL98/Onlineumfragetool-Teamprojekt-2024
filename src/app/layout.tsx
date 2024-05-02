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
			<body className="flex min-h-screen flex-col">
				<header className="sticky left-0 top-0 z-50">{Header}</header>
				<main className="flex flex-grow items-center justify-center overflow-auto">
					{children}
				</main>
				<footer className="bottom-0 z-50">{Footer}</footer>
			</body>
		</html>
	);
}
