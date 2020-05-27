// import { Node, Edge } from './graph';

// export interface StateEvent<T extends string> extends CustomEvent<any> {
//     type: T;
// }

// export interface StateContext {
//     [key: string]: any;
// }

// export type States = 'initial';

// export class State<T extends string, U extends string> implements Node {

//     constructor (public name: T) {

//     }

//     async enter (event: StateEvent<U>, context: StateContext): Promise<boolean> {

//         return true;
//     }

//     async leave (event: StateEvent<U>, context: StateContext): Promise<boolean> {

//         return true;
//     }
// }

// export class Transition<T extends States, U extends string> implements Edge {

//     constructor (public from: T, public to: T, public value: U) { }
// }

// export class TransitionTable<T extends States, U extends string> {

//     table: Map<T, Map<T, Set<U>>> = new Map();

//     constructor (public transitions: Transition<T, U>[]) {

//         transitions.forEach(transition => {

//             if (!this.table.has(transition.from)) {

//                 this.table.set(transition.from, new Map());
//             }

//             if (!this.table.get(transition.from)!.has(transition.to)) {

//                 this.table.get(transition.from)!.set(transition.to, new Set());
//             }

//             this.table.get(transition.from)!.get(transition.to)!.add(transition.value);
//         });
//     }

//     canTransition (from: State<T, U>, to: State<T, U>, event: StateEvent<U>): boolean {

//         return !!this.table.get(from.name)?.get(to.name)?.has(event.type);
//     }
// }

// export class StateMachine<T extends States = States> {

//     context: StateContext = {};

//     states: State<T>[] = [];

//     current: State<T>;

//     transitions: {};

//     constructor () { }

//     async transition (event: StateEvent) { }

//     addTransition (eventName: string, from: string, to: string) { }

//     async canTransition (from: State<T>, to: State<T>, event: StateEvent) {

//         return await Promise.all([
//             this.canLeave(from, to, event),
//             this.canEnter(from, to, event),
//         ]);
//     }

//     async canEnter (from: State<T>, to: State<T>, event: StateEvent) { }

//     async canLeave (from: State<T>, to: State<T>, event: StateEvent) { }
// }

// export type CustomStates = States | 'loading' | 'success' | 'error';

// export class InitialState extends State<CustomStates> {

//     constructor (name: CustomStates = 'initial') {

//         super(name);
//     }
// }

// export class LoadingState extends State<CustomStates> {

//     constructor (name: CustomStates = 'loading') {

//         super(name);
//     }
// }

// export class SuccessState extends State<CustomStates> {

//     constructor (name: CustomStates = 'success') {

//         super(name);
//     }
// }



// const machine = new StateMachine();
