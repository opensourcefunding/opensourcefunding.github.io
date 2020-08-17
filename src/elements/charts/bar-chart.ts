import { Chart } from './chart';
import { chart } from './styles/chart.style';
import { axis as axisStyle } from './styles/axis.style';
import { legend } from './templates/legend.template';
import { toolbar } from './templates/toolbar.template';
import { value } from './templates/value.template';
import { axis } from './templates/axis.template';

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
${ chart() }
${ axisStyle() }

.chart {
    min-height: 20rem;
    margin: 0 0 3rem 3rem;
    position: relative;
    display: flex;
    flex-flow: row nowrap;
    flex: 1 1 auto;
    font-size: 1rem;
    box-sizing: border-box;
}

:host(.dense) .chart {
    margin-bottom: 6rem;
    transition: margin 250ms;
}

.chart .data {
    position: relative;
    padding: 0 .5rem;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    box-sizing: border-box;
}
.chart .bar {
    position: relative;
    padding: 0 .25rem;
    width: 100%;
    max-width: 6rem;
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
.chart .bar:hover,
.chart .bar.active {
    box-shadow:
        inset 0 0 0 3rem rgba(255, 255, 255, .05),
        inset 0 0 0 var(--border-width) var(--outline-color-highlight);
}
.chart .value {
    position: absolute;
    color: var(--color-primary-contrast);
    pointer-events: none;
    user-select: none;
}
:host(.dense:not([display=absolute])) .chart .value {
    transform: rotate(-90deg);
    transition: transform 250ms;
}
.chart .label {
    position: absolute;
    max-width: 100%;
    padding: .5rem .25rem;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: -3rem;
    pointer-events: none;
    user-select: none;
}
:host(.dense) .chart .label {
    max-width: none;
    text-align: right;
    transform: translate(-50%, 0px) rotate(-45deg);
    transform-origin: top right;
    transition-property: transform, text-align;
    transition-duration: 250ms;
}

@media (min-width: 50ch) {

    :host(.dense) .chart {
        margin-bottom: 3rem;
    }
    :host(.dense:not([display=absolute])) .chart .value {
        transform: rotate(0deg);
    }
    :host(.dense) .chart .label {
        max-width: 100%;
        text-align: center;
        transform: rotate(0deg) translate(0, 0);
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

export class BarChart extends Chart {

    static style = STYLE;

    protected template () {

        return template(this);
    }
}

const template = (chart: BarChart) => {

    const data = chart.data;
    const display = chart.display;

    const max = (display === 'relative')
        ? (Math.ceil(chart.maxPercent / 10)) * 10
        : (Math.ceil(chart.maxValue / 5)) * 5;

    return `
    ${ toolbar(display) }
    <figure>
        <div class="chart" role="presentation">

            ${ axis(chart.maxValue, chart.maxPercent, chart.display) }

            ${ chart.data.map(entry => `
                <div class="data">
                    <div class="bar entry" style="height: ${ (display === 'relative' ? entry.percent : entry.value) / max * 100 }%;">
                        <div class="value">${ value(entry, display) }</div>
                    </div>
                    <div class="label">${ entry.label }</div>
                </div>`).join('\n') }

        </div>
        ${ legend(data, display) }
    </figure>`;
};

customElements.define('bar-chart', BarChart);
