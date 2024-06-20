import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
//import { IRect } from "interfaces/canvas/IRect";
import { IRect } from "konva/lib/types";

import ContextMenu from "components/planEditor/polygonCanvas/ContextMenu"
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { ICheckout } from "interfaces/edit/ICheckout";
import { IPolygon } from "interfaces/edit/IPolygon";
import { EditorModes } from "lib/edit/EditorModes";
import { IDoor, IExit } from "interfaces/edit/IDoor";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { Vector } from "lib/geometry/vector";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
import { Point } from "lib/geometry/point";
import PolygonCanvas from "./polygonCanvas/PolygonCanvas";
import {checkPresentCoordinates, findAndRemoveOpenPolygon, findAndSplicePolygonByPointId } from "utils/planEditor/utils";
import { projectPointToLineSegment } from "utils/geometry/utils";

export interface IPlanEditorProps {
    backgroundImage: null | HTMLImageElement,
    mode: EditorModes,
    polygonCorners: IPolygon,
    holePolygons: IPolygon[],
    fit: boolean,
    grid: boolean,
    zoom: boolean,
    referenceLine: IReferenceLine,
    doors: IDoor[],
    walls: Vector[],
    backgroundImagePosition: IBackgroundImagePosition,
    holeWallsList: Vector[][],
    subdomains: ISubdomain[],
    checkouts: ICheckout[],
    onModeChange: (newMode: EditorModes) => (void),
    handleCornerChange: (newObjects: IPolygon[]) => (void),
    handleHoleCornerChange: (newObjects: IPolygon[]) => (void),
    handleReferenceLineChange: (newReferenceLine: IReferenceLine) => (void),
    handleSubdomainsChange: (newObjects: ISubdomain[]) => void,
    handleCheckoutsChange: (newObjects: ICheckout[]) => void,
    handleDoorChange: (doors: IDoor[]) => (void)
    handleImageMoved: (imagePosition: IBackgroundImagePosition) => void
}

function PlanEditor({
                        backgroundImage,
                        mode,
                        onModeChange,
                        polygonCorners,
                        holePolygons,
                        doors,
                        walls,
                        fit,
                        grid,
                        zoom,
                        holeWallsList,
                        subdomains,
                        checkouts,
                        referenceLine,
                        backgroundImagePosition,
                        handleReferenceLineChange,
                        handleCornerChange,
                        handleHoleCornerChange,
                        handleDoorChange,
                        handleSubdomainsChange,
                        handleCheckoutsChange,
                        handleImageMoved
                    }: IPlanEditorProps) {
    const [activeDoorPoint, setActiveDoorPoint] = useState<{ point: Point, vector: Vector } | null>(null);
    const [globalSelectedItems, setGlobalSelectedItems] = useState<string[]>([]);
    const [clickedLine, setClickedLine] = useState<string | null>(null);
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
        if (mode !== EditorModes.doors) {
            setActiveDoorPoint(null)
            setClickedLine(null)
        }

        // Add event listeners
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                // Do something when the ESC key is pressed
                handleEscPressed()
            }
        };
        const handleContextMenu = (e: MouseEvent) => {
            if (e.button === 2) {
                // Do something when the right mouse button is clicked
                handleRightClick(mode);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("contextmenu", handleContextMenu);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("contextmenu", handleContextMenu);
        };
    }, [mode]); // the mode as dependency is important, otherwise the event listeners are not updated when the mode changes

    const handleEscPressed = () => {
        onModeChange(EditorModes.view)
        setActiveDoorPoint(null)
        setClickedLine(null)
    }

    const handleRightClick = (currentMode: EditorModes) => {
        if (currentMode === EditorModes.doors) {
            setActiveDoorPoint(null)
            setClickedLine(null)
        }
        // if (currentMode === EditorModes.measurementLines) {
        //     setActiveMeasurementPoint(null)
        //}
       // if (currentMode === EditorModes.attractors) {
        //    setActiveAttractorPoint(null)
        //}
    }
    

    const handleCreateDoor = (e: any, id: string) => {
        const stage = e.target.getStage();
        const segmentPoints = e.target.attrs.points
        const segmentStart = new Point(segmentPoints[0], segmentPoints[1])
        const segmentEnd = new Point(segmentPoints[2], segmentPoints[3])
        const segmentVector = new Vector(segmentStart, segmentEnd)
        const mousePos = stage.getRelativePointerPosition();
        const clickedPoint = new Point(mousePos.x, mousePos.y)
        const projectedPoint = projectPointToLineSegment(clickedPoint, segmentVector)

        if (clickedLine === id) {
            if (!activeDoorPoint) {
                setActiveDoorPoint(null)
                setClickedLine(null)
                return
            }
            // Add the second point to a vector
            const doorVector = new Vector(activeDoorPoint.point, projectedPoint)

            const numberOfDoors = doors.length + 1
            // all doors are initially exits
            const newExit: IExit = {
                type: "exit",
                wallId: id,
                name: "door",
                vector: doorVector,
                weight: 1,
                hover: false
            }
            handleDoorChange([...doors, newExit])
            setActiveDoorPoint(null)
            setClickedLine(null)
        } else {
            setClickedLine(id)
            setActiveDoorPoint({ point: projectedPoint, vector: segmentVector })
        }
    }

    const handleDeleteDoors = (doorsToDelete: IDoor[]) => {
        const ids = doorsToDelete.map((door) => {
            return door.vector.id
        })
        const newDoors = doors.filter((door) => {
            if (ids.includes(door.vector.id)) {
                return false
            }
            return true
        });
        handleDoorChange([...newDoors]);
    }

    const handleChangeDoor = (newDoor: IDoor) => {
        const newDoors = doors.map((door) => {
            if (door.vector.id === newDoor.vector.id) {
                return newDoor
            }
            return door
        })
        handleDoorChange([...newDoors]);
    }

    // Add Corner
    const handleAddCorner = (newCorner: Point, polygonData: IPolygon[], handleCornerUpdate: (updatedCorners: IPolygon[]) => void) => {
        console.debug("In handle add Corner")
        const initialPolygons = polygonData
        let [openPolygons, remainingPolygons] = findAndRemoveOpenPolygon(initialPolygons)

        let activePolygon: IPolygon

        if (openPolygons.length === 0) {
            activePolygon = { corners: [], closed: false }
        } else if (openPolygons.length === 1) {
            activePolygon = openPolygons[0]
        } else {
            // simply edit the latest polygon that has been added
            activePolygon = initialPolygons[initialPolygons.length - 1]
            remainingPolygons = initialPolygons.filter((initPolygon) => {
                return initPolygon !== activePolygon
            })
        }

        // do not allow identical Points
        const filteredPoints = activePolygon.corners.filter((point) => {
            if (point.x === newCorner.x && point.y === newCorner.y) {
                return false;
            }
            return true;
        });

        let newPolygon: IPolygon
        // make last point snap on first if the distance is short
        if (filteredPoints.length >= 3) {
            const firstPoint = filteredPoints[0];
            console.debug("The distance to the first point is", firstPoint.distance(newCorner))

            if (firstPoint.distance(newCorner) < 35) {
                newPolygon = { corners: filteredPoints, closed: true }
                handleCornerUpdate([...remainingPolygons, newPolygon]);
                return
            }
        }

        newPolygon = { corners: [...filteredPoints, newCorner], closed: false };
        handleCornerUpdate([...remainingPolygons, newPolygon]);
    };

    // add on wall
    const handleAddCornerOnWall = (e: any, vectorId: string, polygonData: IPolygon[], segments: Vector[][], handleCornerUpdate: (updatedCorners: IPolygon[]) => void) => {
        console.debug("in handle add corner on wall")
        const initialPolygons = polygonData

        const clickedVector = segments.flat().find((obj) => obj.id === vectorId);
        if (!clickedVector) {
            console.warn("No Wall found to add a Point to");
            return;
        }
        const endPoint = clickedVector.b


        // get the Polygon that was clicked
        // by searching in which polygon the clicked wall is in
        // remove the polygon from the state, so it can be updated and inserted later
        const [polygon, remainingPolygons] = findAndSplicePolygonByPointId(initialPolygons, endPoint.id);
        if (polygon === undefined) {
            // calculate the clicked polygon
            console.warn("No Polygon found to add a Point to")
            return
        }

        // new point
        const stage = e.target.getStage();
        if (!stage) { console.debug("no stage found"); return };

        const pointerPosition = stage.getRelativePointerPosition();
        if (!pointerPosition) { console.debug("no pointer Position found"); return };

        const { x, y } = pointerPosition;
        const newPoint = new Point(Math.round(x), Math.round(y))

        // do not allow duplicate points
        if (checkPresentCoordinates(polygon.corners, newPoint)) {
            console.warn("Point duplicate detected. Insertion not allowed")
            return
        }

        const insertIndex = polygon.corners.indexOf(endPoint)
        const newCorners = [...polygon.corners]
        newCorners.splice(insertIndex, 0, newPoint)
        handleCornerUpdate([...remainingPolygons, { corners: newCorners, closed: polygon.closed }]);

        const affectedDoors = doors.filter((door) => {
            if (door.wallId === vectorId) { return true }
            return false
        })
        handleDeleteDoors(affectedDoors)

    }

    const handleMoveCorner = (newCorner: Point, polygonData: IPolygon[], handleCornerUpdate: (updatedCorners: IPolygon[]) => void) => {
        console.debug("In handle move Corner")

        const initialPolygons = polygonData
        const [polygon, remainingPolygons, polygonIndex] = findAndSplicePolygonByPointId(initialPolygons, newCorner.id);
        if (polygon === undefined) {
            // calculate the clicked polygon
            console.warn("Corner to Move does not belong to a Polygon")
            return
        }

        const index = polygon.corners.findIndex(object => {
            return object.id === newCorner.id;
        });
        polygon.corners[index] = newCorner

        let newPolygons = [...remainingPolygons]
        newPolygons.splice(polygonIndex, 0, polygon)
        handleCornerUpdate(newPolygons)
    }

    const handleDeleteCorner = (id: Point["id"], polygonData: IPolygon[], handleCornerUpdate: (updatedCorners: IPolygon[]) => void, mode: string) => {
        console.debug("In handle delete Corner")

        const initialPolygons = polygonData
        const [polygon, remainingPolygons] = findAndSplicePolygonByPointId(initialPolygons, id);
        if (polygon === undefined) {
            // calculate the clicked polygon
            console.warn("Point to Delete does not belong to a Polygon")
            return
        }

        const newPoints = polygon.corners.filter((point) => point.id !== id);
        polygon.corners = newPoints
        if (newPoints.length <= 2) { polygon.closed = false }
        if (newPoints.length === 0) {
            if (mode === "objects") {
                handleCornerUpdate([...remainingPolygons]);
                return
            }
        }

        handleCornerUpdate([...remainingPolygons, polygon]);
    };

    const handleAddCheckout = (newObject: IRect) => {
        const newCheckout: ICheckout = { name: "checkout1", id: nanoid(), polygon: newObject, hover: false, text: "Kasse"}
        const newObjects = [...checkouts, newCheckout]
        handleCheckoutsChange(newObjects)
    }

    const handleDeleteCheckout = (checkoutDelete: ICheckout) => {
        if (mode !== EditorModes.checkouts) {
            console.warn("The EditorMode does not support deleting checkouts");
            return
        }

        const newCheckouts = checkouts.filter((subdom) => checkoutDelete !== subdom);
        handleCheckoutsChange(newCheckouts);
    };

    const handleMoveCheckout = (movedCheckout: ICheckout) => {
        if (mode != EditorModes.walls) { return }
        const newCheckouts = checkouts.map((checkout) => {
            if (movedCheckout.id === checkout.id) {
                return movedCheckout
            }
            return checkout
        });

        handleCheckoutsChange(newCheckouts);
    };

    const handleAddSubdomain = (newObject: IRect) => {
        const newSubdomain: ISubdomain = { name: "subdom1", id: nanoid(), polygon: newObject, hover: false, text: "", selectedItems: [] }
        const newObjects = [...subdomains, newSubdomain]
        handleSubdomainsChange(newObjects)
    }

    const handleDeleteSubdomain = (subdomainDelete: ISubdomain) => {
        if (mode !== EditorModes.subdomains) {
            console.warn("The EditorMode does not support deleting subdomains");
            return
        }
        const newGlobalSelectedItems = globalSelectedItems.filter(item => !subdomainDelete.selectedItems.includes(item));
        setGlobalSelectedItems(newGlobalSelectedItems);

        const newSubdomains = subdomains.filter((subdom) => subdomainDelete !== subdom);
        handleSubdomainsChange(newSubdomains);
    };

    const handleMoveSubdomain = (movedSubdomain: ISubdomain) => {
         if (mode != EditorModes.walls) { return }
        const newSubdomains = subdomains.map((subdom) => {
            if (movedSubdomain.id === subdom.id) {
                subdom.textPosition = { x: movedSubdomain.polygon.x, y: movedSubdomain.polygon.y };
                return movedSubdomain
            }
            return subdom
        });

        handleSubdomainsChange(newSubdomains);
    };

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

   /* const handleMoveStartarea = (movedStartarea: IStartArea) => {
        // if (mode != EditorModes.walls) { return }
        const newStartArea = startAreas.map((startarea) => {
            if (movedStartarea.id === startarea.id) {
                return movedStartarea
            }
            return startarea
        });

        handleStartAreasChange(newStartArea);
    };

    const handleDeleteStartArea = (startAreaDelete: IStartArea) => {
        if (mode !== EditorModes.startAreas) {
            console.warn("The EditorMode does not support deleting startareas");
            return
        }
        const newStartareas = startAreas.filter((startArea) => startAreaDelete !== startArea);
        handleStartAreasChange(newStartareas);
    };

    const handleAddStartArea = (newObject: IRect) => {
        const newStartArea = { name: "startarea1", id: nanoid(), rectangle: newObject, hover: false }
        const newObjects = [...startAreas, newStartArea]
        handleStartAreasChange(newObjects)
    }*/

    const clearAffectedWalls = (point: Point, segments: Vector[][]) => {
        let allAffectedDoors: IDoor[] = []
        const affectedWalls = segments.flat().filter((wall) => {
            if (point.id === wall.a.id || point.id === wall.b.id) {
                return true
            }
            return false
        })

        affectedWalls.forEach(wall => {
            const affectedDoors = doors.filter((door) => {
                if (door.wallId === wall.id) { return true }
                return false
            })

            allAffectedDoors = [...allAffectedDoors, ...affectedDoors]
        })
        handleDeleteDoors(allAffectedDoors)
    }


   /* const handleCreateMeasurementLine = (clickedPosition: { x: number, y: number }) => {
        if (mode !== EditorModes.measurementLines) {
            console.warn("The EditorMode does not support deleting measurementlines");
            return
        }
        const clickedPoint = new Point(clickedPosition.x, clickedPosition.y)

        if (activeMeasurementPoint) {
            // Add the second point to a vector
            const lineVector = new Vector(activeMeasurementPoint, clickedPoint)
            handleMeasurementLinesChange([...measurementLines, lineVector])
            setActiveMeasurementPoint(null)
        } else {
            setActiveMeasurementPoint(clickedPoint)
        }
    }*/

    /*const handleCreateAttractor = (clickedPosition: { x: number, y: number }) => {

        const clickedPoint = new Point(clickedPosition.x, clickedPosition.y)

        if (activeAttractorPoint) {
            // Add the second point to a vector
            const lineVector = new Vector(activeAttractorPoint, clickedPoint)
            const newAttractor = {
                name: "attractor",
                wallId: "attractor",
                vector: lineVector,
                strength: 0.1,
                range: 0.1,
                frequency: 0.1,
                hover: false
            }
            //handleAttractorsChange([...attractors, newAttractor])
            setActiveAttractorPoint(null)
        } else {
            setActiveAttractorPoint(clickedPoint)
        }
    }*/

    /*const handleMoveMeasurementLine = (newLine: Vector) => {
        if (mode !== EditorModes.measurementLines) {
            console.warn("The EditorMode does not support moving measurementlines");
            return
        }
        const newMeasurementLines = measurementLines.map((line) => {
            if (line.id === newLine.id) {
                return newLine
            }
            return line
        })
        handleMeasurementLinesChange([...newMeasurementLines]);
    }*/

    /*const handleMoveAttractor = (newAttractor: IAttractor) => {
        const newAtrractors = attractors.map((attractor) => {
            if (attractor.vector.id === newAttractor.vector.id) {
                return newAttractor
            }
            return attractor
        })
        handleAttractorsChange([...newAtrractors]);
    }*/

    // Handler for clicking on a line
    const handleWallClickWrapper = (e: any, vectorId: string) => {
        switch (mode) {
            case EditorModes.walls:
                handleAddCornerOnWall(e, vectorId, [polygonCorners], [walls], handleCornerChange)
                break;
            case EditorModes.doors:
                handleCreateDoor(e, vectorId)
                break;
            case EditorModes.objects:
                handleAddCornerOnWall(e, vectorId, holePolygons, holeWallsList, handleHoleCornerChange)
                break;
            default:
                break;
        }
    }

    const handleAddPointWrapper = (newPoint: Point) => {
        switch (mode) {
            case EditorModes.walls:
                handleAddCorner(newPoint, [polygonCorners], handleCornerChange)
                break;
            case EditorModes.objects:
                handleAddCorner(newPoint, holePolygons, handleHoleCornerChange)
                break;
            default:
                break;
        }
    }

    const handleDeleteCornerWrapper = (point: Point) => {
        switch (mode) {
            case EditorModes.walls:
                clearAffectedWalls(point, [walls])
                handleDeleteCorner(point.id, [polygonCorners], handleCornerChange, "walls")
                break;
            case EditorModes.objects:
                handleDeleteCorner(point.id, holePolygons, handleHoleCornerChange, "objects")
                break;
            default:
                break;
        }
    }

    const handleMoveCornerWrapper = (movedCorner: Point) => {
        switch (mode) {
            case EditorModes.walls:
                clearAffectedWalls(movedCorner, [walls])
                handleMoveCorner(movedCorner, [polygonCorners], handleCornerChange)
                break;
            case EditorModes.objects:
                clearAffectedWalls(movedCorner, holeWallsList)
                handleMoveCorner(movedCorner, holePolygons, handleHoleCornerChange)
                break;
            default:
                break;
        }
    }

    // Handler for clicking on a line
    const handleAddObjectWrapper = (newObject: IRect) => {
        switch (mode) {
            case EditorModes.subdomains:
                handleAddSubdomain(newObject)
                break;
            case EditorModes.checkouts:
                handleAddCheckout(newObject)
                break;
            default:
                break;
        }
    }

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
                backgroundImage={backgroundImage}
                mode={mode}
                fit={fit}
                zoom={zoom}
                grid={grid}
                polygonCorners={polygonCorners}
                holePolygons={holePolygons}
                doors={doors}
                activeDoorPoint={activeDoorPoint}
                walls={walls}
                holeWalls={holeWallsList}
                subdomains={subdomains}
                checkouts={checkouts}
                referenceLine={referenceLine}
                backgroundImagePosition={backgroundImagePosition}
                onReferenceLineChange={handleReferenceLineChange}
                onWallClick={handleWallClickWrapper}
                onAddObject={handleAddObjectWrapper}
                onDeleteDoors={handleDeleteDoors}
                onChangeDoor={handleChangeDoor}
                onDeleteCorner={handleDeleteCornerWrapper}
                onDeleteSubdomain={handleDeleteSubdomain}
                onDeleteCheckout={handleDeleteCheckout}
                onSubdomainMove={handleMoveSubdomain}
                onCheckoutMove={handleMoveCheckout}
                onSubdomainClick={handleClickSubdomain}
                onAddPoint={handleAddPointWrapper}
                onCornerMove={handleMoveCornerWrapper}
                onImageUpdate={handleImageMoved}
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
