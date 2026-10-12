import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="surface-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 620, margin: '0 auto' }}>
      <p style={{ fontSize: '3rem', fontWeight: 800, margin: 0, color: 'var(--accent-violet)' }}>404</p>
      <h1 style={{ marginTop: '0.5rem' }}>මෙම පිටුව හමු නොවිණි</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        ඔබ සොයන පිටුව ඉවත් කර ඇති හෝ ලිපිනය වැරදි විය හැක. පහත සබැඳි භාවිතයෙන් ඉදිරියට යන්න.
      </p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={15} aria-hidden="true" /> මුල් පිටුව
        </Link>
        <Link to="/learning-paths" className="btn btn-secondary">
          <Compass size={15} aria-hidden="true" /> ඉගෙනුම් මාර්ග
        </Link>
      </div>
    </div>
  );
}

export function PermissionDeniedPage() {
  return (
    <div className="surface-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', maxWidth: 620, margin: '0 auto' }}>
      <p style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--accent-danger)' }}>403</p>
      <h1 style={{ marginTop: '0.5rem' }}>ප්‍රවේශය අවසර නැත</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        මෙම කොටස බැලීමට ඔබට අවසර නොමැත. එය Admin පරිපාලකයින් සඳහා පමණක් වන අතර
        ප්‍රවේශය Firestore Security Rules මගින් ද ස්වාධීනව පරීක්ෂා කරනු ලැබේ.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home size={15} aria-hidden="true" /> මුල් පිටුවට
      </Link>
    </div>
  );
}
