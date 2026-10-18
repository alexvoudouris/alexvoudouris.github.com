/* Search and filters use the existing publication rows; no network calls. */
(function () {
  'use strict';
  var search = document.getElementById('publication-search');
  if (!search) return;
  var year = document.getElementById('publication-year');
  var type = document.getElementById('publication-type');
  var clear = document.getElementById('publication-clear');
  var count = document.getElementById('publication-count');
  var empty = document.getElementById('publication-empty');
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-publication-group]'));
  var entries = Array.prototype.slice.call(document.querySelectorAll('[data-publication]'));
  function normalise(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  var index = entries.map(function (row) { return {row: row, text: normalise(row.dataset.search), year: row.dataset.year, type: row.dataset.type}; });
  function update() {
    var words = normalise(search.value).split(/\s+/).filter(Boolean);
    var shown = 0;
    index.forEach(function (entry) {
      var match = (!year.value || entry.year === year.value) && (!type.value || entry.type === type.value) && words.every(function (word) {return entry.text.indexOf(word) >= 0;});
      entry.row.hidden = !match;
      if (match) shown++;
    });
    groups.forEach(function (group) {
      group.hidden = !Array.prototype.some.call(group.querySelectorAll('[data-publication]'), function (row) { return !row.hidden; });
    });
    count.textContent = shown + ' of ' + entries.length + ' publications';
    empty.hidden = shown > 0;
  }
  function reset() { search.value = ''; year.value = ''; type.value = ''; update(); search.focus(); }
  search.addEventListener('input', update);
  year.addEventListener('change', update);
  type.addEventListener('change', update);
  clear.addEventListener('click', reset);
  var params = new URLSearchParams(window.location.search);
  search.value = params.get('q') || '';
  year.value = params.get('year') || '';
  type.value = params.get('type') || '';
  update();
})();
