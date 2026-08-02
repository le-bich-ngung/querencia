// Core logic KHONG phu thuoc framework (khong dung React/RN/Next o day).
// apps/web va apps/cui-bap-mobile se tu viet Provider rieng (khac nhau ve storage:
// localStorage vs AsyncStorage), nhung deu goi vao ham o day.

import { DEFAULT_LOCALE } from './locales';

/** Mot namespace la 1 object phang { key: string } */
export type Namespace = Record<string, string>;

/** Toan bo du lieu dich cua 1 locale, chia theo namespace */
export type LocaleBundle = Record<string, Namespace>;

export interface TranslatorOptions {
  /** Bundle cua locale dang active */
  active: LocaleBundle;
  /** Bundle cua locale mac dinh, dung de fallback khi active thieu/rong */
  fallback: LocaleBundle;
}

/**
 * Tao ham dich t(namespace, key, vars?).
 * Uu tien: active[ns][key] -> neu rong/thieu -> fallback[ns][key] -> neu van thieu -> tra ve chinh key
 * (de de nhan biet key nao con thieu dich, khong lam vo UI).
 */
export function createTranslator({ active, fallback }: TranslatorOptions) {
  return function t(namespace: string, key: string, vars?: Record<string, string | number>): string {
    const activeValue = active[namespace]?.[key];
    const fallbackValue = fallback[namespace]?.[key];
    let raw = activeValue && activeValue.length > 0 ? activeValue : fallbackValue;
    if (!raw || raw.length === 0) return `${namespace}.${key}`;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        raw = raw.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
      }
    }
    return raw;
  };
}

/** Danh sach namespace hien co trong he sinh thai. Them namespace moi thi khai bao them o day. */
export const NAMESPACES = ['common', 'home', 'lano'] as const;
export type NamespaceName = (typeof NAMESPACES)[number];

export { DEFAULT_LOCALE };
