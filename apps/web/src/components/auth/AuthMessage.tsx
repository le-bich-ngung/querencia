export function AuthMessage({ type, children }: {
  type: 'error' | 'success' | 'info';
  children: React.ReactNode;
}) {
  const colors = {
    error:   { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)',   text: '#c0392b' },
    success: { bg: 'rgba(74,124,89,0.06)',   border: 'rgba(74,124,89,0.2)',   text: '#4a7c59' },
    info:    { bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)',  text: '#2563eb' },
  }[type];
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 10, marginBottom: 16,
      background: colors.bg, border: `1px solid ${colors.border}`,
      color: colors.text, fontSize: '0.85rem', lineHeight: 1.5,
    }}>
      {children}
    </div>
  );
}
