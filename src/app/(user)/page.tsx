import Headline from "app/components/Headline";

export default function Page() {
	return (
		<div className="mx-36 flex flex-col items-center justify-center">
			<div className="text-center">
				<Headline text="Herzlich Willkommen zur Umfrage" />
				<p className="mb-2">
					Ihre Meinung ist uns wichtig, um ein umfassendes Bild
					&uumlber Ihr Einkaufsverhlaten zu erhalten und somit die
					Grundlage f&uumlr die Berechnung eines typischen
					Personenflusses in Einkaufzentren zu schaffen.
				</p>
				<p className="mb-4">Dauer: ca. 10 Minuten</p>
				<h3 className="font-semibold">So funktioniert's:</h3>
				<p>
					Beantworten Sie bitte zun&auml;chst einige kurze Fragen zu
					Ihrer Einkaufssituation. W&auml;hlen Sie im folgenden
					Schritt Ihre Einkaufsreihenfolge aus und wie lange Sie an
					den jeweiligen Bereichen verweilen. Sie werden an zwei
					kurzen Umfragen zu unterschiedlichen Supermarktlayouts
					teilnehmen.
				</p>
				<h3 className="my-4 font-semibold">
					Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
					Superm&auml;rkten kontinuierlich zu verbessern!
				</h3>
				<h3 className="my-4 font-semibold font-semibold">
					Vielen Dank f&uuml;r Ihre Unterst&uuml;tzung!
				</h3>
			</div>
			<button className="mt-2 border-2 border-buttonBorderColor bg-buttonBackgroundColor p-6 text-buttonBorderColor">
				Umfrage Starten
			</button>
		</div>
	);
}
