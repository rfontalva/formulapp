import React from 'react';
import '../index.css';
import userUtils from '../utils/userUtils';

const UserMenu = () => (
  <div className="dropdown-content">
    <ul>
      <li>
        <a className="navbar-item dropdown-item" href="/sheets">Mis hojas</a>
      </li>
      <li>
        <button
          type="button"
          className="navbar-menu dropdown-item dropdown-button"
          onClick={userUtils.logOut()}
          onKeyDown={userUtils.logOut()}
        >
          Cerrar sesión
        </button>
      </li>
    </ul>
  </div>
);

export default UserMenu;
