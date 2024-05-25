export interface IDomainPolygon {
    numberPoints: number;
    segmentPoints: number[];
    numberSegments: number;
    pointOrder: number[];
    numberHoles: number;
    holes: { "x": number, "y": number }[];
};
