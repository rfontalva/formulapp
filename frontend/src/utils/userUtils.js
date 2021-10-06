import React from 'react';
import urlUtils from './urlUtils';
import RefContext from '../context/RefContext';

const isLoggedIn = () => {
  const { user } = React.useContext(RefContext);
  if (user) {
    return true;
  }
  return false;
};

const logOut = () => {
  const { setUser } = React.useContext(RefContext);
  setUser();
  document.cookie = 'username=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  urlUtils.goHome();
};

export default { isLoggedIn, logOut };
