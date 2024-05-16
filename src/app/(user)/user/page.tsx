import Button from "components/Button";
import Link from "next/link";

import Headline from "app/components/Headline";

export default function UserHome() {
	return (
		<div className="flex flex-col items-center justify-center">
			<div className="text-center">
				<Headline className="w-full flex-grow">
					<h1 className="text-4xl font-medium">
						Herzlich Willkommen zur Umfrage
					</h1>
				</Headline>
				<div className="mx-72">
					<p className="mb-2">
						Ihre Meinung ist uns wichtig, um ein umfassendes Bild
						&uuml;ber Ihr Einkaufsverhlaten zu erhalten und somit
						die Grundlage f&uuml;r die Berechnung eines typischen
						Personenflusses in Einkaufzentren zu schaffen.
					</p>
					<p className="mb-4">Dauer: ca. 10 Minuten</p>
					<h3 className="font-semibold">So funktioniert's:</h3>
					<p>
						Beantworten Sie bitte zun&auml;chst einige kurze Fragen
						zu Ihrer Einkaufssituation. W&auml;hlen Sie im folgenden
						Schritt Ihre Einkaufsreihenfolge aus und wie lange Sie
						an den jeweiligen Bereichen verweilen. Sie werden an
						zwei kurzen Umfragen zu unterschiedlichen
						Supermarktlayouts teilnehmen.
					</p>
					<h3 className="my-4 font-semibold">
						Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
						Superm&auml;rkten kontinuierlich zu verbessern!
					</h3>
					<h3 className="my-4 font-semibold font-semibold">
						Vielen Dank f&uuml;r Ihre Unterst&uuml;tzung!
					</h3>
				</div>
			</div>
			<Link
				className="font-mono mt-2 border border-buttonBorderColor bg-buttonBackgroundColor p-4 text-buttonBorderColor"
				href="/survey"
			>
				Umfrage Starten
			</Link>
		</div>
	);
}
