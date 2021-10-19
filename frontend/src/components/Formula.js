import React from 'react';
import PropTypes from 'prop-types';
import MathJax from '@innodoc/react-mathjax-node';
import CheatsheetSelector from './CheatsheetSelector';
import CheatsheetContext from '../context/CheatsheetContext';
import UserContext from '../context/UserContext';
import userUtils from '../utils/userUtils';
import '../index.css';

const Formula = ({
  id, title, equation, txt, handleRemove, buttons,
}) => {
  const { selectedCheatsheet } = React.useContext(CheatsheetContext);
  const { user } = React.useContext(UserContext);
  const [isAdded, setAdded] = React.useState(false);
  const addId = () => {
    if (userUtils.isLoggedIn(user) && selectedCheatsheet) {
      console.log('hola');
    }
    if (!localStorage.ids) {
      localStorage.ids = '';
    }
    localStorage.ids += `ids=${id}&`;
    setAdded(true);
  };

  return (
    <article className="formula">
      <h3 className="formula-title">{title}</h3>
      {handleRemove && (
      <button
        type="button"
        className="formula-button"
        title="Reportar formula"
        onClick={() => handleRemove(id)}
      >
        <i
          className="fa fa-flag"
        />
      </button>
      )}
      {buttons && (
      <a className="formula-button" title="Editar formula" href={`${window.frontend}edit/${id}`}>
        <i className="fa fa-edit" />
      </a>
      )}
      {buttons && !isAdded
        && (
          <div className="cheatsheet-dropdown">
            <button
              type="button"
              className="formula-button add-button"
              title="Add formula"
              onClick={addId}
            >
              <i
                className="fa fa-plus"
              />
            </button>
            <CheatsheetSelector />
          </div>
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
  handleRemove: undefined,
  buttons: false,
};

export default Formula;
