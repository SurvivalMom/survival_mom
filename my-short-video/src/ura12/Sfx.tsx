import type { Cue } from "../common/Sfx";

/**
 * Sound cues for ura-12 (files from scripts/generate_sfx_ura12.py). Frames
 * match the footage cuts in script.ts. md: no BGM, nothing flashy, never
 * silent.
 */
export const CUES: Cue[] = [
  // Scene 1: thumb on the memo pad, then the first page turned.
  { from: 6, file: "paper-touch.wav", volume: 0.35 },
  { from: 85, file: "page-flip.wav", volume: 0.55 },
  // Scene 2: flipping back through revisions, stopping on the messiest page
  // with a faint low weight.
  { from: 146, file: "page-flip.wav", volume: 0.5 },
  { from: 191, file: "page-flip.wav", volume: 0.5 },
  { from: 204, file: "low-weight.wav", volume: 0.4 },
  // Scene 3: the printed card slides in, is set down, the palm rests on it.
  { from: 256, file: "card-slide.wav", volume: 0.4 },
  { from: 298, file: "card-down.wav", volume: 0.45 },
  { from: 322, file: "palm-rest.wav", volume: 0.4 },
];
