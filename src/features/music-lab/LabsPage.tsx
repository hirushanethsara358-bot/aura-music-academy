import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Activity,
  AudioLines,
  Ear,
  Gauge,
  Keyboard,
  Layers,
  Music4,
  Sliders,
  Timer,
} from 'lucide-react';
import { VirtualPiano } from './VirtualPiano';
import { ScaleExplorer } from './ScaleExplorer';
import { ChordExplorer } from './ChordExplorer';
import { ProgressionBuilder } from './ProgressionBuilder';
import { Metronome } from './Metronome';
import { EarTraining } from './EarTraining';
import { AudioVisualizer } from '../audio-tools/AudioVisualizer';
import { ParametricEqLab } from '../audio-tools/ParametricEqLab';
import { LocalAudioAnalyzer } from '../audio-tools/LocalAudioAnalyzer';
import { webAudioEngine } from '../../lib/webAudioEngine';

type TabId =
  | 'piano'
  | 'scale'
  | 'chord'
  | 'progression'
  | 'metronome'
  | 'ear-training'
  | 'visualizer'
  | 'eq'
  | 'analyzer';

const TABS: Array<{ id: TabId; labelSi: string; labelEn: string; icon: typeof Keyboard }> = [
  { id: 'piano', labelSi: 'අතථ්‍ය පියානෝ', labelEn: 'Virtual Piano', icon: Keyboard },
  { id: 'scale', labelSi: 'ස්වර මාලා ගවේෂකය', labelEn: 'Scale Explorer', icon: Music4 },
  { id: 'chord', labelSi: 'කෝඩ් ගවේෂකය', labelEn: 'Chord Explorer', icon: Layers },
  { id: 'progression', labelSi: 'කෝඩ් රටා ගොඩනගන්නා', labelEn: 'Progression Builder', icon: AudioLines },
  { id: 'metronome', labelSi: 'මෙට්‍රොනෝමය', labelEn: 'Metronome', icon: Timer },
  { id: 'ear-training', labelSi: 'ශ්‍රවණ පුහුණුව', labelEn: 'Ear Training', icon: Ear },
  { id: 'visualizer', labelSi: 'තරංග/වර්ණාවලි දර්ශකය', labelEn: 'Audio Visualizer', icon: Activity },
  { id: 'eq', labelSi: 'EQ ලැබ්', labelEn: 'Parametric EQ Lab', icon: Sliders },
  { id: 'analyzer', labelSi: 'ගොනු විශ්ලේෂකය', labelEn: 'Local Audio Analyzer', icon: Gauge },
];

export function LabsPage() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get('tab') as TabId) || 'piano';
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === initial) ? initial : 'piano');

  useEffect(() => {
    setParams(tab === 'piano' ? {} : { tab }, { replace: true });
  }, [tab, setParams]);

  // Guarantee all scheduled audio and microphone resources are released when
  // the learner leaves the labs entirely.
  useEffect(() => {
    return () => {
      webAudioEngine.disposeAll();
    };
  }, []);

  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <header>
        <h1 style={{ marginBottom: '0.3rem' }}>අන්තර්ක්‍රියාකාරී Music Lab</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: 800 }}>
          මෙවලම් 9 ක් — සියල්ල <strong>Web Audio API</strong> මගින් ඔබේ බ්‍රවුසරයේම ක්‍රියාත්මක වේ.
          කිසිදු Audio ගොනුවක් බාගත නොකෙරේ; ශබ්දය තත්‍ය කාලීනව සංශ්ලේෂණය කරනු ලැබේ. මෙවලම්
          භාවිතයට <strong>ගිණුමක් අවශ්‍ය නැත</strong>.
        </p>
      </header>

      <div className="tab-strip" role="tablist" aria-label="Music Lab මෙවලම්">
        {TABS.map((entry) => {
          const Icon = entry.icon;
          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={`tab-${entry.id}`}
              aria-selected={tab === entry.id}
              aria-controls={`panel-${entry.id}`}
              className="tab-button"
              onClick={() => setTab(entry.id)}
            >
              <Icon size={13} aria-hidden="true" />
              {entry.labelSi}
            </button>
          );
        })}
      </div>

      <section
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="surface-card"
      >
        <h2 style={{ fontSize: '1.05rem', marginBottom: '0.2rem' }}>{activeTab?.labelSi}</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
          {activeTab?.labelEn}
        </p>

        {tab === 'piano' && <VirtualPiano />}
        {tab === 'scale' && <ScaleExplorer />}
        {tab === 'chord' && <ChordExplorer />}
        {tab === 'progression' && <ProgressionBuilder />}
        {tab === 'metronome' && <Metronome />}
        {tab === 'ear-training' && <EarTraining />}
        {tab === 'visualizer' && <AudioVisualizer />}
        {tab === 'eq' && <ParametricEqLab />}
        {tab === 'analyzer' && <LocalAudioAnalyzer />}
      </section>

      <section className="surface-card" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
        <h2 style={{ fontSize: '0.98rem' }}>මෙවලම් පිළිබඳ දැනගත යුතු කරුණු</h2>
        <ul style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', paddingLeft: '1.1rem' }}>
          <li>බ්‍රවුසරයක් ස්වයංක්‍රීයව ශබ්දය ආරම්භ නොකරයි. පළමුව ඔබ යතුරක් ඔබන්න හෝ බොත්තමක් ඔබන්න.</li>
          <li>ටැබය මාරු කළ විට හෝ වින්ඩෝව වෙනස් කළ විට සියලු වාදනය වන ස්වර නතර වේ.</li>
          <li>හැකි සෑම විටම ඔබේ ප්‍රියතම වෙනත් සංගීත ගීතයක් සමඟ සසඳා (A/B) අසන්න.</li>
          <li>ලබා දෙන සංඛ්‍යාත්මක අගයන් (dB, Hz) සාර්වත්‍ර නියම නොවේ — ශ්‍රවණය මත තීරණ ගන්න.</li>
        </ul>
      </section>
    </div>
  );
}
