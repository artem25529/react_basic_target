import getResourceAsync from '../utils/getResouceAsync.js';
import performAPICall from '../utils/performAPICall.js';

const USERS_URL = 'http://localhost:3000/users';

const userService = {
  async getUsersByFieldsAsync(fields) {
    return await getResourceAsync(USERS_URL, fields);
  },

  async createUser(email, password) {
    const response = await fetch(USERS_URL, {
      method: 'POST',
      body: JSON.stringify({ email, password, favorites: [] }),

      headers: { 'Content-Type': 'application/json' },
    });

    return await response.json();
  },

  getUser(email, setResponse) {
    performAPICall(USERS_URL, { email }, 'GET', null, setResponse);
  },

  async updateUser(user) {
    const response = await fetch(`${USERS_URL}/${user.id}`, {
      method: 'PATCH',
      body: JSON.stringify(user),

      headers: { 'Content-Type': 'application/json' },
    });

    return await response.json();
  },
};

export default userService;
