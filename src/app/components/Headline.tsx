export default function Headline({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<div className={className}>
			<div className="flex flex-col items-center justify-center align-middle">
				<h1 className="m-4 mb-4 flex-grow text-4xl font-medium">
					{text}
				</h1>
				<p className="mb-4 w-3/4 flex-grow border-b-2 border-b-borderSeparatorColor"></p>
			</div>
		</div>
	);
}
