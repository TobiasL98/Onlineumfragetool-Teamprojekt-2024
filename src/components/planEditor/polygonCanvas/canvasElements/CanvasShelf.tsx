import Konva from "konva";
import { Group, Path, Rect, Text } from "react-konva";
import {useEffect, useRef, useState } from "react";

import { restrictPoints } from "../utils/guideLineUtils";
import { IShelf } from "interfaces/edit/IShelf";
import { EditorModes } from "lib/edit/EditorModes";
import { KonvaEventObject } from "konva/lib/Node";


interface CanvasShelfProps {
    shelf: IShelf;
    scale: number;
    onDelete?: (shelf: IShelf) => void;
    onClick?: (evt: KonvaEventObject<MouseEvent>, shelf: IShelf) => void;
    onChange: (shelf: IShelf) => void;
    mode: EditorModes;
}

export default function CanvasShelf({ shelf, scale, onDelete = () => { return }, onChange, mode, onClick }: CanvasShelfProps) {
    const draggable = mode === EditorModes.shelfs;
    const textRef = useRef <Konva.Text | null>(null);
    const iconRef = useRef<Konva.Group | null>(null);
    const pathRef = useRef<Konva.Path | null>(null);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
    const [refreshIconWidth, setRefreshIconWidth] = useState(0);
    const [refreshIconHeight, setRefreshIconHeight] = useState(0);
    const [hover, setHover] = useState(false);
    const highlighted = (mode === EditorModes.shelfs) || ((mode === EditorModes.image) && shelf.text !== "" && hover == true);

    useEffect(() => {
        if (shelf.polygon.rotation === undefined) {
            shelf.polygon.rotation = 0;
            onChange(shelf);
        }
    }, [shelf, onChange]);

    useEffect(() => {
        if (pathRef.current) {
            const bbox = pathRef.current.getClientRect();
            setRefreshIconWidth(bbox.width);
            setRefreshIconHeight(bbox.height);
        }
    }, []);

    const handleRotateStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;
    }

    const handleRotateMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        e.cancelBubble = true;

        const icon = e.target as Konva.Group;
        const stage = icon.getStage();

        if (!stage) return;

        const shelfRect = icon.getParent()!.getChildren().find(child => child.name() === shelf.name);
        const mousePos = stage.getPointerPosition();

        if (!mousePos || !shelfRect) return;

        const centerX = shelfRect.x()
        const centerY = shelfRect.y()

        const dx = mousePos.x - centerX;
        const dy = mousePos.y - centerY;
        const newRotation = Math.atan2(dy, dx) * 180 / Math.PI;

        shelf.polygon.rotation = newRotation;
        shelfRect.rotation(newRotation);

        if (shelfRect.offsetX() === 0) {
            const offsetX = shelf.polygon.width / 2;
            const offsetY = shelf.polygon.height / 2;

            shelfRect.offsetX(offsetX);
            shelfRect.offsetY(offsetY);

            shelfRect.x(shelf.polygon.x + offsetX);
            shelfRect.y(shelf.polygon.y + offsetY);
        }

        const radius = shelfRect.height() / 2
        const angleInRadians = Konva.Util.degToRad(newRotation - 90);

        const rotatedIconX = centerX +  radius * Math.cos(angleInRadians);
        const rotatedIconY = centerY + radius * Math.sin(angleInRadians);

        if (iconRef.current) {
            iconRef.current.offsetX(refreshIconWidth)
            iconRef.current.offsetY(refreshIconHeight * 2)
            iconRef.current.position({
                x: rotatedIconX,
                y: rotatedIconY
            });
            iconRef.current.rotation(newRotation);
        }

        const textPositionX = shelf.polygon.x
        const textPositionY = shelf.polygon.y

        shelf.textPosition = { x: textPositionX, y: textPositionY };

        if (textRef.current && shelf.textPosition) {
            textRef.current.position(shelf.textPosition);
        }

        onChange(shelf);
    };

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        const initPos = e.target.getPosition();
        setInitialPosition(initPos);
    }

    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        const shelfRect = e.target as Konva.Rect;
        const stage = shelfRect.getStage();

        if (!stage) return;

        const { restrictedPointX, restrictedPointY } = restrictPoints({ ev: e, initialPosition });

        shelf.polygon.x = restrictedPointX;
        shelf.polygon.y = restrictedPointY;

        const radius = shelfRect.height() / 2
        const angleInRadians = Konva.Util.degToRad(shelfRect.rotation() - 90);

        let centerX: number
        let centerY: number

        if (shelf.polygon.rotation === 0) {
            centerX = shelf.polygon.x + shelf.polygon.width;
            centerY = shelf.polygon.y

            const rotatedCircleX = centerX + radius * Math.cos(angleInRadians);
            const rotatedCircleY = centerY + radius * Math.sin(angleInRadians);

            if (iconRef.current) {
                iconRef.current.position({
                    x: rotatedCircleX - shelf.polygon.width / 2 - refreshIconWidth,
                    y: rotatedCircleY + shelf.polygon.height / 2 - refreshIconHeight *2,
                });
                iconRef.current.rotation(shelf.polygon.rotation!)
            }

            shelf.textPosition = {x: restrictedPointX, y: restrictedPointY}

            if (textRef.current && shelf.textPosition) {
                textRef.current.position(shelf.textPosition);
            }

        } else {
            centerX = shelfRect.x() // + shelfRect.width() / 2;
            centerY = shelfRect.y()

            const rotatedCircleX = centerX + radius * Math.cos(angleInRadians);
            const rotatedCircleY = centerY + radius * Math.sin(angleInRadians);

            // to do: icon weiter hoch

            if (iconRef.current) {
                // beeinflusst Position des Icons wenn drag zu ende
                //iconRef.current.offsetX(shelf.polygon.width / 2)// + refreshIconWidth/2 );
                //iconRef.current.offsetY(shelf.polygon.height / 4  )//- refreshIconHeight);

                // beeinflusst Position des Icons während des drags
                iconRef.current.position({
                    x: rotatedCircleX,// - refreshIconWidth,
                    y: rotatedCircleY// + shelf.polygon.height / 2// - refreshIconHeight
                });
                iconRef.current.rotation(shelf.polygon.rotation!);
            }

            //shelfRect.offsetX(0);
            //shelfRect.offsetY(0);

            const textPositionX = shelf.polygon.x
            const textPositionY = shelf.polygon.y

            //shelf.textPosition = { x: textPositionX, y: textPositionY };
            shelf.textPosition = {x: restrictedPointX, y: restrictedPointY}
            if (textRef.current && shelf.textPosition) {
                textRef.current.offsetX(shelf.polygon.width / 2);
                textRef.current.offsetY(shelf.polygon.height / 2);
                textRef.current.position(shelf.textPosition);
            }
        }

        onChange(shelf);
    };

    const handleHover = (enable: boolean) => {
        setHover(enable);
        onChange({ ...shelf, hover: enable });
    }

    return (
        <>
            <Rect
                {...shelf.polygon}
                name={shelf.name}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                draggable={draggable}
                onClick={(e) => {
                    if (e.evt.button !== 2 && onClick) {
                        onClick(e, shelf);
                    }
                }}
                //offsetX={shelf.polygon.width / 2}
                //offsetY={shelf.polygon.height / 2}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                strokeWidth={2 / scale}
                stroke={highlighted ? "orange" : "white"}
                dash={[5, 5]}
                fill={highlighted ? "rgba(255, 165, 0, 0.7)" : "rgba(128, 128, 128, 0.5)"}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                    onDelete(shelf);
                }}
            />
            {mode === EditorModes.shelfs && (
                <Group
                    ref={iconRef}
                    x={shelf.polygon.x + shelf.polygon.width / 2 - refreshIconWidth}
                    y={shelf.polygon.y - refreshIconHeight * 2}
                    draggable
                    dragOnTop={false}
                    onDragStart={handleRotateStart}
                    onDragMove={handleRotateMove}
                >
                    <Path
                        ref={pathRef}
                        data="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-0.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14 0.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                        fill="white"
                        strokeWidth={2}
                    />
                </Group>
            )}
            <Text
                ref={textRef}
                x={shelf.polygon.x}
                y={shelf.polygon.y}
                text={shelf.text}
                fontSize={14}
                fill="white"
                align='center'
                verticalAlign='middle'
                width={shelf.polygon.width}
                height={shelf.polygon.height}
                listening={false}
            />
            {mode === EditorModes.image && shelf.shoppingTime !== undefined && shelf.shoppingOrder !== undefined  && (
                <Text
                    ref={textRef}
                    x={shelf.polygon.x}
                    y={shelf.polygon.y + 20}
                    text={`${shelf.shoppingOrder}. (${shelf.shoppingTime})`}
                    fontSize={14}
                    fill={highlighted ? "white" : "orange"}
                    align='center'
                    verticalAlign='middle'
                    width={shelf.polygon.width}
                    height={shelf.polygon.height}
                    listening={false}
                />
            )}
        </>
    );
}