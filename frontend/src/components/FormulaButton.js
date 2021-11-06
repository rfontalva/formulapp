import React from 'react';
import PropTypes from 'prop-types';
import CheatsheetSelector from './CheatsheetSelector';
import userUtils from '../utils/userUtils';
import '../index.css';

const EditButton = ({ user, id }) => (
  <>
    {userUtils.isLoggedIn(user) && (
    <a className="formula-button" title="Editar formula" href={`/edit/${id}`}>
      <i className="fa fa-edit" />
    </a>
    )}
  </>
);

const AddButton = ({
  id, handleClick, user, isAdded,
}) => (
  <>
    {!isAdded && (
      <div className="cheatsheet-dropdown">
        <button
          type="button"
          className="formula-button add-button"
          title="Add formula"
          onClick={handleClick}
        >
          <i
            className="fa fa-plus"
          />
        </button>
        {userUtils.isLoggedIn(user)
            && <CheatsheetSelector id_formula={id} />}
      </div>
    )}
  </>
);

const RemoveButton = ({
  action, handleClick, id, user,
}) => {
  const report = () => (
    <button
      type="button"
      className="formula-button"
      title="Reportar formula"
      onClick={() => handleClick(id)}
    >
      <i
        className="fa fa-flag"
      />
    </button>
  );

  const remove = () => (
    <button
      type="button"
      className="formula-button"
      title="Eliminar formula"
      onClick={() => handleClick(id)}
    >
      <i
        className="fa fa-trash"
      />
    </button>
  );

  if (action === 'report' && userUtils.isLoggedIn(user)) {
    return report();
  }
  if (action === 'remove') return remove();
  return (<></>);
};

const Button_states = ({
  id, handleClick, isAdded, user,
}) => ({
  add: <AddButton
    id={id}
    handleClick={handleClick}
    user={user}
    isAdded={isAdded}
  />,
  edit: <EditButton id={id} user={user} />,
  remove: <RemoveButton action="remove" user={user} id={id} handleClick={handleClick} />,
  report: <RemoveButton action="report" user={user} id={id} handleClick={handleClick} />,
});

const FormulaButton = (props) => (
  Button_states(props)[props.state]
);

FormulaButton.propTypes = {
  id: PropTypes.number.isRequired,
  state: PropTypes.string.isRequired,
  handleClick: PropTypes.func,
  isAdded: PropTypes.bool,
  user: PropTypes.string,
};

FormulaButton.defaultProps = {
  handleClick: undefined,
  isAdded: false,
  user: undefined,
  action: 'remove',
};

EditButton.propTypes = {
  user: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
};

AddButton.propTypes = {
  id: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  isAdded: PropTypes.bool.isRequired,
  user: PropTypes.string.isRequired,
};

RemoveButton.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default FormulaButton;
