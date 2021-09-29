import React from 'react';
import MenuItems from './data/menu.json';
import RefContext from '../context/RefContext';

const Footer = () => {
  const { user, setUser } = React.useContext(RefContext);
  const logOut = () => {
    setUser();
    document.cookie = 'username=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };
  return (
    <footer>
      <h3 className="footer-title">Formulapp®</h3>
      <ul className="footer-menu">
        {MenuItems.map(({ title, link }) => (
          <li key={`${title}`}>
            <a key={`${title}`} href={link}>{title}</a>
          </li>
        ))}
        {user && (
        <button
          type="button"
          id="footer-button"
          className="footer-menu"
          onClick={logOut}
          onKeyDown={logOut}
        >
          Cerrar sesión
        </button>
        )}
      </ul>
    </footer>
  );
};

export default Footer;
