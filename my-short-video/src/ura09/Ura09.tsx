import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Atmosphere } from "../common/Atmosphere";
import { Footage } from "../common/Footage";
import { HeaderBanner } from "../common/HeaderBanner";
import { Sfx } from "../common/Sfx";
import { Telop } from "../common/Telop";
import { CUES } from "./Sfx";
import { CARDS, CUTS, FOOTAGE, HEADER_TEXT, TURN_FRAME } from "./script";

/**
 * ura-09「また聞きに行った」 9:16 short (1080x1920), on Gemini footage.
 * Layers, back to front: graded footage, atmosphere, telops, fixed header.
 */
export const Ura09MataKikiniItta: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage src={FOOTAGE} cuts={CUTS} turnFrame={TURN_FRAME} />
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
    <Sfx dir="ura09" cues={CUES} turnFrame={TURN_FRAME} />
  </AbsoluteFill>
);
