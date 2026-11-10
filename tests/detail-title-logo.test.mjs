import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const detailView = fs.readFileSync(path.join(root, 'src/views/DetailView.js'), 'utf8');

test('detail view hides the duplicate original title when its logo loads', () => {
  assert.match(detailView, /const orijinalBaslik = kok\?\.querySelector\?\.\('\.dt-orijinal'\)/);
  assert.match(detailView, /gorsel\.hidden = false;[\s\S]*?blok\.classList\.add\('detail-titleblock--logo'\);[\s\S]*?orijinalBaslik\.hidden = true/);
});
