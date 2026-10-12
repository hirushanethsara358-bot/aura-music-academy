import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  try {
    localStorage.clear();
  } catch {
    // ignore
  }
});

/* ------------------------------------------------------------------ */
/* Web Audio API mock                                                  */
/* ------------------------------------------------------------------ */
/* jsdom does not implement the Web Audio API. These mocks let the pure
   theory and UI logic be tested without ever producing real sound.     */

class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn(() => this);
  linearRampToValueAtTime = vi.fn(() => this);
  exponentialRampToValueAtTime = vi.fn(() => this);
  cancelScheduledValues = vi.fn(() => this);
}

class MockAudioNode {
  connect = vi.fn(() => this);
  disconnect = vi.fn();
}

class MockOscillator extends MockAudioNode {
  type = 'sine';
  frequency = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockGain extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilter extends MockAudioNode {
  type = 'lowpass';
  frequency = new MockAudioParam();
  gain = new MockAudioParam();
  Q = new MockAudioParam();
}

class MockAnalyser extends MockAudioNode {
  fftSize = 2048;
  frequencyBinCount = 1024;
  smoothingTimeConstant = 0.8;
  context = { sampleRate: 48000 };
  getByteFrequencyData = vi.fn((array: Uint8Array) => {
    array.fill(0);
  });
  getByteTimeDomainData = vi.fn((array: Uint8Array) => {
    array.fill(128);
  });
}

class MockAudioContext {
  state: AudioContextState = 'running';
  currentTime = 0;
  sampleRate = 48000;
  destination = new MockAudioNode();
  createOscillator = vi.fn(() => new MockOscillator());
  createGain = vi.fn(() => new MockGain());
  createBiquadFilter = vi.fn(() => new MockBiquadFilter());
  createAnalyser = vi.fn(() => new MockAnalyser());
  createMediaStreamSource = vi.fn(() => new MockAudioNode());
  resume = vi.fn(async () => undefined);
  decodeAudioData = vi.fn(async () => ({
    duration: 1.5,
    sampleRate: 44100,
    numberOfChannels: 2,
    getChannelData: () => {
      const data = new Float32Array(44100);
      for (let i = 0; i < data.length; i += 1) {
        data[i] = Math.sin((i / 44100) * 440 * 2 * Math.PI) * 0.5;
      }
      return data;
    },
  }));
}

Object.defineProperty(window, 'AudioContext', {
  writable: true,
  value: MockAudioContext,
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

if (!window.requestAnimationFrame) {
  Object.defineProperty(window, 'requestAnimationFrame', {
    writable: true,
    value: (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0) as unknown as number,
  });
  Object.defineProperty(window, 'cancelAnimationFrame', {
    writable: true,
    value: (id: number) => clearTimeout(id),
  });
}

Object.defineProperty(URL, 'createObjectURL', { writable: true, value: vi.fn(() => 'blob:mock') });
Object.defineProperty(URL, 'revokeObjectURL', { writable: true, value: vi.fn() });
