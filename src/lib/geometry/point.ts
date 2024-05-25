import { nanoid } from "nanoid";

class Point {
    readonly id: string;
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.id = nanoid();
        this.x = x;
        this.y = y;
    }

    equals(pointB: Point) {
        return this.x === pointB.x && this.y === pointB.y;
    }

    distance(pointB: Point): number {
        const dx = pointB.x - this.x;
        const dy = pointB.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

export { Point };
