import React from 'react';
import PropTypes from 'prop-types';
import MathJax from '@innodoc/react-mathjax-node';
import CheatsheetContext from '../context/CheatsheetContext';
import UserContext from '../context/UserContext';
import userUtils from '../utils/userUtils';
import '../index.css';
import FormulaButton from './FormulaButton';

const Formula = ({
  id, title, equation, txt, buttons,
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
      {buttons.map((obj) => {
        if (obj.state === 'add') {
        // eslint-disable-next-line no-param-reassign
          obj.handleClick = addId;
        }
        return (
          <FormulaButton
            key={obj.state + obj.id}
            state={obj.state}
            id={obj.id}
            user={obj.user}
            handleClick={obj.handleClick}
            isAdded={isAdded}
          />
        );
      })}
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
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Formula;
