import {
	allergies,
	days,
	defaultFormState,
	occupation,
	diet,
	time,
	sex,
} from "app/(user)/(survey)/FormContext";

export enum Error {
	time,
	days,
	allergies,
	age,
	adults,
	children,
	nobody,
	occupation,
	diet,
	sex,
}

export default function checkForm(form: typeof defaultFormState): Error[] {
	let errors: Error[] = [];

	const error = (cond: boolean, type: Error) => {
		if (cond) {
			errors.push(type);
		}
	};

	// does it have a valid time? does it have a time? empty string means it is not selected, it is not part of the time array so no need to check
	error(!time.map((x) => x.value).includes(form.time), Error.time);

	error(
		days.every((x) => {
			return !(form as any)[x.value];
		}),
		Error.days,
	);

	error(
		form.noPreferredDay &&
			days.slice(0, -1).some((x) => (form as any)[x.value]),
		Error.days,
	);

	error(null == form.otherAllergies.match("(w* ?)*"), Error.allergies);
	error(isNaN(form.age as any), Error.age);
	const adults = Number(form.adults);
	error(isNaN(adults) || adults < 0, Error.adults);
	const children = Number(form.children);
	error(isNaN(children) || children < 0, Error.children);

	error(form.nobody && (adults > 0 || children > 0), Error.nobody);

	error(
		form.noAllergies &&
			allergies.slice(0, -2).some((x) => (form as any)[x.value]),
		Error.allergies,
	);
	error(form.noAllergies && form.otherAllergies.length > 0, Error.allergies);

	error(
		occupation.some((x) => form.occupation == x.value),
		Error.occupation,
	);
	error(
		diet.some((x) => form.diet == x.value),
		Error.diet,
	);

	error(
		sex.some((x) => form.sex == x.value),
		Error.sex,
	);

	return errors;
}
