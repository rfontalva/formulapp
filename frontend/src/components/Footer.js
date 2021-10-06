import React from 'react';
import MenuItems from './data/menu.json';
import userUtils from '../utils/userUtils';

const Footer = () => (
  <footer>
    <h3 className="footer-title">Formulapp®</h3>
    <ul className="footer-menu">
      {MenuItems.map(({ title, link }) => (
        <li key={`${title}`}>
          <a key={`${title}`} href={link}>{title}</a>
        </li>
      ))}
      {userUtils.isLoggedIn() && (
        <button
          type="button"
          id="footer-button"
          className="footer-menu"
          onClick={userUtils.logOut()}
          onKeyDown={userUtils.logOut()}
        >
          Cerrar sesión
        </button>
      )}
    </ul>
  </footer>
);

export default Footer;
