export class SurveyQuestion extends HTMLElement {

    static get observedAttributes () {

        return ['name', 'required'];
    }

    get name (): string | null {

        return this.getAttribute('name');
    }

    set name (value: string | null) {

        if (value === this.name) return;

        if (value) {

            this.setAttribute('name', value);

        } else {

            this.removeAttribute('name');
        }
    }

    get required (): boolean {

        return this.hasAttribute('required') && this.getAttribute('required') !== 'false';
    }

    set required (value: boolean) {

        if (value === this.required) return;

        if (value) {

            this.setAttribute('required', 'true');

        } else {

            this.removeAttribute('required');
        }
    }

    attributeChangedCallback (name: string, oldValue: string, newValue: string) {

        if (oldValue === newValue) return;

        switch (name) {

            case 'name':

                this.name = newValue;
                break;

            case 'required':

                this.required = newValue !== 'false';
                break;
        }
    }

    isValid (): boolean {

        const formData = new FormData(this.parentElement as HTMLFormElement);

        return this.required
            ? !!formData.get(this.name!) || !!formData.get(`${ this.name }-other`)
            : true;
    }
}

customElements.define('survey-question', SurveyQuestion);
