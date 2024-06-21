import { IRect } from "konva/lib/types";
import { nanoid } from "nanoid";

import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { calculatePointInsidePolygon } from "../geometry/utils";
import {IDoor, IEntrance, IExit } from "interfaces/edit/IDoor";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IDomainPolygon } from "interfaces/edit/IDomainPolygon";
import { IConfigExit } from "interfaces/edit/IConfigExit";
import { IConfigEntrance } from "interfaces/edit/IConfigEntrance";
import { ISubdomainFD } from "interfaces/edit/ISubdomainFD";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";


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

export function movePolygonYCoordinate(outerPolygon: IPolygon, innerPolygons: IPolygon[], stageHeight: number): { outerPolygon: IPolygon, innerPolygons: IPolygon[] } {
    // Move the y coordinate of the outer polygon
    const transformedOuterCorners = outerPolygon.corners.map(point => new Point(point.x, stageHeight - point.y));
    const transformedOuterPolygon: IPolygon = { corners: transformedOuterCorners, closed: outerPolygon.closed };

    // Move the y coordinate of the inner polygons
    const transformedInnerPolygons: IPolygon[] = innerPolygons.map(innerPolygon => {
        const transformedInnerCorners = innerPolygon.corners.map(point => new Point(point.x, stageHeight - point.y));
        return { corners: transformedInnerCorners, closed: innerPolygon.closed };
    });

    return { outerPolygon: transformedOuterPolygon, innerPolygons: transformedInnerPolygons };
}

export function transformPointlistsToDomainpolygon(outerPolygon: IPolygon, innerPolygons: IPolygon[], stageHeight: number): IDomainPolygon | undefined {
    // Check if the outer polygon is closed
    if (!outerPolygon.closed) {
        return undefined;
    }

    // Transform/ flip points at the x axis
    const transformedCoordinates = movePolygonYCoordinate(outerPolygon, innerPolygons, stageHeight)
    const transOuterPolygon = transformedCoordinates.outerPolygon
    const transInnerPolygon = transformedCoordinates.innerPolygons
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

    // Process inner polygons
    for (const innerPolygon of transInnerPolygon) {
        // Check if the inner polygon is closed
        if (!innerPolygon.closed) {
            continue
        }

        // Add the x and y coordinates of the inner points to the segment points array
        for (const point of innerPolygon.corners) {
            segmentPoints.push(point.x, point.y);
        }

        // Update the point order array
        const innerNumPoints = innerPolygon.corners.length;
        for (let i = 0; i < innerNumPoints; i++) {
            pointOrder.push(numPoints + i, numPoints + ((i + 1) % innerNumPoints));
            numSegments++;
        }
        numPoints += innerNumPoints;

        // Calculate the point in the middle of the polygon (centroid)
        const centroidPoint = calculatePointInsidePolygon(innerPolygon.corners);
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

// add if branch for exits/ entrees
export const splitDoorsToExitEntrances = (doors: IDoor[], stageHeight: number): { exits: IConfigExit[], entrances: IConfigEntrance[] } => {
    const exits = doors.filter((door) => {
        if (door.type === "entrance") { return false }
        return true
    }).map((door) => {
        const exit = (door as IExit)
        return {
            wallId: exit.wallId,
            name: exit.name ? exit.name : "exit",
            xr: exit.vector.a.x,
            yr: stageHeight - exit.vector.a.y,
            xl: exit.vector.b.x,
            yl: stageHeight - exit.vector.b.y,
            weight: exit.weight
        }
    })

    const entrances = doors.filter((door) => {
        if (door.type === "exit") { return false }
        return true
    }).map((door) => {
        const entrance = (door as IEntrance)
        return {
            wallId: entrance.wallId,
            name: entrance.name ? entrance.name : "entrance",
            xr: entrance.vector.a.x,
            yr: stageHeight - entrance.vector.a.y,
            xl: entrance.vector.b.x,
            yl: stageHeight - entrance.vector.b.y,
            personPerSecond: entrance.personPerSecond,
            maxPersons: entrance.maxPersons,
        }
    })
    return { exits, entrances }
}

export const mergeExitNEntreesToDoors = ({ exits, entrances, stageHeight }: { exits?: IConfigExit[], entrances?: IConfigEntrance[], stageHeight: number }): IDoor[] => {
    const mergedDoors: IDoor[] = []

    if (exits) {
        exits.forEach(exit => {
            const newExit: IExit = {
                type: "exit",
                wallId: exit.wallId,
                name: exit.name ? exit.name : "exit",
                vector: new Vector(new Point(exit.xr, stageHeight - exit.yr), new Point(exit.xl, stageHeight - exit.yl)),
                weight: exit.weight,
                hover: false,
            }
            mergedDoors.push(newExit)
        });
    }

    if (entrances) {
        entrances.forEach(entrance => {
            const newEntrance: IEntrance = {
                type: "entrance",
                wallId: entrance.wallId,
                name: entrance.name ? entrance.name : "entrance",
                vector: new Vector(new Point(entrance.xr, stageHeight - entrance.yr), new Point(entrance.xl, stageHeight - entrance.yl)),
                personPerSecond: entrance.personPerSecond,
                maxPersons: entrance.maxPersons,
                hover: false,
            }
            mergedDoors.push(newEntrance)
        });
    }
    return mergedDoors
}

/*export const transformToConfigSubdomains = (subdomains: ISubdomain[], stageHeight: number): ISubdomain[] => {
    return subdomains.map((subdomain) => {
        const { polygon, name, id, text, selectedItems } = subdomain;

        return {
            name: name,
            polygon: polygon,
            id: id,
            text: text,
            selectedItems: selectedItems,
        };
    });
};*/

export const transformToConfigSubdomains = (subdomains: ISubdomain[], stageHeight: number): ISubdomainFD[] => {
    console.log("subdomain" + subdomains)
    return subdomains.map((subdomain) => {
        const { polygon, name } = subdomain;
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

/*export const transformToConfigSubdomains = (subdomains: ISubdomain[], stageHeight: number): ISubdomain[] => {
    return subdomains.map((subdomain) => {
        const { polygon, name, id, text, selectedItems } = subdomain;

        return {
            name: name,
            polygon: polygon,
            id: id,
            text: text,
            selectedItems: selectedItems,
        };
    });
};*/

export function transformFromConfigSubdomains(subdomainsFD: ISubdomainFD[], stageHeight: number): ISubdomain[] {
    return subdomainsFD.map((subdomainFD: ISubdomainFD) => {
        const polygon: IRect = {
            x: subdomainFD.Polygon[0],
            y: stageHeight - subdomainFD.Polygon[1] - (subdomainFD.Polygon[5] - subdomainFD.Polygon[1]),
            width: subdomainFD.Polygon[2] - subdomainFD.Polygon[0],
            height: subdomainFD.Polygon[5] - subdomainFD.Polygon[1],
        };

        const subdomain: ISubdomain = {
            text: subdomainFD.Name,
            selectedItems: [],
            name: subdomainFD.Name,
            id: nanoid(),
            //velocity: subdomainFD.Velocity,
            polygon: polygon,
            hover: false
        };
        return subdomain;
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
