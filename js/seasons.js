/* Shared appearance controls and navigation. No libraries or build step needed. */
(function () {
  'use strict';
  var root = document.documentElement;
  var config = window.SITE_THEME || {defaultTheme: 'christmas', allowThemeSwitch: true, rememberTheme: true};
  var allowed = ['classic', 'halloween', 'christmas'];
  var picker = document.getElementById('season-select');
  var controls = document.querySelector('.season-controls');
  var photo = document.getElementById('profile-photo');
  var title = document.getElementById('page-title');
  var favicon = document.getElementById('season-favicon');
  var tagline = document.getElementById('seasonal-tagline');
  var caption = document.getElementById('seasonal-caption');
  var menu = document.querySelector('.mobilemenu');
  var sidebar = document.getElementById('sidebar');
  var main = document.getElementById('main');
  var backdrop = document.getElementById('menu-backdrop');
  var surprise = document.getElementById('ghost-trigger');
  var note = document.getElementById('ghost-note');
  var message = document.getElementById('seasonal-message');
  var closeNote = document.getElementById('ghost-close');
  var mobile = window.matchMedia('(max-width: 991px)');
  var storageKey = config.storageKey || 'alexvoudouris-site-theme';
  var themes = {
    classic: {name: '', color: '#2b2b2b', icon: 'assets/monogram.svg', tagline: '', message: '', label: 'Seasonal message'},
    halloween: {name: 'Halloween edition', color: '#18131d', icon: 'assets/halloween/pumpkin.svg', tagline: 'Algorithms, games, and other dark arts.', message: 'Still waiting for Reviewer 2.', label: 'A message from the resident ghost'},
    christmas: {name: 'Christmas edition', color: '#10241e', icon: 'assets/christmas/star.svg', tagline: 'Algorithms, games, and a little Christmas magic.', message: 'All I want for Christmas is an acceptance.', label: 'Open a little Christmas present'}
  };

  function defaultTheme() { return allowed.indexOf(config.defaultTheme) >= 0 ? config.defaultTheme : 'christmas'; }
  function setMessage(open) {
    note.hidden = !open;
    surprise.setAttribute('aria-expanded', String(open));
  }
  function setTheme(theme, remember) {
    if (!config.allowThemeSwitch || allowed.indexOf(theme) < 0) theme = defaultTheme();
    var look = themes[theme];
    root.dataset.theme = theme;
    picker.value = theme;
    controls.hidden = !config.allowThemeSwitch;
    picker.disabled = !config.allowThemeSwitch;
    photo.src = photo.dataset[theme + 'Src'] || photo.dataset.classicSrc;
    photo.alt = theme === 'halloween' ? 'Alexandros Voudouris in a pumpkin-patterned suit on a Halloween porch' :
      theme === 'christmas' ? 'Alexandros Voudouris in a festive tartan suit beside a Christmas tree' : 'Alexandros Voudouris';
    document.querySelector('meta[name="theme-color"]').content = look.color;
    document.title = title.dataset.baseTitle + (look.name ? ' · ' + look.name : '');
    favicon.setAttribute('href', look.icon);
    tagline.textContent = look.tagline;
    caption.textContent = look.name;
    message.textContent = look.message;
    surprise.setAttribute('aria-label', look.label);
    surprise.hidden = theme === 'classic';
    setMessage(false);
    if (remember && config.allowThemeSwitch && config.rememberTheme) {
      try { window.localStorage.setItem(storageKey, theme); } catch (error) {}
    }
  }
  function setMenu(open, returnFocus) {
    open = mobile.matches && open;
    root.classList.toggle('menu-is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    backdrop.hidden = !open;
    sidebar.inert = mobile.matches && !open;
    main.inert = open;
    surprise.inert = open;
    if (open) {
      setMessage(false);
      (sidebar.querySelector('[aria-current="page"]') || picker).focus();
    } else if (returnFocus) menu.focus();
  }

  setTheme(root.dataset.theme, false);
  setMenu(false, false);
  picker.addEventListener('change', function () { setTheme(picker.value, true); });
  menu.addEventListener('click', function (event) {
    event.preventDefault();
    setMenu(!root.classList.contains('menu-is-open'), true);
  });
  backdrop.addEventListener('click', function () { setMenu(false, true); });
  surprise.addEventListener('click', function () { setMessage(note.hidden); });
  closeNote.addEventListener('click', function () { setMessage(false); surprise.focus(); });
  document.addEventListener('click', function (event) {
    if (!note.hidden && !note.contains(event.target) && !surprise.contains(event.target)) setMessage(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!note.hidden) { setMessage(false); surprise.focus(); }
      if (root.classList.contains('menu-is-open')) setMenu(false, true);
    }
    if (event.key === 'Tab' && root.classList.contains('menu-is-open')) {
      var items = [menu].concat(Array.prototype.slice.call(sidebar.querySelectorAll('a[href], button:not([disabled]), select:not([disabled])')));
      var index = items.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && (index < 0 || index === items.length - 1)) { event.preventDefault(); items[0].focus(); }
    }
  });
  function resized() { setMenu(false, false); }
  if (mobile.addEventListener) mobile.addEventListener('change', resized);
  else if (mobile.addListener) mobile.addListener(resized);
  window.addEventListener('storage', function (event) {
    if (event.key === storageKey && config.allowThemeSwitch && config.rememberTheme) setTheme(event.newValue, false);
  });
})();
