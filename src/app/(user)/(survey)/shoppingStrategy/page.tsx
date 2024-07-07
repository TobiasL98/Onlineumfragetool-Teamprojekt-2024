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
import {
	connectPoints,
	transformCheckoutToExit,
	transformDoorToEntrance,
} from "utils/edit/utils";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import { useForm } from "../FormContext";
import checkForm from "utils/checkForm";
import { redirect } from "next/navigation";
import { ISupermarketFile } from "interfaces/edit/ISupermarketFile";
import { IConfigEntrance } from "interfaces/edit/IConfigEntrance";
import { IConfigExit } from "interfaces/edit/IConfigExit";

const stageHeight = 1000;

export default function ShoppingStrategyPage() {
	const { formState } = useForm();
	if (checkForm(formState).length != 0) {
		redirect("/survey");
	}

	const [configFile, setConfigFile] = useState<IeFlowFile | null>(null);

	const [selectedTime, setSelectedTime] = useState("");
	const [editorMode, setEditorMode] = useState<EditorModes>(
		EditorModes.image,
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
	const [shelfs, setShelfs] = useState<IShelf[]>([]);
	const [checkouts, setCheckouts] = useState<ICheckout[]>([]);
	const [doors, setDoors] = useState<IDoor[]>([]);
	const [referenceLine, setReferenceLine] = useState<IReferenceLine>({
		a: new Point(100, 100),
		b: new Point(200, 100),
		width: 10,
	}); // [start, end
	const [polygonCorners, setPolygonCorners] = useState<IPolygon>({
		corners: [],
		closed: false,
	});
	const walls = connectPoints(polygonCorners);
	const [holePolygons, setHolePolygons] = useState<IPolygon[]>([]);
	const innerWallsList = holePolygons.map((corners) =>
		connectPoints(corners),
	);
	const [supermarketFile, setSupermarketFile] = useState<ISupermarketFile>();

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const response = await fetch("/api/getConfig");
				if (!response.ok) {
					throw new Error("Failed to fetch config data");
				}
				const data: IeFlowFile = await response.json();
				setConfigFile(data);
			} catch (error) {
				console.error("Error fetching config:", error);
			}
		};
		fetchConfig();
	}, []);

	useEffect(() => {
		if (configFile && configFile.name !== undefined) {
			setPolygonCorners(configFile.PolygonCorners);
			setDoors(configFile.Door);
			setShelfs(configFile.Shelfs);
			setBackgroundImagePosition(configFile.BackgroundImagePosition);
			setCheckouts(configFile.Checkouts);
			setSupermarketFile(
				computeSupermarket(
					configFile!.name,
					doors,
					checkouts,
					shelfs,
					configFile!.Domainpolygon,
					//polygonCorners,
					backgroundImagePosition,
				),
			);
		}
	}, [configFile]);

	const computeSupermarket = (
		name: string,
		newEntrance: IDoor[],
		newExit: ICheckout[],
		shelf: IShelf[],
		//polygonCorners: IPolygon,
		domainPolygon: any,
		backgroundImagePosition: IBackgroundImagePosition,
	) => {
		const configEntrance: IConfigEntrance[] = transformDoorToEntrance(
			newEntrance,
			stageHeight,
		);

		const configExit: IConfigExit[] = transformCheckoutToExit(
			newExit,
			stageHeight,
		);

		const supermarket: ISupermarketFile = {
			name: name + "_supermarket",
			Entrance: configEntrance,
			Exit: configExit,
			Shelf: shelf,
			Domainpolygon: domainPolygon,
			//PolygonCorners: polygonCorners,
			BackgroundImagePosition: backgroundImagePosition,
		};
		return supermarket;
	};

	// TO DO: diese funktion dann umbauen, dass auch die userdaten irgendwie mit gespeichert werden
	// aber da red ich noch mal mit Frau Axthelm drüber wie genau sie das dann haben will
	// momentan speichert diese funktion das json local als download ab
	const saveSupermarketData = async (supermarketFile: ISupermarketFile) => {
		if (supermarketFile !== null) {
			const formattedJsonStr = JSON.stringify(supermarketFile, null, 2);
			const blob = new Blob([formattedJsonStr], {
				type: "application/json",
			});

			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = supermarketFile.name + ".json";
			link.click();

			setTimeout(() => {
				URL.revokeObjectURL(link.href);
			}, 500);
		}
	};

	return (
		<div className="flex flex-col">
			<Headline className="w-full flex-grow">
				<h1 className="text-4xl font-medium">Einkaufsstrategie</h1>
			</Headline>
			<div className="mb-3 text-center italic">
				Stellen Sie sich im Geiste vor Sie machen gerade Ihren
				Einkauf...
			</div>
			<div className="h-65 flex">
				<div className="w-25-percent m-5 ml-7 flex flex-col justify-between">
					<div className="flex flex-col rounded-3xl bg-borderBackgroundColor p-4">
						<div className="font-small mb-2 mt-2">
							Mit einem Klick können Sie Schritt für Schritt Ihre
							Einkaufsreihenfolge auswählen und wie lange Sie
							jeweils an den Bereichen verweilen.
						</div>
						<div className="font-small mb-2 mt-2">
							Per Rechtsklick auf das jeweilige Regal, können Sie
							Ihre Auswahl wiederrufen.
						</div>
						<div className="font-small mb-2 mt-2">
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
					<Link
						className="link-button flex w-full "
						href="/thankYou"
						onClick={(event) => {
							event.preventDefault();
							saveSupermarketData(supermarketFile!).then(() => {
								window.location.href = "/thankYou";
							});
						}}
					>
						Fertig
					</Link>
				</div>
			</div>
		</div>
	);
}
