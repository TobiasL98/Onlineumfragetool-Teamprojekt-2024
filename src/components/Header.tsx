import Link from "next/link";
import { useRouter } from "next/router";
import Button from "components/Button";

export default function Header(admin: boolean) {
	return (
		<header className="nav-container border-b border-b-[--header-footer-separator-color] bg-[--header-color]  px-6 font-mono">
			<div className="astro-3ef6ksr2 top-nav-wrap flex justify-between p-4 font-mono text-sm">
				<div className="flex align-baseline ">
					{!admin ? (
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
					) : null}

					{admin ? (
						<>
							<Link
								className="astro-3ef6ksr2 logo whitespace-nowrap p-1"
								href="/admin"
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
							<nav className="astro-3ef6ksr2 flex" id="nav-menu">
								<ul
									className="astro-3ef6ksr2 display-none flex items-center pl-10"
									id="menu-items"
								>
									<li className="astro-3ef6ksr2 flex px-5">
										<Link
											className="astro-3ef6ksr2"
											href="/admin/edit"
										>
											Neues Layout
										</Link>
									</li>
									{/*<li className="astro-3ef6ksr2 flex px-5">
        <Link className="astro-3ef6ksr2" href="#">
            Layouts
        </Link>
    </li>*/}
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
						</>
					) : null}
				</div>
				<div className="astro-3ef6ksr2 flex px-4">
					<Button className="p-1 px-4 font-mono">
						<Link href="/login">
							{/* TODO handle sessions */}
							{admin ? "Admin Logout" : "Admin Login"}
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
