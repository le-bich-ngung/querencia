// Chay: pnpm --filter @querencia/i18n validate
// Muc dich: dam bao moi locale co DUNG bo key nhu 'en' (nguon chuan), khong thieu, khong du,
// va khong co key trung lap trong cung 1 file JSON.
// Neu phat hien loi, exit code != 0 de chan CI merge.

import fs from 'fs';
import path from 'path';
import { LOCALE_CODES, DEFAULT_LOCALE } from '../src/locales';

const LOCALES_DIR = path.join(__dirname, '..', 'locales');

function readJsonRaw(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

function findDuplicateKeysInRawJson(raw: string): string[] {
  // JSON.parse tu dong bo qua key trung (chi giu key cuoi), nen phai tu quet raw text.
  const keyRegex = /"([^"\\]|\\.)+"\s*:/g;
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = keyRegex.exec(raw)) !== null) {
    const key = match[0].slice(0, -1).trim();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  for (const [key, count] of seen) {
    if (count > 1) dupes.push(key);
  }
  return dupes;
}

function main() {
  const namespaces = fs
    .readdirSync(path.join(LOCALES_DIR, DEFAULT_LOCALE))
    .filter((f) => f.endsWith('.json'));

  let hasError = false;

  for (const ns of namespaces) {
    const enRaw = readJsonRaw(path.join(LOCALES_DIR, DEFAULT_LOCALE, ns));
    const enDupes = findDuplicateKeysInRawJson(enRaw);
    if (enDupes.length > 0) {
      hasError = true;
      console.error(`[DUPLICATE KEY] en/${ns}: ${enDupes.join(', ')}`);
    }
    const enKeys = new Set(Object.keys(JSON.parse(enRaw)));

    for (const code of LOCALE_CODES) {
      if (code === DEFAULT_LOCALE) continue;
      const filePath = path.join(LOCALES_DIR, code, ns);
      if (!fs.existsSync(filePath)) {
        hasError = true;
        console.error(`[MISSING FILE] ${code}/${ns} khong ton tai`);
        continue;
      }
      const raw = readJsonRaw(filePath);
      const dupes = findDuplicateKeysInRawJson(raw);
      if (dupes.length > 0) {
        hasError = true;
        console.error(`[DUPLICATE KEY] ${code}/${ns}: ${dupes.join(', ')}`);
      }
      const keys = new Set(Object.keys(JSON.parse(raw)));

      const missing = [...enKeys].filter((k) => !keys.has(k));
      const extra = [...keys].filter((k) => !enKeys.has(k));

      if (missing.length > 0) {
        hasError = true;
        console.error(`[MISSING KEY] ${code}/${ns} thieu so voi en: ${missing.join(', ')}`);
      }
      if (extra.length > 0) {
        hasError = true;
        console.error(`[EXTRA KEY] ${code}/${ns} co key thua khong nam trong en: ${extra.join(', ')}`);
      }
    }
  }

  if (hasError) {
    console.error('\ni18n validate: THAT BAI. Xem loi o tren.');
    process.exit(1);
  } else {
    console.log('i18n validate: OK. Tat ca locale dong bo key voi en.');
  }
}

main();
