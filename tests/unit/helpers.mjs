// Pages carry exactly one script: the external, content-free entry moment (site/entry.js),
// loaded before the first paint. Never inline code or event handler attributes.
export function onlyEntryScript(page) {
  const scripts = page.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) ?? [];
  return (
    scripts.length === 1 &&
    /^<script src="(\.\.\/)*assets\/entry\.js"><\/script>$/.test(scripts[0]) &&
    !/\son[a-z]+=/i.test(page)
  );
}
