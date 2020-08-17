import { chart } from './styles/chart.style';

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
${ chart() }
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

export interface ChartData {
    value: number;
    percent: number;
    label: string;
    description: string;
}

export type ChartDisplayType = 'absolute' | 'relative';

export abstract class Chart extends HTMLElement {

    static style = STYLE;

    static get observedAttributes () {

        return ['display', 'total'];
    }

    data: ChartData[] = [];

    display: ChartDisplayType = 'relative';

    total = 0;

    maxValue = 0;

    maxPercent = 0;

    constructor () {

        super();

        this.attachShadow({ mode: 'open' });

        const style = (this.constructor as typeof Chart).style;

        if (style instanceof CSSStyleSheet) {

            this.shadowRoot!.adoptedStyleSheets = [style];

        } else {

            this.shadowRoot!.prepend(style.cloneNode(true));
        }
    }

    connectedCallback () {

        this.parseData();

        this.render();
    }

    attributeChangedCallback (name: string, oldValue: any, newValue: any) {

        if (name === 'total') {

            this.total = parseFloat(newValue);
        }

        if (name === 'display') {

            this.display = (newValue === 'absolute') ? 'absolute' : 'relative';
        }
    }

    toggleDisplay () {

        this.setAttribute('display', (this.display === 'relative') ? 'absolute' : 'relative');

        this.render();
    }

    protected template (): string {

        return '';
    }

    protected render () {

        this.shadowRoot!.innerHTML = this.template();

        this.updateBindings();
    }

    protected updateBindings () {

        this.shadowRoot?.querySelector('[data-action=toggle-display]')?.addEventListener('click', () => this.toggleDisplay());

        [...this.shadowRoot!.querySelectorAll('.chart .entry')].forEach((entry, index) => {

            const legendEntry = this.shadowRoot!.querySelectorAll('.legend .entry').item(index);

            entry.addEventListener('mouseenter', () => legendEntry?.classList.add('active'));
            entry.addEventListener('mouseleave', () => legendEntry?.classList.remove('active'));
        });

        [...this.shadowRoot!.querySelectorAll('.legend .entry')].forEach((entry, index) => {

            const dataEntry = this.shadowRoot!.querySelectorAll('.chart .entry').item(index);

            entry.addEventListener('mouseenter', () => dataEntry?.classList.add('active'));
            entry.addEventListener('mouseleave', () => dataEntry?.classList.remove('active'));
        });
    }

    protected parseData () {

        const dataElements = [...this.querySelectorAll('chart-data')];

        this.data = dataElements.map(element => {

            const value = parseFloat(element.getAttribute('value') ?? '0');
            const percent = Math.round(value / this.total * 1000) / 10;

            const dataItem = {
                value,
                percent,
                label: element.getAttribute('label') ?? '',
                description: element.textContent ?? '',
            };

            // save the max values to scale the graph to the component size
            this.maxValue = Math.max(value, this.maxValue);
            this.maxPercent = Math.max(percent, this.maxPercent);

            return dataItem;
        });
    }
}
