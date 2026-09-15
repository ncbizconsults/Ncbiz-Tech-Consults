/* ============================================================
   INSIGHTS CATEGORY FILTER
   ============================================================
   All articles stay in the page's HTML at all times (crawlable
   by search engines regardless of JS) — this only shows/hides
   them client-side. No page reload.
   ============================================================ */
(function () {
  var buttons = document.querySelectorAll('.insights-filter-btn');
  var cards = document.querySelectorAll('#insights-grid .pillar');
  var emptyState = document.getElementById('insights-empty-state');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    var visibleCount = 0;
    cards.forEach(function (card) {
      var cats = (card.getAttribute('data-categories') || '').split(' ');
      var show = filter === 'all' || cats.indexOf(filter) !== -1;
      card.setAttribute('data-hidden', show ? 'false' : 'true');
      if (show) visibleCount++;
    });
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.getAttribute('data-filter'));
    });
  });
})();
