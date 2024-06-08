"use client";
import { ChangeEvent, createContext, useContext, useState } from "react";

interface FormObject {
	value: string;
	label: string;
}

const formObjectMapper = (x: string[]): FormObject => {
	return {
		value: x[0],
		label: x[1],
	};
};

export const days = [
	["monday", "Montag"],
	["tuesday", "Dienstag"],
	["wednesday", "Mittwoch"],
	["thursday", "Donnerstag"],
	["friday", "Freitag"],
	["saturday", "Samstag"],
	["noPreferredDay", "Kein bevorzugter Tag"],
].map(formObjectMapper);
export const time = [
	["morning", "Morgens 08:00-10:00"],
	["forenoon", "Vormittags 10:00-12:00"],
	["noon", "Mittags 12:00-14:00"],
	["afternoon", "Nachmittags 14:00-17:00"],
	["evening", "Abends 17:00-20:00"],
	["noPreferredTime", "Keine bevorzugte Zeit"],
].map(formObjectMapper);
export const allergies = [
	["gluten", "Gluten"],
	["soy", "Soja"],
	["lactose", "Laktose"],
	["peanuts", "Erdn\u00FCsse"],
	["fructose", "Fruktose"],
	["noAllergies", "Keine"],
	["otherAllergies", "Andere"],
].map(formObjectMapper);
export const diet = [
	["vegan", "Vegan"],
	["vegetarian", "Vegetarisch"],
	["omnivore", "Omnivor"],
].map(formObjectMapper);
export const occupation = [
	["fulltime", "Vollzeit"],
	["parttime", "Teilzeit"],
	["retired", "Rente"],
	["student", "Student"],
	["underage", "Sch\u00FCler"],
	["unemployed", "Arbeitslos"],
].map(formObjectMapper);
export const sex = [
	["male", "M\u00E4nnlich"],
	["female", "Weiblich"],
	["diverse", "Divers"],
].map(formObjectMapper);
export const buyingFor = [
	["adults", "Anzahl Erwachsene"],
	["children", "Anzahl Kinder"],
	["nobody", "Keine"],
].map(formObjectMapper);

const defaultFormState = {
	monday: false,
	tuesday: false,
	wednesday: false,
	thursday: false,
	friday: false,
	saturday: false,
	noPreferredDay: false,
	time: "",
	gluten: false,
	soy: false,
	lactose: false,
	peanuts: false,
	fructose: false,
	noAllergies: false,
	age: "",
	diet: "",
	otherAllergies: "",
	occupation: "",
	male: false,
	female: false,
	diverse: false,
	adults: "",
	children: "",
	nobody: false,
};
interface FormContextProps {
	formState: typeof defaultFormState;
	onChange: (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		nextState?: typeof defaultFormState,
	) => void;
}
const FormContext = createContext<FormContextProps | undefined>(undefined);
export const FormProvider = ({ children }: { children: React.ReactNode }) => {
	const [formState, setFormState] = useState(defaultFormState);
	const onChange = (
		event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
		nextState?: typeof formState,
	) => {
		const { name, type, value, checked } = event.target as HTMLInputElement;
		if (["checkbox", "radio"].includes(type)) {
			setFormState({
				...(nextState || formState),
				[value]: checked,
			});
		} else {
			setFormState({
				...(nextState || formState),
				[name]: value,
			});
		}
	};
	return (
		<FormContext.Provider value={{ formState, onChange }}>
			{children}
		</FormContext.Provider>
	);
};

export const useForm = () => {
	const context = useContext(FormContext);
	if (!context) {
		throw new Error("useForm must be used within a FormProvider");
	} else {
		return context;
	}
};
