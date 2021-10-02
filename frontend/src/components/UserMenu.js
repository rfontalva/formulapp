import React from 'react';
import '../index.css';
import RefContext from '../context/RefContext';
import urlUtils from '../utils/urlUtils';

const UserMenu = () => {
  const { setUser } = React.useContext(RefContext);
  const logOut = () => {
    setUser();
    document.cookie = 'username=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    urlUtils.goHome();
  };
  return (
    <div className="dropdown-content">
      <ul>
        <li>
          <a className="navbar-item dropdown-item" href="/sheets">Mis hojas</a>
        </li>
        <li>
          <button
            type="button"
            className="navbar-menu dropdown-item dropdown-button"
            onClick={logOut}
            onKeyDown={logOut}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
