const localStorageService = {
  setItemForUser(user, key, value) {
    const userEmail = user?.email || 'anonymous';

    const userData = localStorage.getItem('userData')
      ? JSON.parse(localStorage.getItem('userData'))
      : {};

    if (!userData[userEmail]) {
      userData[userEmail] = {};
    }

    userData[userEmail][key] = value;

    localStorage.setItem('userData', JSON.stringify(userData));
  },

  getItemForUser(user, key) {
    const userEmail = user?.email || 'anonymous';

    const userData = localStorage.getItem('userData');

    if (!userData) {
      return undefined;
    }

    return JSON.parse(userData)?.[userEmail]?.[key];
  },

  getLoggedInUser() {
    const userStr = localStorage.getItem('loggedInUser');

    if (userStr === '' || userStr === 'null' || userStr === 'undefined') {
      return null;
    }

    return JSON.parse(userStr);
  },

  setLoggedInUser(user) {
    let userStr;

    if (!user) {
      userStr = '';
    } else {
      userStr = JSON.stringify(user);
    }

    localStorage.setItem('loggedInUser', userStr);
  },
};

export default localStorageService;
