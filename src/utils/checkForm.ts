import {
	allergies,
	days,
	defaultFormState,
	occupation,
	diet,
	time,
	sex,
} from "app/(user)/(survey)/FormContext";

export enum FormError {
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

export default function checkForm(form: typeof defaultFormState): FormError[] {
	let errors: FormError[] = [];

	const error = (cond: boolean, type: FormError) => {
		if (cond) {
			errors.push(type);
		}
	};

	// does it have a valid time? does it have a time? empty string means it is not selected, it is not part of the time array so no need to check
	error(!time.map((x) => x.value).includes(form.time), FormError.time);

	error(
		days.every((x) => {
			return !(form as any)[x.value];
		}),
		FormError.days,
	);

	error(
		form.noPreferredDay &&
			days.slice(0, -1).some((x) => (form as any)[x.value]),
		FormError.days,
	);

	error(null == form.otherAllergies.match("(w* ?)*"), FormError.allergies);
	error(isNaN(form.age as any), FormError.age);
	const adults = Number(form.adults);
	error(isNaN(adults) || adults < 0, FormError.adults);
	const children = Number(form.children);
	error(isNaN(children) || children < 0, FormError.children);

	error(form.nobody && (adults > 0 || children > 0), FormError.nobody);

	error(
		form.noAllergies &&
			allergies.slice(0, -2).some((x) => (form as any)[x.value]),
		FormError.allergies,
	);
	error(
		form.noAllergies && form.otherAllergies.length > 0,
		FormError.allergies,
	);

	error(
		form.occupation.length !== 0 &&
			!occupation.some((x) => form.occupation == x.value),
		FormError.occupation,
	);
	error(
		form.diet.length !== 0 && !diet.some((x) => form.diet == x.value),
		FormError.diet,
	);

	error(
		form.sex.length !== 0 && !sex.some((x) => form.sex == x.value),
		FormError.sex,
	);

	return errors;
}
