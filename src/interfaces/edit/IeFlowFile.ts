import { IBackgroundImagePosition } from "./IBackgroundImagePosition";
import { IDoor } from "./IDoor";
import { IPolygon } from "./IPolygon";
import { ISubdomainFD } from "./ISubdomainFD";

export interface IeFlowFile {
    name: string;
    Door: IDoor[];
    SubdomainsFD: ISubdomainFD[];
    Domainpolygon?: any;
    Grid: any;
    PolygonCorners?: IPolygon;
    HoleCorners?: IPolygon[];
    BackgroundImagePosition?: IBackgroundImagePosition;
}