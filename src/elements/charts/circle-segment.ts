import { arc } from '../../svg-arc';

export class CircleSegment extends HTMLElement {

    static get observedAttributes () {

        return ['outer-radius', 'inner-radius', 'start-angle', 'end-angle'];
    }

    hasConnected = false;

    get outerRadius (): number {

        return parseFloat(this.getAttribute('outer-radius') || '0');
    }

    set outerRadius (value: number) {

        this.setAttribute('outer-radius', value.toString());
    }

    get innerRadius (): number {

        return parseFloat(this.getAttribute('inner-radius') || '0');
    }

    set innerRadius (value: number) {

        this.setAttribute('inner-radius', value.toString());
    }

    get startAngle (): number {

        return parseFloat(this.getAttribute('start-angle') || '0');
    }

    set startAngle (value: number) {

        this.setAttribute('start-angle', value.toString());
    }

    get endAngle (): number {

        return parseFloat(this.getAttribute('end-angle') || '0');
    }

    set endAngle (value: number) {

        this.setAttribute('end-angle', value.toString());
    }

    connectedCallback () {

        this.render();

        this.hasConnected = true;
    }

    attributeChangedCallback (name: string, oldValue: any, newValue: any) {

        if (this.hasConnected) this.render();
    }

    render () {

        const path = arc({ x: this.outerRadius, y: this.outerRadius }, this.outerRadius, this.innerRadius, this.startAngle, this.endAngle);

        this.innerHTML = `<svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#fff" fill-opacity=".1"/>
            <path d="${ path }"/>
        </svg>`
    }
}

customElements.define('circle-segment', CircleSegment);
