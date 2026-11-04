import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/KleeOne";
import { TURN_FRAME } from "./script";

const { fontFamily: HAND_FONT } = loadFont("normal", { weights: ["600"] });

/**
 * Illustrated stand-in for the md's AI footage (no ura-07 footage exists yet).
 * First-person view looking down at a night-shift desk under a lamp, with the
 * viewer's own hand entering from the bottom. Follows the md scenes:
 *   Scene 1 (0-4s)  the hand writes a short, clipped entry, pressing hard
 *   Scene 2 (4-9s)  the pen lifts and traces back over what was written
 *   Scene 3 (9-15s) the pen is set down gently and the hand withdraws
 * Entries are invented and generic (no names, no identifiable patient info).
 */

// Notebook placement (frame coordinates).
const NB_X = 560;
const NB_Y = 1180;
const NB_ROT = -4;
// Ruled lines, in notebook coordinates.
const LINE_X = -370;
// Entries start low on the page so the center telop sits over blank paper.
const LINE_Y0 = -60;
const LINE_GAP = 100;
const FONT_SIZE = 50;

const ENTRIES = [
  "11/4 夜勤",
  "22:00 巡視。入眠中。",
  "23:10 水分補給。",
  "0:20 トイレ誘導。", // written in Scene 1
  "動作遅い。時間かかる。", // the clipped, harsh entry
];
const L3 = 3;
const L4 = 4;

// Approximate advance: full-width glyphs 1em, ASCII ~0.58em.
const textWidth = (s: string) =>
  [...s].reduce((w, c) => w + (c.charCodeAt(0) < 128 ? 0.58 : 1), 0) * FONT_SIZE;

const lineY = (i: number) => LINE_Y0 + i * LINE_GAP;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);

type Pose = { x: number; y: number; lift: number; angle: number };

const W3 = textWidth(ENTRIES[L3]);
const W4 = textWidth(ENTRIES[L4]);
const SET_DOWN: Pose = { x: 80, y: 470, lift: 0, angle: 14 };
const PEN_ANGLE = 58;

/** Where the pen tip is (notebook coords) at a given frame. */
const penPose = (f: number): Pose => {
  const writeY = (i: number) => lineY(i) - 8;
  if (f < 50) {
    const p = interpolate(f, [0, 50], [0, 1], clamp);
    return { x: LINE_X + W3 * p, y: writeY(L3) + Math.sin(f * 1.9) * 3, lift: 0, angle: PEN_ANGLE };
  }
  if (f < 58) {
    const t = interpolate(f, [50, 58], [0, 1], { ...clamp, easing: ease });
    return {
      x: interpolate(t, [0, 1], [LINE_X + W3, LINE_X]),
      y: interpolate(t, [0, 1], [writeY(L3), writeY(L4)]),
      lift: Math.sin(t * Math.PI) * 0.7,
      angle: PEN_ANGLE,
    };
  }
  if (f < 115) {
    const p = interpolate(f, [58, 115], [0, 1], clamp);
    // Pressing harder: a rougher, faster wobble.
    return { x: LINE_X + W4 * p, y: writeY(L4) + Math.sin(f * 2.7) * 5, lift: 0, angle: PEN_ANGLE };
  }
  if (f < 130) {
    const t = interpolate(f, [115, 130], [0, 1], { ...clamp, easing: ease });
    return { x: LINE_X + W4, y: writeY(L4) - t * 10, lift: t, angle: PEN_ANGLE };
  }
  if (f < 160) {
    const t = interpolate(f, [130, 160], [0, 1], { ...clamp, easing: ease });
    return { x: LINE_X + W4 * (1 - t), y: writeY(L4) - 10, lift: 1, angle: PEN_ANGLE };
  }
  if (f < 250) {
    // Re-reading: tip hovers just above the ink, tracing slowly.
    const t = interpolate(f, [160, 250], [0, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
    return { x: LINE_X + W4 * t, y: writeY(L4) - 6, lift: 0.55, angle: PEN_ANGLE };
  }
  if (f < 275) {
    return { x: LINE_X + W4, y: writeY(L4) - 6, lift: 0.55, angle: PEN_ANGLE };
  }
  const t = interpolate(f, [275, 335], [0, 1], { ...clamp, easing: ease });
  return {
    x: interpolate(t, [0, 1], [LINE_X + W4, SET_DOWN.x]),
    y: interpolate(t, [0, 1], [writeY(L4) - 6, SET_DOWN.y]),
    lift: interpolate(t, [0, 0.5, 1], [0.55, 1, 0]),
    angle: interpolate(t, [0, 1], [PEN_ANGLE, SET_DOWN.angle]),
  };
};

export const DeskScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const warm = interpolate(frame, [TURN_FRAME - 30, TURN_FRAME + 90], [0, 1], clamp);
  const pose = penPose(frame);

  // Slow cinematic push-in.
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.07]);

  // Ink reveal for the two lines written on screen.
  const reveal3 = W3 * interpolate(frame, [0, 50], [0, 1], clamp);
  const reveal4 = W4 * interpolate(frame, [58, 115], [0, 1], clamp);

  // While the "刺々しい" card is up, the harsh entry glows a little red.
  const harsh = interpolate(frame, [170, 190, 250, 290], [0, 1, 1, 0.25], clamp);
  const harshInk = interpolateColors(harsh, [0, 1], ["#2a2733", "#8a1f1f"]);

  // Hand withdraws after the pen is set down.
  const withdraw = interpolate(frame, [340, 420], [0, 1], {
    ...clamp,
    easing: Easing.in(Easing.cubic),
  });
  const penSetDown = frame >= 335;

  return (
    <AbsoluteFill style={{ backgroundColor: "#140d0a" }}>
      <svg
        width="1080"
        height="1920"
        viewBox="0 0 1080 1920"
        style={{ transform: `scale(${zoom})`, transformOrigin: "50% 62%" }}
      >
        <defs>
          <linearGradient id="desk" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3a2619" />
            <stop offset="1" stopColor="#1f140d" />
          </linearGradient>
          <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3ead6" />
            <stop offset="1" stopColor="#e2d6bd" />
          </linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f0c6a3" />
            <stop offset="1" stopColor="#c98f6c" />
          </linearGradient>
          <linearGradient id="sleeve" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4a6a86" />
            <stop offset="1" stopColor="#2a3f55" />
          </linearGradient>
          <linearGradient id="pen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b4f78" />
            <stop offset="0.45" stopColor="#1c2742" />
            <stop offset="1" stopColor="#0e1424" />
          </linearGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id="ink">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={1} seed={3} />
            <feDisplacementMap in="SourceGraphic" scale="2.2" />
          </filter>
          <clipPath id="clip3">
            <rect x={LINE_X} y={lineY(L3) - 60} width={reveal3 + 2} height={80} />
          </clipPath>
          <clipPath id="clip4">
            <rect x={LINE_X} y={lineY(L4) - 60} width={reveal4 + 2} height={80} />
          </clipPath>
        </defs>

        {/* Desk with wood grain */}
        <rect width="1080" height="1920" fill="url(#desk)" />
        {new Array(22).fill(0).map((_, i) => {
          const y = i * 92 + random(`g${i}`) * 40;
          return (
            <path
              key={i}
              d={`M -20 ${y} C 300 ${y + 18}, 700 ${y - 22}, 1100 ${y + 8}`}
              stroke="#120a06"
              strokeOpacity={0.25 + random(`go${i}`) * 0.2}
              strokeWidth={2 + random(`gw${i}`) * 3}
              fill="none"
            />
          );
        })}

        {/* A mug at the top edge, just out of focus */}
        <g opacity={0.8} filter="url(#soft)">
          <circle cx={150} cy={250} r={120} fill="#5b4a43" />
          <circle cx={150} cy={250} r={92} fill="#24160f" />
        </g>

        <g transform={`translate(${NB_X} ${NB_Y}) rotate(${NB_ROT})`}>
          {/* Notebook shadow + pages */}
          <rect x={-450} y={-610} width={920} height={1300} rx={18} fill="#000" opacity={0.55} filter="url(#soft)" />
          <rect x={-440} y={-640} width={880} height={1300} rx={14} fill="url(#paper)" />
          <rect x={-440} y={-640} width={880} height={96} rx={14} fill="#c7b9a0" />
          <text x={-380} y={-578} fontFamily={HAND_FONT} fontWeight={600} fontSize={40} fill="#5d5245">
            申し送りノート
          </text>
          {new Array(12).fill(0).map((_, i) => (
            <line
              key={i}
              x1={-410}
              x2={410}
              y1={-442 + i * LINE_GAP}
              y2={-442 + i * LINE_GAP}
              stroke="#9fb4c8"
              strokeWidth={2}
              opacity={0.7}
            />
          ))}
          <line x1={-390} x2={-390} y1={-544} y2={660} stroke="#d58f8f" strokeWidth={2} opacity={0.6} />

          {/* Entries already written before the clip starts */}
          {ENTRIES.slice(0, L3).map((t, i) => (
            <text key={i} x={LINE_X} y={lineY(i)} fontFamily={HAND_FONT} fontWeight={600} fontSize={FONT_SIZE} fill="#3a3a52" filter="url(#ink)">
              {t}
            </text>
          ))}
          {/* Written on screen */}
          <text x={LINE_X} y={lineY(L3)} fontFamily={HAND_FONT} fontWeight={600} fontSize={FONT_SIZE} fill="#2a2733" clipPath="url(#clip3)" filter="url(#ink)">
            {ENTRIES[L3]}
          </text>
          <g clipPath="url(#clip4)" filter="url(#ink)">
            {/* Pressed hard: thicker, slightly uneven strokes */}
            <text
              x={LINE_X}
              y={lineY(L4)}
              fontFamily={HAND_FONT}
              fontWeight={600}
              fontSize={FONT_SIZE + 2}
              fill={harshInk}
              stroke={harshInk}
              strokeWidth={2.4}
              transform={`rotate(-1.2 ${LINE_X} ${lineY(L4)})`}
            >
              {ENTRIES[L4]}
            </text>
          </g>

          {penSetDown ? <Pen pose={SET_DOWN} /> : null}
          <Hand pose={pose} withdraw={withdraw} holdingPen={!penSetDown} />
        </g>

        {/* Lamp light from the top left; widens and warms at the turn */}
        <Lamp frame={frame} warm={warm} />
      </svg>
    </AbsoluteFill>
  );
};

const Pen: React.FC<{ pose: Pose; liftShadow?: number }> = ({ pose, liftShadow = 0 }) => (
  <>
    <g transform={`translate(${pose.x + 10 + liftShadow * 26} ${pose.y + 14 + liftShadow * 34}) rotate(${pose.angle})`} opacity={0.5 - liftShadow * 0.2}>
      <rect x={0} y={-12} width={430} height={24} rx={12} fill="#000" filter="url(#soft)" />
    </g>
    <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.angle})`}>
      <path d="M 0 0 L 38 -9 L 38 9 Z" fill="#c9c3b8" />
      <path d="M 0 0 L 10 -2.5 L 10 2.5 Z" fill="#1a1a1a" />
      <rect x={38} y={-12} width={392} height={24} rx={11} fill="url(#pen)" />
      <rect x={300} y={-16} width={14} height={32} rx={4} fill="#b8a77a" />
      <rect x={60} y={-8} width={220} height={3} rx={1.5} fill="#ffffff" opacity={0.18} />
    </g>
  </>
);

const Hand: React.FC<{ pose: Pose; withdraw: number; holdingPen: boolean }> = ({
  pose,
  withdraw,
  holdingPen,
}) => {
  // The viewer's own right hand, coming in from the bottom right.
  const lift = pose.lift;
  const scale = 1 + lift * 0.04;
  const dx = withdraw * 520;
  const dy = withdraw * 900;
  const handX = holdingPen ? pose.x : SET_DOWN.x + 30;
  const handY = (holdingPen ? pose.y : SET_DOWN.y + 20) - lift * 10;
  return (
    <>
      {/* Hand + arm shadow on the page/desk */}
      <g transform={`translate(${handX + dx + 30 + lift * 30} ${handY + dy + 40 + lift * 40}) rotate(${PEN_ANGLE})`} opacity={0.45 - lift * 0.12}>
        <rect x={110} y={-90} width={1100} height={230} rx={110} fill="#000" filter="url(#soft)" />
      </g>
      {holdingPen ? <Pen pose={{ ...pose, x: pose.x + dx, y: pose.y + dy - lift * 10 }} liftShadow={lift} /> : null}
      <g transform={`translate(${handX + dx} ${handY + dy}) rotate(${PEN_ANGLE}) scale(${scale})`}>
        {/* Sleeve (care uniform) */}
        <rect x={330} y={-120} width={900} height={250} rx={60} fill="url(#sleeve)" />
        <rect x={330} y={-120} width={40} height={250} rx={14} fill="#2a3f55" />
        {/* Back of hand / palm */}
        <path
          d="M 120 -40 C 160 -110, 300 -130, 360 -90 L 360 110 C 290 140, 180 120, 130 70 C 100 40, 100 0, 120 -40 Z"
          fill="url(#skin)"
        />
        {/* Curled middle/ring fingers under the pen */}
        <path d="M 120 40 C 140 80, 200 96, 250 80 C 220 70, 170 56, 140 26 Z" fill="#c4886a" />
        {/* Index finger along the pen */}
        <path d="M 70 -16 C 100 -34, 170 -44, 220 -36 L 228 -6 C 170 -6, 110 0, 76 6 Z" fill="url(#skin)" />
        <ellipse cx={74} cy={-6} rx={14} ry={11} fill="#e8b896" />
        <ellipse cx={70} cy={-9} rx={6} ry={4} fill="#f6dcc6" opacity={0.8} />
        {/* Thumb */}
        <path d="M 92 22 C 120 30, 190 44, 240 30 L 236 56 C 180 66, 120 54, 88 38 Z" fill="#dca582" />
      </g>
    </>
  );
};

const Lamp: React.FC<{ frame: number; warm: number }> = ({ frame, warm }) => {
  const flicker = (random(`lf-${Math.floor(frame / 3)}`) - 0.5) * 0.08 * (1 - warm);
  const breathe = Math.sin(frame / 22) * 0.04;
  const strength = interpolate(warm, [0, 1], [0.5, 0.85]) + flicker + breathe;
  const radius = interpolate(warm, [0, 1], [900, 1350]);
  const color = interpolateColors(warm, [0, 1], ["#ff9a4a", "#ffc888"]);
  const shadow = interpolate(warm, [0, 1], [0.82, 0.55]);
  const coldTint = interpolate(warm, [0, 1], [0.35, 0]);
  return (
    <>
      <defs>
        <radialGradient id="dark" cx="0.22" cy="0.12" r="1.05">
          <stop offset="0" stopColor="#000" stopOpacity={0} />
          <stop offset="0.45" stopColor="#000" stopOpacity={shadow * 0.55} />
          <stop offset="1" stopColor="#000" stopOpacity={shadow} />
        </radialGradient>
        <radialGradient id="lamp" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(200 180) scale(${radius})`}>
          <stop offset="0" stopColor={color} stopOpacity={Math.max(0, strength)} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width="1080" height="1920" fill="url(#dark)" />
      <rect width="1080" height="1920" fill="url(#lamp)" style={{ mixBlendMode: "soft-light" }} />
      <rect width="1080" height="1920" fill="url(#lamp)" opacity={0.35} style={{ mixBlendMode: "screen" }} />
      {/* Cold blue night tint while irritated */}
      <rect width="1080" height="1920" fill="#1b2a5a" opacity={coldTint} style={{ mixBlendMode: "multiply" }} />
    </>
  );
};
