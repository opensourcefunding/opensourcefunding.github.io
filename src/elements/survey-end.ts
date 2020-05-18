const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<slot name="header"></slot>
<slot name="description">
    <p>The results of the survey will be published <a href="#results">here</a> in <span data-days-left>30 days</span>.</p>
    <p>Please check back later.</p>
</slot>
`;

export class SurveyEnd extends HTMLElement {

    static template = TEMPLATE;

    static get observedAttributes () {

        return ['end'];
    }

    get end (): string | null {

        return this.getAttribute('end');
    }

    set end (value: string | null) {

        if (value === this.end) return;

        if (value) {

            this.setAttribute('end', value);

        } else {

            this.removeAttribute('end');
        }
    }

    constructor () {

        super();

        const template = (this.constructor as typeof SurveyEnd).template;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.append(template.content.cloneNode(true));
    }

    connectedCallback () {

        const today = new Date();
        const end = new Date(this.end || today);
        const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const daysLeftMarker = this.querySelector('[data-days-left]') || this.shadowRoot!.querySelector('[data-days-left]');

        if (daysLeftMarker) {

            daysLeftMarker.textContent = `${ (daysLeft > 0) ? daysLeft : 'today' }${ (daysLeft > 1) ? ' days' : (daysLeft === 1) ? ' day' : '' }`;
        }


    }
}

customElements.define('survey-end', SurveyEnd);
