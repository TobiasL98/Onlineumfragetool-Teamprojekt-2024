import { IBackgroundImagePosition } from "./IBackgroundImagePosition";
import { IConfigEntrance } from "./IConfigEntrance";
import { IConfigExit } from "./IConfigExit";
import { IPolygon } from "./IPolygon";
import { IShelf } from "./IShelf";

export interface ISupermarketFile {
    name: string;
    Entrance: IConfigEntrance[];
    Exit: IConfigExit[];
    Shelf: IShelf[];
    Domainpolygon: any;
    //PolygonCorners: IPolygon;
    BackgroundImagePosition: IBackgroundImagePosition;
}