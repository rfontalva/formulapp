import React from 'react';

const SideMenu = React.forwardRef((_, ref) => (
  <div ref={ref} className="sidenav">
    <nav>
      <ul>
        <li>
          <a href="/">Inicio</a>
        </li>
        <li>
          <a href="/add">Agregar</a>
        </li>
        <li>
          <a href="/lookup">Buscar</a>
        </li>
        <li>
          <a href="/generate">Crear</a>
        </li>
      </ul>
    </nav>
  </div>
));

export default SideMenu;
