import localStorageService from './localStorageService.js';

const themeService = {
  applyTheme(user, theme) {
    localStorageService.setItemForUser(user, 'theme', theme);

    document.documentElement.classList.toggle('dark', theme === 'dark');
  },

  getThemeForUser(user) {
    let theme = localStorageService.getItemForUser(user, 'theme');

    if (!theme) {
      theme = matchMedia('(prefers-color-scheme:light)').matches
        ? 'light'
        : 'dark';
    }

    return theme;
  },
};

export default themeService;
