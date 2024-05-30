import Konva from "konva";
import { Rect, Text } from "react-konva";
import { useRef, useState } from "react";

import { restrictPoints } from "../utils/guideLineUtils";
import { ICheckout } from "interfaces/edit/ICheckout";
import { EditorModes } from "lib/edit/EditorModes";
import { KonvaEventObject } from "konva/lib/Node";


interface CanvasSubdomProps {
    checkout: ICheckout;
    scale: number;
    onDelete?: (checkout: ICheckout) => void;
    onChange: (checkout: ICheckout) => void;
    mode: EditorModes;
}

export default function CanvasCheckout({ checkout, scale, onDelete = () => { return }, onChange, mode}: CanvasSubdomProps) {
    const draggable = mode === EditorModes.checkouts;
    const highlighted = (mode === EditorModes.checkouts) || checkout.hover
    const textRef = useRef <Konva.Text | null>(null);
    const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // Store the initial position of the point

    const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
        const initPos = e.target.getPosition();
        setInitialPosition(initPos);
    }


    const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
        const eventPoint = e.target as Konva.Circle; // Assuming e.target is the Konva point
        const stage = eventPoint.getStage();
        if (!stage) return;
        const { restrictedPointX, restrictedPointY } = restrictPoints({ ev: e, initialPosition });

        checkout.polygon.x = restrictedPointX;
        checkout.polygon.y = restrictedPointY;

        checkout.textPosition = { x: restrictedPointX + 10, y: restrictedPointY + 10 };

        if (textRef.current && checkout.textPosition) {
            textRef.current.position(checkout.textPosition);
        }

        onChange(checkout);
    };

    const handleHover = (enable: boolean) => {
        onChange({ ...checkout, hover: enable });
    }

    // @ts-ignore
    return (
        <>
            <Rect
                {...checkout.polygon}
                onMouseEnter={() => handleHover(true)}
                onMouseLeave={() => handleHover(false)}
                draggable={draggable}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                strokeWidth={2 / scale}
                stroke={highlighted ? "orange" : "white"}
                dash={[5, 5]}
                fill={highlighted ? "rgba(255, 165, 0, 0.7)" : "rgba(128, 128, 128, 0.5)"}
                onContextMenu={(e) => {
                    e.evt.preventDefault();
                    onDelete(checkout);
                }}
            />
            <Text
                ref={textRef}
                x={checkout.polygon.x + 10}
                y={checkout.polygon.y + 10}
                text={checkout.text}
                fontSize={14}
                fill='white'
                align='left'
                verticalAlign='top'
            />
        </>
    );
}