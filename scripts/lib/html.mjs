// HTML rendering helpers. Every interpolated value is escaped unless it is already
// SafeHtml produced by the `html` tag, so templates cannot emit raw data by accident.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export class SafeHtml {
  constructor(value) {
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

function renderValue(value) {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(renderValue).join('');
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) {
    out += renderValue(values[i]) + strings[i + 1];
  }
  return new SafeHtml(out);
}

const ALLOWED_SCHEMES = new Set(['http:', 'https:', 'mailto:']);

// Returns the URL unchanged if its scheme is allowed; throws otherwise.
// The caller still interpolates it through `html`, which escapes it for the attribute.
export function safeUrl(value) {
  const text = String(value);
  if (/[\s\u0000-\u001f\u007f]/.test(text)) {
    throw new Error(`URL contains whitespace or control characters: ${JSON.stringify(text)}`);
  }
  let parsed;
  try {
    parsed = new URL(text);
  } catch {
    throw new Error(`Invalid URL: ${JSON.stringify(text)}`);
  }
  if (!ALLOWED_SCHEMES.has(parsed.protocol)) {
    throw new Error(`URL scheme not allowed (http, https, mailto only): ${JSON.stringify(text)}`);
  }
  if (!/^(https?:\/\/|mailto:)/i.test(text)) {
    throw new Error(`URL must start with http://, https:// or mailto: ${JSON.stringify(text)}`);
  }
  return text;
}
