import React from 'react';
import '../index.css';
import SearchBar from './SearchBar';
import Burger from './Burger';
import SideMenu from './SideMenu';
import useMobile from '../hooks/useMobile';
import RefContext from '../context/RefContext';

const Navbar = () => {
  const { titleRef, divClick } = React.useContext(RefContext);
  const [isOpen, setIsOpen] = React.useState(false);
  const sideNavRef = React.createRef();
  const br = React.createRef();
  const isMobile = useMobile();

  const clickHandler = () => {
    setIsOpen(!isOpen);
  };

  React.useEffect(() => {
    if (isOpen) {
      sideNavRef.current.style.width = '150px';
      titleRef.current.style.marginLeft = '155px';
    } else {
      sideNavRef.current.style.width = '0px';
      titleRef.current.style.marginLeft = '1rem';
    }
  }, [isOpen]);

  React.useEffect(() => {
    setIsOpen(false);
  }, [divClick]);

  return (
    <div aria-hidden="true" className="topnav">
      <SearchBar />
      <SideMenu ref={sideNavRef} />
      <nav>
        <ul>
          {isMobile && (
          <li>
            <Burger ref={br} clickHandler={clickHandler} />
          </li>
          )}
          {isMobile || (
          <>
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
          </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
