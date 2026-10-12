import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, Mic, MicOff, Play, Square } from 'lucide-react';
import { webAudioEngine } from '../../lib/webAudioEngine';

type Source = 'tone' | 'microphone';

export function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const [source, setSource] = useState<Source>('tone');
  const [running, setRunning] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [mode, setMode] = useState<'waveform' | 'spectrum' | 'both'>('both');

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    webAudioEngine.stopEqAndVisualizerSignal();
    analyserRef.current = null;
    setRunning(false);
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Background + grid
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'rgba(148,163,184,0.18)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i += 1) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const spectrumHeight = mode === 'both' ? height * 0.62 : height;
    const waveformTop = mode === 'both' ? spectrumHeight + 8 : 0;
    const waveformHeight = mode === 'both' ? height - waveformTop : height;

    if (mode === 'spectrum' || mode === 'both') {
      // Logarithmic frequency axis over ~20 Hz … 20 kHz
      const bins = analyser.frequencyBinCount;
      const sampleRate = analyser.context.sampleRate;
      const data = new Uint8Array(bins);
      analyser.getByteFrequencyData(data);

      const minHz = 20;
      const maxHz = Math.min(20000, sampleRate / 2);
      const bars = 64;
      const barWidth = width / bars;

      for (let i = 0; i < bars; i += 1) {
        const t0 = i / bars;
        const t1 = (i + 1) / bars;
        const f0 = minHz * Math.pow(maxHz / minHz, t0);
        const f1 = minHz * Math.pow(maxHz / minHz, t1);
        const bin0 = Math.max(0, Math.floor((f0 / sampleRate) * bins * 2));
        const bin1 = Math.max(bin0 + 1, Math.min(bins, Math.ceil((f1 / sampleRate) * bins * 2)));

        let sum = 0;
        let count = 0;
        for (let b = bin0; b < bin1; b += 1) {
          sum += data[b];
          count += 1;
        }
        const value = count > 0 ? sum / count : 0;
        const barHeight = (value / 255) * spectrumHeight;

        const gradient = ctx.createLinearGradient(0, spectrumHeight, 0, spectrumHeight - barHeight);
        gradient.addColorStop(0, '#7c5cff');
        gradient.addColorStop(1, '#38bdf8');
        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth + 1, spectrumHeight - barHeight, Math.max(1, barWidth - 2), barHeight);
      }
    }

    if (mode === 'waveform' || mode === 'both') {
      const timeData = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(timeData);

      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const sliceWidth = width / timeData.length;
      for (let i = 0; i < timeData.length; i += 1) {
        const v = timeData[i] / 128.0;
        const y = waveformTop + (v * waveformHeight) / 2;
        const x = i * sliceWidth;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [mode]);

  const startTone = useCallback(() => {
    const analyser = webAudioEngine.startEqAndVisualizerSignal([
      { id: 'low', labelEn: 'Low', labelSi: 'පහළ', type: 'lowshelf', frequencyHz: 250, gainDb: 0, q: 0.7 },
      { id: 'mid', labelEn: 'Mid', labelSi: 'මධ්‍ය', type: 'peaking', frequencyHz: 1000, gainDb: 0, q: 1 },
      { id: 'high', labelEn: 'High', labelSi: 'ඉහළ', type: 'highshelf', frequencyHz: 4000, gainDb: 0, q: 0.7 },
    ]);
    if (!analyser) return;
    analyserRef.current = analyser;
    setMicError(null);
    setRunning(true);
  }, []);

  const startMic = useCallback(async () => {
    try {
      const analyser = await webAudioEngine.startMicrophoneVisualizer();
      if (!analyser) return;
      analyserRef.current = analyser;
      setMicError(null);
      setRunning(true);
    } catch (err) {
      setMicError(
        err instanceof Error
          ? err.message
          : 'මයික්‍රෆෝන ප්‍රවේශය ලබා දී නොමැත. කරුණාකර බ්‍රවුසරයේ අවසරය ලබා දෙන්න.'
      );
      setRunning(false);
    }
  }, []);

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(draw);
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [running, draw]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      webAudioEngine.stopEqAndVisualizerSignal();
    };
  }, []);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <div className="lab-control-row" style={{ marginBottom: 0 }}>
        <div className="lab-control">
          <label htmlFor="viz-source">මූලාශ්‍රය</label>
          <select
            id="viz-source"
            className="select-field"
            value={source}
            onChange={(e) => {
              stop();
              setSource(e.target.value as Source);
            }}
          >
            <option value="tone">අභ්‍යන්තර Test Tone (110 Hz / 220 Hz)</option>
            <option value="microphone">මයික්‍රෆෝනය (ඔබේ අවසරය අවශ්‍යයි)</option>
          </select>
        </div>

        <div className="lab-control">
          <label htmlFor="viz-mode">දර්ශන ආකාරය</label>
          <select
            id="viz-mode"
            className="select-field"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'waveform' | 'spectrum' | 'both')}
          >
            <option value="both">Waveform + Frequency Spectrum</option>
            <option value="waveform">Waveform පමණක්</option>
            <option value="spectrum">Frequency Spectrum පමණක්</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {running ? (
            <button type="button" className="btn btn-danger" onClick={stop}>
              <Square size={14} aria-hidden="true" /> නතර කරන්න
            </button>
          ) : source === 'tone' ? (
            <button type="button" className="btn btn-primary" onClick={startTone}>
              <Play size={14} aria-hidden="true" /> Test Tone ආරම්භ කරන්න
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => void startMic()}>
              <Mic size={14} aria-hidden="true" /> මයික්‍රෆෝනය සක්‍රීය කරන්න
            </button>
          )}
        </div>
      </div>

      {micError && (
        <p role="alert" style={{ color: 'var(--accent-danger)', fontSize: '0.88rem' }}>
          <MicOff size={14} style={{ verticalAlign: '-2px', marginRight: 4 }} aria-hidden="true" />
          {micError}
        </p>
      )}

      {source === 'microphone' && (
        <section className="surface-card" style={{ borderLeft: '3px solid var(--accent-amber)' }}>
          <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <strong>රහස්‍යතාවය:</strong> මයික්‍රෆෝන ශ්‍රව්‍යය <strong>කිසිවිටෙකත් පටිගත නොකෙරේ</strong>{' '}
            හෝ උඩුගත නොකෙරේ. එය Visualizer එකට පමණක් සම්බන්ධ වන අතර ස්පීකරයට කිසිසේත් නොයවයි
            (එසේ කළහොත් Feedback හඬක් ඇතිවේ). <strong>නතර කරන්න</strong> බොත්තම එබූ විට
            මයික්‍රෆෝන ප්‍රවාහය සම්පූර්ණයෙන්ම නතර වේ.
          </p>
        </section>
      )}

      <section className="surface-card">
        <h2 style={{ fontSize: '0.98rem' }}>
          <Activity size={17} style={{ verticalAlign: '-3px', marginRight: 6 }} aria-hidden="true" />
          දර්ශනය
        </h2>
        <canvas
          ref={canvasRef}
          className="canvas-frame"
          role="img"
          aria-label={
            running
              ? 'ශ්‍රව්‍ය ශබ්ද තරංගයේ සහ සංඛ්‍යාත වර්ණාවලියේ තත්‍ය කාලීන දර්ශනය'
              : 'නතර කර ඇත — දර්ශනයක් නොමැත'
          }
        />
        {!running && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.6rem' }}>
            දර්ශනය ආරම්භ කිරීමට ඉහත බොත්තම ඔබන්න. සංඛ්‍යාත අක්ෂය ලඝුගණකීය (Logarithmic) වන
            බැවින් 20 Hz සිට 20 kHz දක්වා පරාසය සමානව දිස්වේ — එය කනට ඇසෙන ආකාරයට වඩාත් සමීපයි.
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'var(--space-4)' }}>
          <span className="badge badge-violet">AnalyserNode FFT: 2048</span>
          <span className="badge">Smoothing: 0.82</span>
          <span className="badge badge-cyan">Update: requestAnimationFrame</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)', marginBottom: 0 }}>
          <strong>ක්‍රියාකාරීත්ව සටහන:</strong> දර්ශනය යාවත්කාලීන වන්නේ{' '}
          <code>requestAnimationFrame</code> මගින් වන අතර ටැබය මාරු කළ විට බ්‍රවුසරය එය
          ස්වයංක්‍රීයව අඩාල කරයි. මේ නිසා අනවශ්‍ය CPU පරිභෝජනයක් ඇති නොවේ.
        </p>
      </section>
    </div>
  );
}
