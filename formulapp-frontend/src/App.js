import React from 'react'
import MathJax from '@innodoc/react-mathjax-node'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home'
import InputFormula from './components/InputFormula';
import Navbar from './components/Navbar';
import Error from './components/Error';

const Formulapp = () => {
  return (
    <div className='app-title'>
      <h1 style={{display:"inline"}}>Formulapp</h1>
      <MathJax.Provider>
        <MathJax.MathJaxNode style={{marginLeft:'2rem'}} displayType="inline" texCode='e^{-j\pi}+i=0' />
      </MathJax.Provider>
    </div>
  );
}

export const App = () => {
    return(
      <Router>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <Navbar />
        <Formulapp />
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/add'>
            <InputFormula />
          </Route>
          <Route path='/edit/:id' children={<InputFormula/>}></Route>
          <Route path='*'>
            <Error />
          </Route>
        </Switch>
      </Router>
    );
}