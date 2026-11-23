import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'index.html');
const preview = path.join(root, 'preview.html');
const dist = path.join(root, 'dist');
if (!fs.existsSync(source)) throw new Error('index.html not found');
fs.mkdirSync(dist, { recursive: true });
const html = fs.readFileSync(source, 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

// The source is a self-contained HTML application. Previous index-based
// externalization mapped the wrong inline script blocks to stale assets and
// silently omitted runtime code. Keep the distribution byte-for-byte identical.
fs.writeFileSync(preview, html);
fs.writeFileSync(path.join(dist, 'index.html'), html);
const assets = path.join(root, 'assets');
if (fs.existsSync(assets)) fs.cpSync(assets, path.join(dist, 'assets'), { recursive: true, force: true });
fs.writeFileSync(path.join(dist, 'build-manifest.json'), JSON.stringify({
  name: 'China Made Easy',
  version: packageJson.version,
  source: 'index.html',
  builtAt: new Date().toISOString(),
  bytes: Buffer.byteLength(html),
  mode: 'self-contained-html',
  externalAssets: 0
}, null, 2));
console.log(`Preview built: ${preview}`);
console.log(`Standalone distribution: ${path.join(dist, 'index.html')}`);
