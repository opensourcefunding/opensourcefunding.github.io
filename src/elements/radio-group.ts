import { FormGroup } from './form-group';
import { RadioButton } from './radio-button';

export class RadioGroup extends FormGroup {

    protected listeners: Map<string, EventListener> = new Map();

    protected radios: NodeListOf<RadioButton>;

    protected active = 0;

    constructor () {

        super();

        this.radios = this.querySelectorAll('radio-button');

        this.listeners.set('change', this.handleChange.bind(this) as EventListener);
        this.listeners.set('keydown', this.handleKeypress.bind(this) as EventListener);
    }

    connectedCallback () {

        super.connectedCallback();

        this.setAttribute('role', 'radiogroup');

        this.initRadios();

        this.addListeners();
    }

    disconnectedCallback () {

        this.removeListeners();
    }

    protected initRadios () {

        this.radios.forEach((radio, index) => {

            if (radio.checked) {

                this.active = index;

            } else {

                radio.tabindex = -1;
            }
        });

        this.radios.item(this.active).tabindex = 0;
    }

    protected nextRadio (from?: number): number {

        const first = 0;
        const last = this.radios.length - 1;

        from = from ?? this.active;

        do {

            from++;

            if (from > last) { from = first; }

        } while (this.radios.item(from).disabled);

        return from;
    }

    protected previousRadio (from?: number): number {

        const first = 0;
        const last = this.radios.length - 1;

        from = from ?? this.active;

        do {

            from--;

            if (from < first) { from = last; }

        } while (this.radios.item(from).disabled);

        return from;
    }

    protected activateRadio (index: number) {

        const previous = this.radios.item(this.active);
        previous.checked = false;
        previous.tabindex = -1;

        const active = this.radios.item(index);
        active.checked = true;
        active.tabindex = 0;
        active.focus();

        this.active = index;
    }

    protected addListeners () {

        this.listeners.forEach((listener, event) => this.addEventListener(event, listener));
    }

    protected removeListeners () {

        this.listeners.forEach((listener, event) => this.removeEventListener(event, listener));
    }

    protected handleChange (event: Event) {

        const checked = (event.target as RadioButton).checked;

        if (checked) {

            const index = [...this.radios.entries()].find(([index, radio]) => radio === event.target)![0];

            if (index !== this.active) {

                this.activateRadio(index);
            }
        }
    }

    protected handleKeypress (event: KeyboardEvent) {

        switch (event.key) {

            case 'ArrowUp':
            case 'ArrowLeft':

                this.activateRadio(this.previousRadio());
                event.preventDefault();
                break;

            case 'ArrowDown':
            case 'ArrowRight':

                this.activateRadio(this.nextRadio());
                event.preventDefault();
                break;
        }
    }
}

customElements.define('radio-group', RadioGroup);
