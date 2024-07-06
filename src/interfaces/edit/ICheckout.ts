import { IRect } from "interfaces/canvas/IRect";

export interface ICheckout {
    name: string,
    id: string,
    polygon: IRect,
    hover: Boolean,
    text: string;
    textPosition?: { x: number, y: number},
    shoppingOrder?: string
}
