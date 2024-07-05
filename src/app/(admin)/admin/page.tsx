import Link from "next/link";

import Headline from "components/Headline";

function Button({ text }: { text: string }) {
	if (text === "Neues Layout erstellen") {
		return (
			<Link
				href="/admin/edit"
				className="flex h-32 w-40 items-center whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2 text-center"
			>
				{text}
			</Link>
		);
	} else {
		return (
			<button className="h-32 w-40 whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2">
				{text}
			</button>
		);
	}
}

export default function AdminHome() {
	const buttons = [
		"Neues Layout erstellen",
		"Eigene Vorlage hochladen",
		"Mit typischer Vorlage starten",
	];
	return (
		<div className="flex flex-col items-center justify-center">
			<div>
				<Headline className="w-full flex-grow">
					<h1 className="text-4xl font-medium">Admin Management </h1>
				</Headline>
				<p className="mx-72 mb-12 text-center">
					Erstellen Sie ein neues Supermarkt-Layout ganz nach Ihren
					Vorstellung, laden Sie eigene Layouts hoch oder nutzen Sie
					eine typische Vorlage, um Zeit zu sparen und Inspiration zu
					erhalten.
				</p>
			</div>
			<div className="flex items-center justify-center space-x-16">
				{buttons.map((e) => {
					return <Button key={e} text={e} />;
				})}
			</div>
		</div>
	);
}
