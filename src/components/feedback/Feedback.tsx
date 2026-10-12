import { AlertTriangle, CheckCircle2, Info, Loader2, Music4 } from 'lucide-react';
import { Component, ErrorInfo, ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Error boundary                                                      */
/* ------------------------------------------------------------------ */

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Aura] Unhandled UI error', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="surface-card" style={{ margin: '2rem auto', maxWidth: 640 }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} color="var(--accent-danger)" aria-hidden="true" />
            අනපේක්ෂිත දෝෂයක් ඇතිවිය
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            මෙම කොටස පෙන්වීමේදී ගැටලුවක් ඇතිවිය. පිටුව නැවත පූරණය කිරීමෙන් බොහෝ විට මෙය විසඳේ.
          </p>
          <pre
            style={{
              background: 'var(--bg-primary)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              overflowX: 'auto',
              color: 'var(--text-muted)',
            }}
          >
            {this.state.message}
          </pre>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            පිටුව නැවත පූරණය කරන්න
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/* Loading states                                                      */
/* ------------------------------------------------------------------ */

export function LoadingState({ labelSi = 'පූරණය වෙමින්...' }: { labelSi?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '2.5rem 1rem',
        color: 'var(--text-muted)',
      }}
    >
      <Loader2 size={18} className="spin" aria-hidden="true" />
      <span>{labelSi}</span>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="surface-card" aria-hidden="true">
      <div className="skeleton" style={{ height: 18, width: '55%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '85%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, width: '70%' }} />
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid-2">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

export function EmptyState({
  titleSi,
  descriptionSi,
  actionLabelSi,
  onAction,
}: {
  titleSi: string;
  descriptionSi: string;
  actionLabelSi?: string;
  onAction?: () => void;
}) {
  return (
    <div
      className="surface-card"
      style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}
    >
      <Music4 size={34} color="var(--accent-violet)" aria-hidden="true" />
      <h3 style={{ marginTop: '0.75rem', marginBottom: '0.35rem' }}>{titleSi}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: actionLabelSi ? '1rem' : 0 }}>
        {descriptionSi}
      </p>
      {actionLabelSi && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionLabelSi}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Status banner                                                       */
/* ------------------------------------------------------------------ */

export function StatusBanner({
  tone,
  titleSi,
  children,
}: {
  tone: 'info' | 'success' | 'warning' | 'error';
  titleSi: string;
  children?: ReactNode;
}) {
  const toneStyles: Record<string, { border: string; icon: ReactNode }> = {
    info: { border: 'var(--accent-blue)', icon: <Info size={18} aria-hidden="true" /> },
    success: {
      border: 'var(--accent-success)',
      icon: <CheckCircle2 size={18} aria-hidden="true" />,
    },
    warning: {
      border: 'var(--accent-amber)',
      icon: <AlertTriangle size={18} aria-hidden="true" />,
    },
    error: {
      border: 'var(--accent-danger)',
      icon: <AlertTriangle size={18} aria-hidden="true" />,
    },
  };
  const style = toneStyles[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className="surface-card"
      style={{ borderLeft: `4px solid ${style.border}`, padding: '0.9rem 1rem' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 600,
          marginBottom: children ? '0.4rem' : 0,
        }}
      >
        {style.icon}
        <span>{titleSi}</span>
      </div>
      {children && (
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{children}</div>
      )}
    </div>
  );
}
