import Konva from "konva";
import { Rect, Text } from "react-konva";
import {useRef, useState, useEffect } from "react";

import { restrictPoints } from "../utils/guideLineUtils";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { EditorModes } from "lib/edit/EditorModes";
import { KonvaEventObject } from "konva/lib/Node";


interface CanvasSubdomProps {
  subdomain: ISubdomain;
  scale: number;
  onDelete?: (subdomain: ISubdomain) => void;
  onClick?: (evt: KonvaEventObject<MouseEvent>, subdomain: ISubdomain) => void;
  onChange: (subdomain: ISubdomain) => void;
  mode: EditorModes;
}

export default function CanvasSubdomain({ subdomain, scale, onDelete = () => { return }, onChange, mode, onClick }: CanvasSubdomProps) {
  const draggable = mode === EditorModes.subdomains;
  const highlighted = (mode === EditorModes.subdomains) || subdomain.hover
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

    subdomain.polygon.x = restrictedPointX;
    subdomain.polygon.y = restrictedPointY;

      subdomain.textPosition = { x: restrictedPointX + 10, y: restrictedPointY + 10 };

      if (textRef.current && subdomain.textPosition) {
          textRef.current.position(subdomain.textPosition);
      }

    onChange(subdomain);
  };

  const handleHover = (enable: boolean) => {
    onChange({ ...subdomain, hover: enable });
  }

  // @ts-ignore
  return (
      <>
        <Rect
            {...subdomain.polygon}
            onMouseEnter={() => handleHover(true)}
            onMouseLeave={() => handleHover(false)}
            draggable={draggable}
            onClick={(e) => {
              if (e.evt.button !== 2 && onClick) {
                onClick(e, subdomain);
              }
            }}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            strokeWidth={2 / scale}
            stroke={highlighted ? "orange" : "white"}
            dash={[5, 5]}
            fill={highlighted ? "rgba(255, 165, 0, 0.7)" : "rgba(128, 128, 128, 0.5)"}
            onContextMenu={(e) => {
              e.evt.preventDefault();
              onDelete(subdomain);
            }}
        />
        <Text
            ref={textRef}
            x={subdomain.polygon.x + 10}
            y={subdomain.polygon.y + 10}
            text={subdomain.text}
            fontSize={14}
            fill='white'
            align='left'
            verticalAlign='top'
        />
      </>
  );
}