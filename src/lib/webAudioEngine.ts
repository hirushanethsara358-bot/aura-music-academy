import { AudioAnalysisSummary, EqBandConfig, WaveformType } from '../types/music';
import { amplitudeToDb, midiToFrequency } from './musicTheory';

interface ActiveVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

class WebAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices = new Map<number, ActiveVoice>();
  private scheduledTimers = new Set<number>();

  // Metronome state
  private metronomeRunning = false;
  private metronomeBpm = 100;
  private metronomeBeatsPerBar = 4;
  private currentBeat = 0;
  private nextNoteTime = 0;
  private metronomeTimerId: number | null = null;
  private onBeatCallback: ((beatIndex: number) => void) | null = null;

  // Visualizer & EQ state
  private analyser: AnalyserNode | null = null;
  private testToneOsc1: OscillatorNode | null = null;
  private testToneOsc2: OscillatorNode | null = null;
  private testToneGain: GainNode | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private eqLowFilter: BiquadFilterNode | null = null;
  private eqMidFilter: BiquadFilterNode | null = null;
  private eqHighFilter: BiquadFilterNode | null = null;

  /**
   * Ensure AudioContext is created and resumed on a user gesture.
   */
  public ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.35;
      this.masterGain.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setMasterVolume(value: number): void {
    const clamped = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(clamped, this.ctx.currentTime);
    }
  }

  /**
   * Start playing a sustained note for the Virtual Piano.
   */
  public startNote(midi: number, waveform: WaveformType = 'triangle'): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    if (this.activeVoices.has(midi)) {
      this.stopNote(midi);
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(midiToFrequency(midi), now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);

    this.activeVoices.set(midi, { oscillator: osc, gain });
  }

  /**
   * Release a sustained note smoothly.
   */
  public stopNote(midi: number): void {
    const voice = this.activeVoices.get(midi);
    if (!voice || !this.ctx) return;

    const now = this.ctx.currentTime;
    try {
      voice.gain.gain.cancelScheduledValues(now);
      voice.gain.gain.setValueAtTime(Math.max(voice.gain.gain.value, 0.0001), now);
      voice.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      voice.oscillator.stop(now + 0.09);
    } catch {
      // Ignore already stopped oscillator
    }
    this.activeVoices.delete(midi);
  }

  /**
   * Immediately stop all active notes and scheduled sequences.
   */
  public stopAllNotes(): void {
    for (const midi of Array.from(this.activeVoices.keys())) {
      this.stopNote(midi);
    }
    for (const id of this.scheduledTimers) {
      window.clearTimeout(id);
    }
    this.scheduledTimers.clear();
  }

  /**
   * Play a single note for a fixed duration (in seconds).
   */
  public playNoteForDuration(
    midi: number,
    durationSec = 0.45,
    waveform: WaveformType = 'triangle',
    startTimeOffsetSec = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const start = ctx.currentTime + startTimeOffsetSec;
    const stop = start + durationSec;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveform;
    osc.frequency.setValueAtTime(midiToFrequency(midi), start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.24, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, stop);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(start);
    osc.stop(stop + 0.02);
  }

  /**
   * Play a sequence of MIDI notes (such as a scale or melody) using Web Audio timing.
   */
  public playSequence(
    midiNotes: number[],
    stepDurationSec = 0.35,
    waveform: WaveformType = 'triangle',
    onStep?: (midi: number | null, index: number) => void
  ): void {
    this.stopAllNotes();
    const ctx = this.ensureContext();
    if (!ctx) return;

    midiNotes.forEach((midi, index) => {
      const offset = index * stepDurationSec;
      this.playNoteForDuration(midi, stepDurationSec * 0.9, waveform, offset);

      if (onStep) {
        const timerId = window.setTimeout(() => {
          onStep(midi, index);
          this.scheduledTimers.delete(timerId);
        }, offset * 1000);
        this.scheduledTimers.add(timerId);
      }
    });

    if (onStep) {
      const endTimer = window.setTimeout(() => {
        onStep(null, -1);
        this.scheduledTimers.delete(endTimer);
      }, midiNotes.length * stepDurationSec * 1000);
      this.scheduledTimers.add(endTimer);
    }
  }

  /**
   * Play multiple MIDI notes simultaneously as a chord.
   */
  public playChord(
    midiNotes: number[],
    durationSec = 0.9,
    waveform: WaveformType = 'triangle',
    startTimeOffsetSec = 0
  ): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain || midiNotes.length === 0) return;

    const start = ctx.currentTime + startTimeOffsetSec;
    const stop = start + durationSec;
    const perVoiceGain = Math.min(0.22, 0.55 / midiNotes.length);

    for (const midi of midiNotes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveform;
      osc.frequency.setValueAtTime(midiToFrequency(midi), start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(perVoiceGain, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, stop);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(start);
      osc.stop(stop + 0.02);
    }
  }

  /**
   * Accurate Web Audio API Lookahead Metronome Scheduler.
   * Uses audioContext.currentTime to schedule clicks ahead of time without timer drift.
   */
  public startMetronome(
    bpm: number,
    beatsPerBar: number,
    onBeat?: (beatIndex: number) => void
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.stopMetronome();
    this.metronomeBpm = Math.max(30, Math.min(260, bpm));
    this.metronomeBeatsPerBar = Math.max(1, Math.min(12, beatsPerBar));
    this.onBeatCallback = onBeat ?? null;
    this.currentBeat = 0;
    this.nextNoteTime = ctx.currentTime + 0.05;
    this.metronomeRunning = true;

    const scheduleAheadTime = 0.1; // seconds
    const lookaheadMs = 25; // ms

    const scheduler = () => {
      if (!this.metronomeRunning || !this.ctx || !this.masterGain) return;
      while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
        const beatIndex = this.currentBeat;
        const clickTime = this.nextNoteTime;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(beatIndex === 0 ? 1100 : 750, clickTime);

        gain.gain.setValueAtTime(0.0001, clickTime);
        gain.gain.exponentialRampToValueAtTime(beatIndex === 0 ? 0.35 : 0.2, clickTime + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, clickTime + 0.055);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(clickTime);
        osc.stop(clickTime + 0.06);

        if (this.onBeatCallback) {
          const delayMs = Math.max(0, (clickTime - this.ctx.currentTime) * 1000);
          const timerId = window.setTimeout(() => {
            if (this.metronomeRunning && this.onBeatCallback) {
              this.onBeatCallback(beatIndex);
            }
            this.scheduledTimers.delete(timerId);
          }, delayMs);
          this.scheduledTimers.add(timerId);
        }

        const secondsPerBeat = 60.0 / this.metronomeBpm;
        this.nextNoteTime += secondsPerBeat;
        this.currentBeat = (this.currentBeat + 1) % this.metronomeBeatsPerBar;
      }
      this.metronomeTimerId = window.setTimeout(scheduler, lookaheadMs);
    };

    scheduler();
  }

  public updateMetronomeConfig(bpm: number, beatsPerBar: number): void {
    this.metronomeBpm = Math.max(30, Math.min(260, bpm));
    this.metronomeBeatsPerBar = Math.max(1, Math.min(12, beatsPerBar));
  }

  public stopMetronome(): void {
    this.metronomeRunning = false;
    if (this.metronomeTimerId !== null) {
      window.clearTimeout(this.metronomeTimerId);
      this.metronomeTimerId = null;
    }
  }

  /**
   * Start internal harmonic test generator routed through 3-band EQ & AnalyserNode.
   */
  public startEqAndVisualizerSignal(bands: EqBandConfig[]): AnalyserNode | null {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return null;

    this.stopEqAndVisualizerSignal();

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.82;

    this.eqLowFilter = ctx.createBiquadFilter();
    this.eqMidFilter = ctx.createBiquadFilter();
    this.eqHighFilter = ctx.createBiquadFilter();

    this.applyEqBands(bands);

    this.testToneOsc1 = ctx.createOscillator();
    this.testToneOsc2 = ctx.createOscillator();
    this.testToneGain = ctx.createGain();

    // Rich harmonic sawtooth + triangle drone (A2 = 110 Hz & E3 = 164.81 Hz)
    this.testToneOsc1.type = 'sawtooth';
    this.testToneOsc1.frequency.setValueAtTime(110, ctx.currentTime);
    this.testToneOsc2.type = 'triangle';
    this.testToneOsc2.frequency.setValueAtTime(220, ctx.currentTime);

    this.testToneGain.gain.setValueAtTime(0.18, ctx.currentTime);

    this.testToneOsc1.connect(this.testToneGain);
    this.testToneOsc2.connect(this.testToneGain);

    this.testToneGain.connect(this.eqLowFilter);
    this.eqLowFilter.connect(this.eqMidFilter);
    this.eqMidFilter.connect(this.eqHighFilter);
    this.eqHighFilter.connect(this.analyser);
    this.analyser.connect(this.masterGain);

    this.testToneOsc1.start();
    this.testToneOsc2.start();

    return this.analyser;
  }

  public applyEqBands(bands: EqBandConfig[]): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    for (const band of bands) {
      const target =
        band.id === 'low'
          ? this.eqLowFilter
          : band.id === 'mid'
            ? this.eqMidFilter
            : this.eqHighFilter;
      if (target) {
        target.type = band.type;
        target.frequency.setValueAtTime(band.frequencyHz, now);
        target.gain.setValueAtTime(band.gainDb, now);
        target.Q.setValueAtTime(band.q, now);
      }
    }
  }

  /**
   * Optional Microphone Input for Visualizer (never records or uploads audio).
   */
  public async startMicrophoneVisualizer(): Promise<AnalyserNode | null> {
    const ctx = this.ensureContext();
    if (!ctx || typeof navigator === 'undefined' || !navigator.mediaDevices) {
      throw new Error('මයික්‍රෆෝන පහසුකම මෙම බ්‍රවුසරයේ ලබාගත නොහැක.');
    }

    this.stopEqAndVisualizerSignal();

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: false,
      },
      video: false,
    });

    this.analyser = ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    this.micSource = ctx.createMediaStreamSource(this.micStream);
    // Connect only to analyser (NOT to destination speakers, avoiding feedback loop!)
    this.micSource.connect(this.analyser);
    return this.analyser;
  }

  public stopEqAndVisualizerSignal(): void {
    try {
      this.testToneOsc1?.stop();
      this.testToneOsc1?.disconnect();
    } catch {
      // ignore
    }
    try {
      this.testToneOsc2?.stop();
      this.testToneOsc2?.disconnect();
    } catch {
      // ignore
    }
    this.testToneOsc1 = null;
    this.testToneOsc2 = null;

    if (this.micSource) {
      try {
        this.micSource.disconnect();
      } catch {
        // ignore
      }
      this.micSource = null;
    }

    if (this.micStream) {
      for (const track of this.micStream.getTracks()) {
        track.stop();
      }
      this.micStream = null;
    }
  }

  /**
   * Decode and analyze a local audio file completely inside the browser.
   */
  public async analyzeLocalAudioFile(file: File): Promise<AudioAnalysisSummary> {
    const ctx = this.ensureContext();
    if (!ctx) {
      throw new Error('Web Audio API ආරම්භ කළ නොහැක.');
    }

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const channelData = audioBuffer.getChannelData(0);
    const totalSamples = channelData.length;

    let peakLinear = 0;
    let sumSquares = 0;
    let sumLinear = 0;
    let clippedSamples = 0;

    for (let i = 0; i < totalSamples; i += 1) {
      const sample = channelData[i];
      const abs = Math.abs(sample);
      if (abs > peakLinear) peakLinear = abs;
      if (abs >= 0.999) clippedSamples += 1;
      sumSquares += sample * sample;
      sumLinear += sample;
    }

    const rmsLinear = totalSamples > 0 ? Math.sqrt(sumSquares / totalSamples) : 0;
    const dcOffset = totalSamples > 0 ? Math.round((sumLinear / totalSamples) * 100000) / 100000 : 0;
    const peakDbfs = amplitudeToDb(peakLinear);
    const rmsDbfs = amplitudeToDb(rmsLinear);
    const crestFactorDb = Math.round((peakDbfs - rmsDbfs) * 100) / 100;

    // Downsample waveform into 120 buckets for lightweight canvas/SVG rendering
    const bucketCount = 120;
    const bucketSize = Math.max(1, Math.floor(totalSamples / bucketCount));
    const waveformPeaks: number[] = [];

    for (let b = 0; b < bucketCount; b += 1) {
      const startIdx = b * bucketSize;
      const endIdx = Math.min(totalSamples, startIdx + bucketSize);
      let maxInBucket = 0;
      for (let i = startIdx; i < endIdx; i += 1) {
        const abs = Math.abs(channelData[i]);
        if (abs > maxInBucket) maxInBucket = abs;
      }
      waveformPeaks.push(Math.round(maxInBucket * 1000) / 1000);
    }

    // Approximate Zero-Crossing / Slew-based 3-band spectral estimate on a representative window
    let lowEnergy = 0;
    let midEnergy = 0;
    let highEnergy = 0;
    const sampleStep = Math.max(1, Math.floor(totalSamples / 20000));
    let prevSample = 0;
    let lowPassState = 0;
    const alphaLow = 0.08;

    for (let i = 0; i < totalSamples; i += sampleStep) {
      const x = channelData[i];
      lowPassState = lowPassState + alphaLow * (x - lowPassState);
      const highComponent = x - prevSample;
      const midComponent = x - lowPassState - highComponent * 0.5;

      lowEnergy += lowPassState * lowPassState;
      midEnergy += midComponent * midComponent;
      highEnergy += highComponent * highComponent;
      prevSample = x;
    }

    const countSteps = Math.max(1, Math.floor(totalSamples / sampleStep));
    const spectralBands = [
      {
        bandLabel: 'Low (Bass: 20 Hz – 250 Hz)',
        rangeHz: '20–250 Hz',
        relativeDb: amplitudeToDb(Math.sqrt(lowEnergy / countSteps)),
      },
      {
        bandLabel: 'Mid (Fundamental & Vocal: 250 Hz – 4 kHz)',
        rangeHz: '250 Hz–4 kHz',
        relativeDb: amplitudeToDb(Math.sqrt(midEnergy / countSteps)),
      },
      {
        bandLabel: 'High (Presence & Air: 4 kHz – 20 kHz)',
        rangeHz: '4–20 kHz',
        relativeDb: amplitudeToDb(Math.sqrt(highEnergy / countSteps)),
      },
    ];

    return {
      fileName: file.name,
      fileSizeBytes: file.size,
      durationSeconds: Math.round(audioBuffer.duration * 100) / 100,
      sampleRate: audioBuffer.sampleRate,
      numberOfChannels: audioBuffer.numberOfChannels,
      peakLinear: Math.round(peakLinear * 10000) / 10000,
      peakDbfs,
      rmsLinear: Math.round(rmsLinear * 10000) / 10000,
      rmsDbfs,
      crestFactorDb,
      dcOffset,
      clippedSamples,
      waveformPeaks,
      spectralBands,
    };
  }

  public disposeAll(): void {
    this.stopAllNotes();
    this.stopMetronome();
    this.stopEqAndVisualizerSignal();
  }
}

export const webAudioEngine = new WebAudioEngine();
