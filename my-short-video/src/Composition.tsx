import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Atmosphere } from "./common/Atmosphere";
import { DeskScene } from "./ura07/DeskScene";
import { HeaderBanner } from "./common/HeaderBanner";
import { Sfx } from "./ura07/Sfx";
import { Telop } from "./common/Telop";
import { CARDS, HEADER_TEXT, TURN_FRAME } from "./ura07/script";

/**
 * ura-07「小さな傲慢に気づいた夜」 9:16 short (1080x1920).
 * Layers, back to front: illustrated desk scene (stand-in for the md's AI
 * footage), atmosphere, center telops, fixed header.
 *
 * Audio: natural SFX only (pen, room tone), see ura07/Sfx.tsx.
 */
export const Ura07ChiisanaGouman: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#070a18" }}>
      <DeskScene />
      <Atmosphere turnFrame={TURN_FRAME} />
      {CARDS.map((card, i) => {
        const next = CARDS[i + 1];
        const isLastOfScene = !next || next.scene !== card.scene;
        return (
          <Sequence
            key={card.from}
            from={card.from}
            durationInFrames={card.to - card.from}
            layout="none"
          >
            <Telop card={card} isLastOfScene={isLastOfScene} />
          </Sequence>
        );
      })}
      <HeaderBanner text={HEADER_TEXT} />
      <Sfx />
    </AbsoluteFill>
  );
};

export { Ura08KimerarenaiWatashi } from "./ura08/Ura08";
