import { SurveyQuestion } from './survey-question';

export class SurveyForm extends HTMLFormElement {

    protected listeners!: Map<string, EventListener>;

    progress!: HTMLProgressElement;

    steps!: NodeListOf<SurveyQuestion>;

    previous!: HTMLButtonElement;

    next!: HTMLButtonElement;

    // submit!: HTMLButtonElement;

    active = 0;

    total = 0;

    connectedCallback () {

        this.listeners = new Map();
        this.listeners.set('change', this.handleChange.bind(this));
        this.listeners.set('next-step', this.handleNextStep.bind(this));
        this.listeners.set('previous-step', this.handlePreviousStep.bind(this));

        this.steps = this.querySelectorAll('survey-question') as NodeListOf<SurveyQuestion>;
        this.total = this.steps.length;
        this.active = 0;

        console.log(this.steps);
        console.log(this.total);
        console.log(this.active);

        this.progress = document.createElement('progress');
        this.progress.max = this.total;
        this.progress.value = this.active + 1;

        this.prepend(this.progress);

        this.previous = document.createElement('button');
        this.previous.type = 'button';
        this.previous.textContent = 'Previous';
        this.previous.className = 'previous';
        this.previous.setAttribute('aria-label', 'previous');
        this.previous.addEventListener('click', () => this.previous.dispatchEvent(new Event('previous-step', { bubbles: true, cancelable: true, composed: true })));

        this.append(this.previous);

        this.next = document.createElement('button');
        this.next.type = 'button';
        this.next.textContent = 'Next';
        this.next.className = 'next';
        this.next.setAttribute('aria-label', 'next');
        this.next.addEventListener('click', () => this.next.dispatchEvent(new Event('next-step', { bubbles: true, cancelable: true, composed: true })));

        this.append(this.next);

        this.update();

        this.addListeners();
    }

    disconnectedCallback () {

        this.removeListeners();
    }

    getResults (): { [key: string]: any } {

        const formJSON = [...new FormData(this).entries()].reduce((json, [name, value]) => {

            if (json.hasOwnProperty(name)) {

                if (!(json[name] instanceof Array)) {

                    json[name] = [json[name]];
                }

                json[name].push(value);

            } else {

                json[name] = value;
            }

            return json;

        }, {} as { [key: string]: any });

        return formJSON;
    }

    protected update () {

        this.steps.forEach((step, key) => {

            if (key !== this.active) {

                step.setAttribute('aria-hidden', 'true');
                step.setAttribute('style', 'display: none;');

            } else {

                step.setAttribute('aria-hidden', 'false');
                step.setAttribute('style', 'display: initial;');
            }
        });

        this.previous.disabled = this.active === 0;
        this.next.disabled = !this.steps.item(this.active).isValid();

        this.progress.value = this.active;
    }

    protected handleChange () {

        this.update();
    }

    protected handleNextStep () {

        if (this.steps.item(this.active).isValid() && this.active < this.total - 1) {

            this.active++;
            this.update()
        }
    }

    protected handlePreviousStep () {

        if (this.active > 0) {

            this.active--;
            this.update()
        }
    }

    protected addListeners () {

        this.listeners.forEach((listener, event) => this.addEventListener(event, listener));
    }

    protected removeListeners () {

        this.listeners.forEach((listener, event) => this.removeEventListener(event, listener));
    }
}

customElements.define('survey-form', SurveyForm, { extends: 'form' });
