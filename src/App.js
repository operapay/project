import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Offset from './visualize/offset';
import OffsetAnalyze from './analytics/offset'
import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/offset">
        <Offset/>
      </Route>
      <Route path="/offset_analyze">
        <OffsetAnalyze/>
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
