"use client";

import PlanEditor from "components/planEditor/PlanEditor";
import PlanTab from "components/planEditor/PlanTab";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
import { IDoor } from "interfaces/edit/IDoor";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { ICheckout } from "interfaces/edit/ICheckout";
import { EditorModes } from "lib/edit/EditorModes";
import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { useState } from "react";
import {
	areConfigsDifferent, connectPoints, getBounds, horiztontalDistanceBetweenOuterPoints,
	transformPointlistsToDomainpolygon, transformToConfigSubdomains } from "utils/edit/utils";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import DefaultParameter from "lib/edit/DefaultParameter";

const stageHeight = 1000

type Pair<K, V> = [K, V];
function RadioGroup<T>(
	buttons: Pair<string, () => T>[],
): [JSX.Element, () => () => T] {
	const [selected, setSelected] = useState(0);
	const selectedFunction = () => buttons[selected][1];

	return [
		<>
			{buttons.map((e, index) => {
				const text = e[0];
				return (
					<button
						key={text}
						onClick={() => {
							setSelected(index);
						}}
						className={
							selected == index
								? "border-l-2 border-buttonBorderColor bg-backgroundColor text-textColor"
								: ""
						}
						dangerouslySetInnerHTML={{ __html: text }}
					/>
				);
			})}
		</>,
		selectedFunction,
	];
}

export default function Editor() {
	// States for all eflow.json parameter
	const [defaultParams, setDefaultParams] = useState<IeFlowFile>(DefaultParameter)
	const [activeConfig, setActiveConfig] = useState<IeFlowFile | null>(null)
	const [name, setName] = useState<string>(defaultParams.name)
	const [grid, setGrid] = useState<any>(defaultParams.Grid)

	// canvas States
	// here are states that represent the same things as entrances/exits!
	const [polygonCorners, setPolygonCorners] = useState<IPolygon>({ corners: [], closed: false });
	const walls = connectPoints(polygonCorners)

	const [holePolygons, setHolePolygons] = useState<IPolygon[]>([]);
	// const innerWalls = connectPoints(holeCorners)
	const innerWallsList = holePolygons.map((corners) => connectPoints(corners));

	const [subdomains, setSubdomains] = useState<ISubdomain[]>([])
	const [checkouts, setCheckouts] = useState<ICheckout[]>([])
	const [doors, setDoors] = useState<IDoor[]>([])
	const [referenceLine, setReferenceLine] = useState<IReferenceLine>({ a: new Point(100, 100), b: new Point(200, 100), width: 10 }); // [start, end

	// set simulateMode to false when Editor should be shown
	const [tab, setTab] = useState<string>("Plan");
	const [editorMode, setEditorMode] = useState<EditorModes>(EditorModes.walls)
	//const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
	const defaultImagePosition: IBackgroundImagePosition = { name: "default", x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1 }
	const [backgroundImagePosition, setBackgroundImagePosition] = useState<IBackgroundImagePosition>(defaultImagePosition)

	const computeConfig = (newName: string,
						   newPolygonCorners: IPolygon,
						   newHoleCorners: IPolygon[],
						   newDoors: IDoor[],
						   newGrid: any,
						   newSubdomains: ISubdomain[],
						   backgroundImagePosition: IBackgroundImagePosition
	) => {
		let configSubdomains = transformToConfigSubdomains(newSubdomains, stageHeight)
		const configDoors = doors // TO DO
		const configDomainpolygon = transformPointlistsToDomainpolygon(newPolygonCorners, newHoleCorners, stageHeight)
		
		const config: IeFlowFile = {
			name: newName,
			Door: configDoors,
			SubdomainsFD: configSubdomains,
			Domainpolygon: configDomainpolygon,
			Grid: newGrid,
			PolygonCorners: newPolygonCorners,
			HoleCorners: newHoleCorners,
			BackgroundImagePosition: backgroundImagePosition
		}
		return config
	};

	const configFile: IeFlowFile = computeConfig(name,
		polygonCorners, holePolygons, grid, doors, subdomains, backgroundImagePosition)

	const refetchPossible = areConfigsDifferent(configFile, activeConfig)
	
	/*const handleReset = () => {
		if (tab === "Plan") {
			setPolygonCorners({corners: [], closed: false});
			setHolePolygons([]);
			setDoors([]);
			setSubdomains([]);
			setCheckouts([])
		}
	};*/

	let [buttons, selected] = RadioGroup([
		["W&auml;nde", () => 1],
		["Eingang", () => 2],
		["Regale", () => 3],
		["Kassen", () => 4],
	]);
	return (
		<div className="flex grow self-stretch">
			<div className="flex basis-1/6 flex-col justify-between bg-[--header-color] text-inputBorderColor border-r border-r-[--header-footer-separator-color]">
				<div>
					<p className="mx-6 border-t-2 border-t-buttonBorderColor font-semibold text-buttonBorderColor"></p>
					<h2 className="m-2 text-center text-lg text-buttonBorderColor">
						<input className='text-center mx-4 mb-1 text-lg rounded bg-[--header-color]'
							   name="simulationname"
							   type="text"
							   value={name}
							   onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
						/>
					</h2>
					<div className="space-y-2 border-y-2 border-black">
						<div className="mx-6 flex flex-col space-y-3 py-4">
							<button className="border-2 border-inputBorderColor bg-inputBackgroundColor">
								Eigenes Layout laden
							</button>
							<button className="border-2 border-inputBorderColor bg-inputBackgroundColor">
								Typische Vorlage laden
							</button>
						</div>
					</div>
					<div>
						<h2 className="my-6 ms-4 text-lg font-medium">
							Architektur
						</h2>
						<PlanTab editorMode={editorMode} onModeChange={setEditorMode} configFile={configFile}/>
					</div>
				</div>
			</div>
			<div className= {`flex-grow justify-between h-full items-center w-auto`}>
				<PlanEditor
					backgroundImage={backgroundImage}
					mode={editorMode}
					grid={tab === "Plan"}
					fit={tab === "Scenario"}
					zoom={tab === "Plan"}
					onModeChange={setEditorMode}
					referenceLine={referenceLine}
					polygonCorners={polygonCorners}
					holePolygons={holePolygons}
					walls={walls}
					holeWallsList={innerWallsList}
					backgroundImagePosition={backgroundImagePosition}
					handleCornerChange={(newPolygons) => { setPolygonCorners(newPolygons[0]) }}
					handleHoleCornerChange={(newPolygons) => { setHolePolygons(newPolygons) }}
					handleReferenceLineChange={(newReferenceLine) => {
						setReferenceLine(newReferenceLine)
					}}
					doors={doors}
					handleDoorChange={(newDoors) => setDoors(newDoors)}
					subdomains={subdomains}
					checkouts={checkouts}
					handleSubdomainsChange={(newSubdomain) => setSubdomains(newSubdomain)}
					handleCheckoutsChange={(newCheckout) => setCheckouts(newCheckout)}
					handleImageMoved={(newBackgroundImagePosition) => { setBackgroundImagePosition(newBackgroundImagePosition) }}
				/>
			</div>
		</div>
	);
}


