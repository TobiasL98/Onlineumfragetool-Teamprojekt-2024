import { IBackgroundImagePosition } from "./IBackgroundImagePosition";
import { ICheckout } from "./ICheckout";
import { IDoor } from "./IDoor";
import { IPolygon } from "./IPolygon";
import { IShelf } from "./IShelf";

export interface IeFlowFile {
    name: string;
    Door: IDoor[];
    Shelfs: IShelf[];
    Domainpolygon?: any;
    //Grid?: any;
    PolygonCorners: IPolygon;
   // HoleCorners: IPolygon[];
    BackgroundImagePosition: IBackgroundImagePosition;
    Checkouts: ICheckout[];
}