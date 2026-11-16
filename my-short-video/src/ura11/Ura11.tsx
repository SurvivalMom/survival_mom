import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import { Atmosphere } from "../common/Atmosphere";
import { Footage } from "../common/Footage";
import { HeaderBanner } from "../common/HeaderBanner";
import { Sfx } from "../common/Sfx";
import { Telop } from "../common/Telop";
import { CheckMark, NameBlur } from "./Overlays";
import { SRC_H, SRC_W } from "./nameTrack";
import { CUES } from "./Sfx";
import { CARDS, CUTS, DURATION_IN_FRAMES, FOOTAGE, HEADER_TEXT, TURN_FRAME } from "./script";

// Push-in target: the answer with the circle mark (source px, ~mid-reveal).
const FOCUS = { x: 384 / SRC_W, y: 838 / SRC_H };

/**
 * ura-11「聞き返された時」 9:16 short (1080x1920), on Gemini footage.
 * Layers, back to front: graded footage (+ name blur, circle mark) with a
 * slow push-in on the reveal, atmosphere, telops, fixed header.
 */
export const Ura11KikikaesaretaToki: React.FC = () => {
  const frame = useCurrentFrame();
  const push = interpolate(frame, [TURN_FRAME, DURATION_IN_FRAMES], [1, 1.28], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${push})`,
          transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%`,
        }}
      >
        <Footage src={FOOTAGE} cuts={CUTS} turnFrame={TURN_FRAME}>
          <NameBlur />
          <CheckMark />
        </Footage>
      </AbsoluteFill>
      <Atmosphere turnFrame={TURN_FRAME} scrim={0.7} />
      {CARDS.map((card, i) => {
        const next = CARDS[i + 1];
        const isLastOfScene = !next || next.scene !== card.scene;
        return (
          <Sequence key={card.from} from={card.from} durationInFrames={card.to - card.from} layout="none">
            <Telop card={card} isLastOfScene={isLastOfScene} />
          </Sequence>
        );
      })}
      <HeaderBanner text={HEADER_TEXT} />
      <Sfx dir="ura11" cues={CUES} turnFrame={TURN_FRAME} />
    </AbsoluteFill>
  );
};
