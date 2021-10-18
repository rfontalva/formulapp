import urlUtils from './urlUtils';

const utils = {
  isLoggedIn(user) {
    if (user) {
      return true;
    }
    return false;
  },

  logOut(setUser) {
    setUser();
    document.cookie = 'username=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    urlUtils.goHome();
  },

  cookieLogIn(username) {
    const cookievalue = `username=${username}`;
    const expiryDate = new Date(new Date().getTime() + 60 * 60 * 1000 * 24).toGMTString();
    document.cookie = `${cookievalue};`;
    document.cookie = `Expires=${expiryDate};`;
  },
};
export default utils;
