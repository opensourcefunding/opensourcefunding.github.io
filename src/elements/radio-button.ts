import { CheckBox } from './check-box';

let STYLE: CSSStyleSheet | HTMLStyleElement;

const STYLE_CONTENT = `
:host {
    display: inline-grid;
    grid-template-columns: auto 1fr;
    column-gap: .5rem;
    align-items: center;
    justify-items: stretch;
    font: inherit;
}
:host input {
    display: none;
}
:host [part="control"] {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    height: 1rem;
    width: 1rem;
    border: 1px solid var(--border-color, #ccc);
    border-radius: 50%;
    box-sizing: border-box;
}
:host [part="check"] {
    flex: 1 1 auto;
    margin: 1px;
    border-radius: 50%;
}
:host([aria-checked="true"]) [part="check"] {
    background-color: var(--background-color-active, dodgerblue);
}
:host([aria-disabled=true]) {
    opacity: .5;
}
:host(:focus) {
    outline: none;
    box-shadow: 0 0 0 2px var(--outline-color, dodgerblue);
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

export class RadioButton extends CheckBox {

    static style = STYLE;

    get checked (): boolean {

        return this.getAttribute('aria-checked') === 'true';
    }

    set checked (checked: boolean) {

        if (checked === this.checked) return;

        this.input.checked = checked;
        this.setAttribute('aria-checked', `${ checked }`);
    }

    connectedCallback () {

        super.connectedCallback();

        this.setAttribute('role', 'radio');
    }

    protected getId (): string {

        return this.id || `radio-button-${ COUNTER++ }`;
    }

    protected createHiddenInput (): HTMLInputElement {

        const input = document.createElement('input');

        input.type = 'radio';
        input.checked = this.getAttribute('aria-checked') === 'true';
        input.disabled = this.getAttribute('aria-disabled') === 'true';

        input.setAttribute('aria-hidden', 'true');
        input.setAttribute('style', 'display: none;');

        this.prepend(input);

        return input;
    }

    protected handleClick (event: MouseEvent) {

        if (this.disabled || this.checked) return;

        this.checked = true;

        this.emitChange();
    }

    protected handleKeypress (event: KeyboardEvent) {

        if (event.key === 'Enter' || event.key === ' ') {

            event.preventDefault();

            if (this.disabled || this.checked) return;

            this.checked = true;

            this.emitChange();
        }
    }
}

customElements.define('radio-button', RadioButton);
