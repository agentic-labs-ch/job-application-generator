// Page templates. All data goes through the `html` tag (escaped) and URLs through
// `safeUrl` (http, https, mailto only). No inline scripts, no embedded data.
// `tags`, `note` and `evidence` fields are never rendered.
// Pages: the main CV (renderPage), role versions (renderProfilePage), cover letters
// (renderLetterPage), text pages (renderArticlePage) and applications
// (renderApplicationPage); see docs/profiles.md and docs/applications.md.
// Type levels follow DESIGN.md (CV typography): every role (role title, company, date, …)
// uses the same class, and so the same level, in every section, on screen and in print.

import { html, safeUrl, SafeHtml } from '../scripts/lib/html.mjs';
import { brandStyle, brandTokens } from '../scripts/lib/brand.mjs';

// Style recipes by Branche (owner's model "4 Berufsfamilien × 4 Branchen", 2026-09-27; the
// designer's refreshed applications of the same day). Design system rule 1 holds per page:
// exactly one family in 400, chosen by the Branche; the font files are in FONT_FILES
// (scripts/build.mjs). Tech & Produkt uses Instrument Sans, like the rest of the site; Mensch &
// Kreativ keeps it until its recipe (Figtree) is built (design/handoff/2026-09-28-stil-rezepte/).
export const BRANCHEN = {
  'finanz-oeffentlich': { family: 'Source Serif 4', stack: '"Source Serif 4", Georgia, "Times New Roman", serif', file: 'source-serif-4-latin-400-normal.woff2' },
  'beratung-sales': { family: 'Schibsted Grotesk', stack: '"Schibsted Grotesk", ui-sans-serif, "Helvetica Neue", Arial, sans-serif', file: 'schibsted-grotesk-latin-400-normal.woff2' },
  'tech-produkt': {},
  'mensch-kreativ': {},
};

// The @font-face rule of a Branche typeface. Its values come only from BRANCHEN above (never
// from data), so the rule is emitted as is: escaping would turn its quotes into entities, which
// a <style> element does not decode.
function fontFaceStyle(font, fontsHref) {
  const rule = `@font-face { font-family: "${font.family}"; font-style: normal; font-weight: 400; font-display: swap; src: url("${fontsHref}${font.file}") format("woff2"); }`;
  if (/[<>]/.test(rule)) throw new Error(`Unexpected character in the font rule: ${rule}`);
  return new SafeHtml(`<style>${rule}</style>`);
}

const LABELS = {
  de: {
    skip: 'Zum Inhalt springen',
    sections: 'Abschnitte',
    about: 'Profil',
    experience: 'Berufserfahrung',
    education: 'Ausbildung',
    certifications: 'Zertifizierungen',
    skills: 'Kompetenzen',
    languages: 'Sprachen',
    activities: 'Engagement',
    interests: 'Interessen',
    present: 'heute',
    since: 'Seit',
    expires: 'gültig bis',
    links: 'Kontakt',
    languageSwitch: 'Sprache',
    projects: 'Projekte',
    levels: { 1: 'Grundkenntnisse', 2: 'Erste Erfahrung', 3: 'Erfahren', 4: 'Spezialist' },
    legend: 'Selbsteinschätzung in vier Stufen',
    topSkills: 'Die 10 wichtigsten Kompetenzen für die Stelle',
    board: 'Kompetenzen nach Kategorie und Stufe',
    category: 'Kategorie',
    keyNote: 'Hervorgehoben: für die Stelle besonders relevant.',
    keyMark: 'für die Stelle relevant',
    dossier: 'Bewerbungsunterlagen',
    application: 'Bewerbung',
    cv: 'Lebenslauf',
    letter: 'Anschreiben',
    jobAd: 'Stelleninserat',
    pdf: 'PDF',
    enclosures: 'Beilagen',
    contents: 'Inhalt',
    applyingAs: 'Bewerbung als',
    place: 'Ort',
    strengths: 'Kernkompetenzen',
    training: 'Weiterbildung & Zertifikate',
    knowledge: 'Weitere Kenntnisse',
    contact: 'Kontakt',
    motivation: 'Motivationsschreiben',
    career: 'Werdegang',
    careerKinds: { arch: 'Architektur & Beratung', dev: 'Entwicklung', edu: 'Ausbildung' },
    careerCaption: 'Arbeit und Ausbildung',
    refLegend: 'Quellen',
    refLetters: { experience: 'B', education: 'A', certifications: 'Z' },
    refKinds: { experience: 'Berufserfahrung', education: 'Ausbildung', certifications: 'Zertifikat' },
    residence: 'Wohnort',
    reference: 'Ref.',
  },
  en: {
    skip: 'Skip to content',
    sections: 'Sections',
    about: 'Profile',
    experience: 'Experience',
    education: 'Education',
    certifications: 'Certifications',
    skills: 'Skills',
    languages: 'Languages',
    activities: 'Activities',
    interests: 'Interests',
    present: 'now',
    since: 'Since',
    expires: 'valid until',
    links: 'Contact',
    languageSwitch: 'Language',
    projects: 'Projects',
    levels: { 1: 'Basic', 2: 'Some experience', 3: 'Experienced', 4: 'Specialist' },
    legend: 'Self-assessment on four levels',
    topSkills: 'The ten most important skills for the role',
    board: 'Skills by category and level',
    category: 'Category',
    keyNote: 'Highlighted: especially relevant for the role.',
    keyMark: 'relevant for the role',
    dossier: 'Application documents',
    application: 'Application',
    cv: 'CV',
    letter: 'Cover letter',
    jobAd: 'Job ad',
    pdf: 'PDF',
    enclosures: 'Enclosures',
    contents: 'Contents',
    applyingAs: 'Application:',
    place: 'Location',
    strengths: 'Key strengths',
    training: 'Certifications & training',
    knowledge: 'Further skills',
    contact: 'Contact',
    motivation: 'Cover letter',
    career: 'Career',
    careerKinds: { arch: 'Architecture & consulting', dev: 'Development', edu: 'Education' },
    careerCaption: 'Work and education',
    refLegend: 'Sources',
    refLetters: { experience: 'W', education: 'E', certifications: 'C' },
    refKinds: { experience: 'Work experience', education: 'Education', certifications: 'Certificate' },
    residence: 'Based in',
    reference: 'Ref.',
  },
};

const LANGUAGE_NAMES = { de: 'Deutsch', en: 'English' };

// Resolves a text field: a plain string is shared by all languages.
function t(value, lang) {
  if (value === undefined || value === null) return undefined;
  return typeof value === 'string' ? value : value[lang];
}

function context(lang) {
  const labels = LABELS[lang];
  if (!labels) throw new Error(`No UI labels for language "${lang}"`);
  return { lang, labels, t: (v) => t(v, lang) };
}

// Granat v2 date format: DE "09.2016", EN "09/2016".
function formatMonth(value, ctx) {
  const [year, month] = value.split('-');
  if (!month) return html`<time datetime="${year}">${year}</time>`; // certificates: year only
  const text = ctx.lang === 'de' ? `${month}.${year}` : `${month}/${year}`;
  return html`<time datetime="${value}">${text}</time>`;
}

// The period of an entry: "09.2016 – 06.2018", "12.2023 – heute".
function period(start, end, ctx) {
  return html`${formatMonth(start, ctx)} – ${end ? formatMonth(end, ctx) : ctx.labels.present}`;
}

// One structure for every entry (owner 2026-09-26: the same order and lines each time): the
// title, then "organisation, place" at the subtitle level, then the period on a line of its
// own in muted table figures (design system, rule 2). Positions, education, certificates and
// activities use it; projects end with the same period line (.project-period). Print joins
// organisation and period on one line ("· " from the stylesheet) until the print part.
// `code` (cross references, see referenceCodes): the entry's short code, before the period.
function orgLine(org, location, ctx, when, code) {
  const loc = ctx.t(location);
  // The code and its separator in one element (print leaves it out until the print part)
  const codeHtml = code ? html`<span class="entry-ref"><span class="entry-code">${code}</span>${when ? ' · ' : ''}</span>` : '';
  const meta = code ? html`${codeHtml}${when ?? ''}` : when;
  return html`<p class="entry-org">${org}${loc ? html`<span class="entry-place">, ${loc}</span>` : ''}${meta ? html`<span class="entry-period">${meta}</span>` : ''}</p>`;
}

// Cross references (owner 2026-09-26: visible and linked, in the design): every position, degree
// and certificate on the page gets a short code in display order (B1, A1, Z1; English W1, E1,
// C1), and a skill links to the entries it comes from. Only pages whose skills carry sources
// show them (main CV: `refs`; role versions: `evidence`).
function referenceCodes(cv, ctx, omit = []) {
  const codes = new Map();
  const add = (kind, items, name) =>
    items.forEach((e, i) => codes.set(e.id, { code: `${ctx.labels.refLetters[kind]}${i + 1}`, name: name(e), kind }));
  add('experience', cv.experience ?? [], (e) => e.organization);
  add('education', cv.education ?? [], (e) => ctx.t(e.degree));
  if (!omit.includes('certifications')) add('certifications', cv.certifications ?? [], (e) => ctx.t(e.name));
  return codes;
}

const codeOf = (ctx, id) => ctx.codes?.get(id)?.code;

// A skill's sources as links (44 px click area each); ids without an entry on the page are left out.
function skillRefs(ids, ctx) {
  const order = [...(ctx.codes?.keys() ?? [])];
  const refs = (ids ?? [])
    .map((id) => [id, ctx.codes?.get(id)])
    .filter(([, c]) => c)
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b)); // B before A before Z, in display order
  if (!refs.length) return '';
  return html`<span class="skill-refs"><span class="visually-hidden">${ctx.labels.refLegend}: </span>${refs.map(
    ([id, c]) => html`<a class="ref" href="#cv-${id}" aria-label="${c.code}: ${c.name}">${c.code}</a>`,
  )}</span>`;
}

function section(id, title, body) {
  return html`
    <section id="${id}" class="section" aria-labelledby="${id}-title">
      <h2 id="${id}-title">${title}</h2>
      ${body}
    </section>`;
}

function languageSwitch(ctx, alternates) {
  if (!alternates.length) return '';
  return html`
      <nav class="lang-switch" aria-label="${ctx.labels.languageSwitch}">
        <ul>
          ${alternates.map(
            (a) => html`<li><a class="button" href="${a.href}" hreflang="${a.lang}" lang="${a.lang}">${LANGUAGE_NAMES[a.lang]}</a></li>`,
          )}
        </ul>
      </nav>`;
}

function portrait(photo, ctx, assetPrefix) {
  if (!photo) return '';
  return html`<img class="portrait" src="${assetPrefix}assets/${photo.src}" alt="${ctx.t(photo.alt)}" width="${photo.width}" height="${photo.height}">`;
}

// Headlines like "Architekt · Cloud": the separator stays with the preceding word, so a
// line break never starts with "·".
function keepSeparators(text) {
  return text.replaceAll(' · ', '\u00a0· ');
}

// Address shown instead of the link label in print (paper has no links).
function printAddress(url) {
  return url.replace(/^mailto:/, '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

// A download link to a PDF that pages.yml prints on deploy (scripts/pdf.mjs --linked):
// `pdf` = { href, name, page, mode }; `page` is the page it is printed from, `mode` "a4" (the
// print styles) or "one-piece" (the desktop view on one long page).
function pdfLink(pdf, label, className = 'button') {
  return html`<a class="${className}" href="${pdf.href}" download="${pdf.name}" data-pdf="${pdf.page}" data-pdf-mode="${pdf.mode ?? 'a4'}" rel="nofollow">${label}</a>`;
}

// `target` (role versions, applications): the role applied for, under the name. `pdf`: the A4
// dossier of this page (owner 2026-09-26: the way to the PDF on the first screen). `contact:
// false` (applications): no language switch, place or contact links; contact closes the CV.
function header(profile, ctx, alternates, assetPrefix, target, pdf, { contact = true } = {}) {
  const links = contact ? profile.links ?? [] : [];
  const location = contact ? ctx.t(profile.location) : undefined;
  return html`
  <header class="site-header">
    <div class="container">
      ${contact ? languageSwitch(ctx, alternates) : ''}
      <div class="header-body${profile.photo ? ' has-portrait' : ''}">
      ${portrait(profile.photo, ctx, assetPrefix)}
      <div class="header-text">
      <h1>${profile.name}</h1>
      ${target ? html`<p class="target-role">${ctx.labels.applyingAs} ${target}</p>` : ''}
      <p class="headline">${keepSeparators(ctx.t(profile.headline))}</p>
      ${location ? html`<p class="location">${location}</p>` : ''}
      ${links.length || pdf
        ? html`<ul class="link-list" aria-label="${ctx.labels.links}">
          ${links.map(
            (l) => html`<li><a class="button" href="${safeUrl(l.url)}"><span class="screen-only">${ctx.t(l.label)}</span><span class="print-only">${printAddress(l.url)}</span></a></li>`,
          )}
          ${pdf ? html`<li class="screen-only">${pdfLink(pdf, ctx.labels.pdf)}</li>` : ''}
        </ul>`
        : ''}
      </div>
      </div>
    </div>
  </header>`;
}

// `items` are section ids (labelled from LABELS) or [id, label] pairs.
function nav(items, ctx) {
  return html`
  <nav class="section-nav" aria-label="${ctx.labels.sections}">
    <ul class="container">
      ${items.map((item) => {
        const [id, label] = Array.isArray(item) ? item : [item, ctx.labels[item]];
        return html`<li><a href="#${id}">${label}</a></li>`;
      })}
    </ul>
  </nav>`;
}

// Timeline component (also the Claude Design test component, see DESIGN.md). Each station shows
// the years of its period at the role's level (owner 2026-09-24: a start year alone read like a
// mark on an axis), then role → "organisation, place · period" → summary → projects →
// highlights (design system, rule 2).
function yearSpan(start, end, ctx) {
  const from = start.slice(0, 4);
  if (!end) return `${ctx.labels.since} ${from}`;
  const to = end.slice(0, 4);
  return from === to ? from : `${from} – ${to}`;
}

// The years repeat the exact period for the eye; screen readers get the exact period once, on
// the organisation's line.
function stationYears(start, end, ctx) {
  return html`<p class="timeline-when"><span class="timeline-span" aria-hidden="true">${yearSpan(start, end, ctx)}</span></p>`;
}

export function timeline(items, lang, codes) {
  const ctx = { ...context(lang), codes };
  return html`
    <ol class="timeline">
      ${items.map(
        (item) => html`
        <li class="timeline-item${item.compact ? ' is-compact' : ''}" id="cv-${item.id}">
          ${stationYears(item.start, item.end, ctx)}
          <div class="timeline-body">
            <h3 class="entry-title">${ctx.t(item.role)}</h3>
            ${orgLine(item.organization, item.location, ctx, period(item.start, item.end, ctx), codeOf(ctx, item.id))}
            ${item.summary ? html`<p class="entry-summary">${ctx.t(item.summary)}</p>` : ''}
            ${item.projects?.length
              ? html`<ul class="projects" aria-label="${ctx.labels.projects}">${item.projects.map(
                  (p) => html`<li><p>${ctx.t(p.description)}</p><p class="project-period">${period(p.start, p.end, ctx)}</p></li>`,
                )}</ul>`
              : ''}
            ${item.highlights?.length
              ? html`<ul class="highlights">${item.highlights.map((h) => html`<li>${ctx.t(h)}</li>`)}</ul>`
              : ''}
          </div>
        </li>`,
      )}
    </ol>`;
}

// Career band (owner 2026-09-26): one list without group titles, before the experience, on
// screen and in print. The positions come first, the education follows below; one time axis
// spans every entry, so no bar is cut (owner 2026-09-26).
// Only the dataset's entries: gaps and time outside it stay empty, without a label. Each row
// names its entry and period (phones: the years, the months follow in the entry and stay for
// screen readers) and links to it; the bars are drawn with CSS (--from/--to in % of the axis),
// so the band needs no script. The kind of a position comes from its tags (architecture,
// consulting, presales: "Architektur & Beratung"; otherwise "Entwicklung"); its colour is named
// by the legend, which closes the block (design system, rule 2), and by a hidden word in each
// row for screen readers (never colour only).
const month = (value) => {
  const [y, m = '1'] = value.split('-');
  return Number(y) * 12 + Number(m) - 1;
};
const ARCH_TAGS = ['architecture', 'consulting', 'presales'];

function careerBand(cv, ctx) {
  const byStart = (a, b) => month(a.entry.start) - month(b.entry.start);
  const work = (cv.experience ?? [])
    .map((entry) => ({
      entry,
      label: entry.organization,
      kind: (entry.tags ?? []).some((t) => ARCH_TAGS.includes(t)) ? 'arch' : 'dev',
    }))
    .sort(byStart);
  const schools = (cv.education ?? [])
    .map((entry) => ({
      entry,
      label: html`${ctx.t(entry.degree)}${ctx.t(entry.field) ? html`, ${ctx.t(entry.field)}` : ''}`,
      kind: 'edu',
    }))
    .sort(byStart);
  const rows = [...work, ...schools];
  if (!rows.length) return '';
  const first = Math.min(...rows.map((r) => month(r.entry.start)));
  const lastEnd = Math.max(...rows.map((r) => month(r.entry.end ?? r.entry.start)));
  const from = Math.floor(first / 12) * 12; // January of the first year
  const to = (Math.floor(lastEnd / 12) + 1) * 12; // January after the last year
  const pct = (m) => Math.round(((Math.min(Math.max(m, from), to) - from) / (to - from)) * 10000) / 100;
  const years = [];
  for (let y = from / 12; y < to / 12; y += 1) years.push(y); // ticks at the start of each year
  const kinds = ['arch', 'dev', 'edu'].filter((k) => rows.some((r) => r.kind === k));
  return html`
    <figure class="career">
      <ol class="career-rows">${rows.map(({ entry, label, kind }) => {
        const start = month(entry.start);
        const end = entry.end ? month(entry.end) + 1 : to; // an open period runs to the axis end
        return html`<li class="career-row"><a class="career-link" href="#cv-${entry.id}" style="--from: ${pct(start)}; --to: ${pct(end)}">
        <span class="career-label"><span class="visually-hidden">${ctx.labels.careerKinds[kind]}: </span>${codeOf(ctx, entry.id) ? html`<span class="entry-code">${codeOf(ctx, entry.id)}</span> ` : ''}${label}</span>
        <span class="career-period"><span class="career-years" aria-hidden="true">${yearSpan(entry.start, entry.end, ctx)}</span><span class="career-months">${period(entry.start, entry.end, ctx)}</span></span>
        <span class="career-track" aria-hidden="true"><span class="career-bar kind-${kind}"></span></span>
      </a></li>`;
      })}</ol>
      <div class="career-axis" aria-hidden="true">${years.map(
        (y, i) => html`<span class="career-tick${(y - years[0]) % 2 ? ' is-minor' : ''}${i === 0 ? ' is-first' : ''}" style="--at: ${pct(y * 12)}">${y}</span>`,
      )}</div>
      <figcaption class="career-caption">${ctx.labels.careerCaption}, ${from / 12} – ${to / 12 - 1}.
        ${kinds.map((k) => html`<span class="career-key"><span class="career-swatch kind-${k}" aria-hidden="true"></span>${ctx.labels.careerKinds[k]}</span>`)}</figcaption>
    </figure>`;
}

function education(items, ctx) {
  return html`
    <ul class="entry-list">
      ${items.map((e) => {
        const field = ctx.t(e.field);
        return html`
        <li class="entry" id="cv-${e.id}">
          <h3 class="entry-title">${ctx.t(e.degree)}${field ? html`, ${field}` : ''}</h3>
          ${orgLine(e.institution, e.location, ctx, period(e.start, e.end, ctx), codeOf(ctx, e.id))}
          ${e.summary ? html`<p class="entry-summary">${ctx.t(e.summary)}</p>` : ''}
        </li>`;
      })}
    </ul>`;
}

function certifications(items, ctx) {
  return html`
    <ul class="entry-list">
      ${items.map((c) => {
        const name = ctx.t(c.name);
        return html`
        <li class="entry" id="cv-${c.id}">
          <h3 class="entry-title">${c.url ? html`<a class="text-link" href="${safeUrl(c.url)}">${name}</a>` : name}</h3>
          ${orgLine(c.issuer, undefined, ctx, c.date ? html`${formatMonth(c.date, ctx)}${c.expires ? html` (${ctx.labels.expires} ${formatMonth(c.expires, ctx)})` : ''}` : undefined, codeOf(ctx, c.id))}
        </li>`;
      })}
    </ul>`;
}

// `refs`: the ids of the entries the skill comes from (links after the word).
function skillLevel(level, ctx, refs) {
  if (!level) return '';
  // Granat: filled brand dots for the reached level, rings for the rest, always with a word.
  const dots = [1, 2, 3, 4].map((n) => html`<span class="dot${n <= level ? ' is-on' : ''}"></span>`);
  return html`<span class="skill-level"><span class="level-dots" aria-hidden="true">${dots}</span><span class="level-label">${ctx.labels.levels[level]}</span>${refs ? skillRefs(refs, ctx) : ''}</span>`;
}

// Role versions: the ten most important skills with their level (dots and word), then a board
// with the categories as rows and the levels that occur as columns; relevant skills carry a
// small square and a visually hidden word, so never colour only.
function topSkills(groups, ctx) {
  const items = groups
    .flatMap((g) => g.items.filter((s) => s.key).map((s) => ({ ...s, group: g })))
    .map((s, index) => ({ ...s, index }))
    .sort((a, b) => b.level - a.level || a.index - b.index)
    .slice(0, 10);
  if (!items.length) return '';
  return html`
    <h3 class="group-title top-skills-title">${ctx.labels.topSkills}</h3>
    <ol class="top-skills">
      ${items.map(
        (s) => html`<li class="top-skill">
          <span class="top-skill-name">${ctx.t(s.name)}<small>${ctx.t(s.group.name)}</small></span>
          ${skillLevel(s.level, ctx, s.evidence)}
        </li>`,
      )}
    </ol>`;
}

function skillBoard(groups, ctx) {
  const levels = [4, 3, 2, 1].filter((l) => groups.some((g) => g.items.some((s) => s.level === l)));
  return html`
    <table class="skill-board" role="table" aria-label="${ctx.labels.board}">
      <thead role="rowgroup"><tr role="row">
        <th scope="col" role="columnheader">${ctx.labels.category}</th>
        ${levels.map((l) => html`<th scope="col" role="columnheader">${ctx.labels.levels[l]}</th>`)}
      </tr></thead>
      <tbody role="rowgroup">
        ${groups.map(
          (g) => html`<tr role="row" id="cv-${g.id}">
            <th scope="row" role="rowheader">${ctx.t(g.name)}</th>
            ${levels.map((l) => {
              const chips = g.items.filter((s) => s.level === l);
              return html`<td role="cell" data-label="${ctx.labels.levels[l]}"${chips.length ? '' : html` class="is-empty"`}>${chips.length
                ? html`<ul class="chips">${chips.map(
                    (s) => html`<li class="chip${s.key ? ' is-key' : ''}">${ctx.t(s.name)}${s.key ? html`<span class="visually-hidden"> (${ctx.labels.keyMark})</span>` : ''}</li>`,
                  )}</ul>`
                : ''}</td>`;
            })}
          </tr>`,
        )}
      </tbody>
    </table>`;
}

// The legend opens the competency block (owner 2026-09-26, deviation from the design system's
// rule 2, where it closes the block): the scale first, then the top ten and the board.
function competencyProfile(groups, languageItems, ctx) {
  return html`
    ${skillLegend(ctx, { keyNote: true })}
    ${topSkills(groups, ctx)}
    ${skillBoard(groups, ctx)}
    ${languageGroup(languageItems, ctx)}`;
}

// Languages as the last competency group (role versions).
function languageGroup(items, ctx) {
  if (!items.length) return '';
  return html`<div class="skill-group" id="cv-languages">
          <h3 class="group-title">${ctx.labels.languages}</h3>
          ${languages(items, ctx)}
        </div>`;
}

// Scale legend with the real shapes (dots) and the level word, highest level first, in one
// compact line that wraps; it opens the competency block. `keyNote` adds the explanation of
// highlighted chips (role versions).
function skillLegend(ctx, { keyNote = false } = {}) {
  const kinds = ['experience', 'education', 'certifications'].filter((k) => [...(ctx.codes?.values() ?? [])].some((c) => c.kind === k));
  return html`
    <div class="skill-legend">
      <p>${ctx.labels.legend}:</p>
      <ul>${[4, 3, 2, 1].map((level) => html`<li>${skillLevel(level, ctx)}</li>`)}</ul>
      ${keyNote ? html`<p class="key-note">${ctx.labels.keyNote}</p>` : ''}
      ${kinds.length
        ? html`<p class="ref-legend">${ctx.labels.refLegend}: ${kinds.map(
            (k, i) => html`${i ? ' · ' : ''}<span class="entry-code">${ctx.labels.refLetters[k]}</span> ${ctx.labels.refKinds[k]}`,
          )}</p>`
        : ''}
    </div>`;
}

// `languageItems` (role versions) adds the languages as the last competency group. The legend
// opens the block (owner 2026-09-26: the scale first, then the skills).
function skills(groups, ctx, { legend = false, languageItems = [] } = {}) {
  return html`
    ${legend ? skillLegend(ctx) : ''}
    <div class="skill-groups">
      ${groups.map(
        (g) => html`
        <div class="skill-group" id="cv-${g.id}">
          <h3 class="group-title">${ctx.t(g.name)}</h3>
          ${skillList(g.items, ctx)}
        </div>`,
      )}
      ${languageGroup(languageItems, ctx)}
    </div>`;
}

// `refs: false` for the print copy in the role version's sidebar (no links there).
function skillList(items, ctx, { refs = true } = {}) {
  return html`<ul class="skill-list">${items.map(
    (s) => html`<li><span class="skill-name">${ctx.t(s.name)}</span>${skillLevel(s.level, ctx, refs ? s.refs ?? s.evidence : undefined)}</li>`,
  )}</ul>`;
}

// `ids: false` for the print copy in the role version's sidebar (ids stay unique).
// Each language: name and level on one line, then an optional short line on how it is used
// (owner 2026-09-26: a native language does not say how well someone speaks it).
function languages(items, ctx, { ids = true } = {}) {
  return html`
    <ul class="language-list">
      ${items.map(
        (l) => html`<li${ids ? html` id="cv-${l.id}"` : ''}><span class="language-name">${ctx.t(l.name)}</span> <span class="language-level">${ctx.t(l.level)}</span>${l.detail ? html` <span class="language-detail">${ctx.t(l.detail)}</span>` : ''}</li>`,
      )}
    </ul>`;
}

// Activities read as text like the sections around them (owner 2026-09-26): what was done at
// the text level, then organisation and period in the entries' structure.
function activities(items, ctx) {
  return html`
    <ul class="entry-list">
      ${items.map(
        (a) => html`
        <li class="entry activity" id="cv-${a.id}">
          <p class="activity-text">${ctx.t(a.description)}</p>
          ${orgLine(a.organization, undefined, ctx, period(a.start, a.end, ctx))}
        </li>`,
      )}
    </ul>`;
}

// A CSS string for a custom property (escaped for CSS here, for the attribute by `html`).
function cssString(text) {
  return `"${String(text).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\r\n]+/g, ' ')}"`;
}

// `runningHead`: text of the printed page head from page 2 on (CVs), read by the @page rules in
// site/styles.css through the --running-head custom property.
// `style`: further declarations for <html> (an application's company colours).
// `alternates`: the other language versions ({ lang, href }), as <link rel="alternate"> before the
// site script, which reads the English one (site/entry.js, language by browser).
// `font`: the page's one typeface when it is not Instrument Sans ({ family, stack, file } from
// BRANCHEN): its @font-face in the head, and --font-text on <html>.
function documentShell(ctx, { title, description, cssHref, scriptHref, noindex = false, bodyClass = '', runningHead, style, alternates = [], font }, body) {
  const fontDeclaration = font?.family && `--font-text: ${font.stack}`;
  const declarations = [style, fontDeclaration, runningHead && `--running-head: ${cssString(runningHead)}`].filter(Boolean).join('; ');
  return html`<!doctype html>
<html lang="${ctx.lang}"${declarations ? html` style="${declarations}"` : ''}>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  ${noindex ? html`<meta name="robots" content="noindex">` : ''}
  <link rel="stylesheet" href="${cssHref}">
  ${font?.family ? fontFaceStyle(font, cssHref.replace(/site\.css$/, 'fonts/')) : ''}
  ${alternates.map((a) => html`<link rel="alternate" hreflang="${a.lang}" href="${a.href}">`)}
  ${scriptHref ? html`<script src="${scriptHref}"></script>` : ''}
</head>
<body${bodyClass ? html` class="${bodyClass}"` : ''}>
  <a class="skip-link" href="#main">${ctx.labels.skip}</a>
  ${body}
</body>
</html>
`.toString();
}

function sections(parts, ctx) {
  return html`
  ${parts.length > 1 ? nav(parts.map(([id]) => id), ctx) : ''}
  <main id="main" class="container" tabindex="-1">
    ${parts.map(([id, body]) => section(id, ctx.labels[id], body))}
  </main>`;
}

function baseParts(cv, ctx, omit = []) {
  const parts = [];
  if (cv.experience?.length) parts.push(['experience', timeline(cv.experience, ctx.lang, ctx.codes)]);
  if (cv.education?.length) parts.push(['education', education(cv.education, ctx)]);
  if (cv.certifications?.length && !omit.includes('certifications')) {
    parts.push(['certifications', certifications(cv.certifications, ctx)]);
  }
  return parts;
}

function interestsPart(cv, ctx, omit = []) {
  return cv.profile.interests && !omit.includes('interests') ? [['interests', html`<p>${ctx.t(cv.profile.interests)}</p>`]] : [];
}

function tailParts(cv, ctx, omit = []) {
  const parts = [];
  if (cv.activities?.length && !omit.includes('activities')) parts.push(['activities', activities(cv.activities, ctx)]);
  parts.push(...interestsPart(cv, ctx, omit));
  return parts;
}

// Renders one language version. `alternates` lists the other language pages as
// { lang, href } relative to this page.
export function renderPage(cv, { lang, assetPrefix = '', cssHref = 'assets/site.css', scriptHref, alternates = [], pdf } = {}) {
  const ctx = context(lang ?? cv.meta?.languages?.[0] ?? 'en');
  if ((cv.skills ?? []).some((g) => g.items.some((s) => s.refs?.length))) ctx.codes = referenceCodes(cv, ctx);
  const { profile } = cv;
  const parts = [];
  if (profile.summary) parts.push(['about', html`<p class="summary">${ctx.t(profile.summary)}</p>`]);
  if (cv.experience?.length || cv.education?.length) parts.push(['career', careerBand(cv, ctx)]);
  // Important first (owner 2026-09-26, docs/cv-guide.md): experience, skills and interests (they
  // will be a large part of the CV); certificates, education, languages and activities at the end.
  if (cv.experience?.length) parts.push(['experience', timeline(cv.experience, ctx.lang, ctx.codes)]);
  if (cv.skills?.length) parts.push(['skills', skills(cv.skills, ctx, { legend: true })]);
  parts.push(...interestsPart(cv, ctx));
  if (cv.certifications?.length) parts.push(['certifications', certifications(cv.certifications, ctx)]);
  if (cv.education?.length) parts.push(['education', education(cv.education, ctx)]);
  if (cv.languages?.length) parts.push(['languages', languages(cv.languages, ctx)]);
  if (cv.activities?.length) parts.push(['activities', activities(cv.activities, ctx)]);

  const headline = ctx.t(profile.headline);
  return documentShell(
    ctx,
    {
      title: `${profile.name} – ${headline}`,
      description: headline,
      cssHref,
      scriptHref,
      bodyClass: 'page-cv',
      runningHead: `${profile.name} · ${ctx.labels.cv}`,
      alternates,
    },
    html`
  ${header(profile, ctx, alternates, assetPrefix, undefined, pdf && { ...pdf, name: applicationPdfName(profile.name, ctx.labels.cv) })}
  ${sections(parts, ctx)}`,
  );
}

// Print sidebar of a role version (DESIGN.md, "Print"): portrait, contact, the scale
// legend, the competency groups as rows with dots, languages and interests. Hidden on screen,
// where the same facts appear in the header and the competency profile; so it carries no ids
// and no links (contact addresses as text, as on paper).
function printSidebar(cv, version, ctx, root) {
  const { profile } = cv;
  const location = ctx.t(profile.location);
  const interests = !(version.omit ?? []).includes('interests') && ctx.t(profile.interests);
  const languageItems = cv.languages ?? [];
  return html`
  <aside class="print-side">
    ${profile.photo
      ? html`<img class="side-portrait" src="${root}assets/${profile.photo.src}" alt="${ctx.t(profile.photo.alt)}" width="${profile.photo.width}" height="${profile.photo.height}">`
      : ''}
    <div class="side-block">
      <h2 class="side-title">${ctx.labels.links}</h2>
      <dl class="side-contact">
        ${(profile.links ?? []).map((l) => html`<div><dt>${ctx.t(l.label)}</dt><dd>${printAddress(l.url)}</dd></div>`)}
        ${location ? html`<div><dt>${ctx.labels.place}</dt><dd>${location}</dd></div>` : ''}
      </dl>
    </div>
    <div class="side-block">
      <h2 class="side-title">${ctx.labels.skills}</h2>
      <ul class="side-legend">${[4, 3, 2, 1].map((level) => html`<li>${skillLevel(level, ctx)}</li>`)}</ul>
      ${version.skills.map(
        (g) => html`<div class="side-group">
          <h3 class="group-title">${ctx.t(g.name)}</h3>
          ${skillList(g.items, ctx, { refs: false })}
        </div>`,
      )}
    </div>
    ${languageItems.length
      ? html`<div class="side-block">
          <h2 class="side-title">${ctx.labels.languages}</h2>
          ${languages(languageItems, ctx, { ids: false })}
        </div>`
      : ''}
    ${interests
      ? html`<div class="side-block">
          <h2 class="side-title">${ctx.labels.interests}</h2>
          <p>${interests}</p>
        </div>`
      : ''}
  </aside>`;
}

// Application bar for role versions with a job ad or a cover letter. `links` holds the
// relative hrefs of the CV and letter pages; `current` is "cv" or "letter".
function dossierNav(version, ctx, links, current) {
  if (!version.job && !version.letter) return '';
  const job = version.job;
  const items = [
    ['cv', ctx.labels.cv, links.cv],
    ...(version.letter ? [['letter', ctx.labels.letter, links.letter]] : []),
  ];
  return html`
  <nav class="dossier-nav" aria-label="${ctx.labels.dossier}">
    <div class="container">
      <p class="dossier-title">${job ? html`<span class="dossier-job">${ctx.labels.application}: ${job.title} · </span>${job.company}` : ctx.labels.application}</p>
      <ul>
        ${items.map(
          ([key, label, href]) =>
            html`<li${key === current ? html` class="is-current"` : ''}><a class="button" href="${href}"${key === current ? html` aria-current="page"` : ''}>${label}</a></li>`,
        )}
        ${job ? html`<li><a class="button" href="${safeUrl(job.url)}">${ctx.labels.jobAd}</a></li>` : ''}
      </ul>
    </div>
  </nav>`;
}

// Role version: `cv` is the base dataset with the version's experience tailoring applied
// (see mergeProfile in scripts/lib/profiles.mjs), `version` the profile document. Print: the
// sidebar layout (printSidebar, DESIGN.md "Print").
export function renderProfilePage(cv, version, { lang, root = '', alternates = [], dossierLinks = {}, pdf } = {}) {
  const ctx = context(lang);
  if ((version.skills ?? []).some((g) => g.items.some((s) => s.evidence?.length))) ctx.codes = referenceCodes(cv, ctx, version.omit ?? []);
  const profile = { ...cv.profile, headline: version.headline };
  const about = html`
    <p class="claim">${ctx.t(version.claim)}</p>
    <p class="summary">${ctx.t(version.summary)}</p>
    <ul class="usp-list">
      ${version.usp.map((u) => html`<li><h3 class="entry-title">${ctx.t(u.title)}</h3><p>${ctx.t(u.text)}</p></li>`)}
    </ul>`;
  const omit = version.omit ?? [];
  const parts = [
    ['about', about],
    ['skills', competencyProfile(version.skills, cv.languages ?? [], ctx)],
    ['career', careerBand(cv, ctx)],
    ...baseParts(cv, ctx, omit),
    ...tailParts(cv, ctx, omit),
  ];
  const headline = ctx.t(version.headline);
  return documentShell(
    ctx,
    {
      title: `${profile.name} – ${headline}`,
      description: headline,
      cssHref: `${root}assets/site.css`,
      scriptHref: `${root}assets/entry.js`,
      noindex: true,
      bodyClass: 'page-profile',
      alternates,
      runningHead: `${profile.name} · ${ctx.labels.cv}`,
    },
    html`
  ${dossierNav(version, ctx, dossierLinks, 'cv')}
  ${header(profile, ctx, alternates, root, ctx.t(version.target), pdf && { ...pdf, name: applicationPdfName(profile.name, ctx.labels.cv, ctx.t(version.target)) })}
  ${sections(parts, ctx)}
  ${printSidebar(cv, version, ctx, root)}`,
  );
}

function formatDate(value, ctx) {
  const [y, m, d] = value.split('-').map(Number);
  const text = new Intl.DateTimeFormat(ctx.lang === 'de' ? 'de-CH' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
  return html`<time datetime="${value}">${text}</time>`;
}

function letterBlock(block, ctx) {
  if (block.points) return html`<ul class="letter-points">${block.points.map((p) => html`<li>${ctx.t(p)}</li>`)}</ul>`;
  return html`<p>${ctx.t(block)}</p>`;
}

// A Swiss business letter: recipient, place and date, subject, salutation, the AIDA blocks,
// closing, signature, enclosures. `sender: true` (applications) puts the sender block first;
// `heading` is the subject's heading level (h2 on a letter page, h3 as the last section).
function letterArticle(profile, letter, ctx, { sender = false, heading = 'h2' } = {}) {
  const location = ctx.t(profile.location);
  const subject = ctx.t(letter.subject);
  const blocks = ['attention', 'interest', 'desire', 'action'].flatMap((part) => letter[part]);
  return html`
    <article class="letter" aria-labelledby="letter-subject">
      ${sender ? html`<p class="letter-sender"><span class="letter-sender-name">${profile.name}</span>${location ? html`<br>${location}` : ''}${(profile.links ?? []).map((l) => html`<br>${printAddress(l.url)}`)}</p>` : ''}
      <div class="letter-meta">
        <p class="letter-recipient">${letter.recipient.map((line, i) => html`${i ? html`<br>` : ''}${ctx.t(line)}`)}</p>
        <p class="letter-date">${ctx.t(letter.place)}, ${formatDate(letter.date, ctx)}</p>
      </div>
      ${heading === 'h3' ? html`<h3 id="letter-subject" class="letter-subject">${subject}</h3>` : html`<h2 id="letter-subject" class="letter-subject">${subject}</h2>`}
      <p>${ctx.t(letter.salutation)}</p>
      ${blocks.map((block) => letterBlock(block, ctx))}
      <p class="letter-closing">${ctx.t(letter.closing)}</p>
      <p class="letter-signature">${profile.name}</p>
      ${letter.enclosures
        ? html`<p class="letter-enclosures"><span class="letter-enclosures-label">${ctx.labels.enclosures}</span> ${ctx.t(letter.enclosures)}</p>`
        : ''}
    </article>`;
}

// Cover letter in the CV's layout: same header (letterhead), then a Swiss business letter.
export function renderLetterPage(cv, version, { lang, root = '', alternates = [], dossierLinks = {} } = {}) {
  const ctx = context(lang);
  const letter = version.letter;
  const profile = { ...cv.profile, headline: version.headline };
  const subject = ctx.t(letter.subject);
  return documentShell(
    ctx,
    {
      title: `${subject} – ${profile.name}`,
      description: subject,
      cssHref: `${root}assets/site.css`,
      scriptHref: `${root}assets/entry.js`,
      noindex: true,
      bodyClass: 'page-letter',
      alternates,
    },
    html`
  ${dossierNav(version, ctx, dossierLinks, 'letter')}
  ${header(profile, ctx, alternates, root)}
  <main id="main" class="container" tabindex="-1">${letterArticle(profile, letter, ctx)}
  </main>`,
  );
}

// Applications (docs/applications.md): CV and motivation letter for one job ad on one page, in
// the order of the CV guide (docs/cv-guide.md). Who I am, the three key strengths and the
// experience come first; certificates, education, languages and further skills follow;
// contact details close the CV, and the motivation letter ends the page. The company colours
// (`brand`) become a style attribute on <html> that overrides the Granat colour tokens of this
// page only; type, spacing and components stay those of the design system.
function strengths(items, ctx) {
  return html`
    <ol class="strengths">
      ${items.map(
        (s) => html`<li class="strength">
          <h3 class="entry-title">${ctx.t(s.title)}</h3>
          <p>${ctx.t(s.text)}</p>
        </li>`,
      )}
    </ol>`;
}

function knowledge(groups, ctx) {
  return html`
    <dl class="knowledge">
      ${groups.map(
        (g) => html`<div class="knowledge-group">
          <dt>${ctx.t(g.name)}</dt>
          <dd>${g.items.map((item) => ctx.t(item)).join(', ')}</dd>
        </div>`,
      )}
    </dl>`;
}

// Contact details and personal notes close the CV (docs/cv-guide.md). Links keep their
// address as the visible text, so screen and paper read the same.
function contact(profile, ctx, interests) {
  const location = ctx.t(profile.location);
  return html`
    <dl class="contact-list">
      ${(profile.links ?? []).map(
        (l) => html`<div><dt>${ctx.t(l.label)}</dt><dd><a class="text-link" href="${safeUrl(l.url)}">${printAddress(l.url)}</a></dd></div>`,
      )}
      ${location ? html`<div><dt>${ctx.labels.residence}</dt><dd>${location}</dd></div>` : ''}
      ${interests ? html`<div><dt>${ctx.labels.interests}</dt><dd>${interests}</dd></div>` : ''}
    </dl>`;
}

// The motivation letter as the last section: sender first (Swiss business letter). On paper it
// starts on a new sheet (site/styles.css).
function applicationLetter(profile, app, ctx) {
  return letterArticle(profile, app.letter, ctx, { sender: true, heading: 'h3' });
}

// Order of the sections (docs/cv-guide.md): [id, label key].
export const APPLICATION_SECTIONS = [
  'about',
  'strengths',
  'career',
  'experience',
  'training',
  'education',
  'languages',
  'knowledge',
  'contact',
  'motivation',
];

// File name of an application's PDF, as the CV guide asks for (docs/cv-guide.md, "Before
// sending"): Alex-Muster_Bewerbung_Globex Consulting_Technology-Strategy-Manager.pdf.
export function applicationPdfName(...parts) {
  const slug = (text) => text.normalize('NFC').replace(/[^\p{L}\p{N}\p{Pd}\s]/gu, '').trim().replace(/[\p{Pd}\s]+/gu, '-');
  return `${parts.map(slug).join('_')}.pdf`;
}

// The PDF itself is printed by pages.yml after the checks (scripts/pdf.mjs --one-piece): the
// desktop view on one long page, like the HTML.
// `cv` is the base dataset with the application's tailoring applied (mergeApplication in
// scripts/lib/profiles.mjs), `app` the application document.
export function renderApplicationPage(cv, app, { root = '' } = {}) {
  const ctx = context(app.language);
  const profile = { ...cv.profile, headline: app.headline };
  const omit = app.omit ?? [];
  const interests = omit.includes('interests') ? undefined : ctx.t(app.interests ?? cv.profile.interests);
  const job = app.job;
  const body = {
    about: html`${app.claim ? html`<p class="claim">${ctx.t(app.claim)}</p>` : ''}<p class="summary">${ctx.t(app.profile)}</p>`,
    strengths: strengths(app.strengths, ctx),
    career: careerBand(cv, ctx),
    experience: timeline(cv.experience ?? [], ctx.lang),
    training: !omit.includes('certifications') && cv.certifications?.length ? certifications(cv.certifications, ctx) : undefined,
    education: cv.education?.length ? education(cv.education, ctx) : undefined,
    languages: cv.languages?.length ? languages(cv.languages, ctx) : undefined,
    knowledge: app.knowledge?.length ? knowledge(app.knowledge, ctx) : undefined,
    contact: contact(profile, ctx, interests),
    motivation: applicationLetter(profile, app, ctx),
  };
  const parts = APPLICATION_SECTIONS.filter((id) => body[id]);
  const navItems = parts.filter((id) => ['about', 'strengths', 'experience', 'education', 'contact', 'motivation'].includes(id));
  const target = ctx.t(app.target);
  const headline = ctx.t(app.headline);
  const { tokens } = brandTokens(app.brand);
  return documentShell(
    ctx,
    {
      title: `${profile.name} – ${ctx.labels.application}: ${target}`,
      description: headline,
      cssHref: `${root}assets/site.css`,
      scriptHref: `${root}assets/entry.js`,
      noindex: true,
      bodyClass: 'page-application',
      runningHead: `${profile.name} · ${ctx.labels.application} ${target}`,
      style: brandStyle(tokens),
      font: BRANCHEN[app.branche],
    },
    html`
  <div class="brand-stripe" aria-hidden="true"></div>
  <nav class="dossier-nav" aria-label="${ctx.labels.dossier}">
    <div class="container">
      <p class="dossier-title"><span class="dossier-job">${ctx.labels.application}: ${job.title} · </span>${job.company}${job.reference ? html` · ${ctx.labels.reference} ${job.reference}` : ''}</p>
      <ul>
        <li><a class="button" href="${safeUrl(job.url)}">${ctx.labels.jobAd}</a></li>
        <li>${pdfLink({ href: `${root}pdf/${app.id}.pdf`, name: applicationPdfName(profile.name, ctx.labels.application, job.company, target), page: `${app.id}/index.html`, mode: 'one-piece' }, ctx.labels.pdf)}</li>
        <li><a class="button" href="#contact">${ctx.labels.contact}</a></li>
      </ul>
    </div>
  </nav>
  ${header(profile, ctx, [], root, target, undefined, { contact: false })}
  ${nav(navItems.map((id) => [id, ctx.labels[id]]), ctx)}
  <main id="main" class="container" tabindex="-1">
    ${parts.map((id) => section(id, ctx.labels[id], body[id]))}
  </main>`,
  );
}

function articleTable(table, ctx) {
  const columns = table.columns.map((c) => ctx.t(c));
  // Explicit roles keep table semantics when narrow screens stack the cells (display: block).
  return html`
    <table class="data-table" role="table">
      <thead role="rowgroup"><tr role="row">${columns.map((c) => html`<th scope="col" role="columnheader">${c}</th>`)}</tr></thead>
      <tbody role="rowgroup">
        ${table.rows.map(
          (row) => html`<tr role="row">${row.map(
            (cell, i) => html`<td role="cell" data-label="${columns[i]}">${ctx.t(cell)}</td>`,
          )}</tr>`,
        )}
      </tbody>
    </table>`;
}

function articleBlock(block, ctx, resolvePage) {
  if (typeof block === 'string' || !(block.list || block.steps || block.table || block.links)) {
    return html`<p>${ctx.t(block)}</p>`;
  }
  if (block.list) return html`<ul class="bullets">${block.list.map((item) => html`<li>${ctx.t(item)}</li>`)}</ul>`;
  if (block.steps) return html`<ol class="steps">${block.steps.map((item) => html`<li>${ctx.t(item)}</li>`)}</ol>`;
  if (block.table) return articleTable(block.table, ctx);
  return html`
    <ul class="page-links">
      ${block.links.map(
        (l) => html`<li><a class="text-link" href="${l.page ? resolvePage(l.page) : safeUrl(l.url)}">${ctx.t(l.label)}</a></li>`,
      )}
    </ul>`;
}

// Text page (keyword analysis, coaching notes). `resolvePage(ref)` returns the relative href
// of a page reference (see docs/profiles.md).
export function renderArticlePage(cv, article, { lang, root = '', alternates = [], resolvePage } = {}) {
  const ctx = context(lang);
  const title = ctx.t(article.title);
  const lead = ctx.t(article.lead);
  const ids = article.sections.map((_, i) => `section-${i + 1}`);
  return documentShell(
    ctx,
    {
      title: `${title} – ${cv.profile.name}`,
      description: lead ?? title,
      cssHref: `${root}assets/site.css`,
      scriptHref: `${root}assets/entry.js`,
      noindex: true,
      bodyClass: 'page-article',
      alternates,
    },
    html`
  <header class="site-header article-header">
    <div class="container">
      ${languageSwitch(ctx, alternates)}
      <p class="article-owner"><a class="text-link" href="${resolvePage('cv')}">${cv.profile.name}</a></p>
      <h1 class="article-title">${title}</h1>
      ${lead ? html`<p class="article-lead">${lead}</p>` : ''}
    </div>
  </header>
  ${ids.length > 2 ? nav(article.sections.map((sec, i) => [ids[i], ctx.t(sec.heading)]), ctx) : ''}
  <main id="main" class="container" tabindex="-1">
    ${article.sections.map((sec, i) =>
      section(ids[i], ctx.t(sec.heading), sec.blocks.map((block) => articleBlock(block, ctx, resolvePage))),
    )}
  </main>`,
  );
}
