export default function Button({
	className,
	children,
	...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className={`cursor-pointer border-2 border-buttonBorderColor bg-buttonBackgroundColor text-buttonBorderColor hover:border-hoverColor hover:text-hoverColor ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
