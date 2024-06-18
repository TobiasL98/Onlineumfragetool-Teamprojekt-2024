"use client";

import Headline from "components/Headline";
import Link from "next/link";
import { useState } from "react";

export default function ShoppingStrategyPage() {
	const [selectedTime, setSelectedTime] = useState("");

	return (
		<div className="flex flex-col">
			<Headline className="w-full flex-grow">
				<h1 className="text-4xl font-medium">Einkaufsstrategie</h1>
			</Headline>
			<div className="h-65 flex">
				<div className="w-25-percent m-5 ml-7 flex flex-col justify-between">
					{/*<form className="p-4 flex flex-col rounded-3xl bg-borderBackgroundColor jjustify-space-around m-5 ml-8">
                        <div className="flex flex-col my-3">
                            <h3 className="font-mono mb-3 font-semibold font-semibold text-center">
                                Aufenthaltsdauer
                            </h3>
                            <p className="mb-3 flex-grow border-b border-b-borderSeparatorColor"></p>
                            <div className="flex flex-col">
                                <small className="m-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="short"
                                            value="short"
                                            checked={selectedTime === "short"}
                                            onClick={() => setSelectedTime(prev => prev === "short" ? "" : "short")}
                                            className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                        />
                                        Kurz (&lt; 2min)
                                    </label>
                                </small>
                                <small className="m-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="middle"
                                            value="middle"
                                            checked={selectedTime === "middle"}
                                            onClick={() => setSelectedTime(prev => prev === "middle" ? "" : "middle")}
                                            className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                        />
                                        Mittel (2 - 5min)
                                    </label>
                                </small>
                                <small className="m-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="long"
                                            value="long"
                                            checked={selectedTime === "long"}
                                            onClick={() => setSelectedTime(prev => prev === "long" ? "" : "long")}
                                            className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                        /> Lang (5min &lt;)
                                    </label>
                                </small>
                            </div>
                        </div>
                    </form>*/}
					<div className="flex flex-col rounded-3xl bg-borderBackgroundColor p-4">
						<div className="mb-5 italic">
							Stellen Sie sich im Geiste vor Sie machen gerade
							Ihren Einkauf...
						</div>
						<div className="mt-5">
							Wählen Sie per Rechtsklick Schritt für Schritt Ihre
							Einkaufsreihenfolge aus und wie lange Sie jeweils an
							den Bereichen verweilen
						</div>
					</div>
					<Link
						className="link-button w-[fit-content]"
						href="/survey"
					>
						Zurück
					</Link>
				</div>
				<div className="m-5 flex w-full rounded-3xl bg-borderBackgroundColor p-4 italic">
					The actual, clickable Supermarkt Layout will be displayed
					here
				</div>
				<div className="m-5 mr-7 flex flex-col justify-end">
					<Link className="link-button flex w-full " href="/thankYou">
						Fertig
					</Link>
				</div>
			</div>
		</div>
	);
}
