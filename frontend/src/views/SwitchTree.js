import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import InputFormula from './InputFormula';
import Lookup from './Lookup';
import PdfGenerator from './PdfGenerator';
import SignUp from './SignUp';
import Error from './Error';
import Profile from './Profile';
import About from './About';
import Cheatsheet from './Cheatsheet';
import MyFormulas from './MyFormulas';
import { SheetsList } from '../components/index';

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
    <Route path="/cheatsheet/:idCheatsheet">
      <Cheatsheet />
    </Route>
    <Route path="/signup">
      <SignUp />
    </Route>
    <Route path="/profile">
      <Profile />
    </Route>
    <Route path="/about">
      <About />
    </Route>
    <Route path="/sheets">
      <SheetsList />
    </Route>
    <Route path="/formulas">
      <MyFormulas />
    </Route>
    <Route path="*">
      <Error />
    </Route>
  </Switch>
);

export default SwitchTree;
