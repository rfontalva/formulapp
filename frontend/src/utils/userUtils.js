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
};
export default utils;
