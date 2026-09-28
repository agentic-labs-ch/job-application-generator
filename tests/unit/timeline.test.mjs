import { test } from 'node:test';
import assert from 'node:assert/strict';
import { timeline } from '../../site/templates.mjs';

// Station label (owner 2026-09-24): the years of the whole period, never the start year alone,
// which read like a mark on an axis and put the wrong period beside each station.
const item = (id, start, end) => ({ id, organization: 'Example Org (fictional)', role: 'Example role', start, ...(end ? { end } : {}) });

test('timeline: each station shows the years of its period; the exact months follow under the organisation', () => {
  const de = String(timeline([item('a', '2023-12'), item('b', '2021-07', '2023-11'), item('c', '2012-08', '2012-12')], 'de'));
  const spans = [...de.matchAll(/<span class="timeline-span" aria-hidden="true">([^<]+)<\/span>/g)].map((m) => m[1]);
  assert.deepEqual(spans, ['Seit 2023', '2021 – 2023', '2012'], 'current, several years, one year');
  // One structure in every entry (owner 2026-09-26): "organisation, place", then the period on
  // a line of its own (display: block on screen; print joins them with a middle dot).
  assert.ok(de.includes('<p class="entry-org">Example Org (fictional)<span class="entry-period"><time datetime="2021-07">07.2021</time> – <time datetime="2023-11">11.2023</time></span></p>'));
  assert.ok(de.includes('<time datetime="2023-12">12.2023</time> – heute</span>'));
  // Rule 2: years (role level) → role → organisation · period; the date never precedes the role
  // at a smaller size.
  const station = de.slice(de.indexOf('id="cv-b"'));
  assert.ok(station.indexOf('timeline-span') < station.indexOf('entry-title') && station.indexOf('entry-title') < station.indexOf('entry-period'));
  const en = String(timeline([item('a', '2023-12'), item('b', '2019-10', '2021-02')], 'en'));
  assert.ok(en.includes('aria-hidden="true">Since 2023</span>'));
  assert.ok(en.includes('<time datetime="2019-10">10/2019</time> – <time datetime="2021-02">02/2021</time>'));
  // The years are for the eye; screen readers read the exact period once.
  assert.ok(!/class="timeline-span"(?! aria-hidden="true")/.test(de + en));
});
