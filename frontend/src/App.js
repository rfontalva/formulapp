import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import RefContext from './context/RefContext';
import {
  AppTitle, Navbar, Footer,
} from './components/index';
import SwitchTree from './views/SwitchTree';

window.frontend = 'http://localhost:3000/';

const App = () => {
  const titleRef = React.useRef(null);
  const opRef = React.useRef(null);

  const [divClick, setDivClick] = React.useState(false);
  const [user, setUser] = React.useState();

  const mouseDownHandler = (e) => {
    if (opRef.current.contains(e.target)) setDivClick(!divClick);
  };
  const refs = {
    titleRef, opRef, divClick, user, setUser,
  };

  React.useEffect(() => {
    const username = 'username=';
    const search = document.cookie.search(username);
    if (search !== -1) {
      const startIndex = search + username.length;
      const end = document.cookie.slice(startIndex).search(';') + startIndex;
      setUser(document.cookie.slice(startIndex, end));
    }
  }, []);

  return (
    <div className="page-container">
      <RefContext.Provider value={refs}>
        <div className="content-wrap">
          <Router>
            <Navbar user={user} setUser={setUser} />
            <div aria-hidden="true" onMouseDown={mouseDownHandler} ref={opRef}>
              <AppTitle ref={titleRef} />
              <SwitchTree />
            </div>
          </Router>
        </div>
        <Footer />
      </RefContext.Provider>
    </div>
  );
};

export default App;
