import { KonvaEventObject } from "konva/lib/Node";
import { Vector } from "lib/geometry/vector";

export interface ICanvasWallProps {
    vector: Vector;
    scale: number;
    highlighted: Boolean;
    color: string;
    onClick?: (evt: KonvaEventObject<MouseEvent>, id: string) => void
}