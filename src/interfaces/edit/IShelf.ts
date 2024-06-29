import { IRect } from "interfaces/canvas/IRect";

export interface IShelf {
    name: string,
    id: string,
    polygon: IRect,
    hover: Boolean,
    text: string;
    shoppingTime?: string;
    textPosition?: { x: number, y: number };
    selectedItems: string[];
    selectedShoppingTimes: string[];
    shoppingOrder?: string
}

