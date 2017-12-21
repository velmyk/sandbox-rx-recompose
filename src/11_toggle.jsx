import React, { Component } from 'react';
import {
    componentFromStream,
    createEventHandler,
} from 'recompose';
import Switch from 'react-toggle-switch';
import '../node_modules/react-toggle-switch/dist/css/switch.min.css'

const ToggleStream = componentFromStream(props$ => {
    const { handler: toggle, stream: toggle$ } = createEventHandler();

    const on$ = toggle$.startWith(true).scan(bool => !bool)

    return props$.combineLatest(on$, (props, on) =>
        props.render({
            on,
            toggle,
        })
    );
});

class Toggle extends Component {
    static defaultProps = { onToggle: () => {} }
    state = { on: false }
    toggle = () =>
        this.setState(
            ({ on }) => ({ on: !on }),
            () => this.props.onToggle(this.state.on),
        )
    render() {
        return this.props.render({
            on: this.state.on,
            toggle: this.toggle
        });
    }
}

function MyToggle({ on, toggle }) {
    return (<button onClick={toggle}>{on ? 'on' : 'off'}</button>);
}

function App() {
    return (
        <ToggleStream
            onToggle={on => console.log('toggle', on)}
            render={({ on, toggle }) => (
                <div>
                    {`The button id ${on ? 'on' : 'off'}`}
                    <Switch on={on} onClick={toggle} />
                    <MyToggle on={on} toggle={toggle} />
                </div>
            )}
        />
    );
}

export default App;
