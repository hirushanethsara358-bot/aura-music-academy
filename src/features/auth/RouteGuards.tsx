import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Route guards live in their own module so that the authentication page
 * components can be fully code-split and only downloaded when visited.
 *
 * SECURITY NOTE: these guards control *rendering* only. Every privileged read
 * and write is independently enforced by firebase/firestore.rules, so hiding a
 * component is never treated as a security control.
 */

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="surface-card" style={{ textAlign: 'center' }}>
        පූරණය වෙමින්...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="surface-card" style={{ textAlign: 'center' }}>
        පූරණය වෙමින්...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!user.isAdmin) {
    return (
      <div className="surface-card" style={{ borderLeft: '4px solid var(--accent-danger)' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.15rem' }}>
          <ShieldCheck size={20} aria-hidden="true" /> ප්‍රවේශය අවසර නැත
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          මෙම පරිපාලන පැනලය Admin පරිපාලකයින් සඳහා පමණක් වේ.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          <strong>වැදගත්:</strong> Admin තත්ත්වය තීරණය වන්නේ Firebase Auth Custom Claim
          (<code>admin: true</code>) මගිනි. එය බ්‍රවුසරයෙන් වෙනස් කළ නොහැකි අතර සෑම
          වරප්‍රසාදිත ලිවීමක්ම Firestore Security Rules මගින් ස්වාධීනව පරීක්ෂා කරනු ලැබේ.
          මෙම පණිවිඩය පෙන්වීම පමණක් ආරක්ෂණයක් නොවේ.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
