/* Applies the visitor's saved light/dark choice before first paint.
   Loaded synchronously in <head> to avoid a flash of the wrong theme. */
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  } catch (e) { /* storage blocked: fall back to system preference */ }
})();
