"use client";
import Bordered from "components/Bordered";
import Button from "components/Button";
import Input from "components/Input";
import Label from "components/Label";
import Select from "components/Select";
import {
	ChangeEvent,
	ChangeEventHandler,
	HTMLAttributes,
	forwardRef,
	useRef,
	useState,
} from "react";

const Error = forwardRef<HTMLDivElement, { text: string }>((props, ref) => {
	return (
		<div
			className="hint ml-5 mt-1 opacity-75"
			style={{ color: "red", display: "none" }}
			ref={ref}
		>
			{props.text}
		</div>
	);
});
function Separator({
	className,
	...rest
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p
			className="w-full border-t border-t-borderSeparatorColor"
			{...rest}
		></p>
	);
}
interface FormObject {
	value: string;
	label: string;
}
interface FormState {
	value: string;
	selected: boolean;
}
const formObjectMapper = (x: string[]): FormObject => {
	return {
		value: x[0],
		label: x[1],
	};
};
function stateFromFormObject(objs: FormObject[]) {
	return useState<FormState[]>(
		objs.map((x) => {
			return { selected: false, value: x.value };
		}),
	);
}
const days = [
	["monday", "Montag"],
	["tuesday", "Dienstag"],
	["wednesday", "Mittwoch"],
	["thursday", "Donnerstag"],
	["friday", "Freitag"],
	["saturday", "Samstag"],
	["noPreferredDay", "Kein bevorzugter Tag"],
].map(formObjectMapper);
const time = [
	["morning", "Morgens 08:00-10:00"],
	["forenoon", "Vormittags 10:00-12:00"],
	["noon", "Mittags 12:00-14:00"],
	["afternoon", "Nachmittags 14:00-17:00"],
	["evening", "Abends 17:00-20:00"],
	["noPreferredTime", "Keine bevorzugte Zeit"],
].map(formObjectMapper);
const allergies = [
	["gluten", "Gluten"],
	["soy", "Soja"],
	["lactose", "Laktose"],
	["peanuts", "Erdn\u00FCsse"],
	["fructose", "Fruktose"],
	["none", "Keine"],
	["others", "Andere"],
].map(formObjectMapper);
const diet = [
	["vegan", "Vegan"],
	["vegetarian", "Vegetarisch"],
	["omnivore", "Omnivor"],
].map(formObjectMapper);
const occupation = [
	["fulltime", "Vollzeit"],
	["parttime", "Teilzeit"],
	["retired", "Rente"],
	["student", "Student"],
	["underage", "Sch\u00FCler"],
	["unemployed", "Arbeitslos"],
].map(formObjectMapper);
const sex = [
	["male", "M\u00E4nnlich"],
	["female", "Weiblich"],
	["diverse", "Divers"],
].map(formObjectMapper);
const buyingFor = [
	["adults", "Anzahl Erwachsene"],
	["children", "Anzahl Kinder"],
	["nobody", "Keine"],
].map(formObjectMapper);
const caretDown = { degree: "rotate(45deg)", marginTop: "0.25rem" };
const caretUp = { degree: "rotate(225deg)", marginTop: "0.5rem" };
export default function Survey() {
	const caretRef = useRef<HTMLParagraphElement>(null);
	const optionalQuestionsRef = useRef<HTMLDivElement>(null);
	const daysRequiredErrorRef = useRef<HTMLDivElement>(null);
	const timeRequiredErrorRef = useRef<HTMLDivElement>(null);
	const typedAllergiesFormatErrorRef = useRef<HTMLDivElement>(null);
	const selectedTimeRef = useRef<HTMLSelectElement>(null);
	const buyingForSomeRef = useRef<HTMLDivElement>(null);
	const allergiesRef = useRef<HTMLDivElement>(null);
	const typedAllergiesRef = useRef<HTMLDivElement>(null);
	const [selectedDays, setSelectedDays] = stateFromFormObject(days);
	const [selectedAllergies, setSelectedAllergies] =
		stateFromFormObject(allergies);
	const onCheckCheckbox = ([selected, setSelected]: [
		typeof selectedDays,
		typeof setSelectedDays,
	]) => {
		return (e: ChangeEvent<HTMLInputElement>) => {
			const self = e.target as HTMLInputElement;
			const update = selected.map((x) =>
				x.value === self.value
					? {
							...x,
							selected: !x.selected,
						}
					: x,
			);
			setSelected(update);
		};
	};
	const optionMapper = (x: FormObject) => {
		return (
			<option key={x.value} value={x.value}>
				{x.label}
			</option>
		);
	};
	const checkboxMapper = (name: string, changer?: ChangeEventHandler) => {
		return (x: FormObject) => {
			return (
				<Label className="flex items-center" key={x.value}>
					<Input
						className="mr-2"
						type="checkbox"
						id={x.value}
						name={name}
						value={x.value}
						onChange={changer}
					/>
					{x.label}
				</Label>
			);
		};
	};
	const radioMapper = (name: string) => {
		return (x: FormObject) => {
			return (
				<Label key={x.value}>
					<Input
						className="mr-2"
						value={x.value}
						name={name}
						type="radio"
					/>
					{x.label}
				</Label>
			);
		};
	};
	return (
		<div className="flex flex-col items-center">
			<form
				name="survey"
				id="survey"
				className="flex flex-col place-items-center items-center"
			>
				<Bordered className="mb-10 w-4/5 grow">
					<div className="m-5 flex space-x-6">
						<div className="flex flex-1 flex-col items-center justify-center">
							<p>
								An welchem Wochentag gehen Sie für gewöhnlich
								einkaufen?
								<span className="p-2" style={{ color: "red" }}>
									*
								</span>
							</p>
							<Error
								ref={daysRequiredErrorRef}
								text="* Bitte wählen Sie mindestens eine Option."
							/>
							<small className="mb-5 mt-3 flex flex-wrap pl-5 pr-8 text-center">
								{days.map(
									checkboxMapper(
										"days",
										onCheckCheckbox([
											selectedDays,
											setSelectedDays,
										]),
									),
								)}
							</small>
							<div className="hint flex p-1 pl-5 text-left opacity-30">
								<p className="mr-1 font-bold">Hinweis: </p>
								<p>
									Sie können mehrere Tage auswählen, jedoch
									wird anschließend nur eine Einkaufsstrategie
									für alle ausgewählten Tage angewendet. Sie
									können die Umfrage für verschiedene Tage
									wiederholen.
								</p>
							</div>
						</div>
						<p className="border-l border-borderSeparatorColor"></p>
						<div className="flex flex-1 flex-col items-center">
							<p>
								Zu welcher Tageszeit gehen Sie für gewöhnlich
								einkaufen?
								<span className="p-2" style={{ color: "red" }}>
									*
								</span>
							</p>
							<Error
								ref={timeRequiredErrorRef}
								text="* Bitte wählen Sie mindestens eine Option."
							/>
							<Select
								name="time"
								className="mt-5 p-2"
								ref={selectedTimeRef}
								defaultValue="X"
							>
								<option disabled value="X">
									Bitte w&auml;hlen
								</option>
								{time.map(optionMapper)}
							</Select>
						</div>
					</div>
				</Bordered>
				<Bordered className="w-4/5 grow p-5 ">
					<div className="flex w-full flex-grow flex-col">
						<button
							className="flex space-x-2"
							type="button"
							onClick={(_) => {
								let style = caretRef.current!.style;
								if (style.transform === caretDown.degree) {
									style.transform = caretUp.degree;
									style.marginTop = caretUp.marginTop;
									optionalQuestionsRef.current!.style.display =
										"flex";
								} else {
									style.transform = caretDown.degree;
									style.marginTop = caretDown.marginTop;
									optionalQuestionsRef.current!.style.display =
										"none";
								}
							}}
						>
							<span
								ref={caretRef}
								className="mr-1 border border-t-0 border-solid border-buttonBorderColor border-l-transparent border-t-transparent p-1 transition-all"
								style={{
									transform: caretDown.degree,
									marginTop: "0.25rem",
								}}
							></span>
							<span>Weitere Fragen</span>
							<span className=" text-buttonBorderColor">
								(optional)
							</span>
						</button>
						<div
							style={{ display: "none" }}
							ref={optionalQuestionsRef}
							className="mt-1 flex-col items-center transition-all"
						>
							<Separator />
							<div className="m-5 flex w-full grow space-x-6">
								<div className="flex flex-1 flex-col items-center space-y-3">
									<Label>
										Alter in Jahren
										<Input
											type="number"
											min="0"
											max="99"
											name="age"
											className="ml-2 w-[fit-content]"
										></Input>
									</Label>
									<Separator />
									<Label className="flex flex-col">
										Bitten geben Sie Ihr Geschlecht an
										<small className="flex">
											{sex.map(radioMapper("sex"))}
										</small>
									</Label>
									<Separator />
									<Label className="flex justify-between">
										{"Ern\u00E4hrungsstil"}
										<Select
											name="diet"
											className="ml-2 p-2"
											defaultValue="X"
										>
											<option disabled value="X">
												Bitte w&auml;hlen
											</option>
											{diet.map(optionMapper)}
										</Select>
									</Label>
									<Separator />
									<Label className="flex justify-between">
										Berufstätigkeit
										<Select
											name="occuptation"
											className="ml-2 p-2"
											defaultValue="X"
										>
											<option disabled value="X">
												Bitte w&auml;hlen
											</option>
											{occupation.map(optionMapper)}
										</Select>
									</Label>
								</div>
								<p className="my-4 border-l border-borderSeparatorColor"></p>
								<div className="flex flex-1 flex-col items-center justify-between space-y-3">
									<p>
										Für wie viele weitere Personen kaufen
										sie ein?
									</p>
									<small className="flex items-start space-x-8">
										<div ref={buyingForSomeRef}>
											{buyingFor.slice(0, -1).map((x) => {
												return (
													<Label
														className="flex justify-between"
														key={x.value}
													>
														{x.label}
														<Input
															name={x.value}
															type="number"
															min="1"
															max="99"
															className="ml-2 w-[fit-content]"
														></Input>
													</Label>
												);
											})}
										</div>
										<div>
											{buyingFor.slice(-1).map(
												checkboxMapper(
													"buyingFor",
													(e) => {
														const self =
															e.target as HTMLInputElement;
														const others =
															buyingForSomeRef.current!.querySelectorAll(
																"input",
															);
														if (self.checked) {
															others.forEach(
																(x) => {
																	x.value =
																		"";
																	x.disabled =
																		true;
																	x.readOnly =
																		true;
																},
															);
														} else {
															others.forEach(
																(x) => {
																	x.disabled =
																		false;
																	x.readOnly =
																		false;
																},
															);
														}
													},
												),
											)}
										</div>
									</small>
									<Separator />
									<p>Allergien / Unverträglichkeiten</p>
									<Error
										ref={typedAllergiesFormatErrorRef}
										text="Andere im Format: Allergie LEERZEICHEN Allergie..."
									/>
									<small className="mb-5 mt-3 flex flex-wrap pl-5 pr-8 text-center">
										<div
											className="flex"
											ref={allergiesRef}
										>
											{allergies
												.slice(0, -2)
												.map(
													checkboxMapper(
														"allergies",
														onCheckCheckbox([
															selectedAllergies,
															setSelectedAllergies,
														]),
													),
												)}
										</div>
										<div>
											{[
												allergies[allergies.length - 2],
											].map(
												checkboxMapper(
													"noAllergies",
													(e) => {
														const self =
															e.target as HTMLInputElement;
														let allergies =
															allergiesRef.current!.querySelectorAll(
																"input",
															);
														let otherAllergies =
															typedAllergiesRef.current!.querySelector(
																"input",
															)!;
														if (self.checked) {
															allergies.forEach(
																(x) => {
																	x.checked =
																		false;
																	x.readOnly =
																		true;
																	x.disabled =
																		true;
																	otherAllergies.disabled =
																		true;
																	otherAllergies.readOnly =
																		true;
																	otherAllergies.value =
																		"";
																},
															);
														} else {
															allergies.forEach(
																(x) => {
																	x.readOnly =
																		false;
																	x.disabled =
																		false;
																	otherAllergies.readOnly =
																		false;
																	otherAllergies.disabled =
																		false;
																},
															);
														}
													},
												),
											)}
										</div>
										<div ref={typedAllergiesRef}>
											{(() => {
												const others =
													allergies[
														allergies.length - 1
													];
												return (
													<Label key={others.value}>
														{others.label}
														<Input
															className="ml-2"
															type="text"
															pattern="(\w* ?)*"
															name={others.value}
														/>
													</Label>
												);
											})()}
										</div>
									</small>
								</div>
							</div>
						</div>
					</div>
				</Bordered>
			</form>
			<div className="m-5 flex w-4/5 grow justify-between">
				<div></div>
				<Button
					className="p-1 px-4 font-mono"
					type="submit"
					form="survey"
					value="survey"
					onClick={(e) => {
						const time = selectedTimeRef.current!;
						let timeError = timeRequiredErrorRef.current!;
						const error = <T extends HTMLElement>(
							cond: boolean,
							element?: T,
						) => {
							if (cond) {
								element && (element.style.display = "block");
								e.preventDefault();
							}
						};
						error(time.selectedIndex === 0, timeError);
						error(
							selectedDays.filter((x) => x.selected).length == 0,
							daysRequiredErrorRef.current!,
						);
						const typedAllergies =
							typedAllergiesRef.current!.querySelector("input")!;

						const typedAllergyFormat =
							typedAllergiesFormatErrorRef.current!;
						error(
							!typedAllergies.checkValidity(),
							typedAllergyFormat,
						);
					}}
				>
					Weiter
				</Button>
			</div>
		</div>
	);
}
