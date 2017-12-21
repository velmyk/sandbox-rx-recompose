import React, { cloneElement, Children } from 'react';
import {
    componentFromStream,
    createEventHandler,
    mapPropsStream,    
} from 'recompose';
import { Observable } from 'rxjs';

const interval = mapPropsStream(props$ =>
    props$.switchMap(props => Observable.interval(1000),
    (props, count) => ({ ...props, count })),
);

const Counter = props => (<h1>{props.count}</h1>);

const CounterWithInterval = interval(Counter);

const App = props => (
    <div>
        <CounterWithInterval />
    </div>
);

export default App;
