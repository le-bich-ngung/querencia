'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Tool } from '../../../lib/tools-registry';

interface Props { tool: Tool }

export function ToolFrame({ tool }: Props) {
  const { data: session } = useSession();

  // Inject token vÃ o URL hash Äá» tool HTML cÃ³ thá» Äá»c
  // (giá»ng pattern cÅ© dÃ¹ng localStorage.getItem('token'))
  const token = (session as any)?.accessToken ?? '';
  const src   = `/tools/${tool.htmlFile}${token ? `#token=${token}` : ''}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Breadcrumb nav nhá» gá»n */}
      <div style={{
        height: 36, background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 16px', fontSize: '0.78rem', color: 'var(--gray)',
      }}>
        <Link href="/tools" style={{ color: 'var(--sage)', textDecoration: 'none' }}>
          â Tools
        </Link>
        <span>/</span>
        <span>{tool.emoji} {tool.name}</span>
        {tool.qCost > 0 && (
          <span style={{
            marginLeft: 'auto', background: 'var(--sage)', color: '#fff',
            padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
          }}>
            {tool.qCost} Q / láº§n
          </span>
        )}
      </div>

      {/* Tool HTML trong iframe â full height */}
      <iframe
        src={src}
        title={tool.name}
        style={{
          flex: 1, border: 'none', width: '100%',
          background: 'var(--bg)',
        }}
        allow="camera; microphone; clipboard-read; clipboard-write; display-capture"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-forms allow-modals"
      />
    </div>
  );
}
