import { IRect } from "interfaces/canvas/IRect";

export interface ISubdomain {
    name: string,
    id: string,
    //velocity: number,
    polygon: IRect,
    hover: Boolean,
}
