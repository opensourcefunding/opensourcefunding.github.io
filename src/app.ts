import './elements/check-box';
import './elements/form-group';
import './elements/icon';
import './elements/radio-button';
import './elements/radio-group';
import './elements/select';
import './elements/survey-question';
import './elements/survey-end';
import './elements/survey-form';
import { Router, Routes } from './router';

const handleNavigation = (page: string) => {

    document.querySelectorAll<HTMLAnchorElement>('header > nav a').forEach(
        link => {

            if (link.href.replace(/^.*?#/, '') === page) {

                link.setAttribute('aria-current', 'page');

            } else {

                link.removeAttribute('aria-current');
            }
        }
    );

    document.querySelectorAll('main > section').forEach(
        section => {

            section.setAttribute('aria-hidden', JSON.stringify(section.id !== page));
        }
    );
};

const ROUTES: Routes = {
    '#home': () => handleNavigation('home'),
    '#survey': () => handleNavigation('survey'),
    '#results': () => handleNavigation('results'),
    '**': () => handleNavigation('home'),
};

async function bootstrap () {

    const router = new Router(ROUTES);

    router.start();
}

window.addEventListener('DOMContentLoaded', () => {

    bootstrap();
});
