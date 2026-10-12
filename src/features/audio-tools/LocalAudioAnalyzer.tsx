import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, FileAudio, ShieldCheck, Trash2, Upload } from 'lucide-react';
import { AudioAnalysisSummary } from '../../types/music';
import { webAudioEngine } from '../../lib/webAudioEngine';
import { StatusBanner } from '../../components/feedback/Feedback';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function LocalAudioAnalyzer() {
  const [analysis, setAnalysis] = useState<AudioAnalysisSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const releaseResources = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setAnalysis(null);
    setFileName(null);
  }, []);

  useEffect(() => {
    return () => {
      releaseResources();
    };
  }, [releaseResources]);

  async function handleFile(file: File) {
    setBusy(true);
    setError(null);
    releaseResources();

    try {
      if (file.size > 60 * 1024 * 1024) {
        throw new Error(
          'මෙම ගොනුව ඉතා විශාලයි (60 MB ට වැඩි). කරුණාකර කුඩා ගොනුවක් තෝරන්න — එසේ නොකළහොත් ඔබේ බ්‍රවුසරය මන්දගාමී විය හැක.'
        );
      }

      setFileName(file.name);
      // Object URL is created only so the resource lifecycle is explicit and
      // revocable. The bytes never leave the browser.
      objectUrlRef.current = URL.createObjectURL(file);

      const summary = await webAudioEngine.analyzeLocalAudioFile(file);
      setAnalysis(summary);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.includes('decode')
            ? 'මෙම ගොනුව කියවීමට නොහැකි විය. එය වලංගු සහාය දක්වන ශ්‍රව්‍ය ගොනුවක් (WAV, MP3, OGG, M4A, FLAC) ද යන්න පරීක්ෂා කරන්න.'
            : err.message
          : 'විශ්ලේෂණයේදී දෝෂයක් ඇතිවිය.'
      );
      setFileName(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <section className="surface-card" style={{ borderLeft: '3px solid var(--accent-success)' }}>
        <h2 style={{ fontSize: '1rem' }}>
          <ShieldCheck size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          රහස්‍යතාවය සහ පෞද්ගලිකත්වය
        </h2>
        <ul style={{ margin: 0, fontSize: '0.89rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
          <li>ඔබ තෝරන ගොනුව <strong>කිසිවිටෙකත් උඩුගත නොකෙරේ</strong>. සියලු විශ්ලේෂණය 100% ක්ම ඔබේ බ්‍රවුසරයේ සිදු වේ.</li>
          <li>ගොනුව කියවනු ලබන්නේ <code>FileReader</code> සහ <code>AudioContext.decodeAudioData</code> මගින් පමණි.</li>
          <li>ගොනු නිම වූ පසු Object URL සහ ශ්‍රව්‍ය සම්පත් නිදහස් කරනු ලැබේ.</li>
          <li>මෙය Firebase Cloud Storage භාවිත නොකරයි — Spark නොමිලේ සැලැස්මට එය ඇතුළත් නොවේ.</li>
        </ul>
      </section>

      <section className="surface-card">
        <h2 style={{ fontSize: '1rem' }}>
          <FileAudio size={18} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          ශ්‍රව්‍ය ගොනුවක් විශ්ලේෂණය කරන්න
        </h2>

        <div className="lab-control">
          <label htmlFor="analyzer-file">ශ්‍රව්‍ය ගොනුවක් තෝරන්න (WAV, MP3, OGG, M4A, FLAC)</label>
          <input
            id="analyzer-file"
            type="file"
            accept="audio/*"
            className="input-field"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
            disabled={busy}
          />
        </div>

        {busy && (
          <p role="status" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            ගොනුව කියවමින් සහ විශ්ලේෂණය කරමින්...
          </p>
        )}

        {error && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <StatusBanner tone="error" titleSi="විශ්ලේෂණය අසාර්ථක විය">
              {error}
            </StatusBanner>
          </div>
        )}

        {fileName && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            style={{ marginTop: 'var(--space-3)' }}
            onClick={() => {
              releaseResources();
              const input = document.getElementById('analyzer-file') as HTMLInputElement | null;
              if (input) input.value = '';
            }}
          >
            <Trash2 size={13} aria-hidden="true" /> ගොනුව ඉවත් කර සම්පත් නිදහස් කරන්න
          </button>
        )}
      </section>

      {analysis && (
        <>
          <section className="surface-card">
            <h2 style={{ fontSize: '1rem' }}>තාක්ෂණික සාරාංශය — {analysis.fileName}</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <tbody>
                  <tr>
                    <th scope="row">ගොනු ප්‍රමාණය</th>
                    <td>{formatBytes(analysis.fileSizeBytes)}</td>
                  </tr>
                  <tr>
                    <th scope="row">කාලය (Duration)</th>
                    <td>{analysis.durationSeconds} තත්පර</td>
                  </tr>
                  <tr>
                    <th scope="row">නියැදි වේගය (Sample Rate)</th>
                    <td>
                      {analysis.sampleRate} Hz · Nyquist සීමාව {(analysis.sampleRate / 2).toFixed(0)} Hz
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">චැනල ගණන</th>
                    <td>{analysis.numberOfChannels} ({analysis.numberOfChannels === 1 ? 'Mono' : 'Stereo'})</td>
                  </tr>
                  <tr>
                    <th scope="row">Peak මට්ටම</th>
                    <td>
                      {analysis.peakDbfs} dBFS ({analysis.peakLinear} රේඛීය)
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">RMS මට්ටම</th>
                    <td>
                      {analysis.rmsDbfs} dBFS · සාමාන්‍ය ශක්තිය
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Crest Factor</th>
                    <td>{analysis.crestFactorDb} dB (Peak සහ RMS අතර පරතරය)</td>
                  </tr>
                  <tr>
                    <th scope="row">DC Offset</th>
                    <td>
                      {analysis.dcOffset}
                      {Math.abs(analysis.dcOffset) > 0.002 && ' — අවධානය අවශ්‍යයි'}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Clipped Samples</th>
                    <td>
                      {analysis.clippedSamples}
                      {analysis.clippedSamples > 0 && ' — Clipping සිදු වී ඇත'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="surface-card">
            <h2 style={{ fontSize: '0.98rem' }}>Waveform දර්ශනය</h2>
            <svg
              viewBox="0 0 600 120"
              style={{ width: '100%', height: 170, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}
              role="img"
              aria-label="ශ්‍රව්‍ය ගොනුවේ ආවරණ තරංග දර්ශනය"
            >
              <line x1="0" y1="60" x2="600" y2="60" stroke="var(--border-subtle)" strokeWidth="1" />
              {analysis.waveformPeaks.map((peak, idx) => {
                const x = (idx / analysis.waveformPeaks.length) * 600;
                const barWidth = 600 / analysis.waveformPeaks.length;
                const height = Math.max(0.5, peak * 56);
                return (
                  <rect
                    key={idx}
                    x={x}
                    y={60 - height}
                    width={Math.max(1, barWidth - 0.6)}
                    height={height * 2}
                    fill={peak > 0.99 ? '#f87171' : '#38bdf8'}
                    opacity={0.85}
                  />
                );
              })}
              <line x1="0" y1="60" x2="600" y2="60" stroke="var(--accent-cyan)" strokeWidth="0.5" />
            </svg>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              රතු පැහැති කොටස් අධික ශබ්ද මට්ටම් (Clipping ආසන්න) දක්වයි.
            </p>
          </section>

          <section className="surface-card">
            <h2 style={{ fontSize: '0.98rem' }}>සංඛ්‍යාත පරාස බෙදීම (ඇස්තමේන්තුගත)</h2>
            {analysis.spectralBands.map((band) => {
              const normalized = Math.round(((band.relativeDb + 60) / 60) * 100);
              return (
                <div key={band.bandLabel} style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span>{band.bandLabel}</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                      {band.relativeDb > -120 ? `${band.relativeDb} dB` : 'මනින ලද නොමැත'}
                    </span>
                  </div>
                  <div className="meter-bar-track">
                    <div className="meter-bar-fill" style={{ width: `${Math.max(0, Math.min(100, normalized))}%` }} />
                  </div>
                </div>
              );
            })}
          </section>

          <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
            <h2 style={{ fontSize: '0.95rem' }}>
              <AlertTriangle size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
              මෙම මිනුම් පිළිබඳ අවංක සීමාවන්
            </h2>
            <ul style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
              <li>
                මෙම අගයන් <strong>ඇස්තමේන්තුගත මිනුම්</strong> වේ. ඒවා වෘත්තීය Mastering මිනුම්
                (ITU-R BS.1770 ප්‍රමිතියට අනුව නිවැරදි Integrated LUFS, True Peak dBTP, විස්තරාත්මක FFT
                විශ්ලේෂණය) <strong>නොවේ</strong>.
              </li>
              <li>
                LUFS ලබා ගැනීමට නම් K-weighting Filter සහ Gating ඇල්ගොරිතමයක් අවශ්‍ය වේ. මෙම
                බ්‍රවුසරයේ මෙවලමෙන් එය සපයන්නේ නැත.
              </li>
              <li>
                සංඛ්‍යාත පරාස බෙදීම සරල Digital Filtering ඇස්තමේන්තුවක් මිස නිවැරදි FFT විශ්ලේෂණයක්
                නොවේ.
              </li>
              <li>
                Peak සහ RMS අගයන් නිවැරදි වේ — ඒවා ඍජුවම නියැදි දත්තවලින් ගණනය කරනු ලැබේ.
              </li>
            </ul>
          </section>
        </>
      )}

      {!analysis && !busy && (
        <section className="surface-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <Upload size={30} color="var(--accent-violet)" aria-hidden="true" />
          <p style={{ color: 'var(--text-muted)', marginTop: '0.6rem', marginBottom: 0 }}>
            තවමත් ගොනුවක් තෝරා නැත. කරුණාකර ඉහතින් ශ්‍රව්‍ය ගොනුවක් තෝරන්න.
          </p>
        </section>
      )}
    </div>
  );
}
