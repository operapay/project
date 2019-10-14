import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Offset from './visualize/offset';
import Count from './countroute'
import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/offset">
        <Offset/>
      </Route>
      <Route path="/count">
        <Count/>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
