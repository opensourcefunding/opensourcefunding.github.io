import { ChartData, ChartDisplayType } from '../chart';

export const value = (entry: ChartData, display: ChartDisplayType): string => (display === 'relative')
    ? entry.percent.toString() + '%'
    : entry.value.toString();
