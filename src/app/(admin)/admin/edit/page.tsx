"use client";

import PlanEditor from "components/planEditor/PlanEditor";
import PlanTab from "components/planEditor/PlanTab";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
import { IDoor } from "interfaces/edit/IDoor";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { IShelf } from "interfaces/edit/IShelf";
import { ICheckout } from "interfaces/edit/ICheckout";
import { EditorModes } from "lib/edit/EditorModes";
import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import {useEffect, useRef, useState } from "react";
import {
	areConfigsDifferent,
	connectPoints,
	getBounds,
	horiztontalDistanceBetweenOuterPoints,
	transformPointlistsToDomainpolygon,
	transformToConfigShelfs,
} from "utils/edit/utils";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import DefaultParameter from "lib/edit/DefaultParameter";
import FileUploadButton from "components/button/FileUploadButton";
import TypicalSupermarketButton from "components/button/TypicalSupermarketButton";
import SaveButton from "components/button/SaveButton";

const stageHeight = 1000;

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
	const [triggerUpload, setTriggerUpload] = useState(false);
	const fileUploadButtonRef = useRef<HTMLButtonElement>(null);
	const [triggerSupermarket, setTriggerSupermarket] = useState(false);
	const typicalSupermarketButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const shouldUpload = urlParams.get('upload') === 'true';
		const shouldSupermarket = urlParams.get('supermarket') === 'true';

		if (shouldUpload) {
			setTriggerUpload(true);
		}

		if (shouldSupermarket) {
			setTriggerSupermarket(true);
		}
	}, []);

	useEffect(() => {
		if (triggerUpload && fileUploadButtonRef.current) {
			fileUploadButtonRef.current.click();
			setTriggerUpload(false);
		}
	}, [triggerUpload]);

	useEffect(() => {
		if (triggerSupermarket && typicalSupermarketButtonRef.current) {
			typicalSupermarketButtonRef.current.click();
			setTriggerSupermarket(false);
		}
	}, [triggerSupermarket]);

	// States for all eflow.json parameter
	const [defaultParams, setDefaultParams] = useState<IeFlowFile>(DefaultParameter);
	const [activeConfig, setActiveConfig] = useState<IeFlowFile | null>(null);
	const [name, setName] = useState<string>(defaultParams.name);
	//const [grid, setGrid] = useState<any>(defaultParams.Grid);

	// canvas States
	// here are states that represent the same things as entrances/exits!
	const [polygonCorners, setPolygonCorners] = useState<IPolygon>({
		corners: [],
		closed: false,
	});
	const walls = connectPoints(polygonCorners);

	const [holePolygons, setHolePolygons] = useState<IPolygon[]>([]);
	// const innerWalls = connectPoints(holeCorners)
	const innerWallsList = holePolygons.map((corners) =>
		connectPoints(corners),
	);
	const [shelfs, setShelfs] = useState<IShelf[]>([]);
	const [checkouts, setCheckouts] = useState<ICheckout[]>([]);
	const [doors, setDoors] = useState<IDoor[]>([]);
	const [referenceLine, setReferenceLine] = useState<IReferenceLine>({
		a: new Point(100, 100),
		b: new Point(200, 100),
		width: 10,
	}); // [start, end

	// set simulateMode to false when Editor should be shown
	const [tab, setTab] = useState<string>("Plan");
	const [editorMode, setEditorMode] = useState<EditorModes>(
		EditorModes.walls,
	);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [backgroundImage, setBackgroundImage] =
		useState<HTMLImageElement | null>(null);
	const defaultImagePosition: IBackgroundImagePosition = {
		name: "default",
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		rotation: 0,
		scaleX: 1,
		scaleY: 1,
	};
	const [backgroundImagePosition, setBackgroundImagePosition] =
		useState<IBackgroundImagePosition>(defaultImagePosition);

	const computeConfig = (
		newName: string,
		newPolygonCorners: IPolygon,
		//newHoleCorners: IPolygon[],
		newDoors: IDoor[],
		//newGrid: any,
		newShelfs: IShelf[],
		backgroundImagePosition: IBackgroundImagePosition,
		newCheckouts: ICheckout[],
	) => {
		//let configShelfs = transformToConfigShelfs(newShelfs, stageHeight)
		const configDoors = doors; // TO DO
		const configDomainpolygon = transformPointlistsToDomainpolygon(
			newPolygonCorners,
			newShelfs,
			newCheckouts,
			stageHeight,
		);

		const config: IeFlowFile = {
			name: newName,
			Door: configDoors,
			Shelfs: shelfs,
			Domainpolygon: configDomainpolygon,
			//Grid: newGrid,
			PolygonCorners: newPolygonCorners,
			//HoleCorners: newHoleCorners,
			BackgroundImagePosition: backgroundImagePosition,
			Checkouts: newCheckouts,
		};
		return config;
	};

	const configFile: IeFlowFile = computeConfig(
		name,
		polygonCorners,
		//holePolygons,
		//grid,
		doors,
		shelfs,
		backgroundImagePosition,
		checkouts,
	);

	//const refetchPossible = areConfigsDifferent(configFile, activeConfig)

	const handleFileUpload = (file: File) => {
		setUploadedFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			const fileContent = reader.result as string;

			if (file.name.endsWith(".json")) {
				const layoutData = JSON.parse(fileContent);

				setPolygonCorners(layoutData.PolygonCorners);
				setHolePolygons(layoutData.HoleCorners);
				setDoors(layoutData.Door);
				setShelfs(layoutData.Shelfs);
				setBackgroundImagePosition(layoutData.BackgroundImagePosition);
				setCheckouts(layoutData.Checkouts);
			}
		};
		reader.readAsText(file);
	};

	const handleSupermarketUpload = async () => {
		try {
			const response = await fetch("/api/getSupermarket");
			if (!response.ok) {
				throw new Error("Failed to fetch config data");
			}
			const layoutData: IeFlowFile = await response.json();
			setPolygonCorners(layoutData.PolygonCorners);
			//setHolePolygons(layoutData.HoleCorners);
			setDoors(layoutData.Door);
			setShelfs(layoutData.Shelfs);
			setBackgroundImagePosition(layoutData.BackgroundImagePosition);
			setCheckouts(layoutData.Checkouts);
		} catch (error) {
			console.error("Error fetching config:", error);
		}
	};

	const handleFileClear = () => {
		setUploadedFile(null);
		setBackgroundImage(null);
		setBackgroundImagePosition({
			...backgroundImagePosition,
			name: "reset",
		});
		setPolygonCorners({ corners: [], closed: false });
		setHolePolygons([]);
		setDoors([]);
		setShelfs([]);
		setCheckouts([]);
	};

	const handleReset = () => {
		setPolygonCorners({ corners: [], closed: false });
		setHolePolygons([]);
		setShelfs([]);
		setCheckouts([]);
		setDoors([]);
		setTab("Plan");
		setEditorMode(EditorModes.walls);
		setUploadedFile(null);
		setBackgroundImage(null);
		setBackgroundImagePosition({
			...backgroundImagePosition,
			name: "reset",
		});
	};


	let [buttons, selected] = RadioGroup([
		["W&auml;nde", () => 1],
		["Eingang", () => 2],
		["Regale", () => 3],
		["Kassen", () => 4],
	]);

	return (
		<div className="flex grow self-stretch">
			<div
				id={"plantab"}
				className="flex h-full basis-1/6 flex-col justify-between border-r border-r-[--header-footer-separator-color] bg-[--header-color] text-inputBorderColor"
			>
				<p className="mx-6 border-t-2 border-t-buttonBorderColor font-semibold text-buttonBorderColor"></p>
				<h2 className="m-2 text-center text-lg text-buttonBorderColor">
					<input
						className="mx-4 mb-1 rounded bg-[--header-color] text-center text-lg"
						name="simulationname"
						type="text"
						value={name}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setName(e.target.value)
						}
					/>
				</h2>
				<div className="space-y-2 border-y-2 border-black">
					<div className="mx-6 flex flex-col space-y-3 py-4">
						<FileUploadButton
							ref={fileUploadButtonRef}
							onFileUpload={handleFileUpload}
							onFileClear={handleFileClear}
							uploadedFile={uploadedFile}
							editorMode={editorMode}
							onClick={() => setEditorMode(EditorModes.image)}
						/>
						<TypicalSupermarketButton
							ref={typicalSupermarketButtonRef}
							onFileUpload={handleSupermarketUpload}
							onFileClear={handleReset}
							editorMode={editorMode}
							onClick={() => setEditorMode(EditorModes.image)}
						/>
					</div>
				</div>
				<div>
					<h2 className="my-6 ms-4 text-lg font-medium">
						Architektur
					</h2>
					<PlanTab
						editorMode={editorMode}
						onModeChange={setEditorMode}
						configFile={configFile}
					/>
				</div>
				<div className="bottom-0 z-50 mt-auto flex items-center justify-center border-t-2 border-black p-4">
					<SaveButton
						className="w-3/4 py-1 text-center"
						jsonConfig={configFile}
					/>
				</div>
			</div>
			<div
				className={`h-full w-auto flex-grow items-center justify-between`}
			>
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
					handleCornerChange={(newPolygons) => {
						setPolygonCorners(newPolygons[0]);
					}}
					handleHoleCornerChange={(newPolygons) => {
						setHolePolygons(newPolygons);
					}}
					handleReferenceLineChange={(newReferenceLine) => {
						setReferenceLine(newReferenceLine);
					}}
					doors={doors}
					handleDoorChange={(newDoors) => setDoors(newDoors)}
					shelfs={shelfs}
					checkouts={checkouts}
					handleShelfsChange={(newShelf) => setShelfs(newShelf)}
					handleCheckoutsChange={(newCheckout) =>
						setCheckouts(newCheckout)
					}
					handleImageMoved={(newBackgroundImagePosition) => {
						setBackgroundImagePosition(newBackgroundImagePosition);
					}}
				/>
			</div>
		</div>
	);
}
