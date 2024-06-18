import { LabelHTMLAttributes } from "react";

export default function Label({
	className,
	children,
	...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
	return (
		<label className={`${className} m-2 flex items-center`} {...rest}>
			{children}
		</label>
	);
}
