import React from 'react';
import PropTypes from 'prop-types';
import urlUtils from '../utils/urlUtils';
import userUtils from '../utils/userUtils';
import UserContext from '../context/UserContext';

const DeleteCheatsheetPopUp = ({ id_cheatsheet, hideBlurBox, getCheatsheets }) => {
  const removeSheet = async () => {
    hideBlurBox();
    fetch(`/api/cheatsheet?id=${id_cheatsheet}`, { method: 'DELETE' }).then(
      getCheatsheets(),
    ).catch((err) => { throw new Error(err); });
  };
  return (
    <div className="inputs-box centered-box">
      <h3>Se eliminará la hoja de fórmulas</h3>
      <button type="button" onClick={removeSheet}>Aceptar</button>
      <button
        type="button"
        onClick={hideBlurBox}
        className="warning-btn"
      >
        Cancelar
      </button>
    </div>
  );
};

DeleteCheatsheetPopUp.propTypes = {
  id_cheatsheet: PropTypes.number.isRequired,
  hideBlurBox: PropTypes.func.isRequired,
  getCheatsheets: PropTypes.func.isRequired,
};

const ShareCheatsheetPopUp = ({ id_cheatsheet, hideBlurBox }) => {
  const [searchUser, setSearchUser] = React.useState('');
  const [permission, setPermission] = React.useState('r');
  const [hasError, setHasError] = React.useState(false);
  const userHandler = (e) => {
    setSearchUser(e.target.value);
    setHasError(false);
  };

  const shareSheet = async () => {
    const res = await fetch(`/api/shareCheatsheet?id=${id_cheatsheet}&username=${searchUser}&permission=${permission}`,
      { method: 'POST' });
    if (res.status === 401) {
      setHasError(true);
    } else {
      hideBlurBox();
    }
  };

  return (
    <div className="inputs-box centered-box">
      <button type="button" className="close-login" onClick={hideBlurBox}>
        <i className="fa fa-close" />
      </button>
      <h3>Compartir</h3>
      <label htmlFor="userSearch">
        Nombre de usuario
        <input type="text" id="userSearch" name="userSearch" onChange={userHandler} value={searchUser} />
      </label>
      <select id="permission" name="permission" onChange={(e) => setPermission(e.target.value)}>
        <option value="r">Sólo lectura</option>
        <option value="w">Edición</option>
      </select>
      <button type="button" onClick={() => shareSheet(id_cheatsheet)}>Aceptar</button>
      {hasError && <p className="error-text">El nombre de usuario no existe</p>}
    </div>
  );
};

ShareCheatsheetPopUp.propTypes = {
  id_cheatsheet: PropTypes.number.isRequired,
  hideBlurBox: PropTypes.func.isRequired,
};

const DeleteAccount = ({ user, hideBlurBox }) => {
  const [password, setPassword] = React.useState('');
  const [hasFailed, setHasFailed] = React.useState(false);
  const { setUser } = React.useContext(UserContext);
  const removeUser = async () => {
    try {
      const res = await fetch(`/api/user?username=${user}&password=${password}`, { method: 'DELETE' });
      if (res.status === 401) {
        setHasFailed(true);
      }
      hideBlurBox();
      userUtils.logOut(setUser);
      urlUtils.goHome();
    } catch (err) {
      throw new Error(err);
    }
  };

  const changeHandler = (e) => {
    setPassword(e.target.value);
    setHasFailed(false);
  };

  return (
    <div className="inputs-box centered-box">
      <h3>Se eliminará la cuenta</h3>
      <label htmlFor="password">
        Confirma tu contraseña
        <input
          type="password"
          id="password"
          name="password"
          onChange={changeHandler}
          value={password}
        />
      </label>
      {hasFailed && <p className="error-text">Contraseña incorrecta</p>}
      <button type="button" onClick={removeUser}>Aceptar</button>
      <button
        type="button"
        onClick={hideBlurBox}
        className="warning-btn"
      >
        Cancelar
      </button>
    </div>
  );
};

DeleteAccount.propTypes = {
  user: PropTypes.string.isRequired,
  hideBlurBox: PropTypes.func.isRequired,
};

export { DeleteCheatsheetPopUp, ShareCheatsheetPopUp, DeleteAccount };
