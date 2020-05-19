import { Icon } from './icon';
import { SurveyEnd } from './survey-end';
import { SurveyQuestion } from './survey-question';

const EVENT_INIT: EventInit = {
    bubbles: true,
    cancelable: true,
    composed: true,
};

export class SurveyForm extends HTMLFormElement {

    protected listeners!: Map<string, EventListener>;

    progress!: HTMLProgressElement;

    questions!: NodeListOf<SurveyQuestion>;

    end!: SurveyEnd;

    previous!: HTMLButtonElement;

    next!: HTMLButtonElement;

    // submit!: HTMLButtonElement;

    active = 0;

    total = 0;

    connectedCallback () {

        this.listeners = new Map();
        this.listeners.set('change', this.handleChange.bind(this));
        this.listeners.set('input', this.handleChange.bind(this));
        this.listeners.set('next-step', this.handleNextStep.bind(this));
        this.listeners.set('previous-step', this.handlePreviousStep.bind(this));

        this.end = this.querySelector('survey-end') as SurveyEnd;
        this.questions = this.querySelectorAll('survey-question') as NodeListOf<SurveyQuestion>;
        this.total = this.questions.length;
        this.active = 0;

        const surveyId = localStorage.getItem('surveyId');

        if (surveyId) {

            this.active = this.total;
        }

        this.createProgress();

        this.createPrevious();

        this.createNext();

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

        this.questions.forEach((step, key) => {

            if (key !== this.active) {

                step.setAttribute('aria-hidden', 'true');

            } else {

                step.removeAttribute('aria-hidden');
            }
        });

        if (this.active === this.total) {

            this.previous.remove();
            this.next.remove();

            this.end.setAttribute('aria-hidden', 'false');

        } else {

            this.end.setAttribute('aria-hidden', 'true');

            this.previous.disabled = this.active === 0;
            this.next.disabled = !this.questions.item(this.active).isValid();

            if (this.active === this.total - 1) {

                this.next.setAttribute('aria-label', 'submit');
                (this.next.querySelector('ui-icon') as Icon).icon = 'message';

            } else {

                this.next.setAttribute('aria-label', 'next');
                (this.next.querySelector('ui-icon') as Icon).icon = 'check';
            }
        }

        this.progress.value = this.active;
    }

    protected createNext () {

        this.next = document.createElement('button');
        this.next.type = 'button';
        this.next.innerHTML = `<ui-icon icon="check"></ui-icon>`;
        this.next.className = 'next';
        this.next.setAttribute('aria-label', 'next');
        this.next.addEventListener('click', () => this.next.dispatchEvent(new Event('next-step', EVENT_INIT)));

        this.append(this.next);
    }

    protected createPrevious () {

        this.previous = document.createElement('button');
        this.previous.type = 'button';
        this.previous.innerHTML = `<ui-icon icon="arrow-left"></ui-icon>`;
        this.previous.className = 'previous';
        this.previous.setAttribute('aria-label', 'previous');
        this.previous.addEventListener('click', () => this.previous.dispatchEvent(new Event('previous-step', EVENT_INIT)));

        this.append(this.previous);
    }

    protected createProgress () {

        this.progress = document.createElement('progress');
        this.progress.max = this.total;
        this.progress.value = this.active + 1;

        this.prepend(this.progress);
    }

    protected handleChange () {

        this.update();
    }

    protected handleNextStep () {

        if (this.questions.item(this.active).isValid() && this.active < this.total - 1) {

            this.active++;
            this.update()

        } else if (this.questions.item(this.active).isValid()) {

            this.handleSubmit();
        }
    }

    protected handlePreviousStep () {

        if (this.active > 0) {

            this.active--;
            this.update()
        }
    }

    protected async handleSubmit () {

        const result = this.getResults();

        try {

            const response = await fetch('https://us-central1-opensourcefunding-8646c.cloudfunctions.net/postSurvey', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(result),
            });

            const surveyId = await response.text();

            localStorage.setItem('surveyId', surveyId);

        } catch (error) {

            // TODO: handle request errors
        }


        this.active = this.total;

        this.update();
    }

    protected addListeners () {

        this.listeners.forEach((listener, event) => this.addEventListener(event, listener));
    }

    protected removeListeners () {

        this.listeners.forEach((listener, event) => this.removeEventListener(event, listener));
    }
}

customElements.define('survey-form', SurveyForm, { extends: 'form' });
