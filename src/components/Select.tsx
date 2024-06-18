import { forwardRef } from "react";

const Select = forwardRef<
	HTMLSelectElement,
	React.SelectHTMLAttributes<HTMLSelectElement>
>(
	(
		{
			className,
			children,
			...rest
		}: React.SelectHTMLAttributes<HTMLSelectElement>,
		ref,
	) => {
		return (
			<select
				className={`rounded-lg border-2 border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor placeholder-inputBorderColor focus:outline-none focus:outline-inputBorderColor ${className}`}
				ref={ref}
				{...rest}
			>
				{children}
			</select>
		);
	},
);

export default Select;
