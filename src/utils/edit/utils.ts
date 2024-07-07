import { IRect } from "konva/lib/types";
import { nanoid } from "nanoid";

import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { calculatePointInsidePolygon } from "../geometry/utils";
import {IDoor, IEntrance} from "interfaces/edit/IDoor";
import { IShelf } from "interfaces/edit/IShelf";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IDomainPolygon } from "interfaces/edit/IDomainPolygon";
import { IConfigExit } from "interfaces/edit/IConfigExit";
import { IConfigEntrance } from "interfaces/edit/IConfigEntrance";
import { IShelfFD } from "interfaces/edit/IShelfFD";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import { ICheckout } from "interfaces/edit/ICheckout";


export const connectPoints = ({ corners, closed }: { corners: Point[], closed: boolean }): Vector[] => {
    const vectors: Vector[] = [];
    if (corners.length < 2) { return [] }

    for (let i = 0; i < corners.length - 1; i++) {
        const a = corners[i];
        const b = corners[i + 1];
        const vector = new Vector(a, b);
        vectors.push(vector);
    }

    if (closed === true) {
        const a = corners[corners.length - 1];
        const b = corners[0];
        const vector = new Vector(a, b);
        vectors.push(vector);
    }
    return vectors;
}

export function movePolygonYCoordinate(outerPolygon: IPolygon, shelfs: IShelf[], stageHeight: number): { outerPolygon: IPolygon, shelfs: IShelf[] } {
    // Move the y coordinate of the outer polygon
    const transformedOuterCorners = outerPolygon.corners.map(point => new Point(point.x, stageHeight - point.y));
    const transformedOuterPolygon: IPolygon = { corners: transformedOuterCorners, closed: outerPolygon.closed };

    // Move the y coordinate of the shelfs
    const transformedShelfs: IShelf[] = shelfs.map(shelf => {
        const { x, y, width, height } = shelf.polygon;
        const corners = [
            new Point(x, stageHeight - y), // Top-left corner
            new Point(x + width, stageHeight - y), // Top-right corner
            new Point(x + width, stageHeight - (y + height)), // Bottom-right corner
            new Point(x, stageHeight - (y + height)) // Bottom-left corner
        ];
        return { ...shelf, corners: corners };
    });

    return { outerPolygon: transformedOuterPolygon, shelfs: transformedShelfs };
}

export function transformPointlistsToDomainpolygon(outerPolygon: IPolygon , shelfs: IShelf[], stageHeight: number): IDomainPolygon | undefined {
    // Check if the outer polygon is closed
    if (!outerPolygon.closed) {
        return undefined;
    }

    // Transform/ flip points at the x axis
    const transformedCoordinates = movePolygonYCoordinate(outerPolygon, shelfs, stageHeight)
    const transOuterPolygon = transformedCoordinates.outerPolygon
    const transShelfs = transformedCoordinates.shelfs
    const segmentPoints: number[] = [];
    const pointOrder: number[] = [];
    const holes: { "x": number, "y": number }[] = [];
    let numPoints = 0;
    let numSegments = 0;
    let numHoles = 0;

    // Process the outer polygon
    for (const point of transOuterPolygon.corners) {
        segmentPoints.push(point.x, point.y);
    }

    // Update the point order array
    const outerNumPoints = transOuterPolygon.corners.length;
    for (let i = 0; i < outerNumPoints; i++) {
        pointOrder.push(numPoints + i, numPoints + ((i + 1) % outerNumPoints));
        numSegments++;
    }
    numPoints += outerNumPoints;

    // Process shelfs
    for (const shelf of shelfs) {
        const { x, y, width, height } = shelf.polygon;
        const corners = [
            new Point(x, y), // Top-left corner
            new Point(x + width, y), // Top-right corner
            new Point(x + width, (y + height)), // Bottom-right corner
            new Point(x, (y + height)) // Bottom-left corner
        ];

        // Add the x and y coordinates of the inner points to the segment points array
        for (const point of corners) {
            segmentPoints.push(point.x, point.y);
        }

        // Update the point order array
        const innerNumPoints = corners.length;
        for (let i = 0; i < innerNumPoints; i++) {
            pointOrder.push(numPoints + i, numPoints + ((i + 1) % innerNumPoints));
            numSegments++;
        }
        numPoints += innerNumPoints;

        console.log("corners" + JSON.stringify(corners))
        // Calculate the point in the middle of the polygon (centroid)
        const centroidPoint = calculatePointInsidePolygon(corners);
        // Add the x and y coordinates of the middle point to the holes array
        holes.push({ "x": centroidPoint.x, "y": centroidPoint.y });
        numHoles++;
    }

    return {
        numberPoints: numPoints,
        segmentPoints: segmentPoints,
        numberSegments: numSegments,
        pointOrder: pointOrder,
        numberHoles: numHoles,
        holes: holes,
    };
}

export const transformDoorToEntrance = (doors: IDoor[], stageHeight: number): IConfigEntrance[] => {
    return doors.map(door => {
        return {
            wallId: door.wallId,
            name: door.name ? door.name : "entrance",
            xr: door.vector.a.x,
            yr: stageHeight - door.vector.a.y,
            xl: door.vector.b.x,
            yl: stageHeight - door.vector.b.y,
            personPerSecond: 0,
            maxPersons: 0,
        };
    });
}

export const transformCheckoutToExit = (checkouts: ICheckout[], stageHeight: number): IConfigExit[] => {
    return checkouts.map(checkout => {
        return {
            name: checkout.name ? checkout.name : "checkout",
            xr: 0,
            yr: 0,
            xl: 0,
            yl: 0,
            weight: 1
        };
    });
}

export const transformToConfigShelfs = (shelfs: IShelf[], stageHeight: number): IShelfFD[] => {
    return shelfs.map((shelf) => {
        const { polygon, name } = shelf;
        const { x, y, width, height } = polygon;
        const coordinates: number[] =
            [
                x, stageHeight - y,                       // Top-left corner (flipped y-coordinate)
                x + width, stageHeight - y,               // Top-right corner (flipped y-coordinate)
                x + width, stageHeight - (y + height),    // Bottom-right corner (flipped y-coordinate)
                x, stageHeight - (y + height)              // Bottom-left corner (flipped y-coordinate)
            ];
        return {
            Name: name,
            //Velocity: velocity,
            Polygon: coordinates
        };
    });
};

/*export const transformToConfigShelfs = (shelfs: IShelf[], stageHeight: number): IShelf[] => {
    return shelfs.map((shelf) => {
        const { polygon, name, id, text, selectedItems } = shelf;

        return {
            name: name,
            polygon: polygon,
            id: id,
            text: text,
            selectedItems: selectedItems,
        };
    });
};*/

export function transformFromConfigShelfs(shelfsFD: IShelfFD[], stageHeight: number): IShelf[] {
    return shelfsFD.map((shelfFD: IShelfFD) => {
        const polygon: IRect = {
            x: shelfFD.Polygon[0],
            y: stageHeight - shelfFD.Polygon[1] - (shelfFD.Polygon[5] - shelfFD.Polygon[1]),
            width: shelfFD.Polygon[2] - shelfFD.Polygon[0],
            height: shelfFD.Polygon[5] - shelfFD.Polygon[1],
        };

        const shelf: IShelf = {
            text: shelfFD.Name,
            //selectedItems: [],
            name: shelfFD.Name,
            id: nanoid(),
            polygon: polygon,
            hover: false
        };
        return shelf;
    });
}


export function areConfigsDifferent(
    computed: IeFlowFile | null,
    active: IeFlowFile | null
): boolean {
    // Check if both objects are null
    if (computed === null && active === null) {
        return false;
    }

    // Check if either object is null
    // no refetching if one is null
    if (computed === null || active === null) {
        return false;
    }

    // Compare the objects
    const stringifiedcomputed = JSON.stringify(computed);
    const stringifiedactive = JSON.stringify(active);
    return stringifiedcomputed !== stringifiedactive;
}

export function horiztontalDistanceBetweenOuterPoints(outerPolygon: IPolygon): { distance: number, maxx: number, minx: number } {
    const { corners } = outerPolygon;
    const xCoordinates = corners.map((corner: Point) => corner.x);
    const maxX = Math.max(...xCoordinates);
    const minX = Math.min(...xCoordinates);
    return { distance: maxX - minX, maxx: maxX, minx: minX };
}

export function getBounds(outerPolygon: IPolygon): { minX: number, maxX: number, minY: number, maxY: number } {
    const { corners } = outerPolygon;

    const yCoordinates = corners.map((corner: Point) => corner.y);
    const maxY = Math.max(...yCoordinates);
    const minY = Math.min(...yCoordinates);

    const xCoordinates = corners.map((corner: Point) => corner.x);
    const maxX = Math.max(...xCoordinates);
    const minX = Math.min(...xCoordinates);

    return { minX, maxX, minY, maxY };
}
