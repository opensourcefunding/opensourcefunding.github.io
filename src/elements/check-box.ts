const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<div part="control"><div part="check"><ui-icon icon="check"></ui-icon></div></div>
<label part="label"><slot></slot></label>
`;

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
:host {
    --icon-color: #fff;
    display: inline-grid;
    grid-template-columns: auto 1fr;
    column-gap: .75rem;
    align-items: center;
    justify-items: stretch;
    font: inherit;
    border-radius: var(--border-radius, .125rem);
}
:host input {
    display: none;
}
:host ui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
:host [part="control"] {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    height: 1.25rem;
    width: 1.25rem;
    border: .125rem solid var(--border-color, #ccc);
    border-radius: var(--border-radius, .125rem);
    box-sizing: border-box;
}
:host [part="check"] {
    flex: 1 1 auto;
    position: relative;
}
:host([aria-checked="true"]) [part="control"] {
    border-color: var(--background-color-active, dodgerblue);
    background-color: var(--background-color-active, dodgerblue);
}
:host([aria-checked="true"]) [part="check"] {
    background-color: var(--background-color-active, dodgerblue);
}
:host([aria-checked="false"]) ui-icon {
    display: none;
}
:host([aria-disabled=true]) {
    opacity: .5;
}
:host(:focus) {
    outline: none;
    box-shadow: 0 0 0 .125rem var(--outline-color, dodgerblue);
}
`;

try {

    STYLE = new CSSStyleSheet();
    STYLE.replaceSync(STYLE_CONTENT);

} catch (error) {

    STYLE = document.createElement('style');
    STYLE.innerText = STYLE_CONTENT;
}

let COUNTER = 0;

export class CheckBox extends HTMLElement {

    static template = TEMPLATE;

    static style = STYLE;

    static get observedAttributes () {

        return ['aria-checked', 'aria-disabled', 'name', 'value'];
    }

    protected listeners: Map<string, EventListener> = new Map();

    protected input: HTMLInputElement;

    protected label: HTMLElement;

    get checked (): boolean {

        return this.input.checked;
    }

    set checked (checked: boolean) {

        if (checked === this.checked) return;

        this.input.checked = checked;
        this.setAttribute('aria-checked', `${ checked }`);
    }

    get disabled (): boolean {

        return this.input.disabled;
    }

    set disabled (disabled: boolean) {

        if (disabled === this.disabled) return;

        this.input.disabled = disabled;

        if (disabled) {

            this.tabindex = -1;
            this.setAttribute('aria-disabled', 'true');

        } else {

            this.tabindex = 0;
            this.removeAttribute('aria-disabled');
        }
    }

    get tabindex (): number {

        return this.disabled ? -1 : 0;
    }

    set tabindex (tabindex: number) {

        if (this.disabled) {

            this.removeAttribute('tabindex');

        } else {

            this.setAttribute('tabindex', `${ tabindex }`);
        }
    }

    get name (): string | null {

        return this.input.name;
    }

    set name (name: string | null) {

        if (name === this.name) return;

        if (name !== null) {

            this.input.name = name;
            this.setAttribute('name', name);

        } else {

            this.input.removeAttribute('name');
            this.removeAttribute('name');
        }
    }

    get value (): string | null {

        return this.input.value;
    }

    set value (value: string | null) {

        if (value === this.value) return;

        if (value !== null) {

            this.input.value = value;
            this.setAttribute('value', value);

        } else {

            this.input.removeAttribute('value');
            this.removeAttribute('value');
        }
    }

    constructor () {

        super();

        const template = (this.constructor as typeof CheckBox).template;
        const style = (this.constructor as typeof CheckBox).style;

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.append(template.content.cloneNode(true));

        if (style instanceof CSSStyleSheet) {

            this.shadowRoot!.adoptedStyleSheets = [style];

        } else {

            this.shadowRoot!.prepend(style.cloneNode(true));
        }

        this.id = this.getId();
        this.input = this.createHiddenInput();
        this.label = this.shadowRoot!.querySelector('[part=label]') as HTMLElement;

        this.listeners.set('click', this.handleClick.bind(this) as EventListener);
        this.listeners.set('keypress', this.handleKeypress.bind(this) as EventListener);
    }

    connectedCallback () {

        this.setAttribute('role', 'checkbox');
        this.tabindex = 0;
        this.setAttribute('aria-checked', `${ this.checked }`);

        this.label.id = `${ this.id }-label`;
        this.setAttribute('aria-labelledby', this.label.id);

        this.addListeners();
    }

    disconnectedCallback () {

        this.removeListeners();
    }

    attributeChangedCallback (name: string, oldValue: string, newValue: string) {

        switch (name) {

            case 'aria-checked':

                if (oldValue === newValue) return;

                this.checked = newValue === 'true';

                break;

            case 'aria-disabled':

                if (oldValue === newValue) return;

                this.disabled = newValue === 'true';

                break;

            case 'name':

                if (oldValue === newValue) return;

                this.name = newValue;

                break;

            case 'value':

                if (oldValue === newValue) return;

                this.value = newValue;

                break;
        }
    }

    toggle () {

        this.checked = !this.checked;
    }

    protected getId (): string {

        return this.id || `check-box-${ COUNTER++ }`;
    }

    protected createHiddenInput (): HTMLInputElement {

        const input = document.createElement('input');

        input.type = 'checkbox';
        input.checked = this.getAttribute('aria-checked') === 'true';
        input.disabled = this.getAttribute('aria-disabled') === 'true';

        input.setAttribute('aria-hidden', 'true');
        input.setAttribute('style', 'display: none;');

        this.prepend(input);

        return input;
    }

    protected addListeners () {

        this.listeners.forEach((listener, event) => this.addEventListener(event, listener));
    }

    protected removeListeners () {

        this.listeners.forEach((listener, event) => this.removeEventListener(event, listener));
    }

    protected handleClick (event: MouseEvent) {

        if (this.disabled) return;

        this.toggle();

        this.emitChange();
    }

    protected handleKeypress (event: KeyboardEvent) {

        if (event.key === 'Enter' || event.key === ' ') {

            event.preventDefault();

            if (this.disabled) return;

            this.toggle();

            this.emitChange();
        }
    }

    protected emitChange () {

        this.dispatchEvent(new Event('change', { bubbles: true, cancelable: true, composed: true }));
    }
}

customElements.define('check-box', CheckBox);
