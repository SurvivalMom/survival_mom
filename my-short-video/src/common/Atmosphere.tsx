import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/**
 * Night-shift desk at night, under a lamp.
 * - Starts cold and heavy (navy / bruised purple), with a small,
 *   unsteady lamp glow to read as irritation.
 * - From the turn of the monologue (turnFrame), the glow widens and
 *   warms to amber, so the picture itself moves from "neglect" to "care".
 */
export const Background: React.FC<{ turnFrame: number }> = ({ turnFrame }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const warm = interpolate(frame, [turnFrame - 30, turnFrame + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const top = interpolateColors(warm, [0, 1], ["#070a18", "#120c1c"]);
  const mid = interpolateColors(warm, [0, 1], ["#1a1433", "#3a2230"]);
  const bottom = interpolateColors(warm, [0, 1], ["#2a0f22", "#5a3322"]);

  // Slow drift of the whole gradient angle, so the frame never sits still.
  const angle = interpolate(frame, [0, durationInFrames], [168, 192]);

  // Lamp glow: flickers slightly while tense, then breathes slowly.
  const flicker = (random(`flicker-${Math.floor(frame / 3)}`) - 0.5) * 0.08 * (1 - warm);
  const breathe = Math.sin(frame / 22) * 0.05;
  const glowOpacity = interpolate(warm, [0, 1], [0.38, 0.72]) + flicker + breathe;
  const glowSize = interpolate(warm, [0, 1], [42, 70]);
  const glowX = 30 + Math.sin(frame / 90) * 4;
  const glowY = 74 - Math.cos(frame / 110) * 3;
  const glowColor = interpolateColors(warm, [0, 1], ["#ff8a3d", "#ffc27a"]);

  // A cold red-violet haze at the top while tense (unease), fading out.
  const hazeOpacity = interpolate(warm, [0, 1], [0.35, 0.05]);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${top} 0%, ${mid} 52%, ${bottom} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 90% 45% at 70% 12%, rgba(150,40,90,${hazeOpacity}) 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle ${glowSize}vh at ${glowX}% ${glowY}%, ${glowColor} 0%, transparent 70%)`,
          opacity: Math.max(0, glowOpacity),
          mixBlendMode: "screen",
        }}
      />
      <Dust frame={frame} width={width} height={height} warm={warm} />
      {/* Vignette keeps the eye on the center telop. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 40%, rgba(0,0,0,0.72) 100%)",
        }}
      />
      <Grain frame={frame} />
    </AbsoluteFill>
  );
};

/**
 * Atmosphere only (dust, vignette, grain), with no base gradient, for
 * laying over the illustrated DeskScene.
 */
export const Atmosphere: React.FC<{ turnFrame: number; scrim?: number }> = ({
  turnFrame,
  scrim = 0.55,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const warm = interpolate(frame, [turnFrame - 30, turnFrame + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Dust frame={frame} width={width} height={height} warm={warm} />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 50%, transparent 45%, rgba(0,0,0,0.6) 100%)",
        }}
      />
      {/* Soft dark band behind the center telop, so it reads over the page. */}
      <AbsoluteFill
        style={{
          background:
            `radial-gradient(ellipse 70% 14% at 50% 44%, rgba(10,6,12,${scrim}) 0%, transparent 100%)`,
        }}
      />
      <Grain frame={frame} />
    </AbsoluteFill>
  );
};

/** Dust floating in the lamp light. Fixed seeds, so every render is the same. */
const Dust: React.FC<{ frame: number; width: number; height: number; warm: number }> = ({
  frame,
  width,
  height,
  warm,
}) => {
  const count = 26;
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x0 = random(`dx-${i}`) * width;
        const y0 = random(`dy-${i}`) * height;
        const speed = 0.25 + random(`ds-${i}`) * 0.6;
        const size = 3 + random(`dz-${i}`) * 7;
        const y = (((y0 - frame * speed) % height) + height) % height;
        const x = x0 + Math.sin(frame / 40 + i) * 18;
        const twinkle = 0.25 + 0.5 * Math.abs(Math.sin(frame / 30 + i * 1.7));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "#ffe2b8",
              opacity: twinkle * (0.35 + warm * 0.45),
              filter: "blur(1.5px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Light film grain to keep the dark gradient from banding. */
const Grain: React.FC<{ frame: number }> = ({ frame }) => {
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay" }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};
