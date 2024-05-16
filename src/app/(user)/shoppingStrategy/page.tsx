"use client"

import Headline from "app/components/Headline";
import Link from "next/link";
import { useState } from "react"

export default function ShoppingStrategyPage() {
    const [selectedTime, setSelectedTime] = useState("");

    return (
        <div className="flex flex-col">
            <Headline
                className="w-full flex-grow"
                text="Einkaufszentrum Layout"
            />
            <div className="flex h-65">
                <div className="w-30-percent flex flex-col justify-between">
                    <form className="p-4 flex flex-col rounded-3xl bg-borderBackgroundColor jjustify-space-around m-5 ml-8">
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
                    </form>
                    <Link className="flex justify-start w-full ml-8 mb-5" href="/survey">
                        <button className="font-mono border border-buttonBorderColor bg-buttonBackgroundColor p-1 px-4 text-buttonBorderColor">
                            Zurück
                        </button>
                    </Link>
                </div>
                <div className="italic p-4 flex rounded-3xl w-full bg-borderBackgroundColor m-5">
                    The actual, clickable Supermarkt Layout will be displayed here
                </div>
                <div className="w-30-percent flex flex-col justify-between ">
                    <div className="p-4 flex flex-col rounded-3xl bg-borderBackgroundColor m-5 mr-8">
                        <div className="italic mb-5">
                            Stellen Sie sich im Geiste vor Sie machen gerade Ihren Einkauf...
                        </div>
                        <div className="italic mt-5">
                            Wählen Sie per Rechtsklick Schritt für Schritt Ihre
                            Einkaufsreihenfolge aus und wie lange Sie jeweils an
                            den Bereichen verweilen
                        </div>
                    </div>
                    <Link className="flex justify-end mr-8 mb-5" href="/thankYou">
                        <button className="px-4 font-mono border border-buttonBorderColor bg-buttonBackgroundColor p-1 px-3 text-buttonBorderColor">
                            Fertig
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}