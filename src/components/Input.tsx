export default function Input({
	className,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={`align-center before: flex justify-center rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none focus:outline-inputBorderColor ${className}`}
			{...rest}
		/>
	);
}
