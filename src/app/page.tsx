export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center mx-10">
			<div className="text-center">
				<h1 className="text-4xl font-medium">
					Herzlich Willkommen zur Umfrage
				</h1>
				<p className="border-b-borderSeparatorColor m-3 border-b-2"></p>
				<h3 className="font-semibold">So funkionierts:</h3>
				<p>
					Beantworten Sie bitte zunächst einige kurze Fragen zu Ihrer
					Einkaufssituation. Wählen Sie im folgenden Schritt Ihre
					Einkaufsreihenfolge aus und wie lange Sie an den jeweiligen
					Bereichen verweilen. Sie werden an zwei kurzen Umfragen zu
					unterschiedlichen Supermarktlayouts teilnehmen.
				</p>
				<h3 className="font-semibold my-6">
					Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
					Supermärkten zu verbessern!
				</h3>
				<h3 className="font-semibold my-6">
					Vielen Dank für Ihre Unterstützung!
				</h3>
			</div>
			<button className="my-6 border-2 border-buttonBorderColor text-buttonBorderColor bg-buttonBackgroundColor p-7">
				Umfrage Starten
			</button>
		</div>
	);
}
