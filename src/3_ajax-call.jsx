import React from 'react';
import { componentFromStream } from 'recompose';
import { Observable } from 'rxjs';

const personById = id => `https://swapi.co/api/people/${id}`;

const Card = props => (
    <div>
        <h1>{props.name}</h1>
        <h2>{props.homeworld}</h2>
    </div>
);

const loadById = id =>
    Observable.ajax(personById(id))
        .pluck('response')
        .switchMap(
            response => Observable.ajax(response.homeworld)
                .pluck('response')
                .startWith({ name: '' }),
            (person, homeworld) => ({ ...person, homeworld: homeworld.name })
        );

const CardStream = componentFromStream(props$ =>
    props$
        .switchMap(props => loadById(props.id))
        .map(Card)
);

const App = props => (
    <div>
        <Card name="John" homeworld="Earth" />
        <CardStream id={1} />
    </div>
);

export default App;
