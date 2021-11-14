import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';

const BlurBox = React.forwardRef(({ child }, ref) => (
  <div ref={ref} className="blur" style={{ display: 'none' }}>
    {child}
  </div>
));

BlurBox.propTypes = {
  child: PropTypes.element.isRequired,
};

export default BlurBox;
