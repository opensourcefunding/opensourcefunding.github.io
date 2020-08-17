import { ChartData, ChartDisplayType } from '../chart';
import { value } from './value.template';

export const legend = (data: ChartData[], display: ChartDisplayType, entryTemplate: (entry: ChartData, display: ChartDisplayType) => string = entryLabel) => `
<figcaption class="legend">
    ${ data.map(entry => entryTemplate(entry, display)).join('\n') }
</figcaption>
`;

export const entryColor = (entry: ChartData, display: ChartDisplayType) => `
<div class="entry">
    <div class="color"></div>
    <div class="value">${ value(entry, display) }</div>
    <div class="description">${ entry.description }</div>
</div>
`;

export const entryLabel = (entry: ChartData, display: ChartDisplayType) => `
<div class="entry">
    <div class="label">${ entry.label }:</div>
    <div class="description">${ entry.description }</div>
</div>
`;
