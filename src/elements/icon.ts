const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<svg focusable="false" aria-hidden="true"><use/></svg>
`;

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
:host {
    display: inline-flex;
    width: var(--line-height, 1.5rem);
    height: var(--line-height, 1.5rem);
    padding: 0;
    line-height: inherit;
    font-size: inherit;
    vertical-align: bottom;
    box-sizing: border-box;
}
:host svg {
    width: 100%;
    height: 100%;
    line-height: inherit;
    font-size: inherit;
    overflow: visible;
    fill: var(--icon-color, currentColor);
}
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

export class Icon extends HTMLElement {

    static template = TEMPLATE;

    static style = STYLE;

    static getObservedAttributes () {

        return ['icon'];
    }

    get icon (): string | null {

        return this.getAttribute('icon');
    }

    set icon (value: string | null) {

        if (value === this.icon) return;

        this.setAttribute('icon', value || '');

        this.update();
    }

    protected use: SVGUseElement;

    constructor () {

        super();

        const template = (this.constructor as typeof Icon).template;
        const style = (this.constructor as typeof Icon).style;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.append(template.content.cloneNode(true));

        if (style instanceof CSSStyleSheet) {

            this.shadowRoot!.adoptedStyleSheets = [style];

        } else {

            this.shadowRoot!.prepend(style.cloneNode(true));
        }

        this.use = this.shadowRoot!.querySelector('use')!;
    }

    connectedCallback () {

        this.setAttribute('role', 'img');
        this.setAttribute('aria-hidden', 'true');

        this.update();
    }

    attributeChangedCallback (name: string, oldValue: string, newValue: string) {

        if (oldValue === newValue) return;

        this.icon = newValue;
    }

    protected update () {

        this.use.setAttribute('href', `icons.svg#${ this.icon }`);
    }
}

customElements.define('ui-icon', Icon);
