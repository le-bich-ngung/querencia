// Chay: pnpm --filter @querencia/i18n build:python
// Muc dich: apps/ai-service (Python) khong import truc tiep duoc package TS,
// nen script nay merge cac namespace JSON cua tung locale thanh 1 file phang
// va ghi vao apps/ai-service/locales/{code}.json — dam bao CHI 1 nguon that
// (packages/i18n/locales) duoc dung, tranh 2 noi lech nhau.
//
// Goi trong CI/build truoc khi deploy ai-service.

import fs from 'fs';
import path from 'path';
import { LOCALE_CODES } from '../src/locales';

const SRC_DIR = path.join(__dirname, '..', 'locales');
const OUT_DIR = path.join(__dirname, '..', '..', '..', 'apps', 'ai-service', 'locales');

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const code of LOCALE_CODES) {
    const localeDir = path.join(SRC_DIR, code);
    if (!fs.existsSync(localeDir)) {
      console.warn(`[SKIP] khong tim thay thu muc locale: ${code}`);
      continue;
    }
    const namespaces = fs.readdirSync(localeDir).filter((f) => f.endsWith('.json'));
    const merged: Record<string, Record<string, string>> = {};

    for (const ns of namespaces) {
      const nsName = ns.replace(/\.json$/, '');
      const content = JSON.parse(fs.readFileSync(path.join(localeDir, ns), 'utf8'));
      merged[nsName] = content;
    }

    const outPath = path.join(OUT_DIR, `${code}.json`);
    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
  }

  console.log(`i18n build:python: da ghi ${LOCALE_CODES.length} file vao ${OUT_DIR}`);
}

main();
