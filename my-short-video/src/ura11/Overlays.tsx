import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RegionBlur } from "../common/RegionBlur";
import { CUTS } from "./script";
import { NAME_TRACK, SRC_H, SRC_W } from "./nameTrack";

/** Blurs the name written on the memo (tracked in nameTrack.ts). */
export const NameBlur: React.FC = () => <RegionBlur track={NAME_TRACK} cuts={CUTS} />;

const XFADE = 8; // must match common/Footage.tsx

// Answer 「良好予定。」 in the source frame: drifts slightly as the camera
// settles (measured at 19.0s and 24.0s).
const ANSWER_AT = [
  { t: 19.0, x: 376, y: 831 },
  { t: 24.0, x: 392, y: 844 },
];

/** Answer position (source px) at output frame `f` during the reveal cut. */
export const answerAt = (f: number, fps: number) => {
  const reveal = CUTS[CUTS.length - 1];
  const t = reveal.srcSec + (f - reveal.from) / fps;
  const k = (t - ANSWER_AT[0].t) / (ANSWER_AT[1].t - ANSWER_AT[0].t);
  return {
    x: ANSWER_AT[0].x + (ANSWER_AT[1].x - ANSWER_AT[0].x) * k,
    y: ANSWER_AT[0].y + (ANSWER_AT[1].y - ANSWER_AT[0].y) * k,
  };
};

/**
 * The "someone else's hand" sign from md Scene 3: a red-pen circle around the
 * written answer with a small tick, already there when the shot settles
 * (it is revealed, not drawn on). Only during the reveal cut.
 */
export const CheckMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = CUTS[CUTS.length - 1];
  if (frame < reveal.from) return null;
  const { x, y } = answerAt(frame, fps);
  // Fades up with the dissolve into the reveal shot.
  const opacity = interpolate(frame, [reveal.from, reveal.from + XFADE], [0, 1], {
    extrapolateRight: "clamp",
  });
  const w = 150;
  const h = 56;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg
        viewBox={`0 0 ${SRC_W} ${SRC_H}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%", opacity, mixBlendMode: "multiply" }}
      >
        <g transform={`translate(${x} ${y}) rotate(-5)`} fill="none" stroke="#c8312b" strokeLinecap="round" strokeLinejoin="round">
          {/* Loose hand-drawn loop: starts and overshoots, like a real pen. */}
          <path
            d={`M ${-w * 0.42} ${-h * 0.42}
                C ${-w * 0.2} ${-h * 0.62}, ${w * 0.38} ${-h * 0.6}, ${w * 0.5} ${-h * 0.18}
                C ${w * 0.6} ${h * 0.2}, ${w * 0.22} ${h * 0.56}, ${-w * 0.12} ${h * 0.5}
                C ${-w * 0.46} ${h * 0.44}, ${-w * 0.6} ${h * 0.05}, ${-w * 0.47} ${-h * 0.3}
                C ${-w * 0.42} ${-h * 0.42}, ${-w * 0.3} ${-h * 0.55}, ${-w * 0.08} ${-h * 0.6}`}
            strokeWidth={3.2}
            opacity={0.9}
          />
          {/* Small tick just past the loop */}
          <path
            d={`M ${w * 0.56} ${-h * 0.05} L ${w * 0.63} ${h * 0.12} L ${w * 0.8} ${-h * 0.32}`}
            strokeWidth={3.4}
            opacity={0.9}
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
