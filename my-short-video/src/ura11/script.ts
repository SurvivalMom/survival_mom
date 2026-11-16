import type { Cut } from "../common/Footage";
import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-11-kikikaesareta-toki.md
 * (裏・申し送りノート #11「聞き返された時」). The one ura episode that ends
 * on a warm turn.
 *
 * Footage: public/source-videos/ura-11/ura-11-src.mp4 (Gemini, 30s,
 * 720x1280, 24fps, near-silent). Key moments (checked at 0.25s steps):
 *   6.2-10.2s memo held up mid-air, not handed over / 10.4-11.6s memo set
 *   down on the binder / ~13.0s pen picked up / 13.8-17.5s writing an
 *   answer under it / from 19.0s the notebook alone (camera still).
 * The memo shows a name (「〇〇様」): blurred by NameBlur (nameTrack.ts).
 * The footage has no clear "circle someone else added", so CheckMark draws
 * one in red pen beside the written answer for Scene 3.
 *
 * One card is 14 characters or fewer in total; long lines are split, never
 * reworded. `**word**` = emphasis. Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 444; // 14.8s (md target: 12-15s)

/** Fixed top header, frame 0 to the end, no fade (per md). */
export const HEADER_TEXT = "答えが、\n返ってこない。";

/** The reveal: grade warms and the camera pushes in on the circle mark. */
export const TURN_FRAME = 270;

export const FOOTAGE = "source-videos/ura-11/ura-11-src.mp4";

export const CARDS: Card[] = [
  // Scene 1: header alone for frames 0-24, then the caption's
  // 「質問しに行ったら、『あなたはどう思う？』と聞き返されました」
  // (the md keeps the quote itself for the telops).
  { from: 24, to: 56, text: "質問しに\n行ったら、", mood: "tense", scene: 1 },
  { from: 56, to: 96, text: "「あなたは\n**どう思う？**」", mood: "turn", scene: 1 },
  { from: 96, to: 120, text: "と聞き返された。", mood: "turn", scene: 1 },

  // Scene 2: 「突き放された気がしたけど、違った。」
  // over setting the memo down and starting to write an answer.
  { from: 120, to: 175, text: "突き放された\n気がしたけど、", mood: "turn", scene: 2 },
  { from: 175, to: 230, text: "**違った**。", mood: "turn", scene: 2 },

  // Scene 3: 「ちゃんと、見てくれていたんだと思う。」
  // 「見てくれていた」 lands with the reveal of the circle mark.
  { from: 230, to: 270, text: "ちゃんと、", mood: "soft", scene: 3 },
  { from: 270, to: 340, text: "**見てくれていた**\nんだと思う。", mood: "soft", scene: 3 },

  // Main CTA (save badge under each card):
  // 「保存して、今度は自分から、誰かに同じ聞き方をしてみてください。」
  { from: 340, to: 372, text: "今度は自分から、", mood: "cta", scene: 4 },
  { from: 372, to: 404, text: "誰かに\n同じ聞き方を", mood: "cta", scene: 4 },
  { from: 404, to: 444, text: "**してみて**\nください。", mood: "cta", scene: 4 },
];

/** Footage cuts: output frame `from` plays the source from `srcSec`. */
export const CUTS: Cut[] = [
  { from: 0, srcSec: 6.2, note: "S1 memo held up mid-air, not handed over" },
  { from: 120, srcSec: 10.4, note: "S2 memo lowered and set down on the binder (src ~11.2 = out 144)" },
  { from: 156, srcSec: 12.8, note: "S2 pen picked up (~13.0 = out 162), writing slowly from ~13.8 (= out 186)" },
  { from: 230, srcSec: 15.3, note: "S3 still writing the answer, slowly" },
  { from: 270, srcSec: 19.0, note: "S3 reveal: notebook alone; CheckMark drawn beside the answer" },
];
