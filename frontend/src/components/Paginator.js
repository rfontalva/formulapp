import React from 'react';
import PropTypes from 'prop-types';

const Paginator = ({
  paginate, page, length,
}) => {
  const handleClick = (increment) => {
    paginate(increment);
  };
  const hasMore = page * 9 < length;
  return (
    <>
      { page !== 0
        && (
        <button
          className="previous arrow-button"
          onClick={() => handleClick(-1)}
          type="button"
        >
          <i className="fa fa-arrow-circle-left" />
        </button>
        )}
      { hasMore
        && (
        <button
          className="next arrow-button"
          onClick={() => handleClick(1)}
          type="button"
        >
          <i className="fa fa-arrow-circle-right" />
        </button>
        )}
    </>
  );
};

Paginator.propTypes = {
  length: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  paginate: PropTypes.func.isRequired,
};

export default Paginator;
