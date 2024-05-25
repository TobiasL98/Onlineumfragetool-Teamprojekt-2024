import Konva from "konva";
import { Group, Line, RegularPolygon, Text } from "react-konva";
import { useState } from "react";

import { SnapLine, restrictPoints } from "../utils/guideLineUtils";
import { calculateTextOffset } from "../utils/canvasUtils";
import { IDoor } from "interfaces/edit/IDoor";
import { EditorModes } from "lib/edit/EditorModes";
import { Vector } from "lib/geometry/vector";
import { Point } from "lib/geometry/point";
import { projectPointToLineSegment } from "utils/geometry/utils";
import { dragPoint } from "components/planEditor/polygonCanvas/CanvasElements/CanvasPoint";

interface CanvasDoorProps {
  door: IDoor;
  scale: number;
  wall: Vector;
  canvasRatio: number;
  onDelete?: (door: IDoor) => void;
  onChange?: (door: IDoor) => void;
  onSnapLinesChange: (snapLines: SnapLine[]) => void;
  color: string;
  mode: EditorModes;
}

export default function CanvasDoor({ door, wall, canvasRatio, scale, onDelete = () => { return }, onChange = () => { return }, color, mode, onSnapLinesChange }: CanvasDoorProps) {
  const { a, b } = door.vector;
  const points = [a.x, a.y, b.x, b.y];
  const angle = door.vector.angle;
  const draggable = mode === EditorModes.doors;
  const highlighted = (mode === EditorModes.doors) || door.hover
  const doorWidth = door.vector.length * canvasRatio;
  const textOffset = calculateTextOffset(angle, scale);

  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // Store the initial position of the point

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const initPos = e.target.getPosition();
    setInitialPosition(initPos);
  }


  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>, circle: string, handleSnapLinesChange: (guideLines: SnapLine[]) => void) => {
    const eventPoint = e.target as Konva.Circle; // Assuming e.target is the Konva point
    const stage = eventPoint.getStage();
    if (!stage) return;

    let pointToChange;

    if (circle === "a") {
      pointToChange = door.vector.a;
    } else {
      pointToChange = door.vector.b;
    }

    const newPos = dragPoint(pointToChange, initialPosition, e, handleSnapLinesChange);
    const { x: projectedX, y: projectedY } = projectPointToLineSegment({ x: newPos.x, y: newPos.y }, wall);


    eventPoint.x(projectedX);
    eventPoint.y(projectedY);

    if (circle === "a") {
      door.vector.setA(new Point(projectedX, projectedY));
    } else {
      door.vector.setB(new Point(projectedX, projectedY));
    }

    onChange(door);
  };

  const handleHover = (enable: boolean) => {
    if (mode !== EditorModes.scenario) return;
    onChange({ ...door, hover: enable });
  }

  return <Group onContextMenu={() => onDelete(door)}
    onMouseEnter={() => handleHover(true)}
    onMouseLeave={() => handleHover(false)}>
    <Line
      id={door.vector.id}
      points={points}
      stroke={highlighted ? "orange" : color}
      strokeWidth={5 / scale} />
    <RegularPolygon
      name="point"
      draggable={draggable}
      onDragMove={(e) => handleDragMove(e, "a", onSnapLinesChange)}
      onDragStart={handleDragStart}
      x={a.x}
      y={a.y}
      sides={4}
      radius={6 / scale}
      fill={highlighted ? "orange" : color}
      rotation={angle + 45}
      stroke={highlighted ? "orange" : color}
      strokeWidth={2 / scale}
      lineCap="round"
      lineJoin="round"
    />
    <Text
      x={1 / 2 * (b.x + a.x) - textOffset.y}
      y={1 / 2 * (b.y + a.y) + textOffset.x}
      text={(doorWidth.toFixed(2)).toString() + "m"}
      fontSize={12 / scale}
      rotation={angle}
      fill={highlighted ? "orange" : color}
      align="center"
      verticalAlign="middle" />
    <RegularPolygon
      name="point"
      draggable={draggable}
      onDragMove={(e) => handleDragMove(e, "b", onSnapLinesChange)}
      onDragStart={handleDragStart}
      x={b.x}
      y={b.y}
      sides={4}
      radius={6 / scale}
      fill={highlighted ? "orange" : color}
      rotation={angle + 45}
      stroke={highlighted ? "orange" : color}
      strokeWidth={2 / scale}
      lineCap="round"
      lineJoin="round"
    />
  </Group>
}