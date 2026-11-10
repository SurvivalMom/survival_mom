import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Atmosphere } from "../common/Atmosphere";
import { HeaderBanner } from "../common/HeaderBanner";
import { Telop } from "../common/Telop";
import { Footage } from "../common/Footage";
import { Sfx } from "../common/Sfx";
import { CUES } from "./Sfx";
import { CARDS, CUTS, FOOTAGE, HEADER_TEXT, TURN_FRAME } from "./script";

/**
 * ura-08「自分で決められない私」 9:16 short (1080x1920).
 * Layers, back to front: graded Gemini footage, atmosphere (dust, vignette,
 * telop scrim, grain), center telops, fixed header. Audio: synthesized SFX.
 */
export const Ura08KimerarenaiWatashi: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Footage src={FOOTAGE} cuts={CUTS} turnFrame={TURN_FRAME} />
    {/* The footage is bright and busy, so the telop scrim is stronger. */}
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
    <Sfx dir="ura08" cues={CUES} turnFrame={TURN_FRAME} />
  </AbsoluteFill>
);
