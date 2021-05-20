import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';

const Burger = React.forwardRef(({ clickHandler }, ref) => (
  <button ref={ref} className="burger navbar-item" type="button" onClick={clickHandler}>
    <div />
    <div />
    <div />
  </button>
));

Burger.propTypes = {
  clickHandler: PropTypes.func.isRequired,
};

export default Burger;
