/* ==========================================================================
   Shared components: <site-header>, <site-footer>, <post-list>, plus the
   automatic in-page table of contents. Plain JS, no dependencies.
   THE MENU AND FOOTER TEXTS ARE GENERATED INTO data/ui-text.js; ONLY THE FOOTER DISCLAIMER IS EDITED HERE.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Texts ------------------------------------------------------------
     Site name, menu and footer links come from data/ui-text.js (written by the build script, never edited by hand).
     The footer disclaimer is the one text that is edited here. */
  var TEXT = (window.UI_TEXT || {}).site;
  var SITE = {
    nameStart: TEXT.brand.start,
    nameAccent: TEXT.brand.accent,
    nav: TEXT.menu,               // [{ label, href (file relative to the site root), match (optional prefix) }]
    footerText: TEXT.footer.text,
    footerDisclaimer: 'is an unofficial fan site. It is not affiliated with, endorsed or sponsored by Konami. Yu-Gi-Oh! and all card names are the property of their respective owners. Card effects are paraphrased; check the official wording.',
    footerLinks: TEXT.footerLinks
  };
  /* --------------------------------------------------------------------- */

  // Site root URL, derived from this script's own location (assets/js/ -> ../../).
  // Works in subfolders, on GitHub Pages project sites and when opened from disk.
  var script = document.currentScript;
  var ROOT = new URL('../../', script.src);
  function url(path) { return new URL(path, ROOT); }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function norm(p) { return p.replace(/index\.html$/, '').replace(/\.html$/, ''); }

  /* ---- <site-header> ---------------------------------------------------- */
  class SiteHeader extends HTMLElement {
    connectedCallback() {
      var here = norm(location.pathname);
      var links = SITE.nav.map(function (item) {
        var target = url(item.href);
        var current = norm(target.pathname) === here ||
          (item.match && location.pathname.indexOf(url(item.match).pathname) === 0);
        return '<a href="' + esc(target.href) + '"' + (current ? ' aria-current="page"' : '') + '>' +
          esc(item.label) + '</a>';
      }).join('');

      // Small screens: the links sit in a menu opened by the button (aria-expanded).
      // From 48em up, CSS shows the links in a row and hides the button.
      this.innerHTML =
        '<a class="skip-link" href="#main">Skip to content</a>' +
        '<header class="site-head"><div class="wrap">' +
        '<a class="brand" href="' + esc(url('index.html').href) + '">' + esc(SITE.nameStart) +
        '<span>' + esc(SITE.nameAccent) + '</span></a>' +
        '<div class="head-controls">' +
        '<button class="theme-toggle" type="button" aria-label="Toggle light/dark theme" title="Toggle theme">◐</button>' +
        '<button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">' +
        '<span class="burger" aria-hidden="true"></span></button>' +
        '</div>' +
        '<nav class="site-nav" id="site-nav" aria-label="Site">' + links + '</nav>' +
        '</div></header>';

      var toggle = this.querySelector('.nav-toggle');
      var nav = this.querySelector('.site-nav');
      function setMenu(open) {
        nav.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
      }
      toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
      // Escape closes the menu and returns focus to the button.
      this.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
      });
      // Reset when the window grows to the desktop layout.
      matchMedia('(min-width: 48em)').addEventListener('change', function () { setMenu(false); });

      this.querySelector('.theme-toggle').addEventListener('click', function () {
        var root = document.documentElement;
        var dark = root.dataset.theme
          ? root.dataset.theme === 'dark'
          : matchMedia('(prefers-color-scheme: dark)').matches;
        var next = dark ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch (e) { /* ignore */ }
      });
    }
  }

  /* ---- <site-footer> ---------------------------------------------------- */
  class SiteFooter extends HTMLElement {
    connectedCallback() {
      var links = SITE.footerLinks.map(function (l) {
        return '<a href="' + esc(url(l.href).href) + '">' + esc(l.label) + '</a>';
      }).join('');
      this.innerHTML =
        '<footer class="site-foot"><div class="wrap">' +
        '<p>' + esc(SITE.footerText) + '</p>' +
        '<p>' + esc(SITE.nameStart + SITE.nameAccent + ' ' + SITE.footerDisclaimer) + '</p>' +
        '<p class="foot-links">' + links + '</p>' +
        '<p>© ' + new Date().getFullYear() + ' ' + esc(SITE.nameStart + SITE.nameAccent) + '</p>' +
        '</div></footer>';
    }
  }

  /* ---- <post-list limit="3" filter> ------------------------------------
     Renders window.ARTICLES (data/articles.js), newest first by date.
     limit="N"  show only the N newest      filter  show tag filter chips
     An article has several tags; a chip shows the articles carrying it.     */
  class PostList extends HTMLElement {
    connectedCallback() {
      var posts = (window.ARTICLES || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      var limit = parseInt(this.getAttribute('limit'), 10);
      var self = this;
      var active = '';

      function render() {
        var shown = posts.filter(function (p) { return !active || (p.tags || []).indexOf(active) !== -1; });
        if (limit) shown = shown.slice(0, limit);
        var html = '';
        if (self.hasAttribute('filter')) {
          var tags = [].concat.apply([], posts.map(function (p) { return p.tags || []; })).filter(function (t, i, a) { return a.indexOf(t) === i; }).sort();
          if (tags.length > 1) {
            html += '<div class="chips" role="group" aria-label="Filter by tag">' +
              ['All'].concat(tags).map(function (t) {
                var on = (t === 'All' && !active) || t === active;
                return '<button class="chip" type="button" aria-pressed="' + on + '" data-tag="' + esc(t === 'All' ? '' : t) + '">' + esc(t) + '</button>';
              }).join('') + '</div>';
          }
        }
        html += '<ul class="tiles">' + shown.map(function (p, i) {
          var d = new Date(p.date + 'T00:00:00');
          var nice = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
          return '<li><a class="tile" data-tone="' + (posts.indexOf(p) % 5) + '" href="' + esc(url(p.url).href) + '">' +
            '<span class="tile-meta">' + esc(nice) + ((p.tags || []).length ? ' · ' + esc(p.tags.join(', ')) : '') + '</span>' +
            '<span class="tile-title">' + esc(p.title) + '</span>' +
            '<span class="tile-text">' + esc(p.summary || '') + '</span></a></li>';
        }).join('') + '</ul>';
        self.innerHTML = html;
        self.querySelectorAll('.chip').forEach(function (b) {
          b.addEventListener('click', function () { active = b.dataset.tag; render(); });
        });
      }
      render();
    }
  }

  /* ---- Automatic sticky table of contents ------------------------------
     Add data-toc to <main>; every <h2 id="…"> becomes a pill with scroll-spy.
     data-toc="h3" makes the pills from the <h3 id="…"> of the page and of its <section>s instead (combos.html). */
  function buildToc() {
    var main = document.querySelector('main[data-toc]');
    if (!main) return;
    var heads = main.querySelectorAll(main.getAttribute('data-toc') === 'h3' ? ':scope > h3[id], :scope > section > h3[id]' : 'h2[id]');
    if (heads.length < 2) return;

    var nav = document.createElement('nav');
    nav.className = 'toc';
    nav.setAttribute('aria-label', 'On this page');
    nav.innerHTML = '<div class="inner">' + Array.prototype.map.call(heads, function (h) {
      return '<a href="#' + esc(h.id) + '">' + esc(h.textContent) + '</a>';
    }).join('') + '</div>';
    main.parentNode.insertBefore(nav, main);

    var links = nav.querySelectorAll('a');
    function setActive(id) {
      links.forEach(function (a) {
        var on = a.getAttribute('href') === '#' + id;
        a.classList.toggle('on', on);
        if (on) {
          // Scroll only the pill bar horizontally, never the page.
          var bar = nav.querySelector('.inner');
          bar.scrollLeft = a.offsetLeft - bar.clientWidth / 2 + a.clientWidth / 2;
        }
      });
    }
    function spy() {
      var current = '';
      var line = nav.offsetHeight + 80;
      heads.forEach(function (h) { if (h.getClientRects().length && h.getBoundingClientRect().top <= line) current = h.id; });
      setActive(current);
    }
    addEventListener('scroll', spy, { passive: true });
    spy();
  }

  /* ---- Links to a collapsed <details> (e.g. combos.html#pure-ddd-combo) ----
     If the hash points at a <details> or something inside one, open it and scroll to it. */
  function openFromHash() {
    var el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    var d = el && el.closest('details');
    if (!d) return;
    d.open = true;
    d.scrollIntoView();
  }
  addEventListener('hashchange', openFromHash);

  customElements.define('site-header', SiteHeader);
  customElements.define('site-footer', SiteFooter);
  customElements.define('post-list', PostList);
  // Scripts are deferred, so the document is parsed by now.
  buildToc();
  openFromHash();
})();
