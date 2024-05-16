import Link from "next/link";

export default function Header(admin: boolean) {
	return (
		<header className="nav-container bg-[--header-color] border-b border-b-[--header-footer-separator-color]  px-6 font-mono">
			<div className="astro-3ef6ksr2 top-nav-wrap flex justify-between p-4 font-mono text-sm">
				<div className="flex align-baseline ">
					<Link
						className="astro-3ef6ksr2 logo whitespace-nowrap p-1"
						href="/user"
					>
						<img
							src={"/Logo_flowculate_4c_day_M 1.svg"}
							alt="flowculate"
							className="astro-3ef6ksr2"
							decoding="async"
							fetchPriority="high"
							width="125"
						/>
					</Link>

					{admin ? (
						<nav className="astro-3ef6ksr2 flex" id="nav-menu">
							<ul
								className="astro-3ef6ksr2 display-none flex items-center pl-10"
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
									<Link
										className="astro-3ef6ksr2"
										href="/admin/results"
									>
										Ergebnisse
									</Link>
								</li>
							</ul>
						</nav>
					) : null}
				</div>
				<div className="astro-3ef6ksr2 flex px-4">
					<Link
						className="astro-3ef6ksr2 focus-outline astro-5eunqzkt group inline-block border border-buttonBorderColor bg-[#444033] p-1 px-4 font-mono text-[#FFD111]"
						href="/login"
					>
						{/* TODO handle sessions */}
						{admin ? "Admin Logout" : "Admin Login"}
					</Link>
				</div>
			</div>
		</header>
	);
}
