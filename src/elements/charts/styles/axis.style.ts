export const axis = () =>
`.chart>.axis.vertical {
    width: 100%;
    height: 0;
    position: absolute;
    border-bottom: 1px dashed var(--background-color-highlight);
}
.chart>.axis.vertical:first-of-type {
    border-bottom-style: solid;
}
.chart>.axis.vertical::before {
    content: attr(data-label);
    position: absolute;
    top: -1rem;
    right: 100%;
    padding-right: .5rem;
    color: var(--color-text-secondary);
}
.chart>.axis.horizontal {
    width: 0;
    height: 100%;
    position: absolute;
    border-right: 1px dashed var(--background-color-highlight);
}
.chart>.axis.horizontal:first-of-type {
    border-right-style: solid;
}
.chart>.axis.horizontal::before {
    content: attr(data-label);
    position: absolute;
    bottom: 100%;
    left: 0;
    margin-bottom: .5rem;
    color: var(--color-text-secondary);
    transform: translate(-50%, 0);
}
.chart>.axis.horizontal:first-of-type::before {
    transform: translate(0, 0);
}
.chart>.axis.horizontal:last-of-type::before {
    transform: translate(-100%, 0);
}`;
