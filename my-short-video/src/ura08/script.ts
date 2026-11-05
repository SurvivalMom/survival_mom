import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-08-kimerarenai-watashi.md
 * (裏・申し送りノート #8「自分で決められない私」)
 *
 * Footage: public/source-videos/ura-08/ura-08-src.mp4 (Gemini, 30s, 720x1280,
 * 24fps, near-silent). Cut down to the parts that match each md scene.
 *
 * Rules carried over from ura-07: one card is 14 characters or fewer in
 * total; long lines are split, never reworded. `**word**` = emphasis.
 * Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 474; // 15.8s (see report: CTA is long)

/** Fixed top header, frame 0 to the end, no fade (per md). */
export const HEADER_TEXT = "決める力が、\n減っている。";

/** Where the grade starts turning from cool to warm. */
export const TURN_FRAME = 228;

export const CARDS: Card[] = [
  // Scene 1 (0-3.5s). Frames 0-24: header alone stops the scroll. The md
  // moves the premise 「分からないことがあると」 into the telops; the rest
  // comes from the caption. 「まず周りを」 lands as the camera glances left.
  { from: 24, to: 60, text: "分からないことが\nあると、", mood: "tense", scene: 1 },
  { from: 60, to: 105, text: "まず**周り**を\n見てしまう。", mood: "tense", scene: 1 },

  // Scene 2: 「自分で考えるより先に、正解に似せることを覚えていた。」
  // over the hand copying from the reference notebook.
  { from: 105, to: 147, text: "自分で考えるより\n先に、", mood: "turn", scene: 2 },
  { from: 147, to: 189, text: "**正解**に\n似せることを", mood: "turn", scene: 2 },
  { from: 189, to: 228, text: "覚えていた。", mood: "turn", scene: 2 },

  // Scene 3: 「素直でいることと、自分で決められないことは、
  // 同じじゃないのかもしれない。」 over the pen lifting and pausing.
  { from: 228, to: 264, text: "**素直**で\nいることと、", mood: "soft", scene: 3 },
  { from: 264, to: 306, text: "自分で決められない\nことは、", mood: "soft", scene: 3 },
  { from: 306, to: 333, text: "**同じじゃない**", mood: "soft", scene: 3 },
  { from: 333, to: 372, text: "のかも\nしれない。", mood: "soft", scene: 3 },

  // Main CTA (save badge shown under each card):
  // 「保存して、次に答えを探す前に、少しだけ自分の考えを声に出してみてください。」
  { from: 372, to: 402, text: "次に答えを\n探す前に、", mood: "cta", scene: 4 },
  { from: 402, to: 432, text: "少しだけ、\n自分の考えを", mood: "cta", scene: 4 },
  { from: 432, to: 474, text: "**声に出して**\nみてください。", mood: "cta", scene: 4 },
];

/**
 * Footage cuts: output frame `from` plays the source starting at `srcSec`.
 * Picked from the 30s clip by eye (contact sheets at 0.5s steps).
 */
export type Cut = { from: number; srcSec: number; note: string };

export const CUTS: Cut[] = [
  { from: 0, srcSec: 0.4, note: "S1 hand writing in the care record" },
  { from: 60, srcSec: 3.0, note: "S1 glance sideways to the reference notebook" },
  { from: 105, srcSec: 11.4, note: "S2 copying while looking at the reference" },
  { from: 228, srcSec: 17.4, note: "S3 copying stops, pen lifts (~0.6s in)" },
  { from: 276, srcSec: 21.6, note: "S3/CTA pen held over the line, pausing" },
];
