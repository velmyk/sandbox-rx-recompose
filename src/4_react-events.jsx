import React from 'react';
import { componentFromStream, createEventHandler } from 'recompose';
import { Observable } from 'rxjs';

const SimpleForm = ({ text, onInput }) => (
    <div>
        <input type="text" onInput={onInput} />
        <h2>{text}</h2>
    </div>
);

const SimpleFormStream = componentFromStream(
    props$ => {
        const { stream: onInput$, handler: onInput } = createEventHandler();
        const text$ = onInput$.map(e => e.target.value).startWith('');

        return text$.map(text => ({ text, onInput })).delay(500).map(SimpleForm);
    },
);

const logInput = e => console.log(e.target.value);

const App = props => (
    <div>
        <SimpleFormStream />
        <SimpleForm
            text="Hello world"
            onInput={logInput}
        />
    </div>
);

export default App;
