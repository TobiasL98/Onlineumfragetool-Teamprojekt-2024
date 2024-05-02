import React from "react";

const Footer: React.FC = () => {
    return (
        <footer>
            <p className="border-b-borderSeparatorColor my-3 m-7 border-b"></p>
            <div className="bg-bg-eFlow px-7 p-3 flex">
                <div className="flex ml-8 mr-8 mb-3 font-mono text-sm">
                    <p className="font-bold mr-2">Datenschutzhinweis: </p>
                    <p>
                        Ihre Teilnahme an dieser Umfrage ist freiwillig und anonym. Die Daten werden ausschließlich
                        für das Teamprojekt erhoben und nicht für andere Zwecke verwendet.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;