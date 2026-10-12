import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, Database, Lock, ShieldCheck, Star } from 'lucide-react';

export function AboutPage() {
  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 900 }}>
      <header>
        <h1 style={{ marginBottom: '0.35rem' }}>Aura Music Academy ගැන</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          සිංහල-පළමු, නොමිලේ-පළමු සංගීත අධ්‍යාපන වේදිකාවක් — මුල් සිට උසස් මට්ටම දක්වා.
        </p>
      </header>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>අපගේ මෙහෙවර</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          බටහිර සංගීත න්‍යාය, නිර්මාණය, සංයෝජනය, සංගීත නිෂ්පාදනය, ශබ්ද ඉංජිනේරු විද්‍යාව,
          Mixing සහ Mastering — මේ සියල්ල සිංහල භාෂාවෙන් නිවැරදිව, ප්‍රායෝගිකව සහ මිල
          අනුව විශාල බාධකයක් නොමැතිව ඉගෙන ගත හැකි කර ගැනීමයි.
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          අපි ඉංග්‍රීසි තාක්ෂණික යෙදුම් ඉවත් නොකරමු — ඒවා සමඟම සිංහල පැහැදිලි කිරීම් ලබා
          දෙමු. හේතුව සරලයි: වෘත්තීය සංගීත ක්ෂේත්‍රයේ ඉංග්‍රීසි යෙදුම් නොදැන සිටීමෙන්
          ඉගෙනුම්කරුවන්ට සැබෑ ලෝකයේ අවස්ථා අහිමි වීමයි.
        </p>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>
          <Star size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          අපගේ මූලධර්ම
        </h2>
        <ol style={{ color: 'var(--text-secondary)' }}>
          <li><strong>සිංහල-පළමු ඉගෙනුම් අත්දැකීම</strong> — සෑම විස්තරයක්ම සිංහලෙන්.</li>
          <li><strong>විද්‍යාත්මක නිරවද්‍යතාව</strong> — Nyquist Theorem, dB පරිමාණය, Dithering වැනි කරුණු ගණිතමය වශයෙන් නිවැරදිව.</li>
          <li><strong>ප්‍රායෝගික ඉගෙනුම</strong> — කටපාඩම් කිරීමට වඩා සැබෑ අභ්‍යාස.</li>
          <li><strong>සාමාන්‍ය දුරකථන සහ පරිගණකවල ක්‍රියාත්මක වීම</strong> — බරැති මෘදුකාංග අවශ්‍ය නැත.</li>
          <li><strong>නොමිලේ-පළමු යටිතල පහසුකම්</strong> — අනිවාර්ය ගෙවන API නොමැත.</li>
          <li><strong>ප්‍රවේශ්‍යතාව</strong> — Keyboard සංචාලනය, නිවැරදි කොන්ට්‍රාස්ට්, Screen Reader සහාය.</li>
        </ol>
      </section>

      <section className="surface-card" id="limitations" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
        <h2 style={{ fontSize: '1.05rem' }}>
          <AlertTriangle size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ප්‍රකාශිත සීමාවන් (Known Limitations)
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          අපි කිසිවිටෙකත් නොපවතින විශේෂාංග ගැන ප්‍රකාශ නොකරමු. පහත දේ තවමත් නොමැත:
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <li>සැබෑ වාද්‍ය භාණ්ඩ පටිගත කිරීම් — සියලු ශ්‍රවණ උදාහරණ Synthesized වේ.</li>
          <li>සහතික (Certificates) හෝ පිළිගත් සුදුසුකම් — Quiz ලකුණු Client එකේ ගණනය වන බැවින් ඒවා අසත්‍ය සහතික සඳහා නොසලකයි.</li>
          <li>වෘත්තීය සමාලෝචන හෝ Mentor සහාය.</li>
          <li>MIDI Controller Hardware සහාය — මෙය ඉදිරි අනුවාදයක සැලසුමකි.</li>
          <li>
            සෑම මට්ටමකම සියලු පාඩම් ස්ලොට් — සැලසුම් කළ මුළු ගණනට වඩා අඩු ප්‍රමාණයක් තවමත්
            රචනා කර ඇත. ප්‍රකාශිත ගණන සහ සැලසුම් කළ ගණන වෙන වෙනම දක්වා ඇත.
          </li>
          <li>
            Offline Cloud Synchronisation — අපි එය ක්‍රියාත්මක කර ඇති බව ප්‍රකාශ නොකරමු. දැනට
            දත්ත ඔබේ බ්‍රවුසරයේ හෝ Firebase Firestore හි සුරැකේ.
          </li>
          <li>
            Admin CMS හි නව පාඩමක් සම්පූර්ණයෙන්ම (අන්තර්ගතය සමඟ) සෑදීම — දැනට පවතින පාඩම්
            සංස්කරණය, පිළිවෙල සහ ප්‍රකාශන තත්ත්වය කළමනාකරණය කළ හැක.
          </li>
        </ul>
      </section>

      <section className="surface-card" id="privacy">
        <h2 style={{ fontSize: '1.05rem' }}>
          <Database size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ඔබේ දත්ත සහ රහස්‍යතාවය
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          අපි අවම දත්ත ප්‍රමාණයක් පමණක් තබා ගනිමු. ඔබේ ඊමේල් ලිපිනය, පෙන්වන නම, පාඩම්
          ප්‍රගතිය, Bookmark සහ Quiz ලකුණු හැර වෙනත් පෞද්ගලික දත්ත රැස් නොකෙරේ.
        </p>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <li>මුරපද සේවාදායකයේ සුරැකෙන්නේ Hash කරන ලද ආකාරයෙන් (Firebase Authentication).</li>
          <li>අපි ඔබව නිරීක්ෂණය කරන Invasive Analytics හෝ Tracking නොයොදන්නෙමු.</li>
          <li>මයික්‍රෆෝන ශ්‍රව්‍ය කිසිවිටෙකත් පටිගත හෝ උඩුගත නොකෙරේ.</li>
          <li>ඔබේ ශ්‍රව්‍ය ගොනු කිසිවිටෙකත් උඩුගත නොකෙරේ — සියලු විශ්ලේෂණය ඔබේ බ්‍රවුසරයේ.</li>
          <li>එක් ඉගෙනුම්කරුවෙකුට තවත් ඉගෙනුම්කරුවෙකුගේ දත්ත කියවීමට හෝ වෙනස් කිරීමට නොහැක.</li>
        </ul>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>
          <Lock size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ආරක්ෂණ ආකෘතිය
        </h2>
        <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <li>Firestore Security Rules සියලු ප්‍රවේශ අවසර දෙන්නේ නිශ්චිතව ප්‍රකාශ කළ දේ පමණි — ඉතිරි සියල්ල ප්‍රතික්ෂේප වේ (Default Deny).</li>
          <li>පරිශීලකයෙකුට තමන්ටම Admin අවසර ලබාගත නොහැක.</li>
          <li>Admin අවසර ලබා දෙන්නේ Firebase Auth Custom Claim එකක් මගින් සේවාදායකයෙන් පමණි.</li>
          <li>කිසිදු Admin Service-Account යතුරක් හෝ රහසක් Frontend කේතයේ හෝ GitHub හි නොමැත.</li>
        </ul>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 0 }}>
          <strong>වැදගත්:</strong> තාක්ෂණික විස්තර <code>docs/SECURITY.md</code> සහ{' '}
          <code>firebase/firestore.rules</code> හි ඇත.
        </p>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>
          <ShieldCheck size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ප්‍රථම Admin පරිපාලක නිර්මාණය කිරීම
        </h2>
        <ol style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <li>Firebase Console එකට ගොස් Authentication හි පරිශීලකයා නිර්මාණය කරන්න.</li>
          <li>
            Firebase Admin SDK (හෝ Google Cloud Console IAM) භාවිතයෙන් එම uid සඳහා Custom Claim
            එකක් සකසන්න: <code>{'{ admin: true }'}</code>.
          </li>
          <li>පරිශීලකයා නැවත පිවිසෙන විට නව Token එකේ Claim එක ඇතුළත් වේ.</li>
          <li>
            විකල්පයක් ලෙස Console එකෙන් පමණක් සෑදිය හැකි <code>admins/{'{uid}'}</code> ලේඛනයක්
            භාවිතා කිරීමද හැක — නමුත් එය Console එකෙන් පමණක් සෑදිය යුතුයි.
          </li>
        </ol>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          <strong>කිසිවිටෙකත්</strong> පරිශීලකයාට තමන්ගේම Admin අවසර සකසා ගැනීමට ඉඩ
          දෙන්නට එපා — එය බ්‍රවුසරයේ Admin බොත්තමක් සැඟවීමට වඩා වෙනස් කරුණකි.
        </p>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1.05rem' }}>
          <CheckCircle2 size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          පටිගත කිරීම් සහ අයිතිය
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 0 }}>
          මෙම වේදිකාවේ සියලුම පාඩම් අන්තර්ගතය මුල් නිර්මාණයකි. කිසිදු ප්‍රකාශිත පොතක්,
          ගෙවන පාඩම් පාඨමාලාවක් හෝ වාණිජ ශ්‍රව්‍ය නියැදියක් පිටපත් කර නොමැත. සියලුම සංගීත
          උදාහරණ ගණිතමය වශයෙන් ගණනය කර Web Audio API මගින් තත්‍ය කාලීනව උත්පාදනය කරනු ලැබේ.
          Logo එක මුල් Vector නිර්මාණයක් වන අතර කිසිදු ප්‍රකාශිත ලාංඡනයක් අනුකරණය නොකෙරේ.
        </p>
      </section>

      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <Link to="/learning-paths" className="btn btn-primary">
          ඉගෙනුම් මාර්ග බලන්න
        </Link>
        <Link to="/labs" className="btn btn-secondary">
          Music Lab විවෘත කරන්න
        </Link>
      </div>
    </div>
  );
}
