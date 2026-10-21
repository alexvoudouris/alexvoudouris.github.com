/* Search and filters use each rendered publication row; no network calls. */
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
  function normalise(value) {
    return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }
  var publicationTypes = {M: 'preprint', J: 'journal', C: 'conference', E: 'edited', D: 'thesis'};
  var index = [];
  groups.forEach(function (group) {
    var heading = group.querySelector('h2');
    var groupYear = heading ? heading.textContent.trim() : '';
    Array.prototype.forEach.call(group.querySelectorAll('tr'), function (row) {
      var label = row.querySelector('.label');
      var code = label ? label.textContent.trim() : '';
      if (!/^[MJCED]\d+$/.test(code)) return;
      var text = row.textContent;
      var yearMatch = text.match(/\b(?:19|20)\d{2}\b/);
      var rowYear = row.dataset.year || (/^\d{4}$/.test(groupYear) ? groupYear : yearMatch ? yearMatch[0] : '');
      var rowType = row.dataset.type || publicationTypes[code.charAt(0)];
      // Older pages omit C7's metadata and include its text in C8's search field.
      // Index every actual row independently, using the text visitors can read.
      if (!row.id) row.id = 'paper-' + code;
      row.classList.add('publication-row');
      row.setAttribute('data-publication', '');
      row.setAttribute('data-year', rowYear);
      row.setAttribute('data-type', rowType);
      row.setAttribute('data-search', text.replace(/\s+/g, ' ').trim());
      index.push({row: row, text: normalise(text), year: rowYear, type: rowType});
    });
  });
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
    count.textContent = shown + ' of ' + index.length + ' publications';
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
