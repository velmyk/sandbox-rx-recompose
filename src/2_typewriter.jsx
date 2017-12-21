import React from 'react';
import { Observable } from 'rxjs';
import { componentFromStream } from 'recompose';

const App = props => (
  <div>
      <h1>{props.message}</h1>
  </div>
);

const createTypewriter = (message, speed) =>
  Observable.zip(
      Observable.from(message),
      Observable.interval(speed),
      letter => letter,
  ).scan((acc, curr) => acc + curr);

const StreamingApp = componentFromStream(props$ =>
  props$
      .switchMap(({ message, speed }) => createTypewriter(message, speed))
      .map(message => ({ message }))
      .map(App)
);

export default StreamingApp;
