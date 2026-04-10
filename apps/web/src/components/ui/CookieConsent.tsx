'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useI18n } from '../../lib/i18n';

// ── Types ────────────────────────────────────────────────────
export interface CookiePreferences {
  essential: true;       // always true, cannot be disabled
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = 'qrncia_cookie_consent';
const CONSENT_VERSION = '1.0';

function loadPrefs(): { prefs: CookiePreferences; version: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function savePrefs(prefs: CookiePreferences) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    prefs,
    version: CONSENT_VERSION,
    savedAt: new Date().toISOString(),
  }));
}

export function useCookieConsent(): CookiePreferences | null {
  const saved = loadPrefs();
  if (!saved || saved.version !== CONSENT_VERSION) return null;
  return saved.prefs;
}

// ── Translations ─────────────────────────────────────────────
const T = {
  en: {
    title: 'We use cookies',
    desc: 'We use essential cookies to make Querencia work. We\'d also like to use optional cookies to understand how you use our site and improve your experience. You can change your preferences at any time.',
    essential: 'Essential',
    essentialDesc: 'Required for the site to function. Cannot be disabled.',
    analytics: 'Analytics',
    analyticsDesc: 'Help us understand how visitors use Querencia (anonymous data only).',
    marketing: 'Marketing',
    marketingDesc: 'Used to show relevant content. We never sell your data.',
    acceptAll: 'Accept all',
    rejectAll: 'Reject optional',
    customize: 'Customize',
    save: 'Save preferences',
    back: 'Back',
    learnMore: 'Privacy Policy',
    required: 'Always on',
  },
  vi: {
    title: 'Chúng mình dùng cookie',
    desc: 'Chúng mình dùng cookie thiết yếu để Querencia hoạt động. Ngoài ra, chúng mình muốn dùng cookie tùy chọn để hiểu cách bạn sử dụng trang và cải thiện trải nghiệm. Bạn có thể thay đổi lựa chọn bất cứ lúc nào.',
    essential: 'Thiết yếu',
    essentialDesc: 'Cần thiết để trang hoạt động. Không thể tắt.',
    analytics: 'Phân tích',
    analyticsDesc: 'Giúp chúng mình hiểu cách người dùng sử dụng Querencia (chỉ dữ liệu ẩn danh).',
    marketing: 'Tiếp thị',
    marketingDesc: 'Dùng để hiển thị nội dung phù hợp. Chúng mình không bao giờ bán dữ liệu của bạn.',
    acceptAll: 'Chấp nhận tất cả',
    rejectAll: 'Từ chối tùy chọn',
    customize: 'Tùy chỉnh',
    save: 'Lưu tùy chọn',
    back: 'Quay lại',
    learnMore: 'Chính sách bảo mật',
    required: 'Luôn bật',
  },
  ja: {
    title: 'Cookieについて',
    desc: 'Querenciaの動作に必要なCookieを使用しています。また、サイトの利用状況を把握し、体験を改善するためのオプションCookieも使用したいと思います。設定はいつでも変更できます。',
    essential: '必須',
    essentialDesc: 'サイトの動作に必要です。無効にできません。',
    analytics: '分析',
    analyticsDesc: 'Querenciaの利用状況を把握するために使用します（匿名データのみ）。',
    marketing: 'マーケティング',
    marketingDesc: '関連コンテンツの表示に使用します。データを販売することはありません。',
    acceptAll: 'すべて受け入れる',
    rejectAll: '任意を拒否する',
    customize: 'カスタマイズ',
    save: '設定を保存',
    back: '戻る',
    learnMore: 'プライバシーポリシー',
    required: '常にオン',
  },
  es: {
    title: 'Usamos cookies',
    desc: 'Usamos cookies esenciales para que Querencia funcione. También nos gustaría usar cookies opcionales para entender cómo usas nuestro sitio y mejorar tu experiencia. Puedes cambiar tus preferencias en cualquier momento.',
    essential: 'Esenciales',
    essentialDesc: 'Necesarias para el funcionamiento del sitio. No se pueden desactivar.',
    analytics: 'Analíticas',
    analyticsDesc: 'Nos ayudan a entender cómo los visitantes usan Querencia (solo datos anónimos).',
    marketing: 'Marketing',
    marketingDesc: 'Se usan para mostrar contenido relevante. Nunca vendemos tus datos.',
    acceptAll: 'Aceptar todo',
    rejectAll: 'Rechazar opcionales',
    customize: 'Personalizar',
    save: 'Guardar preferencias',
    back: 'Volver',
    learnMore: 'Política de privacidad',
    required: 'Siempre activo',
  },
};

// ── Toggle component ─────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: {
  checked: boolean; onChange?: (v: boolean) => void; disabled?: boolean;
}) {
  var SAGE = '#4a7c59';
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={function() { if (!disabled && onChange) onChange(!checked); }}
      style={{
        width: 44, height: 24, borderRadius: 12,
        background: checked ? SAGE : '#d1d5db',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative', flexShrink: 0,
        transition: 'background 0.2s', opacity: disabled ? 0.6 : 1,
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 2,
        left: checked ? 22 : 2,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ── Main component ────────────────────────────────────────────
export function CookieConsent() {
  var SAGE = '#4a7c59';
  var i18n = useI18n();
  var locale = (i18n.locale || 'en') as keyof typeof T;
  var tx = T[locale] || T.en;

  var [visible, setVisible] = useState(false);
  var [view, setView] = useState<'banner' | 'customize'>('banner');
  var [analytics, setAnalytics] = useState(false);
  var [marketing, setMarketing] = useState(false);

  useEffect(function() {
    var saved = loadPrefs();
    if (!saved || saved.version !== CONSENT_VERSION) {
      // Show after short delay so page loads first
      var t = setTimeout(function() { setVisible(true); }, 800);
      return function() { clearTimeout(t); };
    }
  }, []);

  function handleAcceptAll() {
    savePrefs({ essential: true, analytics: true, marketing: true });
    setVisible(false);
  }

  function handleRejectAll() {
    savePrefs({ essential: true, analytics: false, marketing: false });
    setVisible(false);
  }

  function handleSave() {
    savePrefs({ essential: true, analytics, marketing });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Backdrop - subtle */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 998,
        background: 'rgba(0,0,0,0.3)',
        backdropFilter: 'blur(2px)',
        animation: 'cookieFadeIn 0.3s ease',
      }} />

      {/* Banner */}
      <div role="dialog" aria-modal="true" aria-labelledby="cookie-title"
        style={{
          position: 'fixed', bottom: 24, left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 999,
          width: 'min(560px, calc(100vw - 32px))',
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1)',
          border: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden',
          animation: 'cookieSlideUp 0.4s cubic-bezier(0.34,1,0.64,1)',
        }}>

        {/* Header */}
        <div style={{
          padding: '20px 24px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.3rem' }}>🍪</span>
            <h2 id="cookie-title" style={{
              fontSize: '1rem', fontWeight: 700, color: '#111',
              margin: 0,
            }}>{tx.title}</h2>
          </div>
          {/* Version indicator */}
          <span style={{ fontSize: '0.65rem', color: '#bbb', fontFamily: 'monospace' }}>
            v{CONSENT_VERSION}
          </span>
        </div>

        {/* Content */}
        <div style={{ padding: '14px 24px 20px' }}>
          {view === 'banner' ? (
            <>
              <p style={{
                fontSize: '0.83rem', color: '#555', lineHeight: 1.6,
                marginBottom: 20,
              }}>
                {tx.desc}{' '}
                <Link href="/pages/privacy" style={{ color: SAGE, textDecoration: 'none', fontWeight: 500 }}>
                  {tx.learnMore} →
                </Link>
              </p>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {/* Accept All - prominent */}
                <button onClick={handleAcceptAll} style={{
                  flex: 1, minWidth: 140,
                  padding: '11px 20px',
                  background: SAGE, color: '#fff',
                  border: 'none', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  {tx.acceptAll}
                </button>

                {/* Reject Optional - clear but not hidden */}
                <button onClick={handleRejectAll} style={{
                  flex: 1, minWidth: 140,
                  padding: '11px 20px',
                  background: '#fff', color: '#555',
                  border: '1.5px solid #e0e0e0', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.borderColor = '#999'; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0'; }}
                >
                  {tx.rejectAll}
                </button>

                {/* Customize */}
                <button onClick={function() { setView('customize'); }} style={{
                  padding: '11px 16px',
                  background: 'none', color: '#888',
                  border: '1.5px solid #e0e0e0', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.82rem',
                  cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.color = SAGE; (e.currentTarget as HTMLElement).style.borderColor = SAGE; }}
                  onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.color = '#888'; (e.currentTarget as HTMLElement).style.borderColor = '#e0e0e0'; }}
                >
                  {tx.customize}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Customize view */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

                {/* Essential - always on */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 16,
                  padding: '14px 16px',
                  background: '#f9fafb', borderRadius: 12,
                  border: '1px solid #e5e7eb',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{tx.essential}</span>
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 600,
                        background: 'rgba(74,124,89,0.1)', color: SAGE,
                        padding: '1px 7px', borderRadius: 999,
                      }}>{tx.required}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.5, margin: 0 }}>
                      {tx.essentialDesc}
                    </p>
                  </div>
                  <Toggle checked={true} disabled={true} />
                </div>

                {/* Analytics */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 16,
                  padding: '14px 16px',
                  background: '#f9fafb', borderRadius: 12,
                  border: '1px solid ' + (analytics ? 'rgba(74,124,89,0.3)' : '#e5e7eb'),
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{tx.analytics}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.5, margin: 0 }}>
                      {tx.analyticsDesc}
                    </p>
                  </div>
                  <Toggle checked={analytics} onChange={setAnalytics} />
                </div>

                {/* Marketing */}
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', gap: 16,
                  padding: '14px 16px',
                  background: '#f9fafb', borderRadius: 12,
                  border: '1px solid ' + (marketing ? 'rgba(74,124,89,0.3)' : '#e5e7eb'),
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{tx.marketing}</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: '#777', lineHeight: 1.5, margin: 0 }}>
                      {tx.marketingDesc}
                    </p>
                  </div>
                  <Toggle checked={marketing} onChange={setMarketing} />
                </div>
              </div>

              {/* Customize buttons */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={function() { setView('banner'); }} style={{
                  padding: '10px 16px',
                  background: 'none', color: '#888',
                  border: '1.5px solid #e0e0e0', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.82rem',
                  cursor: 'pointer',
                }}>
                  ← {tx.back}
                </button>
                <button onClick={handleSave} style={{
                  flex: 1, padding: '10px 20px',
                  background: SAGE, color: '#fff',
                  border: 'none', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer',
                }}>
                  {tx.save}
                </button>
                <button onClick={handleRejectAll} style={{
                  padding: '10px 16px',
                  background: 'none', color: '#888',
                  border: '1.5px solid #e0e0e0', borderRadius: 100,
                  fontFamily: 'inherit', fontSize: '0.82rem',
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {tx.rejectAll}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{
          padding: '10px 24px',
          background: '#f9fafb',
          borderTop: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>
          <span style={{ fontSize: '0.7rem', color: '#bbb' }}>
            GDPR · CCPA compliant
          </span>
          <Link href="/pages/privacy" style={{
            fontSize: '0.7rem', color: '#aaa',
            textDecoration: 'none',
          }}
            onMouseEnter={function(e) { (e.currentTarget as HTMLElement).style.color = SAGE; }}
            onMouseLeave={function(e) { (e.currentTarget as HTMLElement).style.color = '#aaa'; }}
          >
            {tx.learnMore} →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes cookieFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cookieSlideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
      `}</style>
    </>
  );
}
