"use client";

import Button from "components/Button";
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
import { connectPoints, getBounds } from "utils/edit/utils";


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

const validatePlan = (polygonCorners: IPolygon, doors: IDoor[], referenceLine: IReferenceLine): boolean => {
	if (polygonCorners.closed === true && doors.length !== 0 && referenceLine.a.x !== referenceLine.b.x) {
		return true;
	} else {
		return false;
	}
};

export default function Editor() {
	// States for all eflow.json parameter
	/*const [defaultParams, setDefaultParams] = useState<IeFlowFile>(DefaultParameter)
	const [activeConfig, setActiveConfig] = useState<IeFlowFile | null>(null)
	const [name, setName] = useState<string>(defaultParams.name)
	const [scenario, setScenario] = useState<IScenarioParameter>(defaultParams.Scenario)
	const [infection, setInfection] = useState<IInfectionParameter>(denormalizeInfectionValues(defaultParams.Infection))
	const [fundamentaldiagramm, setFundamentaldiagramm] = useState<number>(defaultParams.Fundamentaldiagramm)
	const [infectionDisabled, setInfectionDisabled] = useState(false)
	const [agentsOn, setAgentsOn] = useState(false)

	// save entrances as doors when loading config
	const [attractors, setAttractors] = useState<IAttractor[]>([])
	const [refinement, setRefinement] = useState<IRefinement>(defaultParams.Refinement)
	// const [granularity, setGranularity] = useState<number>(defaultParams.Granularity)
	const [grid, setGrid] = useState<any>(defaultParams.Grid)*/

	// canvas States
	// here are states that represent the same things as entrances/exits!
	const [polygonCorners, setPolygonCorners] = useState<IPolygon>({ corners: [], closed: false });
	const walls = connectPoints(polygonCorners)

	const [holePolygons, setHolePolygons] = useState<IPolygon[]>([]);
	// const innerWalls = connectPoints(holeCorners)
	const innerWallsList = holePolygons.map((corners) => connectPoints(corners));

	const [subdomains, setSubdomains] = useState<ISubdomain[]>([])
	const [checkouts, setCheckouts] = useState<ICheckout[]>([])
	//const [startAreas, setStartAreas] = useState<IStartArea[]>([])
	const [doors, setDoors] = useState<IDoor[]>([])
	const [referenceLine, setReferenceLine] = useState<IReferenceLine>({ a: new Point(100, 100), b: new Point(200, 100), width: 10 }); // [start, end
	//const [measurementLines, setMeasurementLines] = useState<Vector[]>([]);

	// set simulateMode to false when Editor should be shown
	const [tab, setTab] = useState<string>("Plan");
	const [editorMode, setEditorMode] = useState<EditorModes>(EditorModes.walls)
	//const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)
	const defaultImagePosition: IBackgroundImagePosition = { name: "default", x: 0, y: 0, width: 0, height: 0, rotation: 0, scaleX: 1, scaleY: 1 }
	const [backgroundImagePosition, setBackgroundImagePosition] = useState<IBackgroundImagePosition>(defaultImagePosition)

	const calculateScale = () => {
		const bounds = getBounds(polygonCorners)
		const width = bounds.maxX - bounds.minX
		const height = bounds.maxY - bounds.minY
		const scale = width / height
		return scale
	}

	const scale = calculateScale()

	const planValid = validatePlan(polygonCorners, doors, referenceLine)

	const handleDoorChange = ({ index, newValue }: { index: number, newValue: IDoor }) => {
		if (!doors) { return }
		let newState = [...doors]
		newState[index] = newValue
		setDoors(newState)
	}

	const handleReset = () => {
		if (tab === "Plan") {
			setPolygonCorners({corners: [], closed: false});
			setHolePolygons([]);
			setDoors([]);
			setSubdomains([]);
			setCheckouts([])
		}
	};

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
						Dein Layout
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
						<PlanTab editorMode={editorMode} onModeChange={setEditorMode} />
					</div>
				</div>
				<div className="bottom-0 z-50 flex flex-col items-center border-t-2 border-black p-4">
					<Button
						onClick={() => {
							console.log(selected()());
						}}
						className="w-3/4 py-1 text-center"
					>
						Speichern
					</Button>
				</div>
			</div>
			<div className={`flex-grow justify-between h-full items-center w-auto`}>
				<PlanEditor
					backgroundImage={backgroundImage}
					mode={editorMode}
					grid={tab === "Plan"}
					fit={tab === "Scenario"}
					zoom={tab === "Plan"}
					onModeChange={setEditorMode}
					referenceLine={referenceLine}
					//measurementLines={measurementLines}
					//attractors={attractors}
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
					//handleMeasurementLinesChange={(newMeasurementLines) => { setMeasurementLines(newMeasurementLines) }}
					//handleAttractorsChange={(newAttractors) => { setAttractors(newAttractors) }}
					doors={doors}
					handleDoorChange={(newDoors) => setDoors(newDoors)}
					subdomains={subdomains}
					checkouts={checkouts}
					//startAreas={startAreas}
					//scenario={scenario}
					handleSubdomainsChange={(newSubdomain) => setSubdomains(newSubdomain)}
					handleCheckoutsChange={(newCheckout) => setCheckouts(newCheckout)}
					//handleStartAreasChange={(newStartArea) => setStartAreas(newStartArea)}
					handleImageMoved={(newBackgroundImagePosition) => { setBackgroundImagePosition(newBackgroundImagePosition) }}
				/>
			</div>
		</div>
	);
}


