#!/usr/bin/env node
/* native-routes.json (tek doğruluk kaynağı) → cf/provider-rotalari.js üretir.
   Kullanım: node scripts/native-routes-sync.mjs [--check]
   --check: dosya bayatsa çıkış kodu 1 (CI için). */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JSON_YOL = path.join(KOK, 'android/app/src/main/assets/native-routes.json');
const JS_YOL = path.join(KOK, 'cf/provider-rotalari.js');

const json = JSON.parse(readFileSync(JSON_YOL, 'utf8'));
const govde = `/* ==========================================================================
   CinePulse — SAĞLAYICI ROTA TABLOSU (Cloudflare Worker / Vercel Functions)
   --------------------------------------------------------------------------
   OTOMATİK ÜRETİLMİŞTİR — ELLE DÜZENLEMEYİN.
   Tek doğruluk kaynağı: android/app/src/main/assets/native-routes.json
   Yenilemek için: node scripts/native-routes-sync.mjs
   Neden JS kopyası? Cloudflare Worker Node 22 kullanırken CI/test Node 20'de
   çalışıyor; ESM JSON import-attributes Node 20'de parse edilemiyor. Kopyanın
   bayatlamasını tests/cf-saglayici-rotalari.test.mjs engeller (deep-equal).
   ========================================================================== */
export const ROTA_TABLOSU = ${JSON.stringify(json, null, 2)};
`;

if (process.argv.includes('--check')) {
  const mevcut = existsSync(JS_YOL) ? readFileSync(JS_YOL, 'utf8') : '';
  if (mevcut !== govde) {
    console.error('[native-routes] cf/provider-rotalari.js BAYAT — node scripts/native-routes-sync.mjs çalıştırın');
    process.exit(1);
  }
  console.log('[native-routes] güncel');
  process.exit(0);
}
writeFileSync(JS_YOL, govde);
console.log(`[native-routes] yazıldı: cf/provider-rotalari.js (${Object.keys(json).length} rota)`);
