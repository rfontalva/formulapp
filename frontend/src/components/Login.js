import React, { useState } from 'react';
import PropTypes from 'prop-types';
import RefContext from '../context/RefContext';
import utils from '../utils/urlUtils';
import '../index.css';

const Login = ({ show, setShow }) => {
  const { setUser } = React.useContext(RefContext);
  const [inputs, setInputs] = useState({});
  const [wrongUser, setWrongUser] = useState(false);
  const close = () => {
    setShow(false);
    setInputs({ email: '', password: '' });
    setWrongUser(false);
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    console.log(inputs);
    setInputs({ ...inputs, [name]: value });
  };

  const authenticate = async () => {
    setWrongUser(false);
    const { email, password } = inputs;
    const response = await fetch(`/api/authenticate?email=${email}&password=${password}`, { method: 'POST' });
    if (response.status === 200) {
      const { username } = await response.json();
      setUser(username);
      setShow(false);
      const cookievalue = `username=${username}`;
      const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000 * 24).toGMTString();
      document.cookie = `${cookievalue};expires=${expiryDate}`;
      return;
    }
    setWrongUser(true);
  };

  return (
    show
    && (
    <div className="blur">
      <div className="login-container">
        <div className="form-container sign-in-container">
          <button type="button" className="close-login" onClick={close}>
            <i className="fa fa-close" />
          </button>
          <form className="login-form" action="#">
            <h1>Iniciar sesión</h1>
            <input
              className="login-input"
              id="email"
              type="email"
              placeholder="Email"
              name="email"
              onChange={changeHandler}
            />
            <input
              className="login-input"
              id="password"
              type="password"
              placeholder="Contraseña"
              name="password"
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
    </div>
    )
  );
};

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  setShow: PropTypes.func.isRequired,
};

export default Login;

// <div className="social-container">
//   <a href="/" className="social">
//     <i className="fa fa-facebook" />
//   </a>
//   <a href="/" className="social">
//     <i className="fa fa-google" aria-hidden="true" />
//   </a>
//   <a href="/" className="social">
//     <i className="fa fa-twitter" />
//   </a>
// </div>
