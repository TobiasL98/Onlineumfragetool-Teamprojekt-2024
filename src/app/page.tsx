export default function Page() {
	return (
		<div className="mx-10 flex flex-col items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-medium">
					Herzlich Willkommen zur Umfrage
				</h1>
				<div className="m-3 border-b-2 border-b-borderSeparatorColor"></div>
				<h3 className="font-semibold">So funkionierts:</h3>
				<p>
					Beantworten Sie bitte zun&auml;chst einige kurze Fragen zu
					Ihrer Einkaufssituation. W&auml;hlen Sie im folgenden
					Schritt Ihre Einkaufsreihenfolge aus und wie lange Sie an
					den jeweiligen Bereichen verweilen. Sie werden an zwei
					kurzen Umfragen zu unterschiedlichen Supermarktlayouts
					teilnehmen.
				</p>
				<h3 className="my-6 font-semibold">
					Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
					Superm&auml;rkten zu verbessern!
				</h3>
				<h3 className="my-6 font-semibold">
					Vielen Dank f&uuml;r Ihre Unterst&uuml;tzung!
				</h3>
			</div>
			<button className="my-6 border-2 border-buttonBorderColor bg-buttonBackgroundColor p-7 text-buttonBorderColor">
				Umfrage Starten
			</button>
		</div>
	);
}
