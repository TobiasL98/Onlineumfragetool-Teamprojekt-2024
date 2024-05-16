export default function Input({
	className,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<input
			className={`w-full rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor px-2 py-1 text-inputBorderColor placeholder-inputBorderColor focus:outline-none focus:outline-inputBorderColor ${className}`}
			{...rest}
		/>
	);
}
