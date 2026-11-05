import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Card } from "./types";
import { FONT_FAMILY } from "./font";

const EMPHASIS: Record<Card["mood"], string> = {
  tense: "#ff5a4e", // irritation
  turn: "#ffe14a", // the moment of noticing
  soft: "#ffc27a", // lamp-warm reflection
  cta: "#ffe14a",
};

const renderWithEmphasis = (text: string, color: string): React.ReactNode[] =>
  text.split(/(\*\*.+?\*\*)/g).map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (!m) return part;
    return (
      <span key={i} style={{ color }}>
        {m[1]}
      </span>
    );
  });

/**
 * Big, bold center telop. Rendered inside a <Sequence>, so the frame is
 * local to the card.
 * - tense: hard punch-in with a tiny shake (irritation)
 * - turn / soft: slower rise with a blur-in (noticing, reflecting)
 * - cta: soft rise, slightly smaller, with a save badge
 */
export const Telop: React.FC<{ card: Card; isLastOfScene: boolean }> = ({
  card,
  isLastOfScene,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const length = card.to - card.from;
  const snappy = card.mood === "tense";

  const enter = spring({
    frame,
    fps,
    config: snappy
      ? { damping: 13, stiffness: 200, mass: 0.6 }
      : { damping: 20, stiffness: 90, mass: 0.9 },
    durationInFrames: snappy ? 9 : 16,
  });

  // Hard cut between cards inside a scene (tempo); short fade only when the
  // scene changes, so the mood shift has room to breathe.
  const exit = isLastOfScene
    ? interpolate(frame, [length - 8, length], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const scale = snappy ? 0.82 + enter * 0.18 : 0.94 + enter * 0.06;
  const translateY = (1 - enter) * (snappy ? 0 : 36);
  const blur = snappy ? 0 : (1 - enter) * 10;
  const shake =
    snappy && frame < 8 ? Math.sin(frame * 2.6) * (8 - frame) * 1.2 : 0;

  const isCta = card.mood === "cta";
  const fontSize = isCta ? 84 : 104;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Slightly above true center: keeps clear of the TikTok/Shorts
        // caption and button area at the bottom.
        paddingBottom: 120,
      }}
    >
      <div
        style={{
          transform: `translate(${shake}px, ${translateY}px) scale(${scale})`,
          opacity: Math.min(1, enter * 1.4) * exit,
          filter: `blur(${blur}px)`,
          fontFamily: FONT_FAMILY,
          fontWeight: 900,
          fontSize,
          lineHeight: 1.32,
          letterSpacing: "0.02em",
          color: "#ffffff",
          textAlign: "center",
          whiteSpace: "pre-line",
          WebkitTextStroke: "16px #120a14",
          paintOrder: "stroke fill",
          textShadow: "0 10px 34px rgba(0,0,0,0.65)",
          maxWidth: 1000,
        }}
      >
        {renderWithEmphasis(card.text, EMPHASIS[card.mood])}
      </div>
      {isCta ? <SaveBadge progress={enter} /> : null}
    </div>
  );
};

const SaveBadge: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      marginTop: 56,
      opacity: progress,
      transform: `translateY(${(1 - progress) * 20}px)`,
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "18px 40px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.14)",
      border: "3px solid rgba(255,255,255,0.55)",
      fontFamily: FONT_FAMILY,
      fontWeight: 700,
      fontSize: 44,
      color: "#ffffff",
    }}
  >
    <svg width="40" height="48" viewBox="0 0 20 24" fill="#ffe14a">
      <path d="M2 0h16a2 2 0 0 1 2 2v22l-10-6-10 6V2a2 2 0 0 1 2-2z" />
    </svg>
    保存して見返す
  </div>
);
