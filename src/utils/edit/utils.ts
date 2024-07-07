import { IRect } from "konva/lib/types";
import { nanoid } from "nanoid";

import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { calculatePointInsidePolygon } from "../geometry/utils";
import {IDoor} from "interfaces/edit/IDoor";
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

export function movePolygonYCoordinate(outerPolygon: IPolygon, shelfs: IShelf[], checkouts: ICheckout[], stageHeight: number): { outerPolygon: IPolygon, shelfs: IShelf[], checkouts: ICheckout[]} {
    // Move the y coordinate of the outer polygon
    const transformedOuterCorners = outerPolygon.corners.map(point => new Point(point.x, stageHeight - point.y));
    const transformedOuterPolygon: IPolygon = { corners: transformedOuterCorners, closed: outerPolygon.closed };

    // Move the y coordinate of the shelfs
    const transformedShelfs: IShelf[] = shelfs.map(shelf => {
        const newY = stageHeight - shelf.polygon.y;
        return { ...shelf, polygon: { ...shelf.polygon, y: newY } };
    });

    // Move the y coordinate of the checkouts
    const transformedCheckouts: ICheckout[] = checkouts.map(checkout => {
        const newY = stageHeight - checkout.polygon.y;
        return { ...checkout, polygon: { ...checkout.polygon, y: newY } };
    });

    return { outerPolygon: transformedOuterPolygon, shelfs: transformedShelfs, checkouts: transformedCheckouts};
}

export function calculateCorners(polygon: IShelf | ICheckout): Point[] {
    const { x, y, width, height, rotation } = polygon.polygon;

    let shelfCorners: Point[] = [];

    // Taking shelf rotation into consideration
    if (rotation && rotation !== 0) {
        const angleInRadians = rotation * Math.PI / 180;

        // Top-left corner (rotation point)
        const topLeft = new Point(x, y);

        // Calculate other corners considering rotation
        const topRight = new Point(
            x - width * Math.cos(angleInRadians),
            y - width * Math.sin(angleInRadians)
        );
        const bottomRight = new Point(
            x - width * Math.cos(angleInRadians) - height * Math.sin(angleInRadians),
            y - width * Math.sin(angleInRadians) + height * Math.cos(angleInRadians)
        );
        const bottomLeft = new Point(
            x - height * Math.sin(angleInRadians),
            y + height * Math.cos(angleInRadians)
        );

        shelfCorners = [topLeft, topRight, bottomRight, bottomLeft];
    } else {
        shelfCorners = [
            new Point(x, y), // Top-left corner
            new Point(x + width, y), // Top-right corner
            new Point(x + width, (y - height)), // Bottom-right corner
            new Point(x, (y - height)) // Bottom-left corner
        ];
    }
    return shelfCorners;
}

export function transformPointlistsToDomainpolygon(outerPolygon: IPolygon , shelfs: IShelf[],  checkouts: ICheckout[],  stageHeight: number): IDomainPolygon | undefined {
    // Check if the outer polygon is closed
    if (!outerPolygon.closed) {
        return undefined;
    }

    // Transform/ flip points at the x axis
    const transformedCoordinates = movePolygonYCoordinate(outerPolygon, shelfs, checkouts, stageHeight)
    const transOuterPolygon = transformedCoordinates.outerPolygon
    const transShelfs = transformedCoordinates.shelfs
   // const transCheckout = transformedCoordinates.checkouts
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
    for (const shelf of transShelfs) {
        const shelfCorners = calculateCorners(shelf);

        // Add the x and y coordinates of the inner points to the segment points array
        for (const point of shelfCorners) {
            segmentPoints.push(point.x, point.y);
        }

        // Update the point order array
        const innerNumPoints = shelfCorners.length;
        for (let i = 0; i < innerNumPoints; i++) {
            pointOrder.push(numPoints + i, numPoints + ((i + 1) % innerNumPoints));
            numSegments++;
        }
        numPoints += innerNumPoints;

        // Calculate the point in the middle of the shelf polygon (centroid)
        const centroidPoint = calculatePointInsidePolygon(shelfCorners);

        // Add the x and y coordinates of the middle point to the holes array
        holes.push({ "x": centroidPoint.x, "y": centroidPoint.y });
        numHoles++;
    }

    /*
    // Process checkouts here to be able to verify the correctness of the checkout corners transformation
    for (const checkout of transCheckout) {
        const checkoutCorners = calculateCorners(checkout);

        // Add the x and y coordinates of the inner points to the segment points array
        for (const point of checkoutCorners) {
            segmentPoints.push(point.x, point.y);
        }

        // Update the point order array
        const innerNumPoints = checkoutCorners.length;
        for (let i = 0; i < innerNumPoints; i++) {
            pointOrder.push(numPoints + i, numPoints + ((i + 1) % innerNumPoints));
            numSegments++;
        }
        numPoints += innerNumPoints;

        // Calculate the point in the middle of the checkout polygon (centroid)
        const centroidPoint = calculatePointInsidePolygon(checkoutCorners);

        // Add the x and y coordinates of the middle point to the holes array
        holes.push({ "x": centroidPoint.x, "y": centroidPoint.y });
        numHoles++;
    }*/

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

   //Process checkout corners (to later be able to determine the weighted Vector of the Exit from the checkout corners)
    // Move the y coordinate of the checkouts
   /* const transformedCheckouts: ICheckout[] = checkouts.map(checkout => {
        const newY = stageHeight - checkout.polygon.y;
        return { ...checkout, polygon: { ...checkout.polygon, y: newY } };
    });
    for (const checkout of transformedCheckouts) {
       const checkoutCorners = calculateCorners(checkout);
   }*/

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
        console.log("x: " + x + " y: " + y + " width: " + width + " height: " + height)
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
