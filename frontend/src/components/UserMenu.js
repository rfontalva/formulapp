import React from 'react';
import '../index.css';

const UserMenu = () => (
  <div className="dropdown-content">
    <ul>
      <li>
        <a className="navbar-item dropdown-item" href="/sheets">Mis hojas</a>
      </li>
      <li>
        <p className="navbar-menu dropdown-item" href="/">Cerrar sesión</p>
      </li>
    </ul>
  </div>
);

export default UserMenu;
