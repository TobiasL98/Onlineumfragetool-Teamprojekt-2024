import Bordered from "components/Bordered";
import Button from "components/Button";
import Headline from "components/Headline";
import Select from "components/Select";

export default function Results() {
	return (
		<div className="flex flex-col place-items-center items-center">
			<div>
				<Headline>
					<h1 className="text-4xl font-medium">Ergebnisse</h1>
				</Headline>
				<p className="mx-72 mb-12 text-center">
					Bitte w&auml;hlen Sie den Wochentag und die Tageszeit aus,
					f&uuml;r die Sie die Ergebnisse ansehen m&ouml;chten.
				</p>
				<div className="m-auto flex w-5/6 shrink flex-col items-center md:flex-row md:space-x-10">
					<Bordered className="grow max-md:w-full">
						<Headline className="mb-2">
							<h4 className="font-semibold">Dein Layout</h4>
						</Headline>
						<form
							name="results"
							id="results"
							className="grid w-3/4 grid-cols-2 grid-rows-2 gap-y-5 text-left"
						>
							<label htmlFor="time" className="font-semibold">
								Tageszeit
							</label>
							<Select name="time" id="time" className="px-2 py-1">
								{/*TODO*/}
								<option value="volvo">Volvo</option>
								<option value="saab">Saab</option>
								<option value="mercedes">Mercedes</option>
								<option value="audi">Audi</option>
							</Select>

							<label htmlFor="day" className="font-semibold">
								Wochentag
							</label>
							<Select name="day" id="day" className="px-2 py-1">
								<option value="monday">Montag</option>
								<option value="tuesday">Dienstag</option>
								<option value="wednesday">Mittwoch</option>
								<option value="thursday">Donnerstag</option>
								<option value="friday">Freitag</option>
								<option value="saturday">Samstag</option>
								<option value="sunday">Sonnabend</option>
							</Select>
						</form>
						<Headline className="mt-6"></Headline>
						<Button
							type="submit"
							value="results"
							form="results"
							className="mb-6 mt-2 px-4 py-1"
						>
							Speichern
						</Button>
					</Bordered>
					<Bordered className="grow-[2] max-md:w-full lg:w-3/5">
						Ergebnisse
					</Bordered>
				</div>
			</div>
		</div>
	);
}
