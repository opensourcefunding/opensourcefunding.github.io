import { Analytics } from './analytics';
import './elements/check-box';
import './elements/form-group';
import './elements/icon';
import './elements/radio-button';
import './elements/radio-group';
import './elements/select';
import './elements/survey-end';
import './elements/survey-form';
import './elements/survey-question';
import { END_DATE } from './end-date';
import { Router, Routes } from './router';

const showCookiePopup = () => {

    const template = document.getElementById('cookie-popup') as HTMLTemplateElement;

    document.body.append(template.content.cloneNode(true));

    document.getElementById('decline_cookies')?.addEventListener('click', () => {

        localStorage.setItem('allowAnalytics', 'false');

        manageCookies();

        document.body.querySelector('.cookie-popup')?.remove();
    });

    document.getElementById('accept_cookies')?.addEventListener('click', () => {

        localStorage.setItem('allowAnalytics', 'true');

        manageCookies();

        document.body.querySelector('.cookie-popup')?.remove();
    });
}

const manageCookies = () => {

    const allowAnalytics = localStorage.getItem('allowAnalytics');

    // first visit
    if (allowAnalytics === null) {

        showCookiePopup();

    } else {

        if (allowAnalytics === 'true') {

            Analytics.enable();
        }
    }
}

const initCallToAction = () => {

    document.querySelector('.call-to-action > button')?.addEventListener('click', event => {

        event.preventDefault();

        document.location.hash = 'results';
    });
};

const initDaysLeft = (end: Date) => {

    const today = new Date();
    const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const daysLeftMarker = document.querySelectorAll('[data-days-left]');

    if (daysLeftMarker.length) {

        daysLeftMarker.forEach(marker => {

            marker.textContent = `${ (daysLeft > 0) ? `in ${ daysLeft }` : 'today' }${ (daysLeft > 1) ? ' days' : (daysLeft === 1) ? ' day' : '' }`;
        });
    }
};

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

    Analytics.event('screen_view', { screen_name: page });
};

const ROUTES: Routes = {
    '#home': () => handleNavigation('home'),
    '#survey': () => handleNavigation('survey'),
    '#results': () => handleNavigation('results'),
    '#privacy': () => handleNavigation('privacy'),
    '**': () => handleNavigation('home'),
};

async function bootstrap () {

    manageCookies();

    initCallToAction();

    initDaysLeft(END_DATE);

    const router = new Router(ROUTES);

    router.start();
}

window.addEventListener('DOMContentLoaded', () => {

    bootstrap();
});
