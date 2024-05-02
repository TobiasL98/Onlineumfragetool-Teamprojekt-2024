import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Page() {
	return (
		<>
		<Header />
		<div className="main-content flex flex-col items-center justify-center mx-10">
			<div className="text-center">
				<h1 className="text-4xl font-medium font-mono pb-8">
					Herzlich Willkommen zur Umfrage
				</h1>
				<p className="border-b-borderSeparatorColor m-3 border-b"></p>
				<h3 className="font-semibold my-9">So funkionierts:</h3>
				<p className="px-32">
					Beantworten Sie bitte zunächst einige kurze Fragen zu Ihrer
					Einkaufssituation. Wählen Sie im folgenden Schritt Ihre
					Einkaufsreihenfolge aus und wie lange Sie an den jeweiligen
					Bereichen verweilen. Sie werden an zwei kurzen Umfragen zu
					unterschiedlichen Supermarktlayouts teilnehmen.
				</p>
				<h3 className="font-semibold mt-16 mb-12">
					Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
					Supermärkten zu verbessern!
				</h3>
				<h3 className="font-semibold my-12">
					Vielen Dank für Ihre Unterstützung!
				</h3>
			</div>
			<button className="mb-2 mt-8 border border-buttonBorderColor text-buttonBorderColor bg-buttonBackgroundColor p-3">
				Umfrage Starten
			</button>
		</div>
		<Footer />
		</>
	);
}
