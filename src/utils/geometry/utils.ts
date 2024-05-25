import { Point } from "lib/geometry/point";
import { Vector } from "lib/geometry/vector";

function dotProduct(a: Point, b: Point): number {
    return a.x * b.x + a.y * b.y;
}

function subtractPoints(a: Point | { x: number, y: number }, b: Point | { x: number, y: number }): Point {
    return new Point(a.x - b.x, a.y - b.y);
}

function multiplyPointByScalar(point: Point, scalar: number): Point {
    return new Point(point.x * scalar, point.y * scalar)
}

function getLineSegmentLength(lineSegment: Vector): number {
    const dx = lineSegment.b.x - lineSegment.a.x;
    const dy = lineSegment.b.y - lineSegment.a.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function projectPointToLineSegment(point: Point | { x: number, y: number }, lineSegment: Vector): Point {
    const lineSegmentVector = subtractPoints(lineSegment.b, lineSegment.a);
    const pointVector = subtractPoints(point, lineSegment.a);
    const lineSegmentLength = getLineSegmentLength(lineSegment);

    const projectionScalar = dotProduct(lineSegmentVector, pointVector) / (lineSegmentLength * lineSegmentLength);

    // Clamp the projectionScalar to keep it within the [0, 1] range
    const clampedScalar = Math.max(0, Math.min(1, projectionScalar));

    const projection = multiplyPointByScalar(lineSegmentVector, clampedScalar);
    return new Point(lineSegment.a.x + projection.x, lineSegment.a.y + projection.y)
}

export function calculatePointInsidePolygon(points: Point[]): Point {
    const numPoints = points.length;

    // Calculate centroid of the polygon
    let centroidX = 0;
    let centroidY = 0;
    let signedArea = 0;

    for (let i = 0; i < numPoints; i++) {
        const currentPoint = points[i];
        const nextPoint = points[(i + 1) % numPoints];

        const partialArea = (currentPoint.x * nextPoint.y) - (nextPoint.x * currentPoint.y);
        signedArea += partialArea;
        centroidX += (currentPoint.x + nextPoint.x) * partialArea;
        centroidY += (currentPoint.y + nextPoint.y) * partialArea;
    }

    signedArea *= 0.5;
    centroidX /= (6 * signedArea);
    centroidY /= (6 * signedArea);

    const centroidPoint = new Point(centroidX, centroidY);
    return centroidPoint;
};