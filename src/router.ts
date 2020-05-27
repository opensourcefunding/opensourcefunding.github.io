export interface Routes {
    [key: string]: (route: string) => void;
}

export class Router {

    protected handleHashChange: (event: HashChangeEvent) => void;

    current: string = '';

    constructor (public routes: Routes) {

        this.handleHashChange = (event: HashChangeEvent) => this.navigate(location.hash);
    }

    navigate (route: string) {

        route = route.startsWith('#') ? route : '#' + route;

        if (route === this.current) {

            return;
        }

        const [name, handler] = Object.entries(this.routes).find(([name, handler]) => name === route || name === '**') || [];

        if (name && handler) {

            handler(name);
        }
    }

    start () {

        window.addEventListener('hashchange', this.handleHashChange);

        window.dispatchEvent(new HashChangeEvent('hashchange', {
            oldURL: '',
            newURL: location.href,
        }));
    }

    stop () {

        window.removeEventListener('hashchange', this.handleHashChange);
    }
}
