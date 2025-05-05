import themeService from './themeService';

const userDataService = {
  setUserData(user) {
    themeService.applyCurrentTheme(user);
  },
};

export default userDataService;
