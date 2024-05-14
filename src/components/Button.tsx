export default function Button({
	className,
	children,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={`border-2 border-buttonBorderColor bg-buttonBackgroundColor text-buttonBorderColor ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
