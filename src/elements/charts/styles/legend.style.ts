export const legend = () =>
`.legend {
    padding-top: 2rem;
    display: flex;
    flex-flow: column;
}
.legend>.entry {
    padding: 0 1rem;
    display: flex;
    flex-flow: row nowrap;
    border-radius: var(--border-radius);
    transition: background-color 250ms, box-shadow 250ms;
}
.legend>.entry:not(:last-child) {
    margin-bottom: 1rem;
}
.legend>.entry:hover,
.legend>.entry.active {
    background-color: var(--background-color-highlight);
    box-shadow: 0 -.5rem 0 0 var(--background-color-highlight),
    0 .5rem 0 0 var(--background-color-highlight);
}
.legend>.entry>*:not(:last-child) {
    margin-right: 1rem;
}
.legend>.entry>.color:after {
    content: '';
    display: block;
    width: 2rem;
    height: 1rem;
    margin: .5rem 0;
    background-color: var(--color-secondary);
}
.legend>.entry:first-child>.color:after {
    background-color: var(--color-primary);
}
.legend>.entry>.label {
    font-weight: bold;
    flex: 0 0 9rem;
}
.legend>.entry>.value {
    font-weight: bold;
    text-align: right;
    flex: 0 0 5rem;
}
.legend>.entry>.description {
    flex: 1 1 100%;
}`;
