import React from 'react';
import '../index.css';
import SearchBar from './SearchBar';

const Navbar = () => (
  <div className="topnav">
    <SearchBar />
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
