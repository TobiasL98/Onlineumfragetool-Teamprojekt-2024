import { IRect } from "interfaces/canvas/IRect";
import { Point } from "lib/geometry/point";

export interface ISubdomain {
    name: string,
    id: string,
    polygon: IRect,
    hover?: Boolean,
    text: string;
    textPosition?: { x: number, y: number };
    selectedItems: string[];
}
