export default function Footer() {
	return (
		<div>
			<p className="align-center mx-8 border-b border-b-[--header-footer-separator-color]"></p>
			<div className="bg-bg-eFlow flex p-3 px-7">
				<div className="mb-3 ml-8 mr-8 flex font-mono text-sm">
					<p className="mr-2 font-bold">Datenschutzhinweis: </p>
					<p>
						Ihre Teilnahme an dieser Umfrage ist freiwillig und
						anonym. Die Daten werden ausschließlich für das
						Teamprojekt erhoben und nicht für andere Zwecke
						verwendet.
					</p>
				</div>
			</div>
		</div>
	);
}
