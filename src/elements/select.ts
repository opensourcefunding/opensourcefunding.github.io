const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
<ui-icon icon="angle-down"></ui-icon>
`;

export class Select extends HTMLElement {

    static template = TEMPLATE;

    select: HTMLSelectElement;

    constructor () {

        super();

        this.append((this.constructor as typeof Select).template.content.cloneNode(true));

        this.select = this.querySelector('select')!;
    }

    connectedCallback () {}
}

customElements.define('ui-select', Select);
