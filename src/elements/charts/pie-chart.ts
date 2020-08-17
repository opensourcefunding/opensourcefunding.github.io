import { arc, polarToCartesian } from '../../svg-arc';
import { Chart, ChartData } from './chart';
import { chart } from './styles/chart.style';
import { entryColor, legend } from './templates/legend.template';
import { toolbar } from './templates/toolbar.template';
import { value } from './templates/value.template';

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
${ chart() }

.chart {
    max-height: 100%;
    max-width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    align-self: center;
    font-size: 1rem;
    box-sizing: border-box;
}

.chart>.value {
    position: absolute;
    color: var(--color-primary-contrast);
    text-align: center;
    font-weight: bold;
    line-height: 1.5rem;
    transform: translate(-50%, -50%);
    text-shadow: 0 0 .25rem rgba(0, 0, 0, .25);
    pointer-events: none;
    user-select: none;
}

.chart>svg {
    min-width: 20rem;
    min-height: 20rem;
    overflow: visible;
    fill: var(--color-primary);
}
.chart>svg>path {
    fill: var(--color-secondary);
}
.chart>svg>path:first-of-type {
    fill: var(--color-primary);
}
.chart>svg>.outline {
    fill: transparent;
    stroke: transparent;
    stroke-width: var(--border-width);
    transition: fill 250ms, stroke 250ms;
}
.chart>svg>.outline:hover,
.chart>svg>.outline.active {
    fill: rgba(255, 255, 255, .05);
    stroke: var(--outline-color-highlight);
}
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

export interface PieChartData extends ChartData {
    startAngle: number;
    endAngle: number;
    center: {
        x: number;
        y: number
    };
    path: string;
}

export class PieChart extends Chart {

    static style = STYLE;

    data: PieChartData[] = [];

    radius = 120;

    connectedCallback () {

        // this.radius = Math.min(this.scrollHeight, this.scrollWidth) / 2;

        super.connectedCallback();
    }

    protected template () {

        return template(this);
    }

    protected parseData () {

        let angle = -90;

        const dataElements = [...this.querySelectorAll('chart-data')];

        this.data = dataElements.map(element => {

            const value = parseFloat(element.getAttribute('value') ?? '0');
            const percent = Math.round(value / this.total * 1000) / 10;
            const radius = this.radius;
            const center = { x: radius, y: radius };
            const startAngle = angle;
            const endAngle = angle + percent / 100 * 360;

            const entry = {
                value,
                percent,
                label: element.getAttribute('label') ?? '',
                description: element.textContent ?? '',
                startAngle,
                endAngle,
                center: polarToCartesian(center, radius / 2, startAngle + (endAngle - startAngle) / 2),
                path: arc(center, radius, 0, startAngle, endAngle),
            };

            // update the last angle
            angle = entry.endAngle;

            // save the max values to scale the graph to the component size
            this.maxValue = Math.max(value, this.maxValue);
            this.maxPercent = Math.max(percent, this.maxPercent);

            return entry;
        });
    }
}

const template = (chart: PieChart) => {

    const data = chart.data;
    const display = chart.display;
    const radius = chart.radius;
    const center = { x: radius, y: radius };

    return `
    ${ toolbar(display) }
    <figure>
        <div class="chart" role="presentation">

            <svg width="${ radius * 2 }" height="${ radius * 2 }" viewBox="0 0 ${ radius * 2 } ${ radius * 2 }" preserveAspectRatio="xMidYMid meet">
                <circle cx="${ center.x }" cy="${ center.y }" r="${ radius }"/>
                ${ data.map(entry => `<path d="${ entry.path }"/>`).join('\n') }

                ${ data.map(entry => `<path class="outline entry" d="${ entry.path }"/>`).join('\n') }
            </svg>

            ${ data.map(entry => `<div class="value" style="top: ${ entry.center.y }px; left: ${ entry.center.x }px">${ value(entry, display) }<br>${ entry.label }</div>`).join('\n') }

        </div>
        ${ legend(data, display, entryColor) }
    </figure>`;
};

customElements.define('pie-chart', PieChart);
