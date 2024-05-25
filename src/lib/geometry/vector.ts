import { nanoid } from "nanoid";
import { Point } from "./point";

class Vector {
    readonly id: string;
    a: Point;
    b: Point;
    angle: number;
    midPoint: Point;
    length: number;

    v_x: number;
    v_y: number;

    constructor(a: Point, b: Point) {
        this.id = a.id + b.id
        this.a = a;
        this.b = b;

        this.angle = Math.atan2(b.y - a.y, b.x - a.x) * (180 / Math.PI);
        this.length = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

        this.v_x = b.x - a.x;
        this.v_y = b.y - a.y;

        this.midPoint = new Point(
            (this.a.x + this.b.x) / 2,
            (this.a.y + this.b.y) / 2
        );
    }

    normalize() {
        this.v_x = this.v_x / this.length;
        this.v_y = this.v_y / this.length;
    }

    cross(vectorB: Vector) {
        return this.v_x * vectorB.v_y - vectorB.v_x * this.v_y;
    }

    dot(vectorB: Vector) {
        return this.v_x * vectorB.v_x + this.v_y * vectorB.v_y;
    }

    equals(vectorB: Vector) {
        return (
            (this.a.x === vectorB.a.x &&
                this.a.y === vectorB.a.y &&
                this.b.x === vectorB.b.x &&
                this.b.y === vectorB.b.y) ||
            (this.a.x === vectorB.b.x &&
                this.a.y === vectorB.b.y &&
                this.b.x === vectorB.a.x &&
                this.b.y === vectorB.a.y)
        );
    }

    setA(point: Point) {
        this.a = point;
        this.v_x = this.b.x - this.a.x;
        this.v_y = this.b.y - this.a.y;
        this.angle = Math.atan2(this.b.y - this.a.y, this.b.x - this.a.x) * (180 / Math.PI);
        this.length = Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
        this.midPoint = new Point(
            (this.a.x + this.b.x) / 2,
            (this.a.y + this.b.y) / 2
        );
    }

    setB(point: Point) {
        this.b = point;
        this.v_x = this.b.x - this.a.x;
        this.v_y = this.b.y - this.a.y;
        this.angle = Math.atan2(this.b.y - this.a.y, this.b.x - this.a.x) * (180 / Math.PI);
        this.length = Math.sqrt(Math.pow(this.b.x - this.a.x, 2) + Math.pow(this.b.y - this.a.y, 2));
        this.midPoint = new Point(
            (this.a.x + this.b.x) / 2,
            (this.a.y + this.b.y) / 2
        );
    }
}

export { Vector };
