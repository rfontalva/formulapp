import React from 'react';
import '../index.css';

const Navbar = () => (
  <div className="topnav">
    <nav>
      <ul>
        <li>
          <a href="/">Inicio</a>
        </li>
        <li>
          <a href="/add">Agregar</a>
        </li>
      </ul>
    </nav>
  </div>
);

export default Navbar;
