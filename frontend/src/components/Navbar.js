import React from 'react';
import '../index.css';
import PropTypes from 'prop-types';
import SearchBar from './SearchBar';
import Burger from './Burger';
import SideMenu from './SideMenu';
import Login from './Login';
import useMobile from '../hooks/useMobile';
import RefContext from '../context/RefContext';
import MenuItems from './data/menu.json';

const Navbar = ({ user, setUser }) => {
  const { titleRef, divClick } = React.useContext(RefContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const sideNavRef = React.createRef();
  const br = React.createRef();
  const isMobile = useMobile();
  const [show, setShow] = React.useState(false);
  const clickHandler = () => {
    setIsOpen(!isOpen);
  };

  const login = () => {
    setShow(!show);
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13) login();
  };

  React.useEffect(() => {
    if (isOpen) {
      sideNavRef.current.style.width = '150px';
      titleRef.current.style.marginLeft = '155px';
    } else {
      sideNavRef.current.style.width = '0px';
      titleRef.current.style.marginLeft = '1rem';
    }
  }, [isOpen]);

  React.useEffect(() => {
    setIsOpen(false);
    setUser();
  }, [divClick]);

  return (
    <>
      <Login show={show} />
      <div aria-hidden="true" className="topnav">
        <SearchBar />
        <SideMenu ref={sideNavRef} />
        <nav>
          <ul>
            {isMobile && (
            <li>
              <Burger ref={br} clickHandler={clickHandler} />
            </li>
            )}
            {isMobile || (
            <>
              {MenuItems.map(({ title, link }) => (
                <li key={title}>
                  <a key={title} href={link}>{title}</a>
                </li>
              ))}
            </>
            )}
          </ul>
        </nav>
        {!user
          && (
          <button
            type="button"
            className="login-navbar"
            onKeyDown={() => keyDownHandler}
            onClick={() => login()}
          >
            Iniciar sesión
          </button>
          )}
      </div>
    </>
  );
};

Navbar.propTypes = {
  user: PropTypes.number.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default Navbar;
