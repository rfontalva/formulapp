import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';

const BlurBox = ({ children }) => (
  <div className="blur">
    {children}
  </div>
);

BlurBox.propTypes = {
  children: PropTypes.element.isRequired,
};

export default BlurBox;
