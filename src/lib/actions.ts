"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const password = "1234567890";
const username = "admin";

export async function login(_currentState: unknown, formData: FormData) {
	if (
		!(
			username === formData.get("username") &&
			password === formData.get("password")
		)
	) {
		return "Invalid credentials.";
	} else {
		const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
		const session = process.env.NEXT_PUBLIC_SESSION_SECRET;
		if (session) {
			cookies().set("session", session, {
				expires,
				httpOnly: true,
			});
			redirect("/admin");
		} else {
			throw Error(
				"Set the NEXT_PUBLIC_SESSION_SECRET environment variable!",
			);
		}
	}
}

export async function logout(
	_currentState: unknown,
	_formData: FormData,
): Promise<string> {
	cookies().delete("session");
	redirect("/login");
}
