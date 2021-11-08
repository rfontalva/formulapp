import urlUtils from './urlUtils';
import dbUtils from './dbUtils';

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

  // eslint-disable-next-line no-unused-vars
  async hasAccess(user, idCheatsheet) {
    if (user === undefined) { return { hasPermission: false, permission: undefined }; }
    const query = `SELECT permission FROM Permission JOIN User using (id_user)
      WHERE id_cheatsheet=${idCheatsheet}
      and username='${user}';`;
    const results = await dbUtils.simpleQuery(query);
    const { permission } = await results;
    const hasPermission = permission !== undefined;
    return { hasPermission, permission };
  },
};
export default utils;
