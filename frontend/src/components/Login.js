import React from 'react';
import PropTypes from 'prop-types';
import '../index.css';

const Login = ({ show }) => (
  show
    && (
    <div className="login-container">
      <div className="form-container sign-in-container">
        <form className="login-form" action="#">
          <h1>Iniciar sesión</h1>
          <input className="login-input" type="email" placeholder="Email" />
          <input className="login-input" type="password" placeholder="Contraseña" />
          <a href="/">Olvidaste tu contraseña?</a>
          <button type="button">Ingresar</button>
          <p href="/">Aún no tienes una cuenta?</p>
          <button type="button">Registrate</button>
        </form>
      </div>
    </div>
    )
);

Login.propTypes = {
  show: PropTypes.bool.isRequired,
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
