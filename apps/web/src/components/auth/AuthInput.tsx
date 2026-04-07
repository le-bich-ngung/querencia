ï»¿'use client';
import { useState } from 'react';

export function AuthInput({ label, type = 'text', ...props }: {
  label: string;
  type?: string;
  [key: string]: any;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        {...props}
        onFocus={e => { setFocused(true); props.onFocus?.(e); }}
        onBlur={e => { setFocused(false); props.onBlur?.(e); }}
        style={{
          width: '100%', padding: '11px 14px', borderRadius: 10,
          border: `1.5px solid ${focused ? '#4a7c59' : 'var(--border)'}`,
          background: 'var(--bg)', color: 'var(--text)',
          fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none',
          boxSizing: 'border-box', transition: 'border-color 0.15s',
          ...props.style,
        }}
      />
    </div>
  );
}
