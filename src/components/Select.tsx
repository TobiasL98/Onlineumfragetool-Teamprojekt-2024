export default function Select({
	className,
	children,
	...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
	return (
		<select
			className={`rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor px-2 py-1 text-inputBorderColor placeholder-inputBorderColor focus:outline-none focus:outline-inputBorderColor ${className}`}
			{...rest}
		>
			{children}
		</select>
	);
}
