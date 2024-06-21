import { useEffect, useState } from "react";

import ContextMenu from "components/planEditor/polygonCanvas/ContextMenu"
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { ICheckout } from "interfaces/edit/ICheckout";
import { IPolygon } from "interfaces/edit/IPolygon";
import { EditorModes } from "lib/edit/EditorModes";
import { IDoor } from "interfaces/edit/IDoor";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { Vector } from "lib/geometry/vector";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
import { Point } from "lib/geometry/point";
import PolygonCanvas from "../planEditor/polygonCanvas/PolygonCanvas";

export interface IPlanEditorProps {
    backgroundImage: null | HTMLImageElement,
    mode: EditorModes,
    polygonCorners: IPolygon,
    holePolygons: IPolygon[],
    referenceLine: IReferenceLine,
    fit: boolean,
    grid: boolean,
    doors: IDoor[],
    walls: Vector[],
    backgroundImagePosition: IBackgroundImagePosition,
    holeWallsList: Vector[][],
    subdomains: ISubdomain[],
    checkouts: ICheckout[],
}

function PlanEditor({
                        backgroundImage,
                        mode,
                        polygonCorners,
                        holePolygons,
                        doors,
                        walls,
                        fit,
                        grid,
                        holeWallsList,
                        subdomains,
                        checkouts,
                        referenceLine,
                        backgroundImagePosition,
                    }: IPlanEditorProps) {
    const [activeDoorPoint, setActiveDoorPoint] = useState<{ point: Point, vector: Vector } | null>(null);
    const [globalSelectedItems, setGlobalSelectedItems] = useState<string[]>([]);
    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        subdomain: ISubdomain | null;
    }>({
        visible: false,
        x: 0,
        y: 0,
        subdomain: null,
    });

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            if (e.button === 2) {
                // Do something when the right mouse button is clicked
                //handleRightClick(mode);
            }
        };

        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [mode]); // the mode as dependency is important, otherwise the event listeners are not updated when the mode changes

    const handleClickSubdomain = (e: any, subdomain: ISubdomain) => {
        if (mode !== EditorModes.subdomains) {
            console.warn("The EditorMode does not support clicking subdomains");
            return
        }

        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        const stageBox = stage.container().getBoundingClientRect();

        setContextMenu({
            visible: true,
            x: mousePos.x + stageBox.left,
            y: mousePos.y + stageBox.top,
            subdomain: subdomain
        });
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleMenuItemClick = (itemText: string, selectedSubdomain: ISubdomain | null) => {
        if (selectedSubdomain) {
            selectedSubdomain.selectedItems = [];
            setGlobalSelectedItems([]);

            if (itemText !== selectedSubdomain.text) {
                selectedSubdomain.text = itemText;
                selectedSubdomain.selectedItems.push(itemText);
                setGlobalSelectedItems(prevItems => [...prevItems, itemText]);
            }
        }
    };

    return (
        <>
            <PolygonCanvas
                activeDoorPoint={activeDoorPoint}
                referenceLine={referenceLine}
                backgroundImage={backgroundImage}
                mode={mode}
                fit={fit}
                grid={grid}
                polygonCorners={polygonCorners}
                holePolygons={holePolygons}
                doors={doors}
                walls={walls}
                holeWalls={holeWallsList}
                subdomains={subdomains}
                checkouts={checkouts}
                backgroundImagePosition={backgroundImagePosition}
                onSubdomainClick={handleClickSubdomain}
                // TO DO:also implement on checkoutclick or differenciate between modes and implement checkout click logic in handleClickSubdomain
            />
            <ContextMenu
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                subdomain={contextMenu.subdomain}
                onClose={handleCloseContextMenu}
                onMenuItemClick={(itemText) => handleMenuItemClick(itemText, contextMenu.subdomain)}
                globalSelectedItems={globalSelectedItems}
            />
        </>
    );
}

export default PlanEditor;
