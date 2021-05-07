import React from 'react';
import MathJax from '@innodoc/react-mathjax-node';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  Home, InputFormula, Navbar, Error, Lookup, PdfGenerator,
} from './components/index';

window.backend = 'http://192.168.1.12:4000/';
window.frontend = 'http://192.168.1.12:3000/';

const Formulapp = () => (
  <div className="app-title">
    <h1 style={{ display: 'inline' }}>Formulapp</h1>
    <MathJax.Provider>
      <MathJax.MathJaxNode style={{ marginLeft: '2rem' }} displayType="inline" texCode="e^{-j\pi}+i=0" />
    </MathJax.Provider>
  </div>
);

const App = () => (
  <Router>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
    <Navbar />
    <Formulapp />
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
      <Route path="*">
        <Error />
      </Route>
    </Switch>
  </Router>
);

export default App;
