import React, { useState } from 'react';
import UserContext from '../context/UserContext';
import urlUtils from '../utils/urlUtils';
import userUtils from '../utils/userUtils';
import '../index.css';

const SignUp = () => {
  const { setUser } = React.useContext(UserContext);
  const [account, setAccount] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    password: '',
    password2: '',
  });
  const [wrongPassword, setWrongPassword] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    emailExists: false,
    usernameExists: false,
  });

  const validate = () => {
    let isValid = true;
    let firstname = false;
    let lastname = false;
    let username = false;
    let email = false;
    let password = false;
    if (account.firstname === '') {
      isValid = false;
      firstname = true;
    }
    if (account.lastname === '') {
      isValid = false;
      lastname = true;
    }
    if (account.username === '') {
      isValid = false;
      username = true;
    }
    if (account.email === '') {
      isValid = false;
      email = true;
    }
    if (account.password === '') {
      isValid = false;
      password = true;
    }
    setErrorMessages({
      ...errorMessages,
      firstname,
      lastname,
      username,
      email,
      password,
    });
    return isValid;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const {
      firstname, lastname, username, email, password, password2,
    } = account;
    if (password !== password2) {
      setWrongPassword(true);
      return;
    }
    if (!validate()) return;
    try {
      const res = await fetch(`/api/user?firstname=${firstname}&lastname=${lastname}&email=${email}&username=${username}&password=${password}`,
        { method: 'PUT' });
      switch (res.status) {
        case 401:
          setErrorMessages(await res.json());
          break;
        case 200:
          // eslint-disable-next-line
          const { user } = await res.json();
          setUser(user);
          userUtils.cookieLogIn(user);
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
      setErrorMessages({
        ...errorMessages, emailExists: false, email: false,
      });
    } else if (name === 'username' && errorMessages[name]) {
      setErrorMessages({
        ...errorMessages, usernameExists: false, username: false,
      });
    } else if (errorMessages[name]) {
      setErrorMessages({
        ...errorMessages, [name]: false,
      });
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
          {errorMessages.firstname && <p className="error-text">El campo Nombre no puede quedar vacío</p>}
          <label htmlFor="lastname">
            Apellido
            <input type="text" id="lastname" name="lastname" onChange={changeHandler} value={account.lastname} />
          </label>
          {errorMessages.lastname && <p className="error-text">El campo Apellido no puede quedar vacío</p>}
          <label htmlFor="username">
            Nombre de usuario
            <input type="text" id="username" name="username" onChange={changeHandler} value={account.username} />
          </label>
          {errorMessages.usernameExists && <p className="error-text">{errorMessages.usernameExists}</p>}
          {errorMessages.username && <p className="error-text">El campo Nombre de usuario no puede quedar vacío</p>}
          <label htmlFor="email">
            Email
            <input type="email" id="email" name="email" onChange={changeHandler} value={account.email} />
          </label>
          {errorMessages.emailExists && <p className="error-text">{errorMessages.emailExists}</p>}
          {errorMessages.email && <p className="error-text">El campo Email no puede quedar vacío</p>}
          <label htmlFor="password">
            Contraseña
            <input type="password" id="password" name="password" onChange={changeHandler} value={account.password} />
          </label>
          {errorMessages.password && <p className="error-text">El campo Contraseña no puede quedar vacío</p>}
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
