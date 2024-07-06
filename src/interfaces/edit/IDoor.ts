import { Vector } from "lib/geometry/vector";


export interface IDoor {
    type:  "entrance";
    wallId: string;
    name: string;
    vector: Vector;
    hover: Boolean;
}

/*export interface IExit extends IDoor {
    type: 'exit';
    weight: number;
}*/

export interface IEntrance extends IDoor {
    type: 'entrance';
    //personPerSecond: number;
    //maxPersons: number;
}