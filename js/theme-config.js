/* Edit these settings to choose the site's default appearance. */
window.SITE_THEME = {
  defaultTheme: 'halloween',   // 'classic', 'halloween', or 'christmas'
  allowThemeSwitch: true,     // false hides the selector and forces the default
  storageKey: 'alexvoudouris-classic-preview-theme',
  rememberTheme: false        // false ignores saved choices
};

/* Apply the initial theme before the page is painted. */
(function () {
  var root = document.documentElement;
  var config = window.SITE_THEME;
  var allowed = ['classic', 'halloween', 'christmas'];
  var theme = allowed.indexOf(config.defaultTheme) >= 0 ? config.defaultTheme : 'halloween';
  root.classList.add('js-enabled');
  root.dataset.themeSwitch = config.allowThemeSwitch ? 'enabled' : 'disabled';
  if (config.allowThemeSwitch && config.rememberTheme) {
    try {
      var saved = window.localStorage.getItem(config.storageKey || 'alexvoudouris-site-theme');
      if (allowed.indexOf(saved) >= 0) theme = saved;
    } catch (error) { /* Local files and private browsing can block storage. */ }
  }
  root.dataset.theme = theme;
})();