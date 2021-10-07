import React from 'react';
import '../index.css';
import userUtils from '../utils/userUtils';
import RefContext from '../context/RefContext';

const UserMenu = () => {
  const { setUser } = React.useContext(RefContext);
  return (
    <div className="dropdown-content">
      <ul>
        <li>
          <a className="navbar-item dropdown-item" href="/sheets">Mis hojas</a>
        </li>
        <li>
          <a className="navbar-item dropdown-item" href="/formulas">Mis fórmulas</a>
        </li>
        <li>
          <a className="navbar-item dropdown-item" href="/moderate">Moderar</a>
        </li>
        <li>
          <button
            type="button"
            className="navbar-menu dropdown-item dropdown-button"
            onClick={() => userUtils.logOut(setUser)}
            onKeyDown={() => userUtils.logOut(setUser)}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
