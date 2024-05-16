import Headline from "app/components/Headline";
export default function Page() {
	return (
		<div className="flex w-[650px] flex-col items-center justify-center rounded-3xl bg-borderBackgroundColor text-center">
			<Headline className="w-full flex-grow" text="Admin Login" />
			<form className="mt-4 w-3/5 flex-grow">
				<input
					className="mb-3 w-full rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor px-2 py-1 text-inputBorderColor placeholder-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
					placeholder="admin"
				></input>
				<br></br>
				<input
					className="w-full rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor px-2 py-1 text-inputBorderColor placeholder-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
					placeholder="password"
				></input>
			</form>
			<button className="font-mono my-6 border-2 border-buttonBorderColor bg-buttonBackgroundColor px-7 py-2 text-buttonBorderColor">
				Login
			</button>
		</div>
	);
}
