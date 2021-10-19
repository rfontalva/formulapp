import React from 'react';
import '../index.css';
import SearchBar from './SearchBar';
import Burger from './Burger';
import SideMenu from './SideMenu';
import Login from './Login';
import useMobile from '../hooks/useMobile';
import RefContext from '../context/RefContext';
import UserContext from '../context/UserContext';
import MenuItems from './data/menu.json';
import utils from '../utils/urlUtils';
import UserMenu from './UserMenu';
import userUtils from '../utils/userUtils';

const Navbar = () => {
  const {
    titleRef, divClick,
  } = React.useContext(RefContext);
  const { user } = React.useContext(UserContext);
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
  }, [divClick]);

  return (
    <>
      <Login show={show} setShow={setShow} />
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
                  <a className="navbar-item navbar-menu" key={title} href={link}>{title}</a>
                </li>
              ))}
            </>
            )}
          </ul>
        </nav>
        {!userUtils.isLoggedIn(user)
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
        {userUtils.isLoggedIn(user) && (
          <div className="dropdown login-navbar">
            <button
              type="button"
              className="login-navbar"
              id="user-button"
              onKeyDown={() => keyDownHandler}
              onClick={() => utils.goToUrl('profile')}
            >
              <span style={{ marginRight: '5px' }}>
                <i className="fa fa-user" />
              </span>
              {user}
            </button>
            <UserMenu />
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
