import { useEffect, useState } from "react";

import ContextMenu from "components/planEditor/polygonCanvas/ContextMenu"
import { IShelf } from "interfaces/edit/IShelf";
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
    shelfs: IShelf[],
    checkouts: ICheckout[],
}

function LayoutSurvey({
                        backgroundImage,
                        mode,
                        polygonCorners,
                        holePolygons,
                        doors,
                        walls,
                        fit,
                        grid,
                        holeWallsList,
                        shelfs,
                        checkouts,
                        referenceLine,
                        backgroundImagePosition,
                    }: IPlanEditorProps) {
    const [activeDoorPoint, setActiveDoorPoint] = useState<{ point: Point, vector: Vector } | null>(null);
    const [globalSelectedShoppingTimes, setGlobalSelectedShoppingTimes] = useState<string[]>([]);
    const [shoppingOrderIndex, setShoppingOrderIndex] = useState<number>(0);

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        x: number;
        y: number;
        shelf: IShelf | null;
    }>({
        visible: false,
        x: 0,
        y: 0,
        shelf: null,
    });

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            /*if (e.button === 2 && selectedShelf) {
                setShoppinOrderIndex(shoppinOrderIndex - 1)
                selectedShelf.shoppingOrder = shoppinOrderIndex.toString();
                selectedShelf.shoppingTime = undefined;
                //selectedShelf.selectedShoppingTimes.push(undefined);
            }*/
        };

        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [mode]); // the mode as dependency is important, otherwise the event listeners are not updated when the mode changes

    const handleClickShelf = (e: any, shelf: IShelf) => {
        if (shelf.text === '') {
            return
        }
        if (checkouts.some(checkout => checkout.shoppingOrder !== undefined)) {
            return;
        }

        handleCloseContextMenu()
        console.log("huh???")
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        const stageBox = stage.container().getBoundingClientRect();

        setContextMenu({
            visible: true,
            x: mousePos.x + stageBox.left,
            y: mousePos.y + stageBox.top,
            shelf: shelf
        });
    };

    const handleClickCheckout = (e: any, checkout: ICheckout) => {
        if (checkouts.some(checkout => checkout.shoppingOrder !== undefined)) {
            return;
        }
        if (mode === EditorModes.image && checkout) {
            if (checkout.shoppingOrder === undefined   ) {
                checkouts.forEach(checkout => {
                    const order = parseInt(checkout.shoppingOrder!);
                    if (order !== undefined) {
                        return
                    }
                });
                setShoppingOrderIndex(prevIndex => {
                    const newIndex = prevIndex + 1;
                    console.log(newIndex); // Now it should print the updated value
                    checkout.shoppingOrder = newIndex.toString();
                    return newIndex;
                });
                checkout.shoppingOrder = undefined
            }
        }
    };

    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleMenuItemClick = (itemText: string, selectedShelf: IShelf | null) => {
         if (mode === EditorModes.image && selectedShelf) {
            if (itemText !== selectedShelf.shoppingTime) {
                if (selectedShelf.shoppingTime === undefined   ) {
                    setShoppingOrderIndex(prevIndex => {
                        const newIndex = prevIndex + 1;
                        console.log(newIndex); // Now it should print the updated value
                        selectedShelf.shoppingOrder = newIndex.toString();
                        return newIndex;
                    });
                    selectedShelf.shoppingOrder = shoppingOrderIndex.toString();
                }
                if (selectedShelf.selectedShoppingTimes) {
                    setGlobalSelectedShoppingTimes(prevItems => prevItems.filter(item => item !== selectedShelf.shoppingTime));
                }
                selectedShelf.shoppingTime = itemText;
                selectedShelf.selectedShoppingTimes.push(itemText);
                setGlobalSelectedShoppingTimes(prevItems => [...prevItems, itemText]);
            }
        }
    };

    const handleShelfRightClick = (selectedShelf: IShelf | null) => {
        if (mode === EditorModes.image && selectedShelf) {
            const selectedOrder = parseInt(selectedShelf.shoppingOrder!);
            shelfs.forEach(shelf => {
                const order = parseInt(shelf.shoppingOrder!);
                if (order > selectedOrder) {
                    shelf.shoppingOrder = (order - 1).toString();
                }
            });
            checkouts.forEach(checkout => {
                const order = parseInt(checkout.shoppingOrder!);
                if (order > selectedOrder) {
                    checkout.shoppingOrder = (order - 1).toString();
                }
            });
            selectedShelf.shoppingOrder = undefined;
            selectedShelf.shoppingTime = undefined;
            setShoppingOrderIndex(prevIndex => prevIndex - 1);
        }
    };

    const handleCheckoutRightClick = (selectedCheckout: ICheckout | null) => {
        if (mode === EditorModes.image && selectedCheckout && selectedCheckout.shoppingOrder !== undefined) {
            setShoppingOrderIndex(prevIndex => {
                const newIndex = prevIndex - 1;
                return newIndex;
            });
            selectedCheckout.shoppingOrder = undefined
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
                shelfs={shelfs}
                checkouts={checkouts}
                backgroundImagePosition={backgroundImagePosition}
                onShelfClick={handleClickShelf}
                onDeleteShelf={handleShelfRightClick}
                onCheckoutClick={handleClickCheckout}
                onDeleteCheckout={handleCheckoutRightClick}
            />
            <ContextMenu
                mode={mode}
                visible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                shelf={contextMenu.shelf}
                onClose={handleCloseContextMenu}
                onMenuItemClick={(itemText) => handleMenuItemClick(itemText, contextMenu.shelf)}
                globalSelectedShoppingTimes={globalSelectedShoppingTimes}
            />
        </>
    );
}

export default LayoutSurvey;
