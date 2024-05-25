import Konva from "konva";
import { Group, Line, RegularPolygon, Text } from "react-konva";
import { useState } from "react";

import { restrictPoints } from "../utils/guideLineUtils";
import { IReferenceLine } from "interfaces/edit/IReferenceLine";
import { Vector } from "lib/geometry/vector";

interface CanvasReferenceLineProps {
  referenceLine: IReferenceLine;
  scale: number;
  onChange?: (referenceLine: IReferenceLine) => void;
  color: string;
  highlighted: boolean;
  draggable: boolean;
}

export default function CanvasReferenceLine({ referenceLine, scale, onChange = () => { return }, color, draggable, highlighted }: CanvasReferenceLineProps) {
  const a = referenceLine.a;
  const b = referenceLine.b;
  const referenceVector = new Vector(a, b);
  referenceVector.normalize();

  const angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);

  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // Store the initial position of the point

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const initPos = e.target.getPosition();
    setInitialPosition(initPos);
  }

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>, circle: string) => {
    const eventPoint = e.target as Konva.Circle; // Assuming e.target is the Konva point
    const stage = eventPoint.getStage();
    if (!stage) return;

    // restrict point to canvas
    const { restrictedPointX, restrictedPointY } = restrictPoints({ ev: e, initialPosition });

    // project dragged point to wall
    eventPoint.x(restrictedPointX);
    eventPoint.y(restrictedPointY);

    if (circle === "a") {
      referenceLine.a.x = restrictedPointX;
      referenceLine.a.y = restrictedPointY;
    } else {
      referenceLine.b.x = restrictedPointX;
      referenceLine.b.y = restrictedPointY;
    }

    const newReferenceLine = { ...referenceLine };

    onChange(newReferenceLine);
  };

  console.log(referenceVector)

  return <Group>
    <Line
      id={referenceLine.a.id}
      points={[a.x, a.y, b.x, b.y]}
      stroke={highlighted ? "orange" : color}
      strokeWidth={5 / scale} />
    <RegularPolygon
      draggable={draggable}
      onDragMove={(e) => handleDragMove(e, "a")}
      onDragStart={handleDragStart}
      hitStrokeWidth={3 / scale}
      x={a.x}
      y={a.y}
      sides={3}
      stroke={highlighted ? "orange" : color}
      strokeWidth={1 / scale}
      radius={6 / scale}
      lineCap="round"
      lineJoin="round"
      fill={highlighted ? "orange" : color}
      rotation={angle + 90} />
    <Text
      x={1 / 2 * (b.x + a.x)}
      y={1 / 2 * (b.y + a.y) + 10}
      text={referenceLine.width.toString() + "m"}
      fontSize={12 / scale}
      rotation={angle}
      fill="orange"
      align="center"
      verticalAlign="middle" />
    <RegularPolygon
      draggable={draggable}
      onDragMove={(e) => handleDragMove(e, "b")}
      onDragStart={handleDragStart}
      stroke={highlighted ? "orange" : color}
      strokeWidth={1 / scale}
      hitStrokeWidth={3 / scale}
      lineCap="round"
      lineJoin="round"
      x={b.x}
      y={b.y}
      sides={3}
      radius={6 / scale}
      fill={highlighted ? "orange" : color}
      rotation={angle + 270} />
  </Group>
}