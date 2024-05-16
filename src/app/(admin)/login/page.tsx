import Bordered from "components/Bordered";
import Button from "components/Button";
import Headline from "components/Headline";
import Input from "components/Input";

export default function Page() {
	return (
		<Bordered className="w-[650px]">
			<Headline className="mt-2 w-full grow">
				<h1 className="text-4xl font-medium">Admin Login </h1>
			</Headline>
			<form className="mt-4 w-3/5 flex-grow" name="login" id="login">
				<Input className="mb-4" placeholder="admin" />
				<br></br>
				<Input placeholder="password" />
				<Button
					type="submit"
					value="login"
					form="login"
					className="font-mono my-6 px-7 py-2"
				>
					Login
				</Button>
			</form>
		</Bordered>
	);
}
