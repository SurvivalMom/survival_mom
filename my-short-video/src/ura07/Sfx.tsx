import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";

/**
 * Sound for ura-07. Files are synthesized by scripts/generate_sfx_ura07.py.
 * Frames match the pen timing in DeskScene.tsx. Per the md: no BGM, nothing
 * flashy, but never fully silent.
 */
type Cue = { from: number; file: string; volume: number };

const CUES: Cue[] = [
  // Scene 1: writing 「0:20 トイレ誘導。」, then the hard, clipped entry.
  { from: 0, file: "pen-scratch.wav", volume: 0.55 },
  { from: 50, file: "pen-lift.wav", volume: 0.25 },
  { from: 58, file: "pen-scratch-hard.wav", volume: 0.8 },
  // Scene 2: the pen lifts. Re-reading is left quiet on purpose (room tone
  // only), with a faint low weight under 「刺々しいことに気づいた。」.
  { from: 115, file: "pen-lift.wav", volume: 0.45 },
  { from: 170, file: "realization.wav", volume: 0.5 },
  // Scene 3: the pen set down gently, then the sleeve brushing away.
  { from: 333, file: "pen-down.wav", volume: 0.55 },
  { from: 342, file: "rustle.wav", volume: 0.35 },
];

export const Sfx: React.FC = () => (
  <>
    <Audio
      src={staticFile("sfx/ura07/room-tone.wav")}
      // Slightly closer/warmer once the light warms in Scene 3.
      volume={(f) => interpolate(f, [0, 243, 330], [0.22, 0.22, 0.3], { extrapolateRight: "clamp" })}
    />
    {CUES.map((c) => (
      <Sequence key={`${c.file}-${c.from}`} from={c.from} layout="none">
        <Audio src={staticFile(`sfx/ura07/${c.file}`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
