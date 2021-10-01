import React, { useState } from 'react';
import RefContext from '../context/RefContext';
import urlUtils from '../utils/urlUtils';
import '../index.css';

const SignUp = () => {
  const { setUser } = React.useContext(RefContext);
  const [account, setAccount] = useState({});
  const [wrongPassword, setWrongPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({ emailExists: false, usernameExists: false });

  const submitHandler = async (e) => {
    e.preventDefault();
    const {
      firstname, lastname, username, email, password, password2,
    } = account;
    if (password !== password2) {
      setWrongPassword(true);
      return;
    }
    try {
      const res = await fetch(`/api/user?firstname=${firstname}&lastname=${lastname}&email=${email}&username=${username}&password=${password}`,
        { method: 'PUT' });
      switch (res.status) {
        case 401:
          setErrorMessages(res.json());
          break;
        case 200:
          setUser(username);
          urlUtils.goToUrl('profile');
          break;
        default:
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  const changeHandler = (e) => {
    const { name } = e.target;
    const { value } = e.target;
    if ((name === 'password' || name === 'password2') && wrongPassword) {
      setWrongPassword(false);
    }
    if (name === 'email' && errorMessages.emailExists) {
      setErrorMessages({ ...errorMessages, emailExists: false });
    }
    if (name === 'email' && errorMessages.usernameExists) {
      setErrorMessages({ ...errorMessages, usernameExists: false });
    }
    setAccount({ ...account, [name]: value });
  };

  return (
    <article className="grid">
      <div className="inputs-box">
        <h1>Registrate</h1>
        <form onSubmit={submitHandler}>
          <label htmlFor="firstname">
            Nombre
            <input type="text" id="firstname" name="firstname" onChange={changeHandler} value={account.firstname} />
          </label>
          <label htmlFor="lastname">
            Apellido
            <input type="text" id="lastname" name="lastname" onChange={changeHandler} value={account.lastname} />
          </label>
          <label htmlFor="username">
            Nombre de usuario
            <input type="text" id="username" name="username" onChange={changeHandler} value={account.username} />
          </label>
          {errorMessages.usernameExists && <p className="error-text">{errorMessages.usernameExists}</p>}
          <label htmlFor="email">
            Email
            <input type="email" id="email" name="email" onChange={changeHandler} value={account.email} />
          </label>
          {errorMessages.emailExists && <p className="error-text">{errorMessages.emailExists}</p>}
          <label htmlFor="password">
            Contraseña
            <input type="password" id="password" name="password" onChange={changeHandler} value={account.password} />
          </label>
          <label htmlFor="password2">
            Repita su contraseña
            <input type="password" id="password2" name="password2" onChange={changeHandler} value={account.password2} />
          </label>
          {wrongPassword && <p className="error-text">Las contraseñas no coinciden</p>}
          <button type="submit" onClick={submitHandler}>Enviar</button>
        </form>
      </div>
    </article>
  );
};

export default SignUp;
