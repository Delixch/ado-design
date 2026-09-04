import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * High-quality synthesized WebAudio Sound Engine
 * No external MP3 files required — zero latency, rich sound design.
 */

const MUTE_KEY = 'ado:sound-muted';
export const SOUND_MUTE_EVENT = 'ado:sound-mute-change';

let ctx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtx();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
};

export const isSoundMuted = (): boolean =>
  typeof window !== 'undefined' && localStorage.getItem(MUTE_KEY) === 'on'; // Defaults to ON (unmuted) if not set

export const toggleSound = (): void => {
  const currentMuted = isSoundMuted();
  const nextMuted = !currentMuted;
  localStorage.setItem(MUTE_KEY, nextMuted ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent(SOUND_MUTE_EVENT));
  if (!nextMuted) playChime();
};

/* ─── Sound Synthesizers ─────────────────────────────────── */

/** 1. Tactile Mechanical Keyboard/UI Click */
export const playClick = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;

  // Transient noise click (key housing)
  const bufferSize = c.sampleRate * 0.012; // 12ms
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 2200;

  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.08, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

  noise.connect(filter).connect(noiseGain).connect(c.destination);

  // Soft thud underneath (key switch bottoming out)
  const osc = c.createOscillator();
  const oscGain = c.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.018);

  oscGain.gain.setValueAtTime(0.07, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

  osc.connect(oscGain).connect(c.destination);

  noise.start(now);
  osc.start(now);
  osc.stop(now + 0.02);
};

/** 2. Smooth Panel Open (Warm Chord Swoosh) */
export const playOpen = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;
  const dur = 0.16;

  // Dual oscillator warm swell (Root + 5th)
  [240, 360].forEach((freq, idx) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = idx === 0 ? 'sine' : 'triangle';

    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + dur);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + dur + 0.01);
  });
};

/** 3. Deep Mechanical Close (Snap Shut Thud) */
export const playClose = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;
  const dur = 0.14;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sawtooth';

  // Lowpass filter to muffle the sawtooth into a rich mechanical thud
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(800, now);
  filter.frequency.exponentialRampToValueAtTime(120, now + dur);

  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + dur);

  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(filter).connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + dur + 0.01);
};

/** 4. Sci-Fi Crystal Reveal (High Glassy Sparkle) */
export const playReveal = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;

  [1046.5, 1318.5, 1567.98].forEach((freq, i) => { // C6, E6, G6
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';

    osc.frequency.setValueAtTime(freq, now + i * 0.025);

    gain.gain.setValueAtTime(0, now + i * 0.025);
    gain.gain.linearRampToValueAtTime(0.03, now + i * 0.025 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.025 + 0.12);

    osc.connect(gain).connect(c.destination);
    osc.start(now + i * 0.025);
    osc.stop(now + i * 0.025 + 0.13);
  });
};

/** 5. Retro Neon Arpeggio Chime (Success / Unlock / Toggle) */
export const playChime = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';

    const startTime = now + i * 0.045;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

    osc.connect(gain).connect(c.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.2);
  });
};

/** 6. Cyberpunk Digital Corruption Glitch */
export const playGlitch = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;
  const duration = 0.22;

  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);

  // Bit-crushed stuttering noise
  for (let i = 0; i < bufferSize; i++) {
    const step = Math.floor(i / 120);
    data[i] = (step % 2 === 0 ? 0.8 : -0.8) * Math.random();
  }

  const src = c.createBufferSource();
  src.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2400, now);
  filter.frequency.exponentialRampToValueAtTime(400, now + duration);
  filter.Q.value = 4;

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  src.connect(filter).connect(gain).connect(c.destination);
  src.start(now);
};

/** 7. Typewriter Key Click for AI Bot */
export const playTypewriter = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;

  const pitchShift = (Math.random() - 0.5) * 200; // Natural variation per keypress
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(1400 + pitchShift, now);
  osc.frequency.exponentialRampToValueAtTime(300, now + 0.015);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

  osc.connect(gain).connect(c.destination);
  osc.start(now);
  osc.stop(now + 0.018);
};

/** 8. Sci-Fi Pneumatic Air Release / Secret Door Flip (FIIISSSS-SWOOSH) */
export const playFissh = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const now = c.currentTime;
  const duration = 0.38;

  // White noise for the air release "ssssss"
  const bufferSize = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const fadeOut = Math.pow(1 - i / bufferSize, 1.4);
    data[i] = (Math.random() * 2 - 1) * fadeOut;
  }
  const noise = c.createBufferSource();
  noise.buffer = buffer;

  // Bandpass sweep: opens wide and sweeps from 4800Hz down to 800Hz
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(4800, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + duration);
  filter.Q.setValueAtTime(3.5, now);
  filter.Q.exponentialRampToValueAtTime(1.2, now + duration);

  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0, now);
  noiseGain.gain.linearRampToValueAtTime(0.14, now + 0.03);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter).connect(noiseGain).connect(c.destination);

  // Sub-bass air pressure WHOOSH underneath
  const osc = c.createOscillator();
  const oscGain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(50, now + duration);

  oscGain.gain.setValueAtTime(0.09, now);
  oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(oscGain).connect(c.destination);

  noise.start(now);
  osc.start(now);
  osc.stop(now + duration + 0.02);
};

/** 9. Inkjet Printer Feed — real sample, lazy-loaded on first use */
let printAudio: HTMLAudioElement | null = null;
export const playPrint = (): void => {
  if (isSoundMuted()) return;
  if (!printAudio) {
    printAudio = new Audio('/sounds/printer.mp3');
    printAudio.volume = 0.55;
  }
  printAudio.currentTime = 0;
  void printAudio.play().catch(() => {});
};

export const stopPrint = (): void => {
  printAudio?.pause();
};

/** Scroll reveal hook */
export const useEnterSound = (ref: RefObject<HTMLElement | null>, enabled: boolean): void => {
  const played = useRef(false);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          playReveal();
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, ref]);
};
