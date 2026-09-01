import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Kein Audio-Asset: jeder Ton wird per WebAudio synthetisiert,
 * ein paar Zeilen statt einer MP3-Datei im Performance-Budget.
 * Standardmaessig stumm (Autoplay-Policy sperrt Ton vor der ersten
 * Geste ohnehin, und ungefragter Sound auf einer Portfolio-Seite
 * nervt) — der Schalter im Header schaltet frei.
 */

const MUTE_KEY = 'ado:sound-muted';
export const SOUND_MUTE_EVENT = 'ado:sound-mute-change';

let ctx: AudioContext | null = null;
const getCtx = (): AudioContext => {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

export const isSoundMuted = (): boolean =>
  typeof window !== 'undefined' && localStorage.getItem(MUTE_KEY) !== 'off';

export const toggleSound = (): void => {
  const next = !isSoundMuted();
  localStorage.setItem(MUTE_KEY, next ? 'on' : 'off');
  window.dispatchEvent(new CustomEvent(SOUND_MUTE_EVENT));
  if (!next) playChime();
};

/** Ein Oszillator, kurze Attack-Decay-Huelle — der "Klick". */
const blip = (freqFrom: number, freqTo: number, duration: number, gainPeak = 0.06) => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freqFrom, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqTo, 1), c.currentTime + duration);
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(gainPeak, c.currentTime + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  osc.connect(gain).connect(c.destination);
  osc.start();
  osc.stop(c.currentTime + duration + 0.02);
};

export const playOpen = (): void => blip(420, 900, 0.09);
export const playClose = (): void => blip(500, 220, 0.08);
export const playReveal = (): void => blip(600, 760, 0.05, 0.035);

export const playChime = (): void => {
  if (isSoundMuted()) return;
  blip(520, 900, 0.09, 0.05);
  window.setTimeout(() => blip(780, 1200, 0.1, 0.05), 70);
};

/** Kurzer Rauschstoss statt Sinuston — passt zum Matrix-Glitch. */
export const playGlitch = (): void => {
  if (isSoundMuted()) return;
  const c = getCtx();
  const duration = 0.18;
  const buffer = c.createBuffer(1, c.sampleRate * duration, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1400;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.05, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
  src.connect(filter).connect(gain).connect(c.destination);
  src.start();
};

/** Loest einmalig einen Ton aus, sobald `ref` erstmals ins Bild
 *  scrollt — fuer die Desktop-Portraits ("Bild kommt rein"). */
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
