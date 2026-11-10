import type { Cue } from "../common/Sfx";

/**
 * Sound cues for ura-09 (files from scripts/generate_sfx_ura09.py). Frames
 * match the footage cuts in script.ts. md: no BGM, nothing flashy, never
 * silent; Scene 2 asks for the chair to creak slightly.
 */
export const CUES: Cue[] = [
  // Scene 1: writing, then the pen stops mid-sentence (src 7.4 = out 60).
  { from: 0, file: "pen-write.wav", volume: 0.5 },
  { from: 60, file: "pen-lift.wav", volume: 0.3 },
  // Scene 2: pen set down on the clipboard, then getting up from the chair.
  { from: 120, file: "pen-down.wav", volume: 0.5 },
  { from: 140, file: "chair-rise.wav", volume: 0.5 },
  { from: 146, file: "rustle.wav", volume: 0.3 },
  // Scene 3: sitting back down, picking up the pen, writing in own words.
  { from: 225, file: "chair-sit.wav", volume: 0.5 },
  { from: 267, file: "pen-pickup.wav", volume: 0.4 },
  { from: 282, file: "pen-own-words.wav", volume: 0.5 },
];
