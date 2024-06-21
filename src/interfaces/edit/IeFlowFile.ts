import { IBackgroundImagePosition } from "./IBackgroundImagePosition";
import { ICheckout } from "./ICheckout";
import { IDoor } from "./IDoor";
import { IPolygon } from "./IPolygon";
import { ISubdomain } from "./ISubdomain";

export interface IeFlowFile {
    name: string;
    Door: IDoor[];
    Subdomains: ISubdomain[];
    Domainpolygon?: any;
    Grid?: any;
    PolygonCorners: IPolygon;
    HoleCorners: IPolygon[];
    BackgroundImagePosition: IBackgroundImagePosition;
    Checkouts: ICheckout[];
}