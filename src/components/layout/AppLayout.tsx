import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  FlaskConical,
  GraduationCap,
  Home,
  Info,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { readJson, STORAGE_KEYS, writeJson } from '../../lib/storage';
import { SearchBar } from '../navigation/SearchBar';

type ThemeMode = 'dark' | 'light';

interface NavEntry {
  to: string;
  labelSi: string;
  icon: typeof Home;
}

const PRIMARY_NAV: NavEntry[] = [
  { to: '/', labelSi: 'මුල් පිටුව', icon: Home },
  { to: '/learning-paths', labelSi: 'ඉගෙනුම් මාර්ග', icon: Compass },
  { to: '/category/music-theory', labelSi: 'සංගීත න්‍යාය', icon: BookOpen },
  { to: '/category/composition', labelSi: 'සංගීත නිර්මාණය', icon: BookOpen },
  { to: '/category/arrangement', labelSi: 'සංයෝජනය', icon: BookOpen },
  { to: '/category/production', labelSi: 'නිෂ්පාදනය', icon: BookOpen },
  { to: '/category/audio-engineering', labelSi: 'ශබ්ද ඉංජිනේරු', icon: BookOpen },
  { to: '/category/mixing', labelSi: 'Mixing', icon: BookOpen },
  { to: '/category/mastering', labelSi: 'Mastering', icon: BookOpen },
  { to: '/labs', labelSi: 'අන්තර්ක්‍රියාකාරී Lab', icon: FlaskConical },
  { to: '/my-learning', labelSi: 'මගේ ඉගෙනුම', icon: GraduationCap },
  { to: '/about', labelSi: 'අප ගැන', icon: Info },
];

function getInitialTheme(): ThemeMode {
  const stored = readJson<ThemeMode | null>(STORAGE_KEYS.theme, null);
  if (stored === 'dark' || stored === 'light') return stored;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  return 'dark';
}

export function AppLayout() {
  const { user, logout, cloudMode } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeJson(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    setMobileNavOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        ප්‍රධාන අන්තර්ගතය වෙත යන්න
      </a>

      <header className="top-header">
        <div className="header-inner">
          <Link to="/" className="brand-link" aria-label="Aura Music Academy මුල් පිටුව">
            <img src="/assets/aura-logo.svg" alt="" className="brand-logo" width={36} height={36} />
            <span>
              Aura Music Academy
              <span className="brand-subtitle">ඔරා සංගීත ඇකඩමිය · සිංහලෙන් සංගීත අධ්‍යාපනය</span>
            </span>
          </Link>

          <div className="header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setSearchOpen((v) => !v)}
              aria-expanded={searchOpen}
              aria-controls="global-search-panel"
            >
              <Search size={15} aria-hidden="true" />
              සොයන්න
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={theme === 'dark' ? 'ආලෝක තේමාවට මාරු වන්න' : 'අඳුරු තේමාවට මාරු වන්න'}
            >
              {theme === 'dark' ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}
              <span>{theme === 'dark' ? 'ආලෝකය' : 'අඳුරු'}</span>
            </button>

            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="btn btn-outline btn-sm">
                    <ShieldCheck size={15} aria-hidden="true" />
                    Admin
                  </Link>
                )}
                <Link to="/my-learning" className="btn btn-secondary btn-sm">
                  <UserIcon size={15} aria-hidden="true" />
                  {user.displayName}
                </Link>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => void logout()}
                >
                  <LogOut size={15} aria-hidden="true" />
                  ඉවත් වන්න
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <LogIn size={15} aria-hidden="true" />
                පිවිසෙන්න
              </Link>
            )}

            <button
              type="button"
              className="btn btn-outline btn-sm mobile-nav-toggle"
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-expanded={mobileNavOpen}
              aria-controls="primary-navigation"
              aria-label="ප්‍රධාන මෙනුව"
            >
              {mobileNavOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div
            id="global-search-panel"
            style={{
              maxWidth: 1360,
              margin: '0 auto',
              padding: '0 var(--space-4) var(--space-3)',
            }}
          >
            <SearchBar autoFocus onNavigate={() => setSearchOpen(false)} />
          </div>
        )}

        {!cloudMode && (
          <div
            style={{
              maxWidth: 1360,
              margin: '0 auto',
              padding: '0 var(--space-4) var(--space-2)',
              fontSize: '0.76rem',
              color: 'var(--text-muted)',
            }}
          >
            දේශීය ප්‍රකාරය (Local Studio Mode) — Firebase සම්බන්ධ කර නොමැති බැවින් දත්ත ඔබේ
            බ්‍රවුසරයේ පමණක් සුරැකේ. පාඩම් සහ සියලුම Lab පූර්ණයෙන්ම ක්‍රියාත්මක වේ.
          </div>
        )}
      </header>

      <nav
        className="primary-nav-bar"
        id="primary-navigation"
        aria-label="ප්‍රධාන සංචාලනය"
        style={{ display: mobileNavOpen ? 'block' : undefined }}
      >
        <ul className="primary-nav-list">
          {PRIMARY_NAV.map((entry) => {
            const Icon = entry.icon;
            return (
              <li key={entry.to}>
                <NavLink
                  to={entry.to}
                  className={({ isActive }) =>
                    `nav-item-link${isActive ? ' active' : ''}`
                  }
                  end={entry.to === '/'}
                >
                  <Icon size={14} aria-hidden="true" />
                  {entry.labelSi}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <main id="main-content" className="main-container">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div style={{ maxWidth: 420 }}>
            <strong>Aura Music Academy</strong>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
              සිංහල භාෂාවෙන් බටහිර සංගීත න්‍යාය, නිර්මාණය, සංයෝජනය, නිෂ්පාදනය සහ ශබ්ද
              ඉංජිනේරු විද්‍යාව මට්ටම් 9 ක් පුරා ඉගෙන ගන්න.
            </p>
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.4rem' }}>ඉගෙනුම</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.3rem' }}>
              <li><Link to="/learning-paths">ඉගෙනුම් මාර්ග 9</Link></li>
              <li><Link to="/labs">අන්තර්ක්‍රියාකාරී Lab</Link></li>
              <li><Link to="/glossary">ශබ්දකෝෂය (Glossary)</Link></li>
              <li><Link to="/my-learning">මගේ ඉගෙනුම</Link></li>
            </ul>
          </div>
          <div style={{ fontSize: '0.85rem' }}>
            <strong style={{ display: 'block', marginBottom: '0.4rem' }}>තොරතුරු</strong>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.3rem' }}>
              <li><Link to="/about">අප ගැන</Link></li>
              <li><Link to="/about#limitations">සීමාවන් (Known Limitations)</Link></li>
              <li><Link to="/about#privacy">ඔබේ දත්ත ගැන</Link></li>
            </ul>
          </div>
        </div>
        <p
          style={{
            maxWidth: 1360,
            margin: 'var(--space-6) auto 0',
            fontSize: '0.76rem',
            color: 'var(--text-muted)',
          }}
        >
          © {new Date().getFullYear()} Aura Music Academy. සියලුම පාඩම් අන්තර්ගතය මුල්
          නිර්මාණයකි. සංගීත උදාහරණ Web Audio API මගින් තත්‍ය කාලීනව සංශ්ලේෂණය කරන ලද
          Synthesized ශබ්ද වන අතර සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් නොවේ.
        </p>
      </footer>
    </div>
  );
}
