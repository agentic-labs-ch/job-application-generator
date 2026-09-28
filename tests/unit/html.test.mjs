import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml, html, safeUrl, SafeHtml } from '../../scripts/lib/html.mjs';
import { renderPage } from '../../site/templates.mjs';

test('escapes all HTML-significant characters', () => {
  assert.equal(escapeHtml(`<a href="x" onclick='y'>&</a>`),
    '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
});

test('html tag escapes values, keeps nested SafeHtml, drops empty values', () => {
  const inner = html`<b>${'<i>'}</b>`;
  const out = html`<p title="${'"x"'}">${inner}${null}${undefined}${false}${['<', '>']}</p>`;
  assert.ok(out instanceof SafeHtml);
  assert.equal(out.toString(), '<p title="&quot;x&quot;"><b>&lt;i&gt;</b>&lt;&gt;</p>');
});

test('safeUrl allows only http, https and mailto', () => {
  assert.equal(safeUrl('https://example.com/a?b=1'), 'https://example.com/a?b=1');
  assert.equal(safeUrl('mailto:a@example.com'), 'mailto:a@example.com');
  for (const bad of ['javascript:alert(1)', ' https://example.com', 'java\nscript:x', 'data:x', 'vbscript:x']) {
    assert.throws(() => safeUrl(bad));
  }
});

test('rendered page escapes hostile data consistently', () => {
  const hostile = '<script>alert("x")</script>';
  const page = renderPage({
    meta: { lang: 'en' },
    profile: {
      name: hostile,
      headline: `" onmouseover="x`,
      summary: hostile,
      links: [{ label: hostile, url: 'https://example.com/?q="><script>' }],
    },
    experience: [{ id: 'a', organization: hostile, role: hostile, start: '2020-01', highlights: [hostile] }],
    skills: [{ id: 's', name: hostile, items: [{ name: hostile, level: 2 }] }],
  });
  assert.ok(!page.includes('<script'), 'no raw script tag');
  assert.ok(!page.includes('" onmouseover="'), 'attribute injection escaped');
  assert.ok(page.includes('&lt;script&gt;'));
});

test('rendering refuses a disallowed URL even if validation was bypassed', () => {
  assert.throws(() => renderPage({
    profile: { name: 'A', headline: 'B', links: [{ label: 'x', url: 'javascript:alert(1)' }] },
  }), /scheme not allowed/);
});
