// Site script: external, content-free, tested byte for byte; loaded in <head> without `defer`, so
// it acts before the first paint. It stores two flags and reads nothing else.
//
// 1. Language (owner 2026-09-26): on a German page that has an English version, a browser whose
//    first language is not German opens the English version. A choice made with the language
//    switch is remembered and never overruled (also without storage: coming from the English
//    page counts as a choice). Search engines and automated browsers are not redirected.
// 2. Entry moment (DESIGN.md "Motion"): the page header fades in once per browser, on the first
//    page a visitor opens; every later page and visit starts at rest. Without storage, with
//    reduced motion or in print the header is simply at rest (site/styles.css, [data-entry]).
//    An attribute, not a class: .entry already styles CV entries.
(function () {
  'use strict';
  var LANG = 'portfolio-lang';
  var SEEN = 'portfolio-entry-seen';
  var root = document.documentElement;
  var store = null;
  try {
    store = window.localStorage;
    store.getItem(SEEN);
  } catch (e) {
    store = null; // storage unavailable (private mode, blocked)
  }
  function read(key) {
    try {
      return store ? store.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }
  function write(key, value) {
    try {
      if (store) store.setItem(key, value);
    } catch (e) {
      // no memory: the page still works
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('.lang-switch a[hreflang]') : null;
    if (link) write(LANG, link.getAttribute('hreflang'));
  });

  var english = root.lang === 'de' ? document.querySelector('link[rel="alternate"][hreflang="en"]') : null;
  if (english) {
    var chosen = read(LANG);
    var agent = navigator.userAgent || '';
    var robot = /bot|crawl|spider|slurp|mediapartners|headless|lighthouse|preview|facebookexternalhit/i.test(agent);
    var first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    var fromEnglish = document.referrer.split('#')[0] === english.href;
    if (!robot && !fromEnglish && chosen !== 'de' && (chosen === 'en' || !/^de\b/i.test(first))) {
      window.location.replace(english.href + window.location.hash);
      return; // no entry moment on a page that is being left
    }
  }

  if (!store || read(SEEN)) return;
  write(SEEN, '1');
  root.setAttribute('data-entry', '');
})();
