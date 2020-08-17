import { ChartDisplayType } from '../chart';

export const toolbar = (display: ChartDisplayType) => `
<div class="toolbar">
    <slot name="title" class="description"></slot>
    <button data-action="toggle-display">
        <ui-icon icon="${ (display === 'relative') ? 'user' : 'percentage' }"></ui-icon>
        ${ (display === 'relative') ? 'Count' : 'Percentage' }
    </button>
</div>
`;
