import Konva from "konva";

import { SnapLine, getCenterLines, guidePointOnCross, guidePointOnGrid } from "../utils/guideLineUtils";
import { Circle, Group, Rect } from "react-konva";
import { useState } from "react";
import { getClosestSnapLines } from "../utils/guideLineUtils";
import { Point } from "lib/geometry/point";
import { ICanvasPointProps } from "interfaces/canvas/ICanvasPointProps";

export interface guidedPosition {
  x: number,
  y: number,
  locked?: "none" | "horizontal" | "vertical" | "grid"
}

export const dragPoint = (pointToMove: Point, initialPosition: { x: number, y: number }, e: Konva.KonvaEventObject<DragEvent>, handleSnapLinesChange: (guideLines: SnapLine[]) => void) => {
  const eventPoint = e.target as Konva.Circle; // Assuming e.target is the Konva point
  const newPosition = eventPoint.getPosition();
  const stage = eventPoint.getStage();

  let guidedPosition: guidedPosition = { x: newPosition.x, y: newPosition.y, locked: "none" }
  let guideLines: SnapLine[] = [];

  const shiftPressed = e.evt.shiftKey;
  const cmdPressed = e.evt.metaKey || e.evt.ctrlKey;

  if (shiftPressed) {
    guidedPosition = guidePointOnCross(newPosition, initialPosition)
    guideLines = getCenterLines(initialPosition);
    if (cmdPressed) {
      guidedPosition = guidePointOnGrid(newPosition, initialPosition)
      handleSnapLinesChange([])
      return guidedPosition
    }
  }

  const snapLines = getClosestSnapLines(stage!, eventPoint);
  const orgAbsPos = guidedPosition;
  const absPos = guidedPosition;

  // Find new position
  snapLines.forEach(l => {
    const position = l.snapLine + l.offset;
    // if (l.direction === "vertical" && guidedPosition.locked !== "horizontal") {
    if (l.direction === "vertical" && guidedPosition.locked !== "vertical") {
      absPos.x = position;
      // } else if (l.direction === "horizontal" && guidedPosition.locked !== "vertical") {
    } else if (l.direction === "horizontal" && guidedPosition.locked !== "horizontal") {
      absPos.y = position;
    }
  });

  // calculate the difference between original and new position
  const vecDiff = {
    x: orgAbsPos.x - absPos.x,
    y: orgAbsPos.y - absPos.y,
  };

  // apply the difference to the selected shape.
  const newPos = {
    x: orgAbsPos.x - vecDiff.x,
    y: orgAbsPos.y - vecDiff.y,
  };

  if (guidedPosition.locked === "horizontal") {
    const verticalSnapLines = snapLines.filter(l => l.direction === "vertical")
    guideLines.push(...verticalSnapLines)
  } else if (guidedPosition.locked === "vertical") {
    const horizontalSnapLines = snapLines.filter(l => l.direction === "horizontal")
    guideLines.push(...horizontalSnapLines)
  } else {
    guideLines.push(...snapLines)
  }

  // Add Shiftlines here as well
  handleSnapLinesChange(guideLines)
  return newPos
}

export default function CanvasPoint({ point, scale, onDelete, onChange, active, draggable, onSnapLinesChange }: ICanvasPointProps) {
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // Store the initial position of the point
  const { x, y } = point; // Access the x and y coordinates from the point prop

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    const initPos = e.target.getPosition();
    setInitialPosition(initPos);
  }

  const handleDragMove = (pointToMove: Point, e: Konva.KonvaEventObject<DragEvent>) => {
    const eventPoint = e.target as Konva.Circle; // Assuming e.target is the Konva point
    const stage = eventPoint.getStage();
    if (!stage) return;

    const newPos = dragPoint(pointToMove, initialPosition, e, onSnapLinesChange);

    const updatePoint = (newPosition: guidedPosition) => {
      // event point has to be updated, because otherwise the point seperates from the snaped Position
      eventPoint.x(newPosition.x);
      eventPoint.y(newPosition.y);

      // Update the point in the parent component so all attached objets are updated
      pointToMove.x = newPosition.x;
      pointToMove.y = newPosition.y;

      onChange(pointToMove);
    }

    updatePoint(newPos);
  };


  return (
    <Group
      onContextMenu={() => onDelete(point)}
      draggable={draggable}
      name="point"
      x={x}
      y={y}
      onDragMove={(e) => { handleDragMove(point, e); }}
      onDragStart={handleDragStart}
      onDragEnd={() => { onSnapLinesChange([]); }}
    >
      {active && <Rect
        x={-4 / scale}
        y={-4 / scale}
        width={8 / scale}
        height={8 / scale}
        cornerRadius={1 / scale}
        fill="#87CEEB"
        onContextMenu={() => { onDelete(point) }}
      />}
      <Circle
        width={4 / scale}
        height={4 / scale}
        x={0}
        y={0}
        fill="#BEBEBE"
        onContextMenu={() => { onDelete(point) }}
      />
      <Circle
        width={30 / scale}
        height={30 / scale}
        x={0}
        y={0}  // Increase the hitbox by 10 units on the top and bottom
        fill="transparent"
        onContextMenu={() => { onDelete(point) }}
      />
    </Group>
  );
}