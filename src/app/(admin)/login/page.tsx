export default function Page() {
	return (
		<div className="flex w-[650px] flex-col items-center justify-center rounded-3xl bg-borderBackgroundColor text-center">
			<h1 className="m-4 mb-3 text-4xl font-medium">Admin Login</h1>
			<p className="w-3/4 border-b-2  border-b-borderSeparatorColor"></p>
			<form className="mt-5 w-3/5 flex-grow">
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
			<button className="my-6 border-2 border-buttonBorderColor bg-buttonBackgroundColor px-7 py-2 text-buttonBorderColor">
				Login
			</button>
		</div>
	);
}
