const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<slot name="initial"></slot>
<slot name="loading"></slot>
<slot name="success"></slot>
<slot name="error"></slot>
`;

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
:host {
    --icon-color: var(--link-color);
}
:host slot {
    display: none;
}
:host([state=initial]) slot[name=initial] {
    display: initial;
}
:host([state=loading]) slot[name=loading] {
    display: initial;
}
:host([state=success]) slot[name=success] {
    display: initial;
}
:host([state=error]) slot[name=error] {
    display: initial;
}
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

export type SurveyState = 'initial' | 'loading' | 'success' | 'error';

const SURVEY_STATES: SurveyState[] = ['initial', 'loading', 'success', 'error'];

export class SurveyEnd extends HTMLElement {

    static template = TEMPLATE;

    static style = STYLE;

    static get observedAttributes () {

        return ['end', 'state'];
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

    get state (): SurveyState {

        return (this.getAttribute('state') || 'initial') as SurveyState;
    }

    set state (value: SurveyState) {

        if (value === this.state) return;

        if (value) {

            this.setAttribute('state', value);

        } else {

            this.removeAttribute('state');
        }
    }

    constructor () {

        super();

        const template = (this.constructor as typeof SurveyEnd).template;
        const style = (this.constructor as typeof SurveyEnd).style;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.append(template.content.cloneNode(true));

        if (style instanceof CSSStyleSheet) {

            this.shadowRoot!.adoptedStyleSheets = [style];

        } else {

            this.shadowRoot!.prepend(style.cloneNode(true));
        }
    }

    connectedCallback () {

        const today = new Date();
        const end = new Date(this.end || today);
        const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        const daysLeftMarker = this.querySelector('[data-days-left]') || this.shadowRoot!.querySelector('[data-days-left]');

        if (daysLeftMarker) {

            daysLeftMarker.textContent = `${ (daysLeft > 0) ? `in ${ daysLeft }` : 'today' }${ (daysLeft > 1) ? ' days' : (daysLeft === 1) ? ' day' : '' }`;
        }

        this.setAttribute('state', this.state);
    }
}

customElements.define('survey-end', SurveyEnd);
