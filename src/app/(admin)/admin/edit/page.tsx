import YellowButton from "components/Button";

function Button({
	group,
	name,
	text,
}: {
	group: string;
	name: string;
	text: string;
}) {
	return (
		<div className="has-[:checked]:border-l-2 has-[:checked]:border-buttonBorderColor has-[:checked]:bg-backgroundColor has-[:checked]:text-textColor">
			<input
				type="radio"
				id={name}
				name={group}
				className="peer hidden appearance-none outline-none"
				value={name}
			/>
			<label
				className="z-10 me-auto ms-5 ms-auto text-center"
				htmlFor={name}
			>
				{text}
			</label>
		</div>
	);
}

export default function Editor() {
	return (
		<div className="flex grow self-stretch">
			<div className="flex basis-1/6 flex-col bg-[--header-color] text-inputBorderColor">
				<p className="mx-6 border-t-2 border-t-buttonBorderColor font-semibold text-buttonBorderColor"></p>
				<h2 className="m-2 text-center text-lg text-buttonBorderColor">
					Dein Layout
				</h2>
				<div className="space-y-2 border-y-2 border-black">
					<div className="mx-6 flex flex-col space-y-3 py-4">
						<button className="border-2 border-inputBorderColor bg-inputBackgroundColor">
							Eigenes Layout laden
						</button>
						<button className="border-2 border-inputBorderColor bg-inputBackgroundColor">
							Typische Vorlage laden
						</button>
					</div>
				</div>
				<div className="border-b-2 border-black">
					<h2 className="my-6 ms-4 text-lg font-medium">
						Architektur
					</h2>
					<form className="text-center">
						<Button text="W&auml;nde" name="wall" group="blocks" />
						<Button text="Eingang" name="entrance" group="blocks" />
						<Button text="Regale" name="shelf" group="blocks" />
					</form>
				</div>
				<div className="bottom-0 z-50 my-4 flex flex-col items-center">
					<YellowButton className="w-2/3 text-center">
						Speichern
					</YellowButton>
				</div>
			</div>
			<div className="grow basis-5/6 bg-white"></div>
		</div>
	);
}
