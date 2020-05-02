const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `<div part="check"></div>`;

const STYLE = new CSSStyleSheet();

STYLE.replaceSync(`
:host {
    display: inline-flex;
    height: 1rem;
    width: 1rem;
    font: inherit;
    overflow: hidden;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 50%;
    box-sizing: border-box;
}
:host > [part="check"] {
    flex: 1 1 auto;
    margin: 1px;
    border-radius: 50%;
}
:host([aria-checked="true"]) > [part="check"] {
    background-color: var(--background-color-active, dodgerblue);
}
:host(:focus) {
    outline: none;
    box-shadow: 0 0 0 2px var(--outline-color, dodgerblue);
}
`);

export class RadioButton extends HTMLElement {

    static get observedAttributes () {

        return ['aria-checked'];
    }

    get checked (): boolean {

        return this.getAttribute('aria-checked') === 'true';
    }

    set checked (checked: boolean) {

        if (checked === this.checked) return;

        this.setAttribute('aria-checked', checked.toString());
    }

    constructor () {

        super();

        this.attachShadow({ mode: 'open' });

        this.shadowRoot!.appendChild(TEMPLATE.content.cloneNode(true));
        this.shadowRoot!.adoptedStyleSheets = [STYLE];
    }

    connectedCallback () {

        this.setAttribute('role', 'radio');
        this.setAttribute('aria-checked', this.checked.toString());
        this.setAttribute('tabindex', '0');

        this.addEventListener('click', this.handleClick.bind(this));
        this.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    disconnectedCallback () { }

    attributeChangedCallback (name: string, oldValue: string, newValue: string) {

        if (name === 'aria-checked') {

            if (oldValue === newValue) return;

            this.checked = newValue === 'true';
        }
    }

    protected handleClick (event: MouseEvent) {

        this.checked = !this.checked;
    }

    protected handleKeydown (event: KeyboardEvent) {

        if (event.key === 'Enter' || event.key === ' ') {

            event.preventDefault();

            this.checked = !this.checked;
        }
    }
}

customElements.define('radio-button', RadioButton);
