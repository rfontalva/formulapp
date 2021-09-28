import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import InputFormula from './InputFormula';
import Lookup from './Lookup';
import PdfGenerator from './PdfGenerator';
import SignUp from './SignUp';
import Error from './Error';

const SwitchTree = () => (
  <Switch>
    <Route exact path="/">
      <Home />
    </Route>
    <Route path="/add">
      <InputFormula />
    </Route>
    <Route path="/edit/:id">
      <InputFormula />
    </Route>
    <Route path="/search/:searchTitle">
      <Home search />
    </Route>
    <Route path="/lookup">
      <Lookup />
    </Route>
    <Route path="/generate">
      <PdfGenerator />
    </Route>
    <Route path="/signup">
      <SignUp />
    </Route>
    <Route path="*">
      <Error />
    </Route>
  </Switch>
);

export default SwitchTree;
