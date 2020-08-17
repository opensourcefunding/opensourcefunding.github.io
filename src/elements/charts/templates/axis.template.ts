import { ChartDisplayType } from '../chart';

export const axis = (maxValue: number, maxPercent: number, display: ChartDisplayType, orientation: 'vertical' | 'horizontal' = 'vertical') => {

    const spread = (display === 'absolute') ? 5 : 10;
    const max = (display === 'absolute') ? maxValue / spread : maxPercent / spread;

    const entries = [...Array(Math.ceil(max) + 1)].map((value, index) => index * spread);

    const maxEntry = entries[entries.length - 1];

    return `${ entries.map(y => `<div class="axis ${ orientation }" data-label="${ y }${ display === 'relative' ? '%' : '' }" style="${ orientation === 'vertical' ? `bottom: ${ y / maxEntry * 100 }%;` : `left: ${ y / maxEntry * 100 }%;`}"></div>`).join('\n') }`;
};
