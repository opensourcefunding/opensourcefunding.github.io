interface Point {
    x: number;
    y: number;
}

const DEGREE_TO_RADIAN = Math.PI / 180;

export const polarToCartesian = (center: Point, radius: number, angle: number): Point => {

    const radians = angle * DEGREE_TO_RADIAN;

    return {
        x: center.x + radius * Math.cos(radians),
        y: center.y + radius * Math.sin(radians),
    };
};

export const arc = (center: Point, outerRadius: number, innerRadius: number, startAngle: number, endAngle: number): string => {

    const outerStart = polarToCartesian(center, outerRadius, startAngle);
    const outerEnd = polarToCartesian(center, outerRadius, endAngle);
    const innerStart = polarToCartesian(center, innerRadius, startAngle);
    const innerEnd = polarToCartesian(center, innerRadius, endAngle);

    const largeArcFlag = (endAngle - startAngle <= 180) ? 0 : 1;
    const outerSweepFlag = (endAngle > startAngle) ? 1 : 0;
    const innerSweepFlag = (outerSweepFlag === 1) ? 0 : 1;
    const xAxisRotation = 0;

    const path = [
        'M', outerStart.x, outerStart.y,
        'A', outerRadius, outerRadius, xAxisRotation, largeArcFlag, outerSweepFlag, outerEnd.x, outerEnd.y,
        'L', innerEnd.x, innerEnd.y,
        'A', innerRadius, innerRadius, xAxisRotation, largeArcFlag, innerSweepFlag, innerStart.x, innerStart.y,
        'Z',
    ].join(' ');

    return path;
};
