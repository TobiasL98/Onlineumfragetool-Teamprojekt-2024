import Konva from "konva";
import { LineConfig } from "konva/lib/shapes/Line";
import { guidedPosition } from "../canvasElements/CanvasPoint";

export const getGobalSnaplines = (stage: Konva.Stage, excludedShape: Konva.Shape | null) => {
  const vertical: number[] = [];
  const horizontal: number[] = [];

  // We snap over edges and center of each object on the canvas
  // We can query and get all the shapes by their name property `shape`.
  stage.find(".point").forEach(shape => {
    // We don't want to snap to the selected shape, so we will be passing them as `excludedShape`
    if (shape === excludedShape) return;

    const center = shape.getPosition();
    // const box = shape.getClientRect({ relativeTo: stage });
    // vertical.push([box.x, box.x + box.width, box.x + box.width / 2]);
    // horizontal.push([box.y, box.y + box.height, box.y + box.height / 2]);
    vertical.push(center.x);
    horizontal.push(center.y);
  });

  return {
    vertical: vertical.flat(),
    horizontal: horizontal.flat(),
  };
};


export interface SnapLine {
  snapLine: number;
  diff: number;
  offset: number;
  type: "standard" | "thick"
  direction: "vertical" | "horizontal";
}

export const getCenterLines = (initialPosition: { x: number, y: number }): SnapLine[] => {
  const vertical = initialPosition.x;
  const horizontal = initialPosition.y;
  const result: SnapLine[] = [
    { snapLine: vertical, diff: 0, offset: 0, direction: "vertical", type: "thick" },
    { snapLine: horizontal, diff: 0, offset: 0, direction: "horizontal", type: "thick" }
  ];

  return result
}

const SNAP_THRESHOLD = 10;
const getShapeSnaplines = (globalSnapLines: { vertical: number[]; horizontal: number[]; }, currentShape: Konva.Shape, direction: "vertical" | "horizontal") => {
  const result: SnapLine[] = [];

  // Get snapping Edges here if the Shape is a Polygon
  const absPos = currentShape.getPosition();
  const shapeSnappingEdges = { vertical: [{ guide: absPos.x, offset: 0 }], horizontal: [{ guide: absPos.y, offset: 0 }] };

  globalSnapLines[direction].forEach(snapLine => {
    shapeSnappingEdges[direction].forEach(snappingEdge => {
      const diff = Math.abs(snapLine - snappingEdge.guide);
      // If the distance between the line and the shape is less than the threshold, we will consider it a snapping point.
      if (diff > SNAP_THRESHOLD) return;

      const { offset } = snappingEdge;
      result.push({ snapLine, diff, offset, direction, type: "standard" });
    });
  });
  return result;
};


export const getClosestSnapLines = (stage: Konva.Stage, currentShape: Konva.Shape) => {
  const globalSnapLines = getGobalSnaplines(stage, currentShape)

  const resultV = getShapeSnaplines(globalSnapLines, currentShape, "vertical");
  const resultH = getShapeSnaplines(globalSnapLines, currentShape, "horizontal");

  const closestSnapLines = [];

  // find closest vertical and horizontal snappping lines
  const [minV] = resultV.sort((a, b) => a.diff - b.diff);
  const [minH] = resultH.sort((a, b) => a.diff - b.diff);
  if (minV) closestSnapLines.push({ ...minV });
  if (minH) closestSnapLines.push({ ...minH });

  return closestSnapLines;
};



export const generateCanvasGuideLines = (lines: SnapLine[] = [], scale: number) => {
  if (lines.length > 0) {
    const standardLineStyle = {
      stroke: "rgb(0, 161, 255)",
      strokeWidth: 1 / scale,
      name: "guid-line",
      dash: [4, 6],
    };

    const thickLineStyle = {
      stroke: "rgb(100, 255, 255)",
      strokeWidth: 1 / scale,
      name: "guid-line",
      dash: [2, 2],
    };

    const horizontalLines: LineConfig[] = [];
    const verticalLines: LineConfig[] = [];

    lines.forEach(l => {
      if (l.direction === "horizontal") {
        const line = {
          points: [-6000, 0, 6000, 0],
          x: 0,
          y: l.snapLine,
        };

        if (l.type === "standard") {
          horizontalLines.push({ ...line, ...standardLineStyle });
        } else if (l.type === "thick") {
          horizontalLines.push({ ...line, ...thickLineStyle });
        }

      } else if (l.direction === "vertical") {
        const line = {
          points: [0, -6000, 0, 6000],
          x: l.snapLine,
          y: 0,
        };
        if (l.type === "standard") {
          verticalLines.push({ ...line, ...standardLineStyle });
        } else if (l.type === "thick") {
          verticalLines.push({ ...line, ...thickLineStyle });
        }

      }
    });

    return { horizontalLines, verticalLines };
  }
};


export const restrictPoints = ({ ev, initialPosition, snap = 20 }: { ev: Konva.KonvaEventObject<DragEvent>, initialPosition: { x: number, y: number }, snap?: number }) => {
  const eventObject = ev.target;
  const pointX = eventObject.x();
  const pointY = eventObject.y();

  const shiftPressed = ev.evt.shiftKey;
  const cmdPressed = ev.evt.metaKey || ev.evt.ctrlKey;

  let restrictedPointX = pointX;
  let restrictedPointY = pointY;

  if (shiftPressed) {
    if (cmdPressed) {
      restrictedPointX = Math.round(restrictedPointX / snap) * snap;
      restrictedPointY = Math.round(restrictedPointY / snap) * snap;
    } else {
      const xDiff = Math.abs(initialPosition.x - pointX);
      const yDiff = Math.abs(initialPosition.y - pointY);
      if (xDiff > yDiff) {
        restrictedPointY = initialPosition.y;
      } else {
        restrictedPointX = initialPosition.x;
      }
    }
  }
  return { restrictedPointX, restrictedPointY };
}

export const guidePointOnCross = (newPosition: { x: number, y: number }, initialPosition: { x: number, y: number }): guidedPosition => {
  let guidedX = newPosition.x;
  let guidedY = newPosition.y;

  const xDiff = Math.abs(initialPosition.x - guidedX);
  const yDiff = Math.abs(initialPosition.y - guidedY);

  if (xDiff < yDiff) {
    guidedX = initialPosition.x;
  } else {
    guidedY = initialPosition.y;
  }

  return { x: guidedX, y: guidedY, locked: xDiff < yDiff ? 'vertical' : 'horizontal' };
}

export const guidePointOnGrid = (newPosition: { x: number, y: number }, initialPosition: { x: number, y: number }, snap: number = 20): guidedPosition => {
  let guidedX = newPosition.x;
  let guidedY = newPosition.y;

  guidedX = Math.round(guidedX / snap) * snap;
  guidedY = Math.round(guidedY / snap) * snap;

  return { x: guidedX, y: guidedY, locked: 'grid' };
}

export const checkObjectForLine = (obj: any) => {
  const requiredAttributes = ['id', 'points', 'stroke', 'strokeWidth'];
  return requiredAttributes.every((attribute) => obj.hasOwnProperty(attribute));
};

export const getClickPosition = (e: Konva.KonvaEventObject<MouseEvent>) => {
  if (e.evt.button === 2) {
    return;
  }

  const stage = e.target.getStage();
  if (!stage) return;

  const pointerPosition = stage.getRelativePointerPosition();
  return pointerPosition;
}


