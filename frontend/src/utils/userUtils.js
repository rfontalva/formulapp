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

  async hasAccess(user, idCheatsheet) {
    console.log(user);
    const query = `SELECT permission FROM Permission JOIN User using (id_user)
      WHERE id_cheatsheet=${idCheatsheet}
      and where username='${user}');`;
    const results = await dbUtils.simpleQuery(query);
    console.log(await results);
    // const { permission } = await results;
    // const hasPermission = permission !== undefined;
    return { hasPermission: true, permission: 'a' };
  },
};
export default utils;
