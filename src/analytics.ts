const TRACKING_ID = 'G-MC7GYYDV94';

export class AnalyticsManager {

    protected enabled = false;

    protected queue: any[] = [];

    protected gtag: (...args: any[]) => void;

    get isEnabled (): boolean {

        return this.enabled;
    }

    constructor (protected trackingId: string, protected config = { anonymize_ip: true }) {

        (window as any).dataLayer = (window as any).dataLayer || [];

        this.gtag = function () { (window as any).dataLayer.push(arguments); }
    }

    enable () {

        if (this.isEnabled) return;

        this.enabled = true;

        this.gtag('js', new Date());

        this.gtag('config', this.trackingId, this.config);

        // send all queued events from before the cookie consent
        this.queue.forEach(event => this.gtag(...event));

        this.queue = [];
    }

    event (name: string, data?: any) {

        if (!this.isEnabled) {

            this.queue.push(['event', name, data]);

        } else {

            this.gtag('event', name, data);
        }
    }
}

export const Analytics = new AnalyticsManager(TRACKING_ID);
