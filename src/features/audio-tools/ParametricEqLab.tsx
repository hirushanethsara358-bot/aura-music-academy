import { useEffect, useState } from 'react';
import { Play, RotateCcw, Sliders, Square } from 'lucide-react';
import { EqBandConfig } from '../../types/music';
import { webAudioEngine } from '../../lib/webAudioEngine';

const DEFAULT_BANDS: EqBandConfig[] = [
  {
    id: 'low',
    labelEn: 'Low / Bass',
    labelSi: 'පහළ (Bass) — 250 Hz පමණ',
    type: 'lowshelf',
    frequencyHz: 120,
    gainDb: 0,
    q: 0.7,
  },
  {
    id: 'mid',
    labelEn: 'Mid',
    labelSi: 'මධ්‍ය (Midrange) — 1 kHz පමණ',
    type: 'peaking',
    frequencyHz: 1000,
    gainDb: 0,
    q: 1,
  },
  {
    id: 'high',
    labelEn: 'High / Treble',
    labelSi: 'ඉහළ (Treble) — 6 kHz පමණ',
    type: 'highshelf',
    frequencyHz: 6000,
    gainDb: 0,
    q: 0.7,
  },
];

export function ParametricEqLab() {
  const [bands, setBands] = useState<EqBandConfig[]>(DEFAULT_BANDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (running) {
      webAudioEngine.applyEqBands(bands);
    }
  }, [bands, running]);

  useEffect(() => {
    return () => {
      webAudioEngine.stopEqAndVisualizerSignal();
    };
  }, []);

  function start() {
    const analyser = webAudioEngine.startEqAndVisualizerSignal(bands);
    if (analyser) setRunning(true);
  }

  function stop() {
    webAudioEngine.stopEqAndVisualizerSignal();
    setRunning(false);
  }

  function updateBand(id: EqBandConfig['id'], gainDb: number) {
    setBands((prev) => prev.map((band) => (band.id === id ? { ...band, gainDb } : band)));
  }

  const curvePoints = bands.map((band, idx) => {
    const normalized = (band.gainDb + 12) / 24;
    return {
      x: 60 + idx * 160,
      y: 110 - normalized * 90,
    };
  });

  const path = `M 20 110 L ${curvePoints[0].x} ${curvePoints[0].y} L ${curvePoints[1].x} ${curvePoints[1].y} L ${curvePoints[2].x} ${curvePoints[2].y} L 380 110`;

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <section className="surface-card" style={{ borderLeft: '3px solid var(--accent-amber)' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <strong>මෙය සැබෑ ශබ්ද සැකසුමකි — සංකල්පීය රූප සටහනක් නොවේ.</strong> පහත පරාමිතීන්{' '}
          <strong>Web Audio API BiquadFilterNode</strong> තුනකට සෘජුවම යොදනු ලැබේ. එනම් ඔබ අසන
          වෙනස සැබවින්ම එම Digital Filter එකෙන් සිදු වන බලපෑමයි.
        </p>
      </section>

      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {running ? (
            <button type="button" className="btn btn-danger" onClick={stop}>
              <Square size={14} aria-hidden="true" /> නතර කරන්න
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={start}>
              <Play size={14} aria-hidden="true" /> Test Signal ආරම්භ කරන්න
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setBands(DEFAULT_BANDS);
            }}
          >
            <RotateCcw size={14} aria-hidden="true" /> සමතුලිත තත්ත්වයට
          </button>
        </div>
      </div>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>
          <Sliders size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          3-Band Parametric EQ
        </h2>

        {bands.map((band) => (
          <div key={band.id} style={{ marginBottom: 'var(--space-5)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginBottom: '0.25rem',
              }}
            >
              <label htmlFor={`eq-${band.id}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {band.labelSi}
              </label>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.85rem',
                  color: band.gainDb === 0 ? 'var(--text-muted)' : 'var(--accent-cyan)',
                }}
              >
                {band.gainDb > 0 ? '+' : ''}
                {band.gainDb.toFixed(1)} dB · {band.frequencyHz} Hz · {band.type}
              </span>
            </div>
            <input
              id={`eq-${band.id}`}
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={band.gainDb}
              onChange={(e) => updateBand(band.id, Number(e.target.value))}
              aria-valuetext={`${band.gainDb} decibels at ${band.frequencyHz} hertz`}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}
            >
              <span>−12 dB (අඩු කිරීම)</span>
              <span>0 dB (නොවෙනස්)</span>
              <span>+12 dB (ඉහළ නැංවීම)</span>
            </div>
          </div>
        ))}
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>සංඛ්‍යාත ප්‍රතිචාර වක්‍රය (Frequency Response Curve)</h2>
        <svg
          viewBox="0 0 400 130"
          style={{ width: '100%', height: 190, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}
          role="img"
          aria-label="EQ සැකසුම් මත පදනම්ව සංඛ්‍යාත ප්‍රතිචාර වක්‍රයේ සංකල්පීය දර්ශනය"
        >
          <line x1="20" y1="110" x2="380" y2="110" stroke="var(--border-subtle)" strokeWidth="1" />
          <line x1="20" y1="65" x2="380" y2="65" stroke="var(--border-subtle)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="20" x2="380" y2="20" stroke="var(--border-subtle)" strokeWidth="1" />
          <path d={path} fill="none" stroke="url(#eqGrad)" strokeWidth="2.5" strokeLinejoin="round" />
          <defs>
            <linearGradient id="eqGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7c5cff" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#2dd4bf" />
            </linearGradient>
          </defs>
          <text x="20" y="124" fill="var(--text-muted)" fontSize="9">20 Hz</text>
          <text x="170" y="124" fill="var(--text-muted)" fontSize="9">1 kHz</text>
          <text x="345" y="124" fill="var(--text-muted)" fontSize="9">20 kHz</text>
          <text x="22" y="24" fill="var(--text-muted)" fontSize="8">+12 dB</text>
          <text x="22" y="108" fill="var(--text-muted)" fontSize="8">−12 dB</text>
        </svg>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          මෙය EQ පරාමිතීන්ගේ <strong>සංකල්පීය දර්ශනයකි</strong> — සැබෑ ප්‍රතිචාර වක්‍රය ඔබේ ඇසීම
          මගින් තහවුරු කරන්න. පරාමිතීන් තුනම එකම වේලාවේ අන්තයට ගෙන ගිය විට ශබ්දය විකෘති විය
          හැක.
        </p>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>සංඛ්‍යාත පරාස අර්ථ නිරූපණය</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">පරාසය</th>
                <th scope="col">සංඛ්‍යාත</th>
                <th scope="col">ශ්‍රවණ ප්‍රතිඵලය</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sub-Bass</td>
                <td>20–60 Hz</td>
                <td>ස්පර්ශය පමණි — බොහෝ දුරට ඉවත් කිරීම නිර්දේශිතයි</td>
              </tr>
              <tr>
                <td>Bass</td>
                <td>60–250 Hz</td>
                <td>ශබ්දයේ බර සහ පදනම</td>
              </tr>
              <tr>
                <td>Low Mid / Mud</td>
                <td>250–500 Hz</td>
                <td>වැඩි නම් ශබ්දය මඩ වේ (Muddy)</td>
              </tr>
              <tr>
                <td>Midrange</td>
                <td>500 Hz–2 kHz</td>
                <td>බොහෝ වාද්‍ය භාණ්ඩවල සහ ගායනයේ ප්‍රධාන වර්ණය</td>
              </tr>
              <tr>
                <td>Presence</td>
                <td>2–5 kHz</td>
                <td>පැහැදිලි බව — වැඩි නම් කණට අපහසු වේ (Harsh)</td>
              </tr>
              <tr>
                <td>Sibilance</td>
                <td>5–8 kHz</td>
                <td>&ldquo;ස්&rdquo; ශබ්දය — De-esser සඳහා</td>
              </tr>
              <tr>
                <td>Air</td>
                <td>10–16 kHz</td>
                <td>වායුමය අවකාශය සහ දීප්තිය</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-4)' }}>
          <strong>වැදගත්:</strong> නිශ්චිත dB සහ Hz අගයන් <strong>සාර්වත්‍ර නියම නොවේ</strong>. ඒවා
          මූලාශ්‍රයේ ස්වභාවය, කාමරය සහ ඔබේ අරමුණ මත රඳා පවතී. සැමවිටම ශ්‍රවණයෙන් තීරණය කරන්න —
          අංක අනුව නොව.
        </p>
      </section>
    </div>
  );
}
