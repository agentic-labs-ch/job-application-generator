import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadCv } from '../../scripts/lib/validate.mjs';
import { renderPage } from '../../site/templates.mjs';

// Owner feedback of 2026-09-26 on the main CV, checked on the fictional example dataset.
const { data: cv } = await loadCv('data/cv.example.yaml');
const page = String(renderPage(cv, { lang: 'en' }));
const section = (id) => page.slice(page.indexOf(`<section id="${id}"`), page.indexOf('</section>', page.indexOf(`<section id="${id}"`)));

test('career band: the positions first, the education below, one list, nothing cut', () => {
  const band = section('career');
  assert.equal((band.match(/<ol class="career-rows">/g) ?? []).length, 1, 'one list');
  assert.ok(!band.includes('career-lane'), 'no group titles for work and education');
  const rows = [...band.matchAll(/<a class="career-link" href="#cv-([^"]+)" style="--from: ([\d.]+); --to: ([\d.]+)">/g)];
  assert.equal(rows.length, cv.experience.length + cv.education.length, 'one row per entry, no rows for gaps');
  const ids = rows.map((r) => r[1]);
  assert.deepEqual(ids, ['north-point-intern', 'harbor-works-engineer', 'lumen-labs-lead', 'example-college-bsc', 'example-university-msc'], 'positions oldest first, then the education');
  // One axis over every entry: nothing is cut (owner 2026-09-26), the open period runs to the end.
  const at = (id) => rows.find((r) => r[1] === id).slice(2).map(Number);
  assert.ok(at('example-college-bsc')[0] > 0 && at('example-college-bsc')[1] > at('example-college-bsc')[0]);
  assert.equal(at('lumen-labs-lead')[1], 100);
  assert.ok(!band.includes('is-cut'));
  assert.ok(band.includes('style="--at: 0">2012</span>'), 'first tick: the earliest entry');
  // The kind is named for screen readers (never colour only); phones show the years, the months
  // stay in the markup and name the full period, also where the bar is cut.
  assert.equal((band.match(/<span class="visually-hidden">(Education|Development|Architecture &amp; consulting): <\/span>/g) ?? []).length, rows.length);
  assert.ok(band.includes('<span class="career-years" aria-hidden="true">2012 – 2015</span><span class="career-months"><time datetime="2012-09">09/2012</time>'));
});

test('main CV: important first; the legend opens the skills', () => {
  const order = [...page.matchAll(/<section id="([a-z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(order, ['about', 'career', 'experience', 'skills', 'interests', 'certifications', 'education', 'languages', 'activities']);
  const skills = section('skills');
  assert.ok(skills.indexOf('skill-legend') < skills.indexOf('skill-groups'), 'legend before the groups');
});

test('activities read as text; every entry keeps organisation and period', () => {
  const activities = section('activities');
  assert.ok(activities.includes('<p class="activity-text">Organised a monthly meetup'), 'text, not a title');
  assert.ok(!activities.includes('entry-title'));
  assert.match(activities, /<p class="entry-org">Exampleton Tech Meetup \(fictional\)<span class="entry-period"><time/);
});

test('languages: name and level, then the optional line on how the language is used', () => {
  const languages = section('languages');
  assert.ok(languages.includes('<span class="language-name">English</span> <span class="language-level">Fluent (C2)</span> <span class="language-detail">Writes and presents at work every day (fictional)</span>'));
  assert.ok(/<span class="language-name">French<\/span> <span class="language-level">Intermediate \(B1\)<\/span><\/li>/.test(languages), 'no empty detail');
});

test('cross references: codes on the entries, skills link to their sources (owner 2026-09-26)', () => {
  // English codes: W work experience, E education, C certificate, in display order
  const experience = section('experience');
  assert.ok(experience.includes('<span class="entry-period"><span class="entry-ref"><span class="entry-code">W1</span> · </span><time datetime="2022-04">'), 'W1: the first position');
  assert.ok(section('education').includes('<span class="entry-code">E1</span> · </span>'));
  assert.ok(section('certifications').includes('<span class="entry-code">C1</span> · </span>'));
  assert.ok(section('career').includes('<span class="entry-code">W1</span> Lumen Labs (fictional)'), 'the band names the codes too');
  // Skills: links with a 44 px click area (CSS), named for screen readers, in code order
  const skills = section('skills');
  assert.match(skills, /<span class="skill-name">Python<\/span>.*?<a class="ref" href="#cv-lumen-labs-lead" aria-label="W1: Lumen Labs \(fictional\)">W1<\/a><a class="ref" href="#cv-example-university-msc" aria-label="E1: MSc">E1<\/a>/s);
  assert.match(skills, /<span class="skill-name">Automation<\/span>.*?>W1<\/a><a class="ref" href="#cv-harbor-works-engineer"[^>]*>W2<\/a>/s, 'sorted by code, not by data order');
  assert.ok(!/<span class="skill-name">TypeScript<\/span><span class="skill-level">(?:(?!<\/li>).)*skill-refs/s.test(skills), 'a skill without sources shows none');
  assert.ok(skills.includes('<p class="ref-legend">Sources: <span class="entry-code">W</span> Work experience · <span class="entry-code">E</span> Education · <span class="entry-code">C</span> Certificate</p>'), 'the legend explains the codes');
});

test('cross references stay off pages whose skills have no sources', async () => {
  const { data } = await loadCv('data/cv.example.yaml');
  for (const group of data.skills) for (const item of group.items) delete item.refs;
  const plain = String(renderPage(data, { lang: 'en' }));
  assert.ok(!plain.includes('entry-code') && !plain.includes('class="ref"') && !plain.includes('ref-legend'));
});
