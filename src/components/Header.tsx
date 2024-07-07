"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Button from "components/Button";
import { logout } from "lib/actions";
import { useFormState } from "react-dom";

export default function Header({ admin }: { admin: boolean }) {
	const navigation = usePathname();
	const [_, dispatch] = useFormState(logout, undefined);
	return (
		<div className="nav-container border-b border-b-[--header-footer-separator-color] bg-[--header-color]  px-6 font-mono">
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
									className="astro-3ef6ksr2 display-none flex items-center pl-10 "
									id="menu-items"
								>
									<li className="astro-3ef6ksr2 astro-3ef6ksr2 flex px-5 hover:text-[--hover-color]">
										<Link
											className={`astro-3ef6ksr2 ${navigation === "/admin/edit" ? "underline" : ""}`}
											href="/admin/edit"
										>
											Neues Layout
										</Link>
									</li>
									<li className="astro-3ef6ksr2 astro-3ef6ksr2 flex px-5 hover:text-[--hover-color]">
										<Link
											className={`astro-3ef6ksr2 ${navigation === "/admin/results" ? "underline" : ""}`}
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
					{admin ? (
						<form action={dispatch}>
							<Button className="p-1 px-4" type="submit">
								Admin Logout
							</Button>
						</form>
					) : (
						<Link className="link-button" href="/login">
							Admin Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
