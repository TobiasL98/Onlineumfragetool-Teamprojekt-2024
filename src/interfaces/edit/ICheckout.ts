import { IRect } from "interfaces/canvas/IRect";

export interface ICheckout {
    name: string,
    id: string,
    //velocity: number,
    polygon: IRect,
    hover: Boolean,
    text: string;
    textPosition?: { x: number, y: number };
}
