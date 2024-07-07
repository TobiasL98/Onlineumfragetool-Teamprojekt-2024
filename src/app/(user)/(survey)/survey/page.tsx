"use client";
import Bordered from "components/Bordered";
import Input from "components/Input";
import Label from "components/Label";
import Select from "components/Select";
import {
	ChangeEvent,
	ChangeEventHandler,
	HTMLAttributes,
	forwardRef,
	useRef,
} from "react";

import {
	useForm,
	days,
	allergies,
	sex,
	time,
	diet,
	buyingFor,
	occupation,
} from "../FormContext";
import { useRouter } from "next/navigation";

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

Error.displayName = "SurveyError";

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

const caretDown = { degree: "rotate(45deg)", marginTop: "0.25rem" };
const caretUp = { degree: "rotate(225deg)", marginTop: "0.5rem" };

export default function Survey() {
	const { formState, onChange } = useForm();
	const caretRef = useRef<HTMLParagraphElement>(null);
	const optionalQuestionsRef = useRef<HTMLDivElement>(null);
	const daysRequiredErrorRef = useRef<HTMLDivElement>(null);
	const timeRequiredErrorRef = useRef<HTMLDivElement>(null);
	const typedAllergiesFormatErrorRef = useRef<HTMLDivElement>(null);
	const selectedTimeRef = useRef<HTMLSelectElement>(null);
	const buyingForSomeRef = useRef<HTMLDivElement>(null);
	const allergiesRef = useRef<HTMLDivElement>(null);
	const typedAllergiesRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);
	const router = useRouter(); // Initialize useRouter

	const optionMapper = (x: FormObject) => {
		return (
			<option key={x.value} value={x.value}>
				{x.label}
			</option>
		);
	};
	optionMapper.displayName = "optionMapper";

	const checkboxMapper = (
		name: string,
		changer?: ChangeEventHandler,
		disabled: boolean = false,
	) => {
		function HOC(x: FormObject) {
			return (
				<Label className="flex items-center" key={x.value}>
					<Input
						className="mr-2"
						type="checkbox"
						id={x.value}
						name={name}
						value={x.value}
						onChange={changer}
						disabled={disabled}
						checked={(formState as any)[x.value]}
					/>
					{x.label}
				</Label>
			);
		}
		HOC.displayName = "checkboxMapper";
		return HOC;
	};

	const radioMapper = (name: string) => {
		function HOC(x: FormObject) {
			return (
				<Label key={x.value}>
					<Input
						className="mr-2"
						value={x.value}
						name={name}
						type="radio"
						onChange={onChange}
						checked={(formState as any)[name] === x.value}
					/>
					{x.label}
				</Label>
			);
		}
		HOC.displayName = "radioMapper";
		return HOC;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Perform validation
		const time = selectedTimeRef.current!;
		let timeError = timeRequiredErrorRef.current!;
		const error = <T extends HTMLElement>(cond: boolean, element?: T) => {
			if (cond) {
				element && (element.style.display = "block");
				e.preventDefault();
			}
		};
		error(time.selectedIndex === 0, timeError);
		error(
			days.every((x) => {
				return !(formState as any)[x.value];
			}),
			daysRequiredErrorRef.current!,
		);
		const typedAllergies =
			typedAllergiesRef.current!.querySelector("input")!;
		const typedAllergyFormat = typedAllergiesFormatErrorRef.current!;
		error(!typedAllergies.checkValidity(), typedAllergyFormat);
		error(!formRef.current!.checkValidity());

		// If validation fails, return
		if (
			time.selectedIndex === 0 ||
			days.every((x) => !(formState as any)[x.value]) ||
			!typedAllergies.checkValidity() ||
			!formRef.current!.checkValidity()
		) {
			return;
		}

		// Prepare form data
		const formData = {
			days: days
				.filter((day) => (formState as any)[day.value])
				.map((day) => day.value),
			time: formState.time,
			age: formState.age,
			sex: formState.sex,
			diet: formState.diet,
			occupation: formState.occupation,
			buyingFor: buyingFor
				.filter((item) => (formState as any)[item.value])
				.map((item) => ({
					type: item.value,
					count: (formState as any)[item.value],
				})),
			allergies: allergies
				.filter((item) => (formState as any)[item.value])
				.map((item) => item.value),
			otherAllergies: formState.otherAllergies,
		};

		// Submit form data
		const response = await fetch("/api/saveSurvey", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});

		if (response.ok) {
			router.push("/shoppingStrategy"); // Redirect to the next page
		} else {
			alert("Failed to save data.");
		}
	};

	return (
		<div className="flex flex-col items-center">
			<form
				ref={formRef}
				onSubmit={handleSubmit}
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
								{(() => {
									let dayCheckboxes = days.slice(0, -1).map(
										checkboxMapper(
											"days",
											(
												e: ChangeEvent<HTMLInputElement>,
											) => {
												daysRequiredErrorRef.current!.style.display =
													"none";
												onChange(e);
											},
											formState.noPreferredDay,
										),
									);
									let noPreferredDay = days.slice(-1).map(
										checkboxMapper(
											"days",
											(
												e: ChangeEvent<HTMLInputElement>,
											) => {
												const self =
													e.target as HTMLInputElement;
												if (self.checked) {
													let updateState: any = {
														...formState,
													};
													dayCheckboxes.forEach(
														(x) => {
															let boxProps = x
																.props
																.children[0]
																.props as React.InputHTMLAttributes<HTMLInputElement>;
															updateState[
																boxProps.value as string
															] = false;
														},
													);
													onChange(e, updateState);
												} else {
													onChange(e);
												}
												daysRequiredErrorRef.current!.style.display =
													"none";
											},
										),
									);
									return dayCheckboxes.concat(noPreferredDay);
								})()}
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
								defaultValue={
									formState.time.length == 0
										? "X"
										: formState.time
								}
								onChange={(e) => {
									timeRequiredErrorRef.current!.style.display =
										"none";
									onChange(e);
								}}
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
											onChange={onChange}
											value={formState.age}
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
											defaultValue={
												formState.diet.length == 0
													? "X"
													: formState.diet
											}
											onChange={onChange}
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
											name="occupation"
											className="ml-2 p-2"
											defaultValue={
												formState.occupation.length == 0
													? "X"
													: formState.occupation
											}
											onChange={onChange}
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
															disabled={
																formState.nobody
															}
															onChange={onChange}
															name={x.value}
															value={
																(
																	formState as any
																)[x.value]
															}
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
													(
														e: ChangeEvent<HTMLInputElement>,
													) => {
														const self =
															e.target as HTMLInputElement;
														const others =
															buyingForSomeRef.current!.querySelectorAll(
																"input",
															);
														if (self.checked) {
															let updateState: any =
																{
																	...formState,
																};
															others.forEach(
																(x) => {
																	updateState[
																		x.name
																	] = "";
																},
															);
															onChange(
																e,
																updateState,
															);
														} else {
															onChange(e);
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
														onChange,
														formState.noAllergies,
													),
												)}
										</div>
										<div>
											{[
												allergies[allergies.length - 2],
											].map(
												checkboxMapper(
													"allergies",
													(
														e: ChangeEvent<HTMLInputElement>,
													) => {
														const self = e.target;
														let allergies =
															allergiesRef.current!.querySelectorAll(
																"input",
															);
														if (self.checked) {
															let updateState: any =
																{
																	...formState,
																};
															allergies.forEach(
																(x) => {
																	updateState[
																		x.value
																	] = false;
																},
															);
															updateState[
																"otherAllergies"
															] = "";
															onChange(
																e,
																updateState,
															);
														} else {
															onChange(e);
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
															onChange={onChange}
															className="ml-2"
															type="text"
															value={
																formState.otherAllergies
															}
															disabled={
																formState.noAllergies
															}
															pattern="(\w* ?)*"
															name="otherAllergies"
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
				<button
					type="submit"
					className="link-button"
					onClick={handleSubmit}
				>
					Weiter
				</button>
			</div>
		</div>
	);
}
