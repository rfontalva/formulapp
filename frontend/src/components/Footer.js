import React from 'react';
import MenuItems from './data/menu.json';

const Footer = () => (
  <footer>
    <h3 className="footer-title">Formulapp®</h3>
    <ul className="footer-menu">
      {MenuItems.map(({ title, link }) => (
        <li key={`${title}`}>
          <a key={`${title}`} href={link}>{title}</a>
        </li>
      ))}
    </ul>
  </footer>
);

export default Footer;
