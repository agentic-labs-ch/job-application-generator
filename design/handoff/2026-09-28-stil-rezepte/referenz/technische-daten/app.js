(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Ansichten: Lebenslauf | Anschreiben ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var views = { lebenslauf: document.getElementById('lebenslauf'), anschreiben: document.getElementById('anschreiben') };
  var current = null;

  function show(name, opts) {
    opts = opts || {};
    if (!views[name]) name = 'lebenslauf';
    if (name === current) return;
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-view') === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    Object.keys(views).forEach(function (k) {
      var v = views[k];
      v.classList.remove('enter');
      if (k === name) {
        v.hidden = false;
        if (current !== null && !reduce) { void v.offsetWidth; v.classList.add('enter'); }
      } else {
        v.hidden = true;
      }
    });
    current = name;
    if (opts.scroll) window.scrollTo(0, 0);
    if (name === 'lebenslauf') checkGauges();
  }

  function go(name, focusTab) {
    var hash = '#' + name;
    if (location.hash !== hash) {
      try { history.pushState(null, '', hash); } catch (e) { }
    }
    show(name, { scroll: true });
    if (focusTab) {
      var t = document.getElementById('t-' + name);
      if (t) t.focus();
    }
  }

  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('[data-view]');
    if (a) {
      ev.preventDefault();
      go(a.getAttribute('data-view'), a.classList.contains('btn'));
      return;
    }
    var p = ev.target.closest && ev.target.closest('[data-print]');
    if (p) { ev.preventDefault(); window.print(); }
  });

  document.querySelector('.tabs').addEventListener('keydown', function (ev) {
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var n = null;
    if (ev.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (ev.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (ev.key === 'Home') n = 0;
    else if (ev.key === 'End') n = tabs.length - 1;
    else if (ev.key === ' ') { ev.preventDefault(); go(tabs[i].getAttribute('data-view'), true); return; }
    if (n === null) return;
    ev.preventDefault();
    go(tabs[n].getAttribute('data-view'), true);
  });

  window.addEventListener('popstate', function () { show(location.hash.slice(1), { scroll: true }); });
  window.addEventListener('hashchange', function () { show(location.hash.slice(1), { scroll: true }); });

  /* ---------- Instrumente ---------- */
  var gauges = [].slice.call(document.querySelectorAll('.gauge'));
  var fmt = function (x) { return x.toFixed(1).replace('.', ','); };
  var started = false;

  function run() {
    if (started) return;
    started = true;
    gauges.forEach(function (g, i) {
      var num = g.querySelector('.g-num');
      var target = parseFloat(num.getAttribute('data-v'));
      if (reduce) { g.classList.add('on'); num.textContent = fmt(target); return; }
      var delay = i * 90, dur = 600, t0 = null;
      requestAnimationFrame(function () { g.classList.add('on'); });
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, Math.max(0, (ts - t0 - delay) / dur));
        var k = 1 - Math.pow(1 - p, 3);
        num.textContent = fmt(Math.round(target * k * 10) / 10);
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var grid = document.querySelector('.gauges');
  var io = null;
  function checkGauges() {
    if (started || !grid) return;
    if (reduce || !('IntersectionObserver' in window)) { run(); return; }
    if (!io) {
      io = new IntersectionObserver(function (en) {
        if (en.some(function (x) { return x.isIntersecting; })) { run(); io.disconnect(); }
      }, { threshold: 0.35 });
      io.observe(grid);
    }
  }
  if (!reduce) gauges.forEach(function (g) { g.querySelector('.g-num').textContent = fmt(0); });

  /* Aufklappen: eine Gruppe offen, die erste zu Beginn */
  function openPanel(btn, anim) {
    gauges.forEach(function (b) {
      var on = b === btn;
      b.setAttribute('aria-expanded', on ? 'true' : 'false');
      var p = document.getElementById(b.getAttribute('aria-controls'));
      p.classList.remove('enter');
      p.hidden = !on;
      if (on && anim && !reduce) { void p.offsetWidth; p.classList.add('enter'); }
      if (on && anim) {
        var r = p.getBoundingClientRect();
        if (r.top > window.innerHeight - 120) p.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }
  gauges.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-expanded') === 'true') {
        b.setAttribute('aria-expanded', 'false');
        document.getElementById(b.getAttribute('aria-controls')).hidden = true;
      } else {
        openPanel(b, true);
      }
    });
  });
  if (gauges.length) openPanel(gauges[0], false);

  /* Start */
  show(location.hash === '#anschreiben' ? 'anschreiben' : 'lebenslauf');
  if (location.hash === '#anschreiben') window.scrollTo(0, 0);
  checkGauges();
})();
