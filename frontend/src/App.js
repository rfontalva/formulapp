import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import RefContext from './context/RefContext';
import {
  AppTitle, Home, InputFormula, Navbar, Error, Lookup, PdfGenerator, Footer,
} from './components/index';

window.frontend = 'http://localhost:3000/';

const App = () => {
  const titleRef = React.useRef(null);
  const opRef = React.useRef(null);
  const [divClick, setDivClick] = React.useState(false);
  const mouseDownHandler = (e) => {
    if (opRef.current.contains(e.target)) setDivClick(!divClick);
  };
  const refs = { titleRef, opRef, divClick };
  return (
    <div className="page-container">
      <RefContext.Provider value={refs}>
        <div className="content-wrap">
          <Router>
            <Navbar />
            <div aria-hidden="true" onMouseDown={mouseDownHandler} ref={opRef}>
              <AppTitle ref={titleRef} />
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
            </div>
          </Router>
        </div>
        <Footer />
      </RefContext.Provider>
    </div>
  );
};

export default App;
