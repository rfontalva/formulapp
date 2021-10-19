import React, { useState } from 'react';
import PropTypes from 'prop-types';
import UserContext from '../context/UserContext';
import utils from '../utils/urlUtils';
import userUtils from '../utils/userUtils';
import '../index.css';
import BlurBox from './BlurBox';

const Login = ({ show, setShow }) => {
  const { setUser } = React.useContext(UserContext);
  const [inputs, setInputs] = useState({});
  const [wrongUser, setWrongUser] = useState(false);
  const close = () => {
    setShow(false);
    setInputs({ usernameInput: '', password: '' });
    setWrongUser(false);
  };

  const authenticate = async () => {
    setWrongUser(false);
    const { usernameInput, password } = inputs;
    const response = await fetch(`/api/authenticate?username=${usernameInput}&password=${password}`, { method: 'POST' });
    if (response.status === 200) {
      const { username } = await response.json();
      setUser(username);
      setShow(false);
      userUtils.cookieLogIn(username);
      return;
    }
    setWrongUser(true);
  };

  const keyDownHandler = (e) => {
    if (e.keyCode === 13) authenticate();
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  return (
    show
    && (
    <BlurBox>
      <div className="login-container">
        <div className="form-container sign-in-container">
          <button type="button" className="close-login" onClick={close}>
            <i className="fa fa-close" />
          </button>
          <form className="login-form" action="#">
            <h1>Iniciar sesión</h1>
            <input
              className="login-input"
              id="username"
              type="username"
              placeholder="Nombre de usuario"
              name="usernameInput"
              onKeyDown={keyDownHandler}
              onChange={changeHandler}
            />
            <input
              className="login-input"
              id="password"
              type="password"
              placeholder="Contraseña"
              name="password"
              onKeyDown={keyDownHandler}
              onChange={changeHandler}
            />
            {wrongUser && <p className="error-text">Usuario o contraseña incorrectos</p>}
            <a href="/">Olvidaste tu contraseña?</a>
            <button type="button" className="sign-btn" onClick={authenticate}>Ingresar</button>
            <p href="/">Aún no tienes una cuenta?</p>
            <button type="button" className="sign-btn" onClick={() => utils.goToUrl('signup')}>Registrate</button>
          </form>
        </div>
      </div>
    </BlurBox>
    )
  );
};

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default Login;
