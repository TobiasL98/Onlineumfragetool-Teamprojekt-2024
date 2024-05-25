import { Circle } from "react-konva";
import { IStage } from "../PolygonCanvas";

const CanvasGridDots = (stage: IStage, parentHeight: number, parentWidth: number) => {
  const spacing = 100
  const gridDots = [];
  const startX = Math.floor((-stage.x - parentWidth) / spacing) * spacing;
  const endX =
    Math.floor((-stage.x + parentWidth * 2) / spacing) * spacing;

  const startY =
    Math.floor((-stage.y - parentHeight) / spacing) * spacing;
  const endY =
    Math.floor((-stage.y + parentHeight * 2) / spacing) * spacing;

  for (var x = startX; x < endX; x += spacing) {
    for (var y = startY; y < endY; y += spacing) {
      gridDots.push(
        <Circle
          key={`dot-${x}-${y}`}
          x={x}
          y={y}
          radius={1}
          fill="grey"
        />
      );
    }
  }
  return gridDots;
};

export default CanvasGridDots