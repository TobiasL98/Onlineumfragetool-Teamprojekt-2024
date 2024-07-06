"use client";
import Bordered from "components/Bordered";
import Button from "components/Button";
import Headline from "components/Headline";
import Input from "components/Input";
import { login } from "lib/actions";
import { useFormState, useFormStatus } from "react-dom";

export default function Page() {
	const [errorMessage, dispatch] = useFormState(login, undefined);
	const { pending } = useFormStatus();
	return (
		<Bordered className="w-[650px]">
			<Headline className="mt-2 w-full grow">
				<h1 className="text-4xl font-medium">Admin Login </h1>
			</Headline>
			<div style={{ color: "red" }} className="hint ml-5 mt-1 opacity-75">
				{errorMessage && <p>{errorMessage}</p>}
			</div>
			<form
				action={dispatch}
				className="mt-4 flex w-3/5 flex-grow flex-col items-center"
				name="login"
				id="login"
			>
				<Input
					className="mb-4 px-2 py-1"
					placeholder="admin"
					name="username"
					type="text"
				/>
				<br></br>
				<Input
					placeholder="password"
					className="px-2 py-1"
					name="password"
					type="password"
				/>
				<Button
					aria-disabled={pending}
					onClick={(e) => {
						if (pending) {
							e.preventDefault();
						}
					}}
					type="submit"
					value="login"
					form="login"
					className="my-6 px-7 py-2 font-mono"
				>
					Login
				</Button>
			</form>
		</Bordered>
	);
}
