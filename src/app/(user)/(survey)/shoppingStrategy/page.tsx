"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import Headline from "components/Headline";
import LayoutSurvey from "components/layoutSurvey/LayoutSurvey";
import { EditorModes } from "lib/edit/EditorModes";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
import { IShelf } from "interfaces/edit/IShelf";
import { ICheckout } from "interfaces/edit/ICheckout";
import { IDoor } from "interfaces/edit/IDoor";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { Point } from "lib/geometry/point";
import { IPolygon } from "interfaces/edit/IPolygon";
import { connectPoints } from "utils/edit/utils";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";

export default function ShoppingStrategyPage() {
	const [configFile, setConfigFile] = useState<IeFlowFile | null>(null);

	
	const [selectedTime, setSelectedTime] = useState("");
	const [editorMode, setEditorMode] = useState<EditorModes>(EditorModes.image)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
	const defaultImagePosition: IBackgroundImagePosition = { name: "default", x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1 }
	const [backgroundImagePosition, setBackgroundImagePosition] = useState<IBackgroundImagePosition>(defaultImagePosition)
	const [shelfs, setShelfs] = useState<IShelf[]>([])
	const [checkouts, setCheckouts] = useState<ICheckout[]>([])
	const [doors, setDoors] = useState<IDoor[]>([])
	const [referenceLine, setReferenceLine] = useState<IReferenceLine>({ a: new Point(100, 100), b: new Point(200, 100), width: 10 }); // [start, end
	const [polygonCorners, setPolygonCorners] = useState<IPolygon>({ corners: [], closed: false });
	const walls = connectPoints(polygonCorners)
	const [holePolygons, setHolePolygons] = useState<IPolygon[]>([]);
	const innerWallsList = holePolygons.map((corners) => connectPoints(corners));

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const response = await fetch('/api/getConfig'); 
				if (!response.ok) {
					throw new Error('Failed to fetch config data');
				}
				//console.log("response: "+ response.json())
				const data: IeFlowFile = await response.json();
				//console.log("data: "+ data.name)
				setConfigFile(data);
			} catch (error) {
				console.error('Error fetching config:', error);
			}
		};
		fetchConfig();
	}, []);

	useEffect(() => {
		//console.log("configFile updated:", configFile?.name);
if (configFile && configFile.name !== undefined) {
			setPolygonCorners(configFile.PolygonCorners);
			setHolePolygons(configFile.HoleCorners);
			setDoors(configFile.Door);
			setShelfs(configFile.Shelfs);
			setBackgroundImagePosition(configFile.BackgroundImagePosition);
			setCheckouts(configFile.Checkouts);
		}
	}, [configFile]);

	return (
			<div className="flex flex-col">
				<Headline className="w-full flex-grow">
					<h1 className="text-4xl font-medium">Einkaufsstrategie</h1>
				</Headline>
				<div className="mb-3 italic text-center">
					Stellen Sie sich im Geiste vor Sie machen gerade
					Ihren Einkauf...
				</div>
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
							<div className="mt-2 mb-2 font-small">
								Mit einem Klick können Sie Schritt für Schritt Ihre
								Einkaufsreihenfolge auswählen und wie lange Sie jeweils an
								den Bereichen verweilen.
							</div>
							<div className="mt-2 mb-2 font-small">
								Per Rechtsklick auf das jeweilige Regal,
								können Sie Ihre Auswahl wiederrufen.
							</div>
							<div className="mt-2 mb-2 font-small">
								Bitte wählen Sie eine Kasse als letztes aus.
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
						{configFile ? (
							<LayoutSurvey
								backgroundImage={backgroundImage}
								mode={editorMode}
								grid={true}
								fit={false}
								referenceLine={referenceLine}
								polygonCorners={polygonCorners}
								holePolygons={holePolygons}
								walls={walls}
								holeWallsList={innerWallsList}
								backgroundImagePosition={backgroundImagePosition}
								doors={doors}
								shelfs={shelfs}
								checkouts={checkouts}
							/>
						) : null}
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
