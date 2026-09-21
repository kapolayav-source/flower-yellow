// Web Audio API pure synthesizer for a sweet gentle music box / harp chime
// Plays a warm, nostalgic spring melody inspired by acoustic yellow flowers music

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let timeoutIds: number[] = [];

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Pentatonic warm spring chime frequencies (Hz)
const NOTES: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  G5: 783.99,
  A5: 880.0,
  B5: 987.77,
  C6: 1046.5,
};

export function playSinglePluck(freq: number, duration = 1.2, volume = 0.15) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Music box / celesta tone (sine + soft harmonic overtones)
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration);
}

// Gentle acoustic spring tune pattern: [Note, delaySeconds, duration]
const MELODY: [string, number, number][] = [
  ['E5', 0.0, 1.4],
  ['G5', 0.4, 1.4],
  ['A5', 0.8, 1.6],
  ['G5', 1.2, 1.2],
  ['E5', 1.6, 1.6],
  ['D5', 2.2, 1.2],
  ['C5', 2.6, 2.0],

  ['E5', 3.4, 1.4],
  ['D5', 3.8, 1.2],
  ['C5', 4.2, 1.4],
  ['D5', 4.6, 1.4],
  ['E5', 5.0, 1.8],
  ['G5', 5.6, 2.2],

  ['A5', 6.4, 1.5],
  ['C6', 6.9, 1.8],
  ['B5', 7.5, 1.5],
  ['A5', 8.0, 1.5],
  ['G5', 8.5, 2.2],

  ['E5', 9.4, 1.4],
  ['G5', 9.8, 1.4],
  ['D5', 10.3, 1.6],
  ['C5', 10.8, 3.0],
];

export function startYellowFlowerMelody(loop = true): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  stopMelody();
  isPlaying = true;

  const playSequence = () => {
    if (!isPlaying) return;

    MELODY.forEach(([note, delay, dur]) => {
      const tId = window.setTimeout(() => {
        if (isPlaying && NOTES[note]) {
          playSinglePluck(NOTES[note], dur, 0.12);
        }
      }, delay * 1000);
      timeoutIds.push(tId);
    });

    if (loop) {
      const loopDuration = 12500; // 12.5 seconds loop
      const loopId = window.setTimeout(() => {
        if (isPlaying) {
          playSequence();
        }
      }, loopDuration);
      timeoutIds.push(loopId);
    }
  };

  playSequence();

  return () => {
    stopMelody();
  };
}

export function stopMelody() {
  isPlaying = false;
  timeoutIds.forEach(id => clearTimeout(id));
  timeoutIds = [];
}
