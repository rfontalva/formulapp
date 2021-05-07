import React from 'react';
import PropTypes from 'prop-types';
import MathJax from '@innodoc/react-mathjax-node';
import '../index.css';

const Formula = ({
  id, title, equation, txt, handleRemove, buttons,
}) => {
  const addId = () => {
    if (!localStorage.ids) {
      localStorage.ids = '';
    }
    localStorage.ids += `ids=${id}&`;
  };

  return (
    <article className="formula">
      <h3 className="formula-title">{title}</h3>
      {buttons && (
      <button
        type="button"
        className="formula-button"
        title="Delete formula"
        onClick={() => handleRemove(id)}
      >
        <i
          className="fa fa-trash"
        />
      </button>
      )}
      {buttons && (
      <a className="formula-button" title="Edit formula" href={`${window.frontend}edit/${id}`}>
        <i className="fa fa-edit" />
      </a>
      )}
      {buttons && (
      <button
        type="button"
        className="formula-button"
        title="Add formula"
        onClick={addId}
      >
        <i
          className="fa fa-plus"
        />
      </button>
      )}
      <div style={{ clear: 'both' }} />
      <MathJax.Provider>
        <MathJax.MathJaxNode displayType="inline" texCode={equation} />
      </MathJax.Provider>
      <p>{txt}</p>
    </article>
  );
};

Formula.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  equation: PropTypes.string.isRequired,
  txt: PropTypes.string.isRequired,
  handleRemove: PropTypes.func,
  buttons: PropTypes.bool,
};

Formula.defaultProps = {
  handleRemove: () => {},
  buttons: false,
};

export default Formula;
