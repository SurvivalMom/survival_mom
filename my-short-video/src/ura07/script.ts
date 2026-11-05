import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-07-chiisana-gouman.md
 * (裏・申し送りノート #7「小さな傲慢に気づいた夜」)
 *
 * The md's monologue lines are split into short sequential cards so the
 * telop changes at a quick SNS tempo. Account rule carried over from
 * remotion-video/src/Telop.tsx: one card shows 14 characters or fewer in
 * total (all lines combined). Longer lines are split into more cards,
 * never reworded to fit.
 *
 * `**word**` marks an emphasis word (1 per card at most).
 * Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 450; // 15s (md target: 12-15s)

/** Fixed top header, shown from frame 0 to the end with no fade (per md). */
export const HEADER_TEXT = "また、\nイライラしてしまった。";

export type { Card, Mood } from "../common/types";

export const CARDS: Card[] = [
  // Scene 1 (0-4s): frames 0-24 show the header only, so it stops the
  // scroll on its own. The cards that follow carry the specificity the md
  // moved out of the header ("あの利用者さんの遅さに"), taken from the caption.
  { from: 24, to: 60, text: "利用者さんの", mood: "tense", scene: 1 },
  { from: 60, to: 105, text: "**動作の遅さ**に、", mood: "tense", scene: 1 },

  // Scene 2 (4-9s): 「書いた後で、自分の字が刺々しいことに気づいた。」
  { from: 105, to: 138, text: "書いた後で、", mood: "turn", scene: 2 },
  { from: 138, to: 177, text: "自分の字が", mood: "turn", scene: 2 },
  { from: 177, to: 243, text: "**刺々しい**ことに\n気づいた。", mood: "turn", scene: 2 },

  // Scene 3 (9-13s): 「正しさを振りかざしていたのは、私の方だったかもしれない。」
  { from: 243, to: 273, text: "**正しさ**を", mood: "soft", scene: 3 },
  { from: 273, to: 315, text: "振りかざして\nいたのは、", mood: "soft", scene: 3 },
  { from: 315, to: 372, text: "**私の方**だった\nかもしれない。", mood: "soft", scene: 3 },

  // Main CTA (save): 「保存して、明日は少しだけ、言葉を選んでみてください。」
  { from: 372, to: 408, text: "保存して、\n明日は少しだけ、", mood: "cta", scene: 4 },
  { from: 408, to: 450, text: "**言葉を選んで**\nみてください。", mood: "cta", scene: 4 },
];

/** Frame where the background starts warming from "irritation" to "care". */
export const TURN_FRAME = 243;
