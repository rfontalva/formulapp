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
  const [reported, setReported] = React.useState(false);

  const wrapperHandler = () => {
    handleClick(id);
    setReported(true);
  };

  const report = () => (
    <button
      type="button"
      className="formula-button"
      title="Reportar formula"
      onClick={wrapperHandler}
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

  if (action === 'report' && userUtils.isLoggedIn(user) && !reported) {
    return report();
  }
  if (action === 'remove') {
    return remove();
  }
  return (<></>);
};

const OpinionButton = ({
  action, handleClick, id, user,
}) => {
  const approve = () => (
    <button
      type="button"
      className="formula-button"
      title="Esta fórmula está bien"
      onClick={() => handleClick(id, 'positive', user)}
    >
      <i
        className="fa fa-check"
      />
    </button>
  );

  const reject = () => (
    <button
      type="button"
      className="formula-button"
      title="Esta fórmula está mal"
      onClick={() => handleClick(id, 'negative', user)}
    >
      <i
        className="fa fa-close"
      />
    </button>
  );

  const NA = () => (
    <button
      type="button"
      className="formula-button"
      title="Sin opinion"
      onClick={() => handleClick()}
    >
      <i
        className="fa fa-question"
      />
    </button>
  );

  switch (action) {
    case 'reject':
      return reject();
    case 'approve':
      return approve();
    case 'NA':
      return NA();
    default:
      return <></>;
  }
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
  approve: <OpinionButton action="approve" user={user} id={id} handleClick={handleClick} />,
  reject: <OpinionButton action="reject" user={user} id={id} handleClick={handleClick} />,
  NA: <OpinionButton action="NA" user={user} id={id} handleClick={handleClick} />,
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

OpinionButton.propTypes = {
  id: PropTypes.number.isRequired,
  user: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default FormulaButton;
