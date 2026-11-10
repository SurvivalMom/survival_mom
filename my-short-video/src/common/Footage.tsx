import React from "react";
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
export type Cut = { from: number; srcSec: number; note: string };

const XFADE = 8; // frames of cross-dissolve between cuts

/**
 * AI footage (path relative to public/), cut per `cuts` with short dissolves, then graded:
 * cool and slightly heavy at first (deferring to others), warming once the
 * monologue turns inward (`turnFrame`). Slight push-in for life.
 */
export const Footage: React.FC<{ src: string; cuts: Cut[]; turnFrame: number }> = ({
  src,
  cuts,
  turnFrame,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const warm = interpolate(frame, [turnFrame - 20, turnFrame + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const zoom = interpolate(frame, [0, durationInFrames], [1.02, 1.08]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        {cuts.map((cut, i) => {
          const next = cuts[i + 1];
          const end = next ? next.from + XFADE : durationInFrames;
          const start = Math.max(0, cut.from);
          return (
            <Sequence key={cut.from} from={start} durationInFrames={end - start}>
              <CutLayer src={staticFile(src)} srcSec={cut.srcSec} fadeIn={i > 0} fps={fps} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      {/* Cool, heavy tint at first */}
      <AbsoluteFill
        style={{
          backgroundColor: "#1d2a52",
          mixBlendMode: "multiply",
          opacity: interpolate(warm, [0, 1], [0.42, 0.12]),
        }}
      />
      {/* Warm amber light spreading from the window side */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 85% 10%, #ffb565 0%, rgba(255,160,80,0.4) 40%, transparent 75%)",
          mixBlendMode: "soft-light",
          opacity: interpolate(warm, [0, 1], [0.15, 0.85]) + Math.sin(frame / 24) * 0.04,
        }}
      />
    </AbsoluteFill>
  );
};

const CutLayer: React.FC<{ src: string; srcSec: number; fadeIn: boolean; fps: number }> = ({
  src,
  srcSec,
  fadeIn,
  fps,
}) => {
  const frame = useCurrentFrame();
  const opacity = fadeIn
    ? interpolate(frame, [0, XFADE], [0, 1], { extrapolateRight: "clamp" })
    : 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <OffthreadVideo
        src={src}
        muted
        trimBefore={Math.round(srcSec * fps)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  );
};
