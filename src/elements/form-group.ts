const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<slot name="header"></slot>
<slot name="description"></slot>
<slot></slot>
`;

let COUNTER = 0;

export class FormGroup extends HTMLElement {

    header: HTMLElement | null = null;

    description: HTMLElement | null = null;

    constructor () {

        super();

        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.append(TEMPLATE.content.cloneNode(true));

        this.id = this.id || `form-group-${ COUNTER++ }`;
        this.header = this.querySelector('[slot=header]');
        this.description = this.querySelector('[slot=description]');
    }

    connectedCallback () {

        this.setAttribute('role', 'group');

        if (this.header) {

            this.header.id = this.header.id || `${ this.id }-header`;
            this.setAttribute('aria-labelledby', this.header.id);
        }

        if (this.description) {

            this.description.id = this.description.id || `${ this.id }-description`;
            this.setAttribute('aria-describedby', this.description.id);
        }
    }
}

customElements.define('form-group', FormGroup);
