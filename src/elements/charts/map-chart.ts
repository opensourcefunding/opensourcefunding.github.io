import { Chart } from './chart';
import { axis as axisStyle } from './styles/axis.style';
import { chart } from './styles/chart.style';
import { axis } from './templates/axis.template';
import { map } from './templates/map.template';
import { value } from './templates/value.template';

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
${ chart() }
${ axisStyle() }

.toolbar>button:first-of-type {
    margin-left: auto;
}

figure {
    position: relative;
}

.chart {
    margin: 0 -2rem;
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: scroll;
}

.chart>svg {
    width: calc(var(--width) + 4rem);
    fill: var(--outline-color-highlight);
    fill-opacity: .5;
}

.chart>svg .highlight {
    fill: var(--color-primary);
    stroke-width: var(--border-width);
    stroke: transparent;
    transition: stroke 250ms;
}
.chart>svg .highlight:hover,
.chart>svg .highlight.active {
    stroke: var(--outline-color-highlight);
}

:host([type=bar]) .chart {
    min-height: 20rem;
    margin: 3rem 0 0 8rem;
    overflow: initial;
    font-size: 1rem;
}
:host([type=bar]) .chart .data {
    position: relative;
    padding: .5rem 0;
    flex: 1 1 auto;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    box-sizing: border-box;
}
:host([type=bar]) .chart .bar {
    position: relative;
    padding: .25rem 0;
    height: 3rem;
    width: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: visible;
    font-weight: bold;
    box-sizing: border-box;
    background-color: var(--color-primary);
    box-shadow:
        inset 0 0 0 3rem transparent,
        inset 0 0 0 var(--border-width) transparent;
    text-shadow: 0 0 .25rem rgba(0, 0, 0, .25);
    transition: box-shadow 250ms;
}
:host([type=bar]) .chart .bar:hover,
:host([type=bar]) .chart .bar.active {
    box-shadow:
        inset 0 0 0 3rem rgba(255, 255, 255, .05),
        inset 0 0 0 var(--border-width) var(--outline-color-highlight);
}
:host([type=bar]) .chart .value {
    position: absolute;
    color: var(--color-primary-contrast);
    pointer-events: none;
    user-select: none;
}
:host([type=bar]) .chart .label {
    position: absolute;
    right: 100%;
    margin: 0 .5rem 0 0;
    padding: .5rem .25rem;
    max-width: 8rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    pointer-events: none;
    user-select: none;
    box-sizing: border-box;
}

.mini-legend {
    display: flex;
    flex-flow: column;
    font-size: 1rem;
    color: var(--color-text-secondary);
    position: absolute;
    top: 16rem;
    pointer-events: none;
    user-select: none;
}
.mini-legend>.entry {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
}
.mini-legend>.entry>.color {
    --opacity: 0;
    width: 2rem;
    height: 1rem;
    margin-right: 1rem;
    background-color: var(--background-color);
    box-shadow: inset 0 0 0 2rem rgba(30, 144, 255, var(--opacity));
}
:host([type=bar]) .mini-legend {
    display: none;
}

.current {
    position: absolute;
    bottom: 0;
    margin-bottom: -3rem;
    padding: 0 1rem;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-flow: row nowrap;
    border-radius: var(--border-radius);
    transition: background-color 250ms, box-shadow 250ms;
}
.current.active {
    background-color: var(--background-color-highlight);
    box-shadow: 0 -.5rem 0 0 var(--background-color-highlight),
    0 .5rem 0 0 var(--background-color-highlight);
}
.current>.description {
    margin-right: .5rem;
}
.current>.value {
    font-weight: bold;
}
:host([type=bar]) .current {
    display: none;
}

@media (min-width: 50ch) {

    :host([type=bar]) .chart {
        margin-left: 12rem;
    }
    :host([type=bar]) .chart .label {
        max-width: 12rem;
    }
}

@media (prefers-color-scheme: dark) {

    .chart>svg {
        fill-opacity: .1;
    }
}
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

const opacities: { [key: string]: string; } = {
    '0': '.1',
    '1': '.2',
    '2': '.4',
    '3': '.6',
    '5': '.8',
    '8': '1',
};

export class MapChart extends Chart {

    static style = STYLE;

    static get observedAttributes () {

        return [...super.observedAttributes, 'type'];
    }

    type: 'map' | 'bar' = 'map';

    attributeChangedCallback (name: string, oldValue: any, newValue: any) {

        if (name === 'type') {

            this.type = (newValue === 'map') ? 'map' : 'bar';

        } else {

            super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    toggleType () {

        this.setAttribute('type', (this.type === 'map') ? 'bar' : 'map');

        this.render();
    }

    protected template () {

        return template(this);
    }

    protected updateBindings () {

        super.updateBindings();

        this.shadowRoot?.querySelector('[data-action=toggle-type]')?.addEventListener('click', () => this.toggleType());

        const current = this.shadowRoot?.querySelector('.current')!;

        this.data.forEach((entry, index) => {

            const country = this.shadowRoot!.querySelector(`#${ entry.label.toLowerCase() }`);

            country?.setAttribute('fill-opacity', opacities[entry.value.toString()] ?? opacities['0']);
            country?.classList.add('highlight', 'entry');

            country?.addEventListener('mouseenter', () => {
                current.innerHTML = `<span class="description">${ entry.description }:</span><span class="value">${ this.display === 'relative' ? entry.percent + '%' : entry.value }</span>`;
                current.classList.add('active');
            });

            country?.addEventListener('mouseleave', () => {
                current.innerHTML = '&nbsp;';
                current.classList.remove('active');
            });
        });
    }
}

const template = (chart: MapChart) => {

    const data = chart.data;
    const display = chart.display;

    const max = (display === 'relative')
        ? (Math.ceil(chart.maxPercent / 10)) * 10
        : (Math.ceil(chart.maxValue / 5)) * 5;

    return `
<div class="toolbar">
    <slot name="title" class="description"></slot>
    <button data-action="toggle-type">
        <ui-icon icon="${ (chart.type === 'map') ? 'leaderboard' : 'world' }"></ui-icon>
        ${ (chart.type === 'map') ? 'Chart' : 'Map' }
    </button>
    <button data-action="toggle-display">
        <ui-icon icon="${ (chart.display === 'relative') ? 'user' : 'percentage' }"></ui-icon>
        ${ (chart.display === 'relative') ? 'Count' : 'Percentage' }
    </button>
</div>
<figure>
    <div class="chart" role="presentation">
        ${
        chart.type === 'map'
            ? map()
            : axis(chart.maxValue, chart.maxPercent, chart.display, 'horizontal') + chart.data.map(entry => `

            <div class="data">
                <div class="bar entry" style="width: ${ (display === 'relative' ? entry.percent : entry.value) / max * 100 }%;">
                    <div class="value">${ value(entry, display) }</div>
                </div>
                <div class="label">${ entry.description }</div>
            </div>`).join('\n')
        }
    </div>
    <div class="mini-legend" role="presentation">
        ${ Object.entries(opacities).map(entry => `<div class="entry"><div class="color" style="--opacity: ${ entry[1] }"></div><div class="description">${ entry[0] }</div></div>`).join('\n') }
    </div>
    <div class="current">&nbsp;</div>
</figure>`;
};

customElements.define('map-chart', MapChart);
