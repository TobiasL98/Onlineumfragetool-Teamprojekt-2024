import Link from "next/link";

export default function Header(admin: bool) {
	return (
		<header className="nav-container border-b border-b-borderSeparatorColor bg-[--header-color] px-6">
			<div className="astro-3ef6ksr2 top-nav-wrap flex justify-between p-4 font-mono text-sm">
				<div className="flex align-baseline ">
					<Link
						className="astro-3ef6ksr2 logo whitespace-nowrap p-1"
						href="/"
					>
						<img
							src={"/Logo_flowculate_4c_day_M 1.svg"}
							alt="flowculate"
							className="astro-3ef6ksr2"
							decoding="async"
							fetchPriority="high"
							width="120"
						/>
					</Link>
					{admin ? (
						<nav className="astro-3ef6ksr2 flex" id="nav-menu">
							<ul
								className="astro-3ef6ksr2 display-none  flex items-center pl-10"
								id="menu-items"
							>
								<li className="astro-3ef6ksr2 flex px-5">
									<Link className="astro-3ef6ksr2" href="#">
										Neues Layout
									</Link>
								</li>
								<li className="astro-3ef6ksr2 flex px-5">
									<Link className="astro-3ef6ksr2" href="#">
										Layouts
									</Link>
								</li>
								<li className="astro-3ef6ksr2 flex px-5">
									<Link className="astro-3ef6ksr2" href="#">
										Ergebnisse
									</Link>
								</li>
							</ul>
						</nav>
					) : null}
				</div>
				{admin ? null : (
					<div className="astro-3ef6ksr2 flex px-4">
						<Link
							className="astro-3ef6ksr2 focus-outline astro-5eunqzkt group inline-block border border-buttonBorderColor bg-[#444033] p-1 px-4 font-mono text-[#FFD111]"
							href="/login"
						>
							Anmelden
						</Link>
					</div>
				)}
			</div>
		</header>
	);
}
