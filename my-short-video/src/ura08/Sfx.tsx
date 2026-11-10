import type { Cue } from "../common/Sfx";

/**
 * Sound cues for ura-08 (files from scripts/generate_sfx_ura08.py). Frames
 * match the footage cuts in script.ts. md: no BGM, nothing flashy, never silent.
 */
export const CUES: Cue[] = [
  // Scene 1: writing in the record, then the pen stops and the eyes go
  // sideways to the reference notebook.
  { from: 0, file: "pen-write.wav", volume: 0.5 },
  { from: 58, file: "pen-lift.wav", volume: 0.3 },
  { from: 62, file: "turn-rustle.wav", volume: 0.35 },
  // Scene 2: copying the model phrasing, careful strokes with glances.
  { from: 108, file: "pen-copy.wav", volume: 0.55 },
  // Scene 3: the last few strokes, then the pen lifts and stays up.
  { from: 228, file: "pen-copy-short.wav", volume: 0.5 },
  { from: 244, file: "pen-lift.wav", volume: 0.45 }, // source 17.95s
  // Pausing over the blank line: room only, plus a faint low weight under
  // 「同じじゃない」.
  { from: 300, file: "realization.wav", volume: 0.45 },
];
