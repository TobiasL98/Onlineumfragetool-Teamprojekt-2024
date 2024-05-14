"use client";

import YellowButton from "components/Button";
import { useState } from "react";

type Pair<K, V> = [K, V];
function RadioGroup<T>(
	buttons: Pair<string, () => T>[],
): [JSX.Element, () => () => T] {
	const [selected, setSelected] = useState(0);
	const selectedFunction = () => buttons[selected][1];

	return [
		<>
			{buttons.map((e, index) => {
				const text = e[0];
				return (
					<button
						key={text}
						onClick={() => {
							setSelected(index);
						}}
						className={
							selected == index
								? "border-l-2 border-buttonBorderColor bg-backgroundColor text-textColor"
								: ""
						}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			})}
		</>,
		selectedFunction,
	];
}

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
	let [buttons, selected] = RadioGroup([
		["W&auml;nde", () => 1],
		["Eingang", () => 2],
		["Regale", () => 3],
	]);
	return (
		<div className="flex grow self-stretch">
			<div className="flex basis-1/6 flex-col justify-between bg-[--header-color] text-inputBorderColor">
				<div>
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
					<div>
						<h2 className="my-6 ms-4 text-lg font-medium">
							Architektur
						</h2>
						<div className="flex flex-col text-center">
							{buttons}
						</div>
					</div>
				</div>
				<div className="bottom-0 z-50 flex flex-col items-center border-t-2 border-black p-4">
					<YellowButton
						onClick={() => {
							console.log(selected()());
						}}
						className="w-3/4 py-1 text-center"
					>
						Speichern
					</YellowButton>
				</div>
			</div>
			<div className="grow basis-5/6 bg-white"></div>
		</div>
	);
}
