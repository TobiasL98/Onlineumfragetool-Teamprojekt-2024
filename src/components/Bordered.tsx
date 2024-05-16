export default function Bordered({
	children,
	className = "",
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`flex flex-col items-center justify-center rounded-3xl bg-borderBackgroundColor text-center ${className}`}
		>
			{children}
		</div>
	);
}
