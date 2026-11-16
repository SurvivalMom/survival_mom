import type { Cue } from "../common/Sfx";

/**
 * Sound cues for ura-11 (files from scripts/generate_sfx_ura11.py). Frames
 * match the footage cuts in script.ts. md: no BGM, nothing flashy, never
 * silent. The reveal gets one soft, warm swell -- the series' only warm turn.
 */
export const CUES: Cue[] = [
  // Scene 1: the memo held up, a small paper flutter, then stillness.
  { from: 4, file: "memo-flutter.wav", volume: 0.35 },
  // Scene 2: memo laid on the binder, pen picked up, writing slowly at first.
  { from: 144, file: "memo-down.wav", volume: 0.45 },
  { from: 162, file: "pen-pickup.wav", volume: 0.35 },
  { from: 186, file: "pen-slow.wav", volume: 0.5 },
  // Scene 3: the circle mark is revealed.
  { from: 268, file: "warm-swell.wav", volume: 0.35 },
];
