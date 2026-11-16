import type { Cue } from "../common/Sfx";

/**
 * Sound cues for ura-10 (files from scripts/generate_sfx_ura10.py). Frames
 * match the footage cuts in script.ts. md: no BGM, nothing flashy, never
 * silent. The safety CTA is left to the room tone so nothing competes with it.
 */
export const CUES: Cue[] = [
  // Scene 1: writing fast, pressing, no time to think.
  { from: 0, file: "pen-fast.wav", volume: 0.6 },
  // Scene 2: pen set down unsteadily (a double knock), the palm comes to
  // rest on the record, a faint low weight under 「分からない」.
  { from: 121, file: "pen-down-unsteady.wav", volume: 0.55 },
  { from: 145, file: "palm-rest.wav", volume: 0.4 },
  { from: 150, file: "low-weight.wav", volume: 0.4 },
  // Scene 3: reaching toward the wall, fingertips on the contact sheet.
  { from: 203, file: "rustle.wav", volume: 0.35 },
  { from: 287, file: "sheet-touch.wav", volume: 0.5 },
];
