import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

function scanHtmlTags(source) {
  const tags = [];
  let i = 0;
  while (i < source.length) {
    const lt = source.indexOf('<', i);
    if (lt < 0) break;
    if (source.startsWith('<!--', lt)) {
      const end = source.indexOf('-->', lt + 4);
      i = end < 0 ? source.length : end + 3;
      continue;
    }
    const match = source.slice(lt).match(/^<([A-Za-z][\w:-]*)([^>]*)>/);
    if (!match) { i = lt + 1; continue; }
    const tag = match[1].toLowerCase();
    const attrs = match[2];
    tags.push({ tag, attrs, offset: lt });
    i = lt + match[0].length;
    if (tag === 'script' || tag === 'style') {
      const close = new RegExp(`<\\/${tag}\\s*>`, 'ig');
      close.lastIndex = i;
      const closing = close.exec(source);
      i = closing ? close.lastIndex : source.length;
    }
  }
  return tags;
}

test('HTML has unique IDs across all real tags, including script and style tags', () => {
  const tags = scanHtmlTags(html);
  const ids = new Map();
  for (const { attrs, tag, offset } of tags) {
    const idMatch = attrs.match(/\bid\s*=\s*(["'])(.*?)\1/i);
    if (!idMatch) continue;
    const id = idMatch[2];
    ids.set(id, [...(ids.get(id) || []), { tag, offset }]);
  }
  const duplicates = [...ids.entries()].filter(([, occurrences]) => occurrences.length > 1);
  assert.deepEqual(duplicates, [], `Duplicate HTML IDs: ${JSON.stringify(duplicates)}`);
});

test('HTML has one document root, head and body, with closing tags at the end', () => {
  const tags = scanHtmlTags(html);
  assert.equal(tags.filter(t => t.tag === 'html' && !t.attrs.startsWith('/')).length, 1);
  assert.equal(tags.filter(t => t.tag === 'head' && !t.attrs.startsWith('/')).length, 1);
  assert.equal(tags.filter(t => t.tag === 'body' && !t.attrs.startsWith('/')).length, 1);
  assert.match(html.trimEnd(), /<\/body>\s*<\/html>$/i);
});
