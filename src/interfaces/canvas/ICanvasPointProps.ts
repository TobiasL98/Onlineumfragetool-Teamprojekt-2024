import { SnapLine } from "components/planEditor/polygonCanvas/utils/guideLineUtils";
import { Point } from "lib/geometry/point";


export interface ICanvasPointProps {
    point: Point;
    scale: number;
    onDelete: (point: Point) => void;
    onChange: (point: Point) => void;
    onSnapLinesChange: (snapLines: SnapLine[]) => void;
    draggable: boolean
    active: boolean
}