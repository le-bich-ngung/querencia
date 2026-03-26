'use client';
interface Props {
  message: string | null;
  type: 'success' | 'error';
}
export function AuthMessage({ message, type }: Props) {
  if (!message) return null;
  return (
    <div style={{
      padding: '10px 14px',
      borderRadius: 8,
      fontSize: '0.85rem',
      background: type === 'success' ? '#ddeee3' : '#fdecea',
      color:      type === 'success' ? '#2f5c3e' : '#c0392b',
      lineHeight: 1.4,
    }}>
      {message}
    </div>
  );
}
