import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { Cut } from "./Footage";

/** [source seconds, x, y, w, h, angle] in source pixels. */
export type TrackEntry = [number, number, number, number, number, number];

const XFADE = 8; // must match common/Footage.tsx

/** Source seconds shown by each cut that is visible at output frame `f`. */
export const sourceTimesAt = (cuts: Cut[], f: number, fps: number): number[] => {
  const times: number[] = [];
  cuts.forEach((cut, i) => {
    const next = cuts[i + 1];
    const end = next ? next.from + XFADE : Infinity;
    if (f >= cut.from && f < end) {
      times.push(cut.srcSec + ((f - cut.from) / fps) * (cut.rate ?? 1));
    }
  });
  return times;
};

/**
 * Blurs tracked regions (e.g. names written on a memo) in AI footage. Render it
 * as a child of <Footage> so it follows the same push-in. Every entry within
 * half a source frame of the shown time is blurred, so several regions can be
 * covered at once.
 */
export const RegionBlur: React.FC<{
  track: TrackEntry[];
  cuts: Cut[];
  srcW?: number;
  srcH?: number;
  srcFps?: number;
}> = ({ track, cuts, srcW = 720, srcH = 1280, srcFps = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tol = 0.5 / srcFps + 0.001;
  const boxes = sourceTimesAt(cuts, frame, fps).flatMap((t) =>
    track.filter((e) => Math.abs(e[0] - t) <= tol),
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {boxes.map(([t, x, y, w, h, angle], i) => {
        const padX = w * 0.3;
        const padY = h * 0.45;
        return (
          <div
            key={`${t}-${i}`}
            style={{
              position: "absolute",
              left: `${((x - padX) / srcW) * 100}%`,
              top: `${((y - padY) / srcH) * 100}%`,
              width: `${((w + padX * 2) / srcW) * 100}%`,
              height: `${((h + padY * 2) / srcH) * 100}%`,
              transform: `rotate(${-angle}deg)`,
              borderRadius: 12,
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              backgroundColor: "rgba(225,215,195,0.35)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
