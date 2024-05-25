import { IPolygon } from "interfaces/edit/IPolygon";
import { Point } from "lib/geometry/point";


export function checkPresentCoordinates(points: Point[], newPoint: Point): boolean {
    let isPresent = false;
    points.forEach(point => {
        if (point.x === newPoint.x && point.y === newPoint.y) {
            isPresent = true;
        }
    });

    return isPresent;
}

export const findAndSplicePolygonByPointId = (polygons: IPolygon[], pointId: string): [IPolygon | undefined, IPolygon[], number] => {
    const index = polygons.findIndex((polygon) => {
        return polygon.corners.some((point) => point.id === pointId);
    });

    if (index !== -1) {
        const removedPolygon = polygons.splice(index, 1)[0];
        return [removedPolygon, polygons, index];
    }

    return [undefined, polygons, -1];
};

export const findAndRemoveOpenPolygon = (polygons: IPolygon[]): [IPolygon[], IPolygon[]] => {
    const openPolygons = polygons.filter((polygon) => !polygon.closed);
    const remainingPolygons = polygons.filter((polygon) => polygon.closed);
    return [openPolygons, remainingPolygons];
};
