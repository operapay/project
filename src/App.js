import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Offset from './visualize/offset';
import OffsetAnalyze from './analytics/offset'
import Holding from './visualize/holding';
import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/offset/visualize">
        <Offset/>
      </Route>
      <Route path="/offset/analyze">
        <OffsetAnalyze/>
      </Route>
      <Route path="/holding/visualize">
        <Holding/>
      </Route>
      <Route path="/holding/analyze">
        <OffsetAnalyze/>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
