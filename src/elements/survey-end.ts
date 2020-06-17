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

        return ['state'];
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

        this.setAttribute('state', this.state);
    }
}

customElements.define('survey-end', SurveyEnd);
