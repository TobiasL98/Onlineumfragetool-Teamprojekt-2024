import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";
import { IRect } from "konva/lib/types";
import { calculatePointInsidePolygon } from "../geometry/utils";
import { nanoid } from "nanoid";
import { IMeasurementStations } from "interfaces/config/IMeasurementStations";
import {IDoor, IEntrance, IExit } from "interfaces/edit/IDoor";
import { ISubdomain } from "interfaces/edit/ISubdomain";
import { IPolygon } from "interfaces/edit/IPolygon";
import { IDomainPolygon } from "interfaces/edit/IDomainPolygon";
import { IConfigExit } from "interfaces/edit/IConfigExit";
import { IConfigEntrance } from "interfaces/edit/IConfigEntrance";
import { ISubdomainFD } from "interfaces/edit/ISubdomainFD";


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

// transform startAreas
/*export const transformToConfigStartAreas = (startAreaList: IStartArea[], stageHeight: number): ISubdomainRhoInit[] => {
    const coordinateList: number[][] = [];
    startAreaList.forEach((startArea) => {
        const { x, y, width, height } = startArea.rectangle;
        const coordinates: number[] = [
            x, stageHeight - y,                       // Top-left corner (flipped y-coordinate)
            x + width, stageHeight - y,               // Top-right corner (flipped y-coordinate)
            x + width, stageHeight - (y + height),    // Bottom-right corner (flipped y-coordinate)
            x, stageHeight - (y + height)              // Bottom-left corner (flipped y-coordinate)
        ];
        coordinateList.push(coordinates);
    });
    return coordinateList;
};

export function transformFromConfigStartareas(polygons: ISubdomainRhoInit[], stageHeight: number): IStartArea[] {
    return polygons.map((polygon: ISubdomainRhoInit) => {
        const rect: IRect = {
            x: polygon[0],
            y: stageHeight - polygon[1] - (polygon[5] - polygon[1]), // Flip the y-coordinate
            width: polygon[2] - polygon[0],
            height: polygon[5] - polygon[1]
        };
        const startArea: IStartArea = {
            name: "startArea",
            id: nanoid(),
            rectangle: rect,
            hover: false
        };
        return startArea;
    });
}*/

/*export const transformToConfigSubdomains = (subdomains: ISubdomain[], stageHeight: number): ISubdomainFD[] => {
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

export function transformFromConfigSubdomains(subdomainsFD: ISubdomainFD[], stageHeight: number): ISubdomain[] {
    return subdomainsFD.map((subdomainFD: ISubdomainFD) => {
        const polygon: IRect = {
            x: subdomainFD.Polygon[0],
            y: stageHeight - subdomainFD.Polygon[1] - (subdomainFD.Polygon[5] - subdomainFD.Polygon[1]),
            width: subdomainFD.Polygon[2] - subdomainFD.Polygon[0],
            height: subdomainFD.Polygon[5] - subdomainFD.Polygon[1],
        };

        const subdomain: ISubdomain = {
            name: subdomainFD.Name,
            id: nanoid(),
            //velocity: subdomainFD.Velocity,
            polygon: polygon,
            hover: false
        };
        return subdomain;
    });
}

export function transformToConfigMeasurementstations(measurementLines: Vector[], stageHeight: number): IMeasurementStations[] {
    const configStations = measurementLines.map((line) => {
        return {
            id: line.id,
            xr: line.a.x,
            yr: stageHeight - line.a.y,
            xl: line.b.x,
            yl: stageHeight - line.b.y,
        };
    });
    return configStations;
}*/

/*export function transformFromConfigMeasurementstations(measurementstations: IMeasurementStations[] | [], stageHeight: number): Vector[] {
    const lines = measurementstations.map((station) => {
        const measureLine = new Vector(new Point(station.xr, stageHeight - station.yr), new Point(station.xl, stageHeight - station.yl))
        return measureLine
    });
    return lines;
}*/

/*export function transformToConfigAttractors(attractors: IAttractor[], stageHeight: number): IConfigAttractor[] {
    const configAttractors = attractors.map((attractor) => {
        return {
            xr: attractor.vector.a.x,
            yr: stageHeight - attractor.vector.a.y,
            xl: attractor.vector.b.x,
            yl: stageHeight - attractor.vector.b.y,
            name: attractor.name,
            strength: attractor.strength,
            range: attractor.range,
            frequency: attractor.frequency,
        };
    });
    return configAttractors;
}*/

/*export function transformFromConfigAttractors(configAttractors: IConfigAttractor[] | [], stageHeight: number): IAttractor[] {
    const attractors = configAttractors.map((configAttractor) => {
        const vector = new Vector(new Point(configAttractor.xr, stageHeight - configAttractor.yr), new Point(configAttractor.xl, stageHeight - configAttractor.yl))
        return {
            vector: vector,
            name: configAttractor.name ? configAttractor.name : "attractor",
            strength: configAttractor.strength,
            range: configAttractor.range,
            frequency: configAttractor.frequency,
            hover: false
        }

    });
    return attractors;
}*/

/*export function normalizeInfectionValues(infectionParams: IInfectionParameter): IInfectionParameter {
    const { percentInfected, percentRemoved, infectionRate } = infectionParams;

    const normalizedPercentInfected = percentInfected / 100;
    const normalizedPercentRemoved = percentRemoved / 100;
    const normalizedInfection = infectionRate / 100;

    return {
        ...infectionParams,
        percentInfected: normalizedPercentInfected,
        percentRemoved: normalizedPercentRemoved,
        infectionRate: normalizedInfection,
    };
}*/

/*export function denormalizeInfectionValues(infectionParams: IInfectionParameter): IInfectionParameter {
    const { percentInfected, percentRemoved, infectionRate } = infectionParams;

    const denormalizedPercentInfected = percentInfected * 100;
    const denormalizedPercentRemoved = percentRemoved * 100;
    const denormalizedInfection = infectionRate * 100;

    return {
        ...infectionParams,
        percentInfected: denormalizedPercentInfected,
        percentRemoved: denormalizedPercentRemoved,
        infectionRate: denormalizedInfection,
    };
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
}*/

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
