import { END_DATE } from '../end-date';
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

        if (END_DATE.getTime() < new Date().getTime()) {

            this.finishedState();
        }

        this.update();

        this.addListeners();
    }

    disconnectedCallback () {

        this.removeListeners();
    }

    getResult (): { [key: string]: any } {

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

            this.previous?.remove();
            this.next?.remove();

            this.end.setAttribute('aria-hidden', 'false');

        } else {

            this.end.setAttribute('aria-hidden', 'true');

            this.previous.disabled = this.active === 0;
            this.next.disabled = !this.questions.item(this.active)?.isValid();

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
        this.next.addEventListener('click', () => this.next.dispatchEvent(new Event('next-step', { ...EVENT_INIT })));

        this.append(this.next);
    }

    protected createPrevious () {

        this.previous = document.createElement('button');
        this.previous.type = 'button';
        this.previous.innerHTML = `<ui-icon icon="arrow-left"></ui-icon>`;
        this.previous.className = 'previous';
        this.previous.setAttribute('aria-label', 'previous');
        this.previous.addEventListener('click', () => this.previous.dispatchEvent(new Event('previous-step', { ...EVENT_INIT })));

        this.append(this.previous);
    }

    protected createProgress () {

        this.progress = document.createElement('progress');
        this.progress.max = this.total;
        this.progress.value = this.active + 1;
        this.progress.setAttribute('aria-live', 'polite');

        this.prepend(this.progress);
    }

    protected getNextStep (): number {

        if (this.active === this.total) return this.total;

        const indizes = this.filterSteps();

        return indizes[indizes.indexOf(this.active) + 1];
    }

    protected getPreviousStep (): number {

        if (this.active === 0) return 0;

        const indizes = this.filterSteps();

        return indizes[indizes.indexOf(this.active) - 1];
    }

    protected filterSteps () {

        const result = this.getResult();

        let steps = [...this.questions.entries()];

        if (result.role === 'user') {

            steps = steps.filter(([index, question]) => question.name !== 'motivation-contributor' && question.name !== 'frequency');
        }

        return steps.map(([index, question]) => index);
    }

    protected handleChange () {

        this.update();
    }

    protected handleNextStep () {

        const currentStep = this.questions.item(this.active);

        const isValid = currentStep
            ? currentStep.isValid()
            // if currentStep is undefined we ae at the end and consider the form valid
            : true;

        if (this.active < this.total - 1 && isValid) {

            this.active = this.getNextStep();

            this.update()

        } else if (isValid) {

            this.handleSubmit();
        }
    }

    protected handlePreviousStep () {

        if (this.active > 0) {

            this.active = this.getPreviousStep();

            this.update()
        }
    }

    protected async handleSubmit () {

        this.loadingState();

        const result = {
            ...this.getResult(),
            timestamp: new Date().getTime(),
        };

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

            this.successState();

        } catch (error) {

            this.errorState();
        }
    }

    protected loadingState () {

        this.active = this.total;

        this.end.state = 'loading';

        this.update();

        this.progress.removeAttribute('value');
    }

    protected successState () {

        this.active = this.total;

        this.end.state = 'success';

        this.update();

        this.progress.value = this.active;
    }

    protected errorState () {

        this.active = this.total;

        this.end.state = 'error';

        this.update();

        this.progress.value = this.active;

        const again = this.querySelector('.again') as HTMLButtonElement;

        const handler = () => {

            again.dispatchEvent(new Event('next-step', { ...EVENT_INIT }));

            again.removeEventListener('click', handler);
        }

        again.addEventListener('click', handler);
    }

    protected finishedState () {

        this.active = this.total;

        this.end.state = 'finished';

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
