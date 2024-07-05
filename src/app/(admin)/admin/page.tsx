import Link from "next/link";

import Headline from "components/Headline";


export default function AdminHome() {
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
				<Link href="/admin/edit" className="h-32 w-40 flex items-center text-center whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2">
					Neues Layout erstellen
				</Link>
				<Link href="/admin/edit?upload=true" className="h-32 w-40 flex items-center text-center whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2">
					Eigene Vorlage hochladen
				</Link>
				<Link href="/admin/edit?supermarket=true" className="h-32 w-40 flex items-center text-center whitespace-normal text-wrap rounded-3xl border-2 border-borderSeparatorColor bg-borderBackgroundColor p-2">
					Mit typischer Vorlage starten
				</Link>
			</div>
		</div>
	);
}
