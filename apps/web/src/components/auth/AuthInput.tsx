'use client';
import { useState, forwardRef } from 'react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showToggle?: boolean; // cho password fields
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, showToggle, type, ...rest }, ref) => {
    const [visible, setVisible] = useState(false);
    const inputType = showToggle ? (visible ? 'text' : 'password') : type;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            type={inputType}
            {...rest}
            style={{
              width: '100%',
              padding: showToggle ? '12px 44px 12px 16px' : '12px 16px',
              border: `1.5px solid ${error ? '#c0392b' : 'var(--border)'}`,
              borderRadius: 10,
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              background: 'var(--bg)',
              color: 'var(--text)',
              outline: 'none',
              transition: 'border-color 0.15s',
              boxSizing: 'border-box',
              ...rest.style,
            }}
            onFocus={e => { e.currentTarget.style.borderColor = 'var(--sage)'; }}
            onBlur={e => { e.currentTarget.style.borderColor = error ? '#c0392b' : 'var(--border)'; }}
          />
          {showToggle && (
            <button
              type="button"
              onClick={() => setVisible(v => !v)}
              tabIndex={-1}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none',
                cursor: 'pointer', color: 'var(--gray)',
                fontSize: '1rem', padding: 4,
                opacity: visible ? 1 : 0.5,
                transition: 'opacity 0.15s',
              }}
              aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {visible ? '🙈' : '👁'}
            </button>
          )}
        </div>
        {error && (
          <span style={{ fontSize: '0.78rem', color: '#c0392b' }}>{error}</span>
        )}
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';
