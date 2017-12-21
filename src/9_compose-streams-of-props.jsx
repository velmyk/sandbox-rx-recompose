import React, { cloneElement, Children } from 'react';
import {
    componentFromStream,
    createEventHandler,
    mapPropsStream,
    compose,
} from 'recompose';
import { Observable } from 'rxjs';

const count = mapPropsStream(props$ => {
    const { stream: onInc$, handler: onInc } = createEventHandler();
    const { stream: onDec$, handler: onDec } = createEventHandler();

    return props$.switchMap(props =>
        Observable.merge(
            onInc$.mapTo(1),
            onDec$.mapTo(-1)
        )
            .startWith(0)
            .scan((acc, curr) => acc + curr),
        (props, count) => ({ ...props, onInc, onDec, count }),
    )
});

const load = mapPropsStream(props$ =>
    props$.switchMap(props =>
        Observable.ajax(`https://swapi.co/api/people/${props.count}`)
            .pluck('response')
            .startWith({ name: 'loading...' })
            .catch(err => Observable.of({ name: 'Not found' })),
        (props, person) => ({ ...props, person }),
    )
);

const typewriter = mapPropsStream(props$ =>
    props$.switchMap(props =>
        Observable.zip(
            Observable.from(props.person.name),
            Observable.interval(100),
            letter => letter,
        )
            .scan((acc, curr) => acc + curr),
        (props, name) => ({ ...props, person: { ...props.person, name } }),
    )
);

const Counter = ({ count, onInc, onDec, person }) => (
    <div>
        <button onClick={onInc}>+</button>
        <h2>{count}</h2>
        <h1>{person.name}</h1>
        <button onClick={onDec}>-</button>
    </div>
);

const CounterWithPersonLoader = compose(count, load, typewriter)(Counter);

const App = () => (
    <div>
        <CounterWithPersonLoader />
    </div>
);

export default App;
