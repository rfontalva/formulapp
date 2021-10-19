import React from 'react';
import MenuItems from './data/menu.json';
import userUtils from '../utils/userUtils';
import UserContext from '../context/UserContext';

const Footer = () => {
  const { user, setUser } = React.useContext(UserContext);

  return (
    <footer>
      <a style={{ textDecoration: 'none', color: 'inherit' }} href="/">
        <h3 className="footer-title">
          Formulapp®
        </h3>
      </a>
      <ul className="footer-menu">
        {MenuItems.map(({ title, link }) => (
          <li key={`${title}`}>
            <a key={`${title}`} href={link}>{title}</a>
          </li>
        ))}
        <li>
          <a href="/about">Acerca de</a>
        </li>
        {userUtils.isLoggedIn(user) && (
        <button
          type="button"
          id="footer-button"
          className="footer-menu"
          onClick={() => userUtils.logOut(setUser)}
          onKeyDown={() => userUtils.logOut(setUser)}
        >
          Cerrar sesión
        </button>
        )}
      </ul>
    </footer>
  );
};

export default Footer;
