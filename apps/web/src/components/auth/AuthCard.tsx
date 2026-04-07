ï»¿export function AuthCard({ children, title, subtitle }: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)', padding: '24px',
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--bg-surface)', borderRadius: 16,
        border: '1.5px solid var(--border)', padding: '36px 32px',
      }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: 6 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 24 }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

// cache bust
