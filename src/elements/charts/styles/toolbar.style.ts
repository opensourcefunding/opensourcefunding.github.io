export const toolbar = () =>
`.toolbar {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.toolbar>.description {
    flex: 1 1 100%;
}
.toolbar>button {
    margin-left: 1rem;
    padding: .5rem .75rem;
    flex: 0 0 3rem;
    overflow: hidden;
}
.toolbar>button>ui-icon {
    margin-right: 3rem;
}
@media (min-width: 50ch) {
    .toolbar>button {
        flex-basis: auto;
        overflow: initial;
    }
    .toolbar>button>ui-icon {
        margin-right: .5rem;
    }
}`;
