import { ICanvasWallProps } from "interfaces/canvas/ICanvasWallProps";
import { KonvaEventObject } from "konva/lib/Node";
import { Line } from "react-konva";


export default function CanvasWall({ vector, scale, highlighted, color, onClick = (evt: KonvaEventObject<MouseEvent>, id: string) => { return } }: ICanvasWallProps) {
  const { a, b } = vector;
  const points = [a.x, a.y, b.x, b.y];

  return (
    <Line id={vector.id}
      onContextMenu={(e) => e.evt.preventDefault()}
      points={points}
      stroke={highlighted ? "orange" : color}
      strokeWidth={3 / scale}
      hitStrokeWidth={20 / scale}
      onClick={(e) => {
        if (e.evt.button !== 2) {
          onClick(e, vector.id);
        }
      }} />)
}