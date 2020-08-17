import { base } from './base.style';
import { legend } from './legend.style';
import { toolbar } from './toolbar.style';

export const chart = () => `
:host {
    --chart-height: 20rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}
::slotted(*) {
    padding: 0 !important;
}
${ base() }
${ toolbar() }
${ legend() }

figure {
    display: flex;
    flex-flow: column;
}
`;
