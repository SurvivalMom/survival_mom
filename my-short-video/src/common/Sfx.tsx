import React from "react";
import { Audio, Sequence, interpolate, staticFile } from "remotion";

/** One sound effect: starts at output frame `from`. */
export type Cue = { from: number; file: string; volume: number };

/**
 * Room tone under the whole clip (slightly closer once the mood warms at
 * `turnFrame`) plus frame-placed effects. Files live in public/sfx/<dir>/.
 */
export const Sfx: React.FC<{ dir: string; cues: Cue[]; turnFrame: number }> = ({
  dir,
  cues,
  turnFrame,
}) => (
  <>
    <Audio
      src={staticFile(`sfx/${dir}/room-tone.wav`)}
      volume={(f) =>
        interpolate(f, [0, turnFrame, turnFrame + 100], [0.22, 0.22, 0.3], {
          extrapolateRight: "clamp",
        })
      }
    />
    {cues.map((c) => (
      <Sequence key={`${c.file}-${c.from}`} from={c.from} layout="none">
        <Audio src={staticFile(`sfx/${dir}/${c.file}`)} volume={c.volume} />
      </Sequence>
    ))}
  </>
);
