export const base = () => `
* {
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    line-height: inherit;
}

button {
    padding: .5rem 1rem;
    display: flex;
    align-items: center;
    color: var(--color-primary-contrast);
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    border-radius: 1.5rem;
    background: var(--border-color);
}

button:hover,
button:focus {
    outline: none;
    color: var(--color-primary-contrast);
    background-color: var(--color-primary);
}

ui-icon {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: .5rem;
}

button>ui-icon {
    flex: 0 0 auto;
}
`;
