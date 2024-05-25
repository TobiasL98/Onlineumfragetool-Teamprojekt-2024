import Konva from "konva";
import { Rect } from "react-konva";
import { useState } from "react";
import { restrictPoints } from "../utils/guideLineUtils";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { EditorModes } from "lib/edit/EditorModes";


interface CanvasSubdomProps {
  subdomain: ISubdomain;
  scale: number;
  onDelete?: (subdomain: ISubdomain) => void;
  onChange: (subdomain: ISubdomain) => void;
  mode: EditorModes;
}

export default function CanvasSubdomain({ subdomain, scale, onDelete = () => { return }, onChange, mode }: CanvasSubdomProps) {
  const draggable = mode === EditorModes.subdomains;
  const highlighted = (mode === EditorModes.subdomains) || subdomain.hover

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

    onChange(subdomain);
  };

  const handleHover = (enable: boolean) => {
    if (mode !== EditorModes.scenario) return;
    onChange({ ...subdomain, hover: enable });
  }

  return <Rect {...subdomain.polygon}
    onMouseEnter={() => handleHover(true)}
    onMouseLeave={() => handleHover(false)}
    draggable={draggable}
    onDragStart={handleDragStart}
    onDragMove={handleDragMove}
    strokeWidth={2 / scale}
    stroke={highlighted ? "orange" : "white"}
    dash={[5, 5]}
    fill={highlighted ? "rgba(255, 165, 0, 0.7)" : "rgba(128, 128, 128, 0.5)"}
    onContextMenu={() => onDelete(subdomain)} />
}
