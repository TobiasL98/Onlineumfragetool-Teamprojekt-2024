import type { Metadata } from "next";
import "app/globals.css";

export const metadata: Metadata = {
	title: "Supermarkt Umfrage",
};

export default function DefaultLayout(
	HeaderFun: () => React.ReactNode = () => null,
	FooterFun: () => React.ReactNode = () => null,
) {
	let [Header, Footer] = [HeaderFun(), FooterFun()];
	function HOC({ children }: { children: React.ReactNode }) {
		return (
			<html lang="en">
				<body className="flex min-h-screen flex-col">
					<header className="sticky left-0 top-0 z-50">
						{Header && Header}
					</header>
					<main className="flex flex-grow items-center justify-center overflow-auto">
						{children}
					</main>
					<footer className="bottom-0 z-50">
						{Footer && Footer}
					</footer>
				</body>
			</html>
		);
	}
	HOC.displayName = "Layout";
	return HOC;
}
