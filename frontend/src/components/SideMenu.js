import React from 'react';
import MenuItems from './data/menu.json';

const SideMenu = React.forwardRef((_, ref) => (
  <div ref={ref} className="sidenav">
    <nav>
      <ul>
        {MenuItems.map(({ title, link }) => (
          <li key={`sm${title}`}>
            <a key={`sm${title}`} href={link}>{title}</a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
));

export default SideMenu;
