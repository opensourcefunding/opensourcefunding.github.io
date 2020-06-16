const TRACKING_ID = 'UA-16350314-4';

export class AnalyticsManager {

    protected script: HTMLScriptElement | undefined;

    protected queue: any[];

    get isEnabled (): boolean {

        return !!this.script;
    }

    constructor (protected trackingId: string, protected config = { anonymize_ip: true }) {

        this.queue = [];

        this.push('js', new Date());

        this.push('config', this.trackingId, this.config);
    }

    enable () {

        if (this.isEnabled) return;

        this.load();
    }

    event (name: string, data?: any) {

        this.push('event', name, data);
    }

    protected load () {

        this.script = document.createElement('script') as HTMLScriptElement;

        this.script.src = `https://www.googletagmanager.com/gtag/js?id=${ this.trackingId }`;
        this.script.async = true;

        document.head.append(this.script);

        (window as any).dataLayer = this.queue;
    }

    protected push (...args: any[]) {

        this.queue.push(args);
    }
}

export const Analytics = new AnalyticsManager(TRACKING_ID);
