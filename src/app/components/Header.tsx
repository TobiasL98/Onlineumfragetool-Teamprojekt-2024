import React from "react";


const Header: React.FC = () => {
    return (
        <header className="mb-6 px-6 bg-[--header-color] border-b-borderSeparatorColor border-b nav-container">
            <div className="flex astro-3ef6ksr2 top-nav-wrap p-4 justify-between font-mono text-sm">
                <div className="flex align-baseline ">
                    <a className="astro-3ef6ksr2 logo whitespace-nowrap p-1" href="#">
                        <img src={"/Logo_flowculate_4c_day_M 1.svg"} alt="flowculate" className="astro-3ef6ksr2" decoding="async" fetchPriority="high" width="120"/>
                    </a>
                    <nav className="astro-3ef6ksr2 flex" id="nav-menu">
                        <ul className="astro-3ef6ksr2 display-none  items-center pl-10 flex" id="menu-items">
                            <li className="astro-3ef6ksr2 flex px-5">
                                <a className="astro-3ef6ksr2" href="#">Neues Layout</a>
                            </li>
                            <li className="astro-3ef6ksr2 flex px-5">
                                <a className="astro-3ef6ksr2" href="#">Layouts</a>
                            </li>
                            <li className="astro-3ef6ksr2 flex px-5">
                                <a className="astro-3ef6ksr2" href="#">Ergebnisse</a>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="astro-3ef6ksr2 flex px-4">
                        <a className="astro-3ef6ksr2 font-mono focus-outline astro-5eunqzkt group inline-block bg-[#444033] border-buttonBorderColor border p-1 px-4 text-[#FFD111]" href="#" tabIndex={0} target="_blank">
                            Anmelden
                        </a>
                </div>
            </div>
        </header>
    );
};

export default Header;