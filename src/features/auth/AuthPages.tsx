import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { StatusBanner } from '../../components/feedback/Feedback';

function GoogleLogoSvg() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
      />
    </svg>
  );
}

function AuthShell({
  titleSi,
  subtitleSi,
  children,
}: {
  titleSi: string;
  subtitleSi: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', display: 'grid', gap: 'var(--space-4)' }}>
      <header style={{ textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.3rem' }}>{titleSi}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{subtitleSi}</p>
      </header>
      <div className="surface-card">{children}</div>
    </div>
  );
}

export function LoginPage() {
  const { user, login, loginWithGoogle, cloudMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    const defaultTarget = user.isAdmin ? '/admin' : '/my-learning';
    const redirectTo = (location.state as { from?: string } | null)?.from ?? defaultTarget;
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      const isAdminEmail = email.trim().toLowerCase() === 'adminaura.hirusha@auramail.com';
      navigate(isAdminEmail ? '/admin' : '/my-learning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'පිවිසීමේ දෝෂයක් ඇතිවිය.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/my-learning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google පිවිසීමේ දෝෂයක් ඇතිවිය.');
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <AuthShell titleSi="පිවිසෙන්න" subtitleSi="ඔබේ ඉගෙනුම් ප්‍රගතිය සහ Quiz ලකුණු දිගටම තබා ගන්න.">
      {!cloudMode && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="info" titleSi="දේශීය ප්‍රකාරය (Local Studio Mode)">
            Firebase සම්බන්ධ කර නොමැති බැවින් ගිණුම් දත්ත මෙම බ්‍රවුසරයේ පමණක් සුරකිනු ලැබේ.
            වෙනත් උපාංගයකට ගෙන යා නොහැක. නිෂ්පාදන භාවිතයට Firebase සම්බන්ධ කරන්න.
          </StatusBanner>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="error" titleSi="පිවිසීම අසාර්ථක විය">
            {error}
          </StatusBanner>
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void handleGoogleLogin()}
          disabled={googleSubmitting || submitting}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <GoogleLogoSvg />
          <span>{googleSubmitting ? 'Google වෙත සම්බන්ධ වෙමින්...' : 'Google හරහා ඉදිරියට යන්න (Continue with Google)'}</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span>හෝ ඊමේල් සහ මුරපදය භාවිතයෙන්</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div className="lab-control">
          <label htmlFor="login-email">ඊමේල් ලිපිනය</label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="login-password">මුරපදය</label>
          <input
            id="login-password"
            type="password"
            required
            autoComplete="current-password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting || googleSubmitting}>
          <LogIn size={15} aria-hidden="true" />
          {submitting ? 'පිවිසෙමින්...' : 'පිවිසෙන්න'}
        </button>

        <p style={{ fontSize: '0.88rem', textAlign: 'center', marginBottom: 0 }}>
          ගිණුමක් නැද්ද? <Link to="/register">ලියාපදිංචි වන්න</Link>
          {' · '}
          <Link to="/forgot-password">මුරපදය අමතකද?</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { user, register, loginWithGoogle, cloudMode } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (user) return <Navigate to="/my-learning" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('මුරපදය අවම වශයෙන් අකුරු 6 ක් විය යුතුයි.');
      return;
    }
    if (password !== confirm) {
      setError('මුරපද දෙක එකිනෙක නොගැළපේ. කරුණාකර නැවත පරීක්ෂා කරන්න.');
      return;
    }

    setSubmitting(true);
    try {
      await register(email, password, displayName);
      navigate('/my-learning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ලියාපදිංචියේ දෝෂයක් ඇතිවිය.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleRegister() {
    setGoogleSubmitting(true);
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/my-learning');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google ලියාපදිංචියේ දෝෂයක් ඇතිවිය.');
    } finally {
      setGoogleSubmitting(false);
    }
  }

  return (
    <AuthShell
      titleSi="ලියාපදිංචි වන්න"
      subtitleSi="නොමිලේ ගිණුමක් සාදා ඔබේ ඉගෙනුම් ගමන ආරම්භ කරන්න."
    >
      {!cloudMode && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="info" titleSi="දේශීය ප්‍රකාරය (Local Studio Mode)">
            මෙම ගිණුම මෙම බ්‍රවුසරයට පමණක් සීමා වේ. මුරපද ගබඩා කරනු ලබන්නේ Hash කරන ලද
            ආකාරයෙන් පමණක් වුවද මෙය නිෂ්පාදන අවස්ථාව සඳහා නොවේ — Firebase Authentication
            සම්බන්ධ කරන්න.
          </StatusBanner>
        </div>
      )}

      {error && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="error" titleSi="ලියාපදිංචිය අසාර්ථක විය">
            {error}
          </StatusBanner>
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => void handleGoogleRegister()}
          disabled={googleSubmitting || submitting}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <GoogleLogoSvg />
          <span>{googleSubmitting ? 'Google වෙත සම්බන්ධ වෙමින්...' : 'Google හරහා ඉදිරියට යන්න (Continue with Google)'}</span>
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          <span>හෝ ඊමේල් සහ මුරපදය භාවිතයෙන්</span>
          <span style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
        </div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div className="lab-control">
          <label htmlFor="register-name">ඔබේ නම</label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            className="input-field"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="උදා: නිමල් පෙරේරා"
          />
        </div>

        <div className="lab-control">
          <label htmlFor="register-email">ඊමේල් ලිපිනය</label>
          <input
            id="register-email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="register-password">මුරපදය (අවම අකුරු 6)</label>
          <input
            id="register-password"
            type="password"
            required
            autoComplete="new-password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="lab-control">
          <label htmlFor="register-confirm">මුරපදය තහවුරු කරන්න</label>
          <input
            id="register-confirm"
            type="password"
            required
            autoComplete="new-password"
            className="input-field"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting || googleSubmitting}>
          <UserPlus size={15} aria-hidden="true" />
          {submitting ? 'ගිණුම සාදමින්...' : 'ගිණුම සාදන්න'}
        </button>

        <p style={{ fontSize: '0.88rem', textAlign: 'center', marginBottom: 0 }}>
          දැනටමත් ගිණුමක් තිබේද? <Link to="/login">පිවිසෙන්න</Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      await resetPassword(email);
      setMessage(
        'මුරපදය යළි සැකසීමේ සබැඳියක් ඔබේ ඊමේල් ලිපිනයට යවා ඇත. එය පරීක්ෂා කරන්න.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ඉල්ලීම අසාර්ථක විය.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell titleSi="මුරපදය යළි සකසන්න" subtitleSi="ඔබේ ඊමේල් ලිපිනය ඇතුළත් කරන්න. යළි සැකසීමේ සබැඳියක් යවනු ලැබේ.">
      {message && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="success" titleSi="ඉල්ලීම යවා ඇත">
            {message}
          </StatusBanner>
        </div>
      )}
      {error && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <StatusBanner tone="error" titleSi="යැවීමට නොහැකි විය">
            {error}
          </StatusBanner>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div className="lab-control">
          <label htmlFor="forgot-email">ඊමේල් ලිපිනය</label>
          <input
            id="forgot-email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          <KeyRound size={15} aria-hidden="true" />
          {submitting ? 'යවමින්...' : 'යළි සැකසීමේ සබැඳිය යවන්න'}
        </button>
        <p style={{ fontSize: '0.88rem', textAlign: 'center', marginBottom: 0 }}>
          <Link to="/login">පිවිසුම් පිටුවට ආපසු යන්න</Link>
        </p>
      </form>
    </AuthShell>
  );
}
