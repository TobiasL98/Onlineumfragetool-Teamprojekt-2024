export default function Headline({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={`${className} w-full flex-grow`}>
			<div className="flex flex-col items-center justify-center align-middle">
				{children && (
					<div className="m-4 mb-4 flex-grow">{children}</div>
				)}
				<p className="mb-4 w-5/6 flex-grow border-b-2 border-b-borderSeparatorColor"></p>
			</div>
		</div>
	);
}
