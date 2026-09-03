import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../lib/motion';
import { playOpen, playClose, playReveal, playTypewriter, isSoundMuted } from '../lib/sound';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

const WELCOME = 'Hallo! Ich bin Adnans Bot. Frag mich nach Preis, Standort oder Kontakt.';
const FALLBACK = 'Auf diese Frage bin ich noch nicht vorbereitet — schreib Adnan direkt: adnan.aydin@bluewin.ch';

/** German AI Voice Speech Synthesis */
const speakGermanAI = (text: string) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || isSoundMuted()) return;
  try {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/adnan\.aydin@bluewin\.ch/g, 'Adnan Aydin bluewin.ch');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.volume = 0.15; // Ultra soft & quiet volume (15%)
    utterance.pitch = 0.9;   // Lower, calm tone
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const deVoice = voices.find((v) => v.lang.startsWith('de'));
    if (deVoice) utterance.voice = deVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    // Ignore SpeechSynthesis errors if unsupported
  }
};

/* Feste Stichwort-Antworten statt echter KI — der Bot tut nur so.
   Reihenfolge zaehlt: die engeren Themen (Preis/Kontakt/Standort)
   vor der breiten Begruessung, sonst faengt "hallo, was kostet das"
   die Begruessung statt der Preisfrage ab. */
const RULES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['preis', 'kosten', 'kostet', 'wieviel', 'wie viel', 'budget', 'angebot', 'fiyat'],
    reply: 'Schreib am besten eine E-Mail mit allen Details zu deinem Projekt — dann bekommst du ein passendes Angebot: adnan.aydin@bluewin.ch',
  },
  {
    keywords: ['kontakt', 'email', 'e-mail', 'mail', 'telefon', 'erreichen', 'iletişim', 'iletisim'],
    reply: 'Am schnellsten per E-Mail: adnan.aydin@bluewin.ch — oder über das Kontaktformular weiter unten auf der Seite.',
  },
  {
    keywords: ['wo', 'standort', 'sitz', 'zürich', 'zurich', 'nerede', 'nerdesin'],
    reply: 'Adnan sitzt in Zürich, Schweiz — Projekte laufen aber remote, überall möglich.',
  },
  {
    keywords: ['wie geht', 'wie gehts', "wie geht's", 'nasılsın', 'nasilsin'],
    reply: "Mir geht's gut, danke der Nachfrage! Und dir?",
  },
  {
    keywords: ['hallo', 'hi', 'hey', 'servus', 'grüezi', 'gruezi', 'moin', 'guten tag', 'merhaba'],
    reply: 'Hallo! Wie kann ich helfen? Frag mich nach Preis, Standort oder Kontakt.',
  },
];

const matchReply = (input: string): string => {
  const text = input.toLowerCase();
  const rule = RULES.find((r) => r.keywords.some((kw) => text.includes(kw)));
  return rule ? rule.reply : FALLBACK;
};

/** Tippt Text zeichenweise ein statt ihn sofort anzuzeigen — bei
 *  reduzierter Bewegung steht er sofort da. */
const Typewriter: React.FC<{ text: string; reducedMotion: boolean; onDone?: () => void }> = ({
  text,
  reducedMotion,
  onDone,
}) => {
  const [shown, setShown] = useState(reducedMotion ? text.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      onDone?.();
      return;
    }
    if (shown >= text.length) {
      onDone?.();
      return;
    }
    if (shown % 2 === 0) playTypewriter();
    const t = window.setTimeout(() => setShown((n) => n + 1), 22);
    return () => window.clearTimeout(t);
  }, [shown, text, reducedMotion, onDone]);

  return <>{text.slice(0, shown)}</>;
};

/** Tut nur so, als waere es KI — feste Stichwort-Antworten mit
 *  Tipp-Animation. Rechts unten, oberhalb des Scroll-to-Top-Rings,
 *  damit sich beide nicht ueberlappen. */
export const AiBotBubble: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    (next ? playOpen : playClose)();
    if (next) {
      if (messages.length === 0) {
        setMessages([{ role: 'bot', text: WELCOME }]);
        setTypingIndex(0);
      }
      speakGermanAI(WELCOME);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typingIndex]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const reply = matchReply(text);
    setMessages((prev) => [...prev, { role: 'user', text }, { role: 'bot', text: reply }]);
    setTypingIndex(messages.length + 1);
    setInput('');
    playReveal();
    speakGermanAI(reply);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={open ? 'Chat schliessen' : 'Chat mit Adnans Bot öffnen'}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reducedMotion ? 0 : 0.3 }}
        className="fixed bottom-24 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#FF5A1F] bg-[#0A0A0A] shadow-[0_0_20px_rgba(255,90,31,0.25)]"
      >
        <span className="font-mono-ui text-[13px] font-bold text-[#FF5A1F]">
          {open ? '×' : 'AI'}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-[9.5rem] right-6 z-30 flex w-[min(320px,calc(100vw-3rem))] flex-col overflow-hidden rounded-2xl border border-[#FF5A1F]/40 bg-[#0A0A0A] shadow-2xl"
          >
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-[#FF5A1F]" />
              <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-white/70">
                Adnans Bot
              </span>
            </div>

            <div ref={listRef} className="flex max-h-72 flex-col gap-2 overflow-y-auto px-4 py-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`font-sans-ui max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                    m.role === 'bot'
                      ? 'self-start border border-[#FF5A1F]/30 bg-black text-white/90'
                      : 'self-end bg-white/10 text-white'
                  }`}
                >
                  {m.role === 'bot' && i === typingIndex ? (
                    <Typewriter
                      text={m.text}
                      reducedMotion={reducedMotion}
                      onDone={() => setTypingIndex(null)}
                    />
                  ) : (
                    m.text
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Frag etwas…"
                className="font-sans-ui flex-1 rounded-lg bg-white/5 px-3 py-2 text-[11px] text-white placeholder:text-white/30 outline-none focus:bg-white/10"
              />
              <button
                type="button"
                onClick={send}
                aria-label="Senden"
                className="font-mono-ui rounded-lg border border-[#FF5A1F]/50 px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-[#FF5A1F] transition-colors hover:bg-[#FF5A1F]/10"
              >
                Los
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
