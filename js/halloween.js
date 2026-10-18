/* Plain JavaScript: works on static hosting and when index.html is opened directly. */
(function () {
  'use strict';
  var root = document.documentElement;
  var toggle = document.getElementById('season-toggle');
  var photo = document.getElementById('profile-photo');
  var menu = document.querySelector('.mobilemenu');
  var sidebar = document.getElementById('sidebar');
  var main = document.getElementById('main');
  var backdrop = document.getElementById('menu-backdrop');
  var ghost = document.getElementById('ghost-trigger');
  var note = document.getElementById('ghost-note');
  var closeNote = document.getElementById('ghost-close');
  var mobile = window.matchMedia('(max-width: 991px)');
  var storageKey = 'alexvoudouris-season-theme';

  function setGhost(open) {
    note.hidden = !open;
    ghost.setAttribute('aria-expanded', String(open));
  }

  function setTheme(theme, remember) {
    var halloween = theme === 'halloween';
    root.dataset.theme = halloween ? 'halloween' : 'classic';
    toggle.setAttribute('aria-pressed', String(halloween));
    photo.src = halloween ? photo.dataset.halloweenSrc : photo.dataset.classicSrc;
    photo.alt = halloween ? 'Alexandros Voudouris in a pumpkin-patterned suit on a Halloween porch' : 'Alexandros Voudouris';
    document.querySelector('meta[name="theme-color"]').content = halloween ? '#18131d' : '#2b2b2b';
    ghost.hidden = !halloween;
    if (!halloween) setGhost(false);
    if (remember) {
      try { window.localStorage.setItem(storageKey, root.dataset.theme); } catch (error) { /* Local files and private browsing may block storage. */ }
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
    ghost.inert = open;
    if (open) {
      setGhost(false);
      var current = sidebar.querySelector('[aria-current="page"]') || toggle;
      current.focus();
    } else if (returnFocus) {
      menu.focus();
    }
  }

  setTheme(root.dataset.theme === 'classic' ? 'classic' : 'halloween', false);
  setMenu(false, false);
  toggle.addEventListener('click', function () { setTheme(root.dataset.theme === 'halloween' ? 'classic' : 'halloween', true); });
  menu.addEventListener('click', function (event) {
    event.preventDefault();
    setMenu(!root.classList.contains('menu-is-open'), true);
  });
  backdrop.addEventListener('click', function () { setMenu(false, true); });
  ghost.addEventListener('click', function () { setGhost(note.hidden); });
  closeNote.addEventListener('click', function () { setGhost(false); ghost.focus(); });

  document.addEventListener('click', function (event) {
    if (!note.hidden && !note.contains(event.target) && !ghost.contains(event.target)) setGhost(false);
  });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      if (!note.hidden) { setGhost(false); ghost.focus(); }
      if (root.classList.contains('menu-is-open')) setMenu(false, true);
    }
    if (event.key === 'Tab' && root.classList.contains('menu-is-open')) {
      var items = [menu].concat(Array.prototype.slice.call(sidebar.querySelectorAll('a[href], button:not([disabled])')));
      var index = items.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); items[items.length - 1].focus(); }
      else if (!event.shiftKey && (index < 0 || index === items.length - 1)) { event.preventDefault(); items[0].focus(); }
    }
  });
  function resizeNavigation() { setMenu(false, false); }
  if (mobile.addEventListener) mobile.addEventListener('change', resizeNavigation);
  else if (mobile.addListener) mobile.addListener(resizeNavigation);
  window.addEventListener('storage', function (event) {
    if (event.key === storageKey) setTheme(event.newValue === 'classic' ? 'classic' : 'halloween', false);
  });
})();
