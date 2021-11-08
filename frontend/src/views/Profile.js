import React, { useState } from 'react';
import UserContext from '../context/UserContext';
import dbUtils from '../utils/dbUtils';
import ErrorComp from './Error';
import MyFormulas from './MyFormulas';
import { SheetsList } from '../components/index';

const Profile = () => {
  const { user } = React.useContext(UserContext);
  const [userDetails, setUserDetails] = useState({
    user: '', firstname: '', lastname: '', email: '',
  });

  const getUserData = async () => {
    if (!user) { return; }
    const query = `select firstname, lastname, email from User where username='${user}'`;
    try {
      const results = await dbUtils.simpleQuery(query);
      const { firstname, lastname, email } = results;
      setUserDetails({
        user, firstname, lastname, email,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  React.useEffect(() => {
    getUserData();
  }, [user]);
  return (
    <>
      {user && (
      <>
        <div className="inputs-box side-box" id="profile-box">
          <h1 style={{ textAlign: 'left' }}>Información del perfil</h1>
          <p>
            Nombre de usuario:
            {' '}
            {userDetails.user}
          </p>
          <p>
            Correo electrónico:
            {' '}
            {userDetails.email}
          </p>
          <p>
            Nombre:
            {' '}
            {userDetails.firstname}
          </p>
          <p>
            Apellido:
            {' '}
            {userDetails.lastname}
          </p>
          <a href="/">Cambiar mi contraseña</a>
          <button
            type="button"
            onClick={() => console.log('click')}
          >
            Borrar mi cuenta

          </button>
        </div>
        <SheetsList />
        <MyFormulas />
      </>
      )}
      {!user && <ErrorComp />}
    </>
  );
};

export default Profile;
