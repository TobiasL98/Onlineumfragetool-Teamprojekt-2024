export default function Page() {
	return (
		<div className="flex flex-col items-center justify-center text-center rounded-3xl w-[650px] bg-borderBackgroundColor">
			<h1 className="text-4xl font-medium m-4 mb-3">Admin Login</h1>
			<p className="border-b-borderSeparatorColor w-3/4  border-b-2"></p>
			<form className="flex-grow w-3/5 mt-5">
				<input
					className="rounded-lg border-2 mb-3 px-2 w-full py-1 border-inputBorderColor placeholder-inputBorderColor text-inputBorderColor bg-inputBackgroundColor focus:outline-inputBorderColor focus:outline-none"
					placeholder="admin"
				></input>
				<br></br>
				<input
					className="rounded-lg border-2 px-2 w-full py-1 border-inputBorderColor placeholder-inputBorderColor text-inputBorderColor bg-inputBackgroundColor focus:outline-inputBorderColor focus:outline-none"
					placeholder="password"
				></input>
			</form>
			<button className="my-6 border-2 border-buttonBorderColor text-buttonBorderColor bg-buttonBackgroundColor px-7 py-2">
				Login
			</button>
		</div>
	);
}
