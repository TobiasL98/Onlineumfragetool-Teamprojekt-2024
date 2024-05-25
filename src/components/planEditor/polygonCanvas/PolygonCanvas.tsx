import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Stage, Circle, Line, Rect, Image, Group, Layer, Transformer, RegularPolygon, Text } from "react-konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowsPointingInIcon } from "@heroicons/react/24/solid";

import { checkObjectForLine, getClickPosition, guidePointOnCross } from "./utils/guideLineUtils";
import { SnapLine, generateCanvasGuideLines } from "./utils/guideLineUtils";
import CanvasPoint from "./CanvasElements/CanvasPoint";
import { fitToFormat } from "./utils/canvasUtils";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { IPolygon } from "interfaces/edit/IPolygon";
import { EditorModes } from "lib/edit/EditorModes";
import { IDoor } from "interfaces/edit/IDoor";
import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { IBackgroundImagePosition } from "interfaces/edit/IBackgroundImagePosition";
//import { IRect } from "interfaces/canvas/IRect";
import { IRect } from "konva/lib/types";
import { projectPointToLineSegment } from "utils/geometry/utils";
import { getBounds } from "utils/edit/utils";
import CanvasAxis from "./canvasElements/CanvasAxis";
import CanvasGridDots from "./canvasElements/CanvasGridDots";
import CanvasReferenceLine from "./canvasElements/CanvasRererenceLine";
import CanvasWall from "./canvasElements/CanvasWall";
import CanvasDoor from "./canvasElements/CanvasDoor";
import CanvasSubdomain from "./canvasElements/CanvasSubdomain";
import Slider from "../Slider";
export interface IStage {
    scale: number,
    x: number,
    y: number
}

export interface ICursorPosition {
    x: number,
    y: number
}

const gridSpacing = 20;
const stageAxisOffset = 40; //pixel

const calculateCanvasRatio = (referenceLine: IReferenceLine) => {
    const lineLength = referenceLine.a.distance(referenceLine.b)
    const canvasRatio = referenceLine.width / lineLength
    return canvasRatio
}

interface CanvasProps {
    zoom?: boolean;
    grid?: boolean;
    fit?: boolean;
    backgroundImage: HTMLImageElement | null;
    polygonCorners: IPolygon;
    holePolygons: IPolygon[];
    mode: EditorModes,
    doors: IDoor[] | [];
    activeDoorPoint: { point: Point, vector: Vector } | null
   // activeMeasurementPoint: Point | null
    //activeAttractorPoint: Point | null
    walls: Vector[];
    holeWalls: Vector[][];
    subdomains: ISubdomain[];
    //startAreas: IStartArea[];
   // measurementLines: Vector[];
    //attractors: IAttractor[];
    referenceLine: IReferenceLine;
    backgroundImagePosition: IBackgroundImagePosition;
    onReferenceLineChange?: (referenceLine: IReferenceLine) => void;
    onDeleteCorner?: (point: Point) => void;
    onAddPoint?: (newPoint: Point) => void;
    // onChangeMeasurementLine?: (measurementLine: Vector) => void;
    // onCreateMeasurementLine?: (clickedPosition: { x: number; y: number; }) => void;
    // onDeleteMeasurementLine?: (measurementLine: Vector) => void;
    //onChangeAttractor?: (attractor: IAttractor) => void;
    //onCreateAttractor?: (clickedPosition: { x: number; y: number; }) => void;
    //onDeleteAttractor?: (attractor: IAttractor) => void;
    onDeleteDoors?: (doors: IDoor[]) => void;
    onChangeDoor?: (doors: IDoor) => void;
    onDeleteSubdomain?: (subdomain: ISubdomain) => void;
    //onDeleteStartArea?: (startArea: IStartArea) => void;
    onCornerMove?: (point: Point) => void;
    onAddObject?: (newObjects: IRect) => void;
    onSubdomainMove?: (subdomain: ISubdomain) => void;
    //onStartareaMove?: (startArea: IStartArea) => void;
    onWallClick?: (evt: KonvaEventObject<MouseEvent>, id: string) => void
    onImageUpdate?: (imagePosition: IBackgroundImagePosition) => void;
}

function PolygonCanvas({
                           backgroundImage,
                           mode,
                           polygonCorners,
                           holePolygons,
                           walls,
                           holeWalls,
                           doors,
                           // measurementLines,
                          // attractors,
                           subdomains,
                           //startAreas,
                           referenceLine,
                           activeDoorPoint,
                          // activeMeasurementPoint,
                           //activeAttractorPoint,
                           zoom = true,
                           grid = true,
                           fit = false,
                           backgroundImagePosition,
                           onReferenceLineChange = () => { return },
                           onDeleteDoors = () => { return },
                           onChangeDoor = () => { return },
                           //  onChangeMeasurementLine = () => { return },
                           //  onCreateMeasurementLine = () => { return },
                           //  onDeleteMeasurementLine = () => { return },
                           //onChangeAttractor = () => { return },
                           //onCreateAttractor = () => { return },
                           //onDeleteAttractor = () => { return },
                           onDeleteCorner = () => { return },
                           onDeleteSubdomain = () => { return },
                           //onDeleteStartArea = () => { return },
                           onSubdomainMove = () => { return },
                           //onStartareaMove = () => { return },
                           onAddPoint = () => { return },
                           onCornerMove = () => { return },
                           onAddObject = () => { return },
                           onWallClick = () => { return },
                           onImageUpdate = () => { return },
                       }: CanvasProps) {
    const [startRectPosition, setStartRectPosition] = useState({ x: 0, y: 0 });
    const [currentRectPosition, setCurrentRectPosition] = useState({ x: 0, y: 0 });

    const parentRef = useRef<HTMLDivElement | null>(null);
    const [parentWidth, setParentWidth] = useState<number>(0);
    const [parentHeight, setParentHeight] = useState<number>(0);
    const [isDragging, setIsDragging] = useState(false);
    const [verticalLines, setVerticalLines] = useState<LineConfig[]>([])
    const [horizontalLines, setHorizontalLines] = useState<LineConfig[]>([])

    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const calculateAngle = (a: Point | null, b: Point | null | { x: number, y: number }) => {
        if (!a || !b) return (0)
        return (Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI))
    }

    //const activeMeasurementAngle = calculateAngle(activeMeasurementPoint, cursorPosition)
    const canvasRatio = calculateCanvasRatio(referenceLine)


    interface DetermineActivePointInputs {
        mode: string;
        activeDoorPoint: { point: Point, vector: Vector } | null;
       // activeMeasurementPoint: Point | null;
        //activeAttractorPoint: Point | null;
        polygonCorners: IPolygon;
        holePolygons: IPolygon[];
    }

    const determineActivePoint = ({
                                      mode,
                                      activeDoorPoint,
                                     // activeMeasurementPoint,
                                      //activeAttractorPoint,
                                      polygonCorners,
                                      holePolygons
                                  }: DetermineActivePointInputs) => {
        if (mode === EditorModes.doors) {
            return activeDoorPoint?.point
        }
       /* if (mode === EditorModes.measurementLines) {
            return activeMeasurementPoint
        }*/
       /* if (mode === EditorModes.attractors) {
            return activeAttractorPoint
        }*/
        if (mode === EditorModes.walls) {
            if (polygonCorners.corners.length > 0 && !polygonCorners.closed) {
                return polygonCorners.corners[polygonCorners.corners.length - 1]
            }
            return null
        }
        if (mode === EditorModes.objects) {
            if (holePolygons.length > 0 && !holePolygons[holePolygons.length - 1].closed) {
                return holePolygons[holePolygons.length - 1].corners[holePolygons[holePolygons.length - 1].corners.length - 1]
            }
            return null
        }

        return null
    }
    const activePoint = determineActivePoint({ mode, activeDoorPoint, polygonCorners, holePolygons })



    const konvaRefs = {
        wallGroup: useRef<Konva.Group>(null),
        subdomainGroup: useRef<Konva.Group | null>(null),
        //startareaGroup: useRef<Konva.Group | null>(null),
        doorGroup: useRef<Konva.Group | null>(null),
        //  measurementLineGroup: useRef<Konva.Group | null>(null),
        //attractorGroup: useRef<Konva.Group | null>(null),
        holeGroup: useRef<Konva.Group>(null),
        image: useRef<Konva.Image | null>(null),
        transformer: useRef<Konva.Transformer>(null),
        referenceLine: useRef<Konva.Group | null>(null),
        floorplan: useRef<Konva.Group | null>(null),
    }
    const stageRef = useRef<Konva.Stage | null>(null);

    const [spacebarPressed, setSpacebarPressed] = useState(false);
    const [stage, setStage] = useState<IStage>({
        scale: 1,
        x: 0,
        y: 0
    });

    const getParentDimensions = () => {
        if (parentRef.current) {
            const { clientWidth, clientHeight } = parentRef.current;
            setParentWidth(clientWidth);
            setParentHeight(clientHeight);
            setStage({
                scale: 0.8,
                x: 0,
                y: 0
            })
        }
    };

    useEffect(() => {
        if (!fit) { return }
        if (!parentRef.current) { return }
        const { clientWidth, clientHeight } = parentRef.current;
        const bounds = getBounds(polygonCorners)
        const newStage = fitToFormat(clientWidth, clientHeight, stageAxisOffset, bounds)
        setStage(newStage)
    }, [fit])

    useEffect(() => {
        getParentDimensions(); // Get initial dimensions
        window.addEventListener('resize', getParentDimensions);
        return () => {
            window.removeEventListener('resize', getParentDimensions);
        };
    }, []);

    useEffect(() => {
        if (!konvaRefs.image.current || !konvaRefs.transformer.current || !backgroundImage) return
        // hide transformer if no image is present
        if (!backgroundImage) {
            konvaRefs.transformer.current.hide()
            return
        } else {
            konvaRefs.transformer.current.show()
        }

        if (backgroundImagePosition.name === backgroundImage.title) {
            const { scaleX, scaleY, rotation, x, y, width, height } = backgroundImagePosition;
            konvaRefs.image.current.setAttrs({ scaleX, scaleY, rotation, x, y, width, height });
        } else {
            // reset image position and scale when new image is loaded or removed
            konvaRefs.image.current.scale({ x: 1, y: 1 });
            konvaRefs.image.current.position({ x: 0, y: 0 });
            const imageAspectRatio = backgroundImage ? backgroundImage.naturalWidth / backgroundImage.naturalHeight : 1;
            let imageWidth = parentWidth;
            let imageHeigth = parentWidth / imageAspectRatio;

            if (imageHeigth > parentHeight) {
                imageHeigth = parentHeight;
                imageWidth = parentHeight * imageAspectRatio;
            }

            konvaRefs.image.current.width(imageWidth);
            konvaRefs.image.current.height(imageHeigth);
            handleImageUpdate()
        }

        // attach transformer
        konvaRefs.transformer.current.nodes([konvaRefs.image.current as Konva.Image]);
        konvaRefs.transformer.current.getLayer()?.batchDraw();
    }, [backgroundImage]);

    const checkKeyPressed = useCallback((e: KeyboardEvent) => {
        if (mode === EditorModes.scenario) return

        if (e.key === "ArrowLeft") {
            e.preventDefault()
            setStage({ ...stage, x: stage.x + 30, })
        }
        if (e.key === "ArrowRight") {
            e.preventDefault()
            setStage({ ...stage, x: stage.x - 30, })
        }
        if (e.key === "ArrowUp") {
            e.preventDefault()
            setStage({ ...stage, y: stage.y + 30, })
        }
        if (e.key === "ArrowDown") {
            e.preventDefault()
            setStage({ ...stage, y: stage.y - 30, })
        }
        if (e.key === ' ') { // Spacebar key
            setSpacebarPressed(true);
        }

    }, [stage]);

    useEffect(() => {
        window.addEventListener('keydown', checkKeyPressed);
        window.addEventListener('keyup', (e) => {
            if (e.key === ' ') { // Spacebar key
                setSpacebarPressed(false);
                console.log("spacebar key up")
            }
        });
        return () => {
            window.removeEventListener("keydown", checkKeyPressed);
            window.removeEventListener('keyup', (e) => {
                if (e.key === ' ') { // Spacebar key
                    setSpacebarPressed(false);
                }
            })
        };
    }, [checkKeyPressed])

    useEffect(() => {
        fixGroupOrder(mode);
    }, [mode]);

    // computed props
    const projectedCursorPosition: Point | null = activeDoorPoint && projectPointToLineSegment(cursorPosition, activeDoorPoint.vector);

    const fixGroupOrder = (mode: EditorModes) => {
        const { wallGroup, subdomainGroup, doorGroup, holeGroup, referenceLine, floorplan } = konvaRefs;

        switch (mode) {
            case EditorModes.walls:
                wallGroup.current?.moveToTop();
                doorGroup.current?.moveToTop();
                break;
            case EditorModes.subdomains:
                subdomainGroup.current?.moveToTop();
                break;
           /* case EditorModes.startAreas:
                startareaGroup.current?.moveToTop();
                break;*/
            case EditorModes.doors:
                wallGroup.current?.moveToTop();
                doorGroup.current?.moveToTop();
                break;
            /*case EditorModes.measurementLines:
                measurementLineGroup.current?.moveToTop();
                break;*/
           /* case EditorModes.attractors:
                attractorGroup.current?.moveToTop();
                break;*/
            case EditorModes.objects:
                holeGroup.current?.moveToTop();
                break;
            case EditorModes.referenceLine:
                referenceLine.current?.moveToTop();
                break
            case EditorModes.image:
                console.log("moved to top")
                floorplan.current?.moveToTop()
                break
        }
    }

    const drawLines = (snaplines: SnapLine[]) => {
        const guideLines = generateCanvasGuideLines(snaplines, stage.scale)
        if (!guideLines) {
            setHorizontalLines([])
            setVerticalLines([])
            return
        }
        setHorizontalLines(guideLines.horizontalLines)
        setVerticalLines(guideLines.verticalLines)
    }

    // Handler
    const handleRectCanvasMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        if (onAddObject === undefined) {
            return;
        }
        const pointerPosition = getClickPosition(e);
        if (!pointerPosition || spacebarPressed) return;
        const { x, y } = pointerPosition;

        setStartRectPosition({ x, y });
        setCurrentRectPosition({ x, y });
        setIsDragging(true);
    };

    const handleCanvasMouseUp = () => {
        if (isDragging) {
            const newRectangle = {
                x: Math.min(startRectPosition.x, currentRectPosition.x),
                y: Math.min(startRectPosition.y, currentRectPosition.y),
                width: Math.abs(currentRectPosition.x - startRectPosition.x),
                height: Math.abs(currentRectPosition.y - startRectPosition.y),
            };

            const minLength = 20 / stage.scale
            if (newRectangle.width > minLength && newRectangle.height > minLength) {
                onAddObject(newRectangle);
            }

            setIsDragging(false);
        }
    };

    const handleAddPoint = (pointerPosition: { x: number, y: number }) => {
        if (onAddPoint === undefined) { return }
        onAddPoint(new Point(Math.round(pointerPosition.x), Math.round(pointerPosition.y)));
    };

    const handleCanvasMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        const stageObject = e.target.getStage();
        if (!stageObject) return;
        const shiftIsPressed = e.evt.shiftKey

        let pointerPosition = stageObject.getRelativePointerPosition();
        if (!pointerPosition) return;

        if (shiftIsPressed && activePoint) {
            pointerPosition = guidePointOnCross(pointerPosition, activePoint)

            const verticalSnapLine: SnapLine = {
                snapLine: activePoint.x,
                diff: 0, // Setzen Sie diesen Wert entsprechend Ihrer Logik
                offset: 0, // Setzen Sie diesen Wert entsprechend Ihrer Logik
                type: "thick",
                direction: "vertical"
            };

            const horizontalSnapLine: SnapLine = {
                snapLine: activePoint.y,
                diff: 0, // Setzen Sie diesen Wert entsprechend Ihrer Logik
                offset: 0, // Setzen Sie diesen Wert entsprechend Ihrer Logik
                type: "thick",
                direction: "horizontal"
            };

            const guideLines = generateCanvasGuideLines([verticalSnapLine, horizontalSnapLine], stage.scale)

            if (guideLines) {
                setHorizontalLines(guideLines.horizontalLines)
                setVerticalLines(guideLines.verticalLines)
            }
        } else {
            setHorizontalLines([])
            setVerticalLines([])
        }

        setCursorPosition({ x: pointerPosition.x, y: pointerPosition.y });

        if (isDragging) {
            setCurrentRectPosition({ x: pointerPosition.x, y: pointerPosition.y });
        }
    };

    // Define which functionality is ON
    const handleCanvasClick = (e: KonvaEventObject<MouseEvent>) => {
        const isRightClick = e.evt.button === 2;
        let clickPosition = cursorPosition



        switch (mode) {
            case EditorModes.walls:
                if (checkObjectForLine(e.target.attrs) || isRightClick) {
                    break;
                }
                handleAddPoint(clickPosition)
                break;
            case EditorModes.objects:
                if (checkObjectForLine(e.target.attrs) || isRightClick) {
                    break;
                }
                handleAddPoint(clickPosition)
                break;
            /*case EditorModes.measurementLines:
                if (isRightClick) {
                    break;
                }
                onCreateMeasurementLine(clickPosition)
                break;*/
            /*case EditorModes.attractors:
                if (isRightClick) {
                    break;
                }
                onCreateAttractor(clickPosition)
                break;*/
            default:
                console.debug("The EditorMode does not support canvas click");
                break;
        }
    };

    const handleCanvasMouseDown = (e: KonvaEventObject<MouseEvent>) => {
        switch (mode) {
            case EditorModes.subdomains:
                if (e.target instanceof Konva.Rect) { break; }
                handleRectCanvasMouseDown(e)
                break;
            /*case EditorModes.startAreas:
                if (e.target instanceof Konva.Rect) { break; }
                handleRectCanvasMouseDown(e)
                break;*/
            default:
                console.debug("The EditorMode does not support canvas click");
                break;
        }
    };

    const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        if (!zoom) return;
        const stage = e.target.getStage();
        const scaleBy = 1.04
        const minScale = 0.2;
        const maxScale = 10;

        if (!stage) return;
        const oldScale = stage.scaleX();

        const mousePointTo = {
            x: stage.getPointerPosition()!.x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition()!.y / oldScale - stage.y() / oldScale
        };

        let newScale =
            e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
        newScale = Math.min(Math.max(newScale, minScale), maxScale);

        var newPos = {
            x:
                -(mousePointTo.x - stage.getPointerPosition()!.x / newScale) *
                newScale,
            y:
                -(mousePointTo.y - stage.getPointerPosition()!.y / newScale) *
                newScale
        };

        setStage({
            scale: newScale,
            x: newPos.x,
            y: newPos.y
        });
    };

    const handleImageUpdate = () => {
        if (!konvaRefs.transformer.current || !konvaRefs.image.current || !backgroundImage) return
        const imagePosition = {
            name: backgroundImage.title,
            x: konvaRefs.image.current.x(),
            y: konvaRefs.image.current.y(),
            rotation: konvaRefs.image.current.rotation(),
            width: konvaRefs.image.current.width(),
            height: konvaRefs.image.current.height(),
            scaleX: konvaRefs.image.current.scaleX(),
            scaleY: konvaRefs.image.current.scaleY(),
        };
        onImageUpdate(imagePosition);
    }


    return (
        <div className="flex flex-col flex-grow relative h-[95%] w-auto ml-10 cursor-pointer">
            <div className="flex flex-grow w-auto ">
                <div ref={parentRef} className="flex flex-grow h-full w-auto">
                    <Stage
                        width={parentWidth}
                        height={parentHeight}>
                        <Layer>
                            {grid && CanvasAxis({ polygonCorners, referenceLine, stage, stageAxisOffset, parentHeight, parentWidth })}
                        </Layer>
                    </Stage>
                    <Stage
                        className={`absolute overflow-hidden w-auto pl-10`}
                        ref={stageRef}
                        width={parentWidth - stageAxisOffset}
                        height={parentHeight - stageAxisOffset}
                        onClick={handleCanvasClick}
                        onContextMenu={(e) => e.evt.preventDefault()}
                        onWheel={handleWheel}
                        onMouseMove={handleCanvasMouseMove}
                        scaleX={stage.scale}
                        scaleY={stage.scale}
                        x={stage.x}
                        y={stage.y}
                        draggable={spacebarPressed && mode !== EditorModes.scenario}
                        onDragEnd={(e) => {
                            // added to not move canvas when any other element is dragged
                            if (!spacebarPressed) { return }
                            setStage({ ...stage, x: e.target.x(), y: e.target.y() })
                        }}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                    >
                        <Layer>
                            {grid && CanvasGridDots(stage, parentHeight, parentWidth)}
                        </Layer>
                        <Layer>
                            {verticalLines.map((line, index) => {
                                return <Line key={index} {...line} />
                            })}
                            {horizontalLines.map((line, index) => {
                                return <Line key={index} {...line} />
                            })}
                        </Layer>
                        <Layer>
                            {/*
                -------------------------
                Group: Background Image
                -------------------------
                */}
                            {backgroundImage && <Group ref={konvaRefs.floorplan}>
                                <Image
                                    ref={konvaRefs.image}
                                    image={backgroundImage as CanvasImageSource}
                                    width={backgroundImage?.naturalWidth}
                                    height={backgroundImage?.naturalHeight}
                                    draggable={mode === EditorModes.image}
                                    opacity={0.3} // Adjust the opacity value as needed (0.0 to 1.0)
                                />
                                <Transformer
                                    ref={konvaRefs.transformer}
                                    onTransformEnd={handleImageUpdate}
                                    onDragEnd={handleImageUpdate}
                                    keepRatio={true}
                                    rotateEnabled={false}
                                    resizeEnabled={mode === EditorModes.image}
                                    borderEnabled={mode === EditorModes.image}
                                    boundBoxFunc={(oldBox, newBox) => {
                                        // limit resize
                                        if (newBox.width < 5 || newBox.height < 5) {
                                            return oldBox;
                                        }
                                        return newBox;
                                    }}
                                />
                            </Group>}
                            {/*
                -------------------------
                Group: Reference Line
                -------------------------
                */}
                            {referenceLine && mode === EditorModes.referenceLine &&
                                <Group ref={konvaRefs.referenceLine} >
                                    <CanvasReferenceLine
                                        key={referenceLine.a.id}
                                        referenceLine={referenceLine}
                                        scale={stage.scale}
                                        draggable={mode === EditorModes.referenceLine}
                                        onChange={onReferenceLineChange}
                                        color="white"
                                        highlighted={mode === EditorModes.referenceLine}
                                    />
                                </Group>
                            }
                            {/*
                -------------------------
                Group: Walls
                -------------------------
                */}
                            <Group ref={konvaRefs.wallGroup}>
                                {walls && walls.map((vector) => {
                                    return <CanvasWall key={vector.id}
                                                       scale={stage.scale}
                                                       vector={vector}
                                                       onClick={onWallClick}
                                                       color="white"
                                                       highlighted={mode === "walls"} />;
                                })}
                                {polygonCorners.corners.map((point, index) => {
                                    // Render the corner points
                                    return (
                                        <Group key={index}>
                                            {index === 0 && !polygonCorners.closed && mode === EditorModes.walls &&
                                                <Circle
                                                    x={point.x}
                                                    y={point.y}
                                                    radius={5 / stage.scale}
                                                    fill="none"
                                                    stroke="orange"
                                                    strokeWidth={2 / stage.scale}
                                                />}
                                            <CanvasPoint
                                                key={point.id}
                                                scale={stage.scale}
                                                active={mode === EditorModes.walls}
                                                draggable={mode === EditorModes.walls}
                                                point={point}
                                                onDelete={onDeleteCorner}
                                                onChange={onCornerMove}
                                                onSnapLinesChange={(snaplines: SnapLine[]) => drawLines(snaplines)}
                                            />
                                        </Group>
                                    );
                                })}
                                {mode === "walls" && polygonCorners.corners.length > 0 && !polygonCorners.closed && cursorPosition && (
                                    <Line
                                        points={[
                                            polygonCorners.corners[polygonCorners.corners.length - 1].x,
                                            polygonCorners.corners[polygonCorners.corners.length - 1].y,
                                            cursorPosition.x,
                                            cursorPosition.y,
                                        ]}
                                        stroke="orange"
                                        strokeWidth={2 / stage.scale}
                                        dash={[5, 5]} // Set the dash pattern for the line (alternating 5 units of solid and 5 units of empty)
                                    />
                                )}
                            </Group>
                            {/*
                -------------------------
                Group: Objects
                -------------------------
                */}
                            <Group ref={konvaRefs.holeGroup}>
                                {holeWalls && holeWalls.flat().map((vector) => {
                                    return <CanvasWall key={vector.id} scale={stage.scale} vector={vector} onClick={(onWallClick)} color="white" highlighted={mode === "objects"} />;
                                })}
                                {holePolygons.length > 0 && holePolygons.map((polygon, index) => {
                                    const isLastPolygon = index === holePolygons.length - 1;
                                    const isLastCorner = isLastPolygon && !polygon.closed;
                                    return (
                                        <Group key={index}>
                                            {polygon.corners.map((point, cornerIndex) => (
                                                <Group key={cornerIndex}>
                                                    {cornerIndex === 0 && !polygon.closed && mode === EditorModes.objects &&
                                                        <Circle
                                                            x={point.x}
                                                            y={point.y}
                                                            radius={5 / stage.scale}
                                                            fill="none"
                                                            stroke="orange"
                                                            strokeWidth={2 / stage.scale}
                                                        />}
                                                    <CanvasPoint
                                                        key={point.id}
                                                        scale={stage.scale}
                                                        active={mode === EditorModes.objects}
                                                        draggable={mode === EditorModes.objects}
                                                        point={point}
                                                        onDelete={onDeleteCorner}
                                                        onChange={onCornerMove}
                                                        onSnapLinesChange={(snaplines: SnapLine[]) => drawLines(snaplines)}
                                                    />
                                                </Group>
                                            ))}
                                            {mode === "objects" && isLastCorner && cursorPosition && (
                                                <Line
                                                    points={[
                                                        polygon.corners[polygon.corners.length - 1].x,
                                                        polygon.corners[polygon.corners.length - 1].y,
                                                        cursorPosition.x,
                                                        cursorPosition.y,
                                                    ]}
                                                    stroke="orange"
                                                    strokeWidth={2 / stage.scale}
                                                    dash={[5, 5]}
                                                />
                                            )}
                                        </Group>
                                    );
                                })}
                            </Group>
                            {/*
                -------------------------
                Group: Doors
                -------------------------
                */}
                            <Group ref={konvaRefs.doorGroup}>
                                {doors.map((door, index) => {
                                    let wall = walls.find((wall) => wall.id === door.wallId);
                                    if (!wall) {
                                        wall = holeWalls.flat().find((wall) => wall.id === door.wallId);
                                    }
                                    if (!wall) {
                                        return;
                                    }
                                    return <CanvasDoor key={door.vector.id} scale={stage.scale} door={door} wall={wall} canvasRatio={canvasRatio} onDelete={(door) => onDeleteDoors([door])} onChange={onChangeDoor} color="white" mode={mode} onSnapLinesChange={(snaplines) => drawLines(snaplines)} />
                                })}
                                {mode === EditorModes.doors && activeDoorPoint && projectedCursorPosition && (
                                    <>
                                        <RegularPolygon
                                            x={activeDoorPoint.point.x}
                                            y={activeDoorPoint.point.y}
                                            sides={4}
                                            radius={6 / stage.scale}
                                            fill={"orange"}
                                            rotation={activeDoorPoint.vector.angle + 45}
                                            stroke={"orange"}
                                            strokeWidth={2 / stage.scale}
                                            lineCap="round"
                                            lineJoin="round"
                                            listening={false}
                                        />
                                        <Line
                                            points={[
                                                activeDoorPoint.point.x,
                                                activeDoorPoint.point.y,
                                                projectedCursorPosition.x,
                                                projectedCursorPosition.y,
                                            ]}
                                            stroke="orange"
                                            strokeWidth={5 / stage.scale}
                                            dash={[5, 5]}
                                            listening={false}
                                        />
                                        <RegularPolygon
                                            x={projectedCursorPosition.x}
                                            y={projectedCursorPosition.y}
                                            sides={4}
                                            radius={6 / stage.scale}
                                            fill={"orange"}
                                            rotation={activeDoorPoint.vector.angle + 45}
                                            stroke={"orange"}
                                            strokeWidth={2 / stage.scale}
                                            lineCap="round"
                                            lineJoin="round"
                                            listening={false}
                                        />
                                    </>
                                )}
                            </Group>
                            {/*
                -------------------------
                Group: Measurement Lines
                -------------------------
                */}
                            {/* <Group ref={konvaRefs.measurementLineGroup}>
                                {measurementLines.map((line, index) => {
                                    return <CanvasMeasurementLine key={line.id} line={line} scale={stage.scale} canvasRatio={canvasRatio} onChange={onChangeMeasurementLine} onDelete={onDeleteMeasurementLine} color="white" draggable={mode === EditorModes.measurementLines} highlighted={mode === EditorModes.measurementLines} onSnapLinesChange={(snaplines) => drawLines(snaplines)} />
                                })}
                                {mode === EditorModes.measurementLines && activeMeasurementPoint && cursorPosition && (
                                    <>
                                        <Circle
                                            width={10 / stage.scale}
                                            height={10 / stage.scale}
                                            x={activeMeasurementPoint.x}
                                            y={activeMeasurementPoint.y}
                                            fill="orange"
                                        />
                                        <Line
                                            points={[
                                                activeMeasurementPoint.x,
                                                activeMeasurementPoint.y,
                                                cursorPosition.x,
                                                cursorPosition.y,
                                            ]}
                                            stroke="orange"
                                            strokeWidth={3 / stage.scale}
                                            dash={[5, 5]}
                                            listening={false}
                                        />
                                        <Circle
                                            width={10 / stage.scale}
                                            height={10 / stage.scale}
                                            x={cursorPosition.x}
                                            y={cursorPosition.y}
                                            fill="orange"
                                            listening={false}
                                        />
                                        <RegularPolygon
                                            x={activeMeasurementPoint.x}
                                            y={activeMeasurementPoint.y}
                                            sides={3}
                                            stroke={"orange"}
                                            strokeWidth={3 / stage.scale}
                                            radius={6 / stage.scale}
                                            lineCap="round"
                                            lineJoin="round"
                                            fill={"orange"}
                                            rotation={activeMeasurementAngle + 90} />
                                        <RegularPolygon
                                            x={cursorPosition.x}
                                            y={cursorPosition.y}
                                            sides={3}
                                            stroke={"orange"}
                                            strokeWidth={3 / stage.scale}
                                            radius={6 / stage.scale}
                                            lineCap="round"
                                            lineJoin="round"
                                            fill={"orange"}
                                            rotation={activeMeasurementAngle - 90} />
                                    </>
                                )}
                            </Group>*/}
                            {/*
                -------------------------
                Group: Attractors
                -------------------------
                */}
                            {/* <Group ref={konvaRefs.attractorGroup}>
                                {attractors.map((attractor, index) => {
                                    return <CanvasAttractor key={attractor.vector.id} attractor={attractor} referenceLine={referenceLine} scale={stage.scale} onChange={onChangeAttractor} onDelete={onDeleteAttractor} color="white" mode={mode} onSnapLinesChange={(snaplines) => drawLines(snaplines)} />
                                })}
                                {mode === EditorModes.attractors && activeAttractorPoint && cursorPosition && (
                                    <>
                                        <Circle
                                            width={10 / stage.scale}
                                            height={10 / stage.scale}
                                            x={activeAttractorPoint.x}
                                            y={activeAttractorPoint.y}
                                            fill="orange"
                                        />
                                        <Line
                                            points={[
                                                activeAttractorPoint.x,
                                                activeAttractorPoint.y,
                                                cursorPosition.x,
                                                cursorPosition.y,
                                            ]}
                                            stroke="orange"
                                            strokeWidth={5 / stage.scale}
                                            dash={[5, 5]}
                                            listening={false}
                                        />
                                        <Circle
                                            width={10 / stage.scale}
                                            height={10 / stage.scale}
                                            x={cursorPosition.x}
                                            y={cursorPosition.y}
                                            fill="orange"
                                            listening={false}
                                        />
                                    </>
                                )}
                            </Group>*/}
                            {/*
                -------------------------
                Group: Subdomains
                -------------------------
                */}
                            <Group ref={konvaRefs.subdomainGroup}>
                                {subdomains.map((subdom, index) => (
                                    <CanvasSubdomain key={index} scale={stage.scale} subdomain={subdom} onChange={onSubdomainMove} onDelete={onDeleteSubdomain} mode={mode} />
                                ))}
                            </Group>
                            {/*
                -------------------------
                Group: Start Areas
                -------------------------
                */}
                            {/*     <Group ref={konvaRefs.startareaGroup}>
                                {startAreas.map((startArea, index) => (
                                    <CanvasStartArea key={index} draggable={mode === EditorModes.startAreas} scale={stage.scale} startarea={startArea} onChange={onStartareaMove} onDelete={onDeleteStartArea} highlighted={mode === EditorModes.startAreas} />
                                ))}
                            </Group>
                            <Group>
                                {isDragging && (
                                    <Rect
                                        x={startRectPosition.x}
                                        y={startRectPosition.y}
                                        width={currentRectPosition.x - startRectPosition.x}
                                        height={currentRectPosition.y - startRectPosition.y}
                                        stroke="orange"
                                        strokeWidth={2 / stage.scale}
                                    />
                                )}
                            </Group>*/}
                        </Layer>
                    </Stage>
                </div>
            </div>
            {zoom &&
                <div className="flex items-center">
                    <Slider className={"h-6 w-80"} label={"Zoom"} name={"zoom"} unit={"%"} value={parseInt((stage.scale * 100).toFixed(0))} min={10} max={200} step={1} onSliderChange={(e) => setStage({ ...stage, scale: (e.target.value / 100) })} disabled={false} />
                    <button onClick={() => {
                        const bounds = getBounds(polygonCorners)
                        const newStage = fitToFormat(parentWidth, parentHeight, stageAxisOffset, bounds)
                        setStage(newStage)
                    }
                    } >
                        <ArrowsPointingInIcon className="ml-5  h-5 w-5 text-white" />
                    </button>
                </div>
            }
        </div >
    );
}

export default PolygonCanvas;