import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import logo from './logo.svg';
import Offset from './visualize/offset';
import OffsetAnalyze from './analytics/offset'
import Holding from './visualize/holding';
import HoldingAnalyze from './analytics/holding'
import Narbar from './navbar'
import './App.css';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="">
        <Narbar/>
      </Route>
      {/* <Route path="/offset/visualize">
        <Offset/>
      </Route>
      <Route path="/offset/analyze">
        <OffsetAnalyze/>
      </Route>
      <Route path="/holding/visualize">
        <Holding/>
      </Route>
      <Route path="/holding/analyze">
        <HoldingAnalyze/>
      </Route> */}
    </Switch>
  </BrowserRouter>
);

export default App;
