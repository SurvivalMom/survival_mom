import type { Cut } from "../common/Footage";
import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-10-hitori-de-kimeta-yoru.md
 * (裏・申し送りノート #10「一人で決めた夜」)
 *
 * SAFETY: the md requires that the message "safety-related judgments are
 * never carried alone; always report and consult" is NOT shortened or
 * weakened in Scene 3 / CTA. So the full CTA text is shown, split into
 * cards, and this takes priority over the 12-15s length target.
 *
 * Footage: public/source-videos/ura-10/ura-10-src.mp4 (Gemini, 30s,
 * 720x1280, 24fps, near-silent). Key moments (checked at 0.2s steps):
 *   0.5-7.5s writing fast / 15.3s pen set down / 16.1s hand rests on the
 *   record / 20.6s reaches toward the wall / 23.4s fingertips touch the
 *   posted emergency contact sheet, then rest there to the end.
 *
 * One card is 14 characters or fewer in total; long lines are split, never
 * reworded. `**word**` = emphasis. Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 520; // 17.3s: full safety CTA (see above)

/** Fixed top header, frame 0 to the end, no fade (per md). */
export const HEADER_TEXT = "相談する間も、\nなかった。";

/** Grade turns from cold to warm as the hand reaches for the contact list. */
export const TURN_FRAME = 200;

export const FOOTAGE = "source-videos/ura-10/ura-10-src.mp4";

export const CARDS: Card[] = [
  // Scene 1: header alone for frames 0-24, then the caption's
  // 「とっさに一人で判断しました」 and the md's 「相談する時間はなかった。」
  // (the line the md moved out of the header).
  { from: 24, to: 60, text: "**とっさに**\n一人で判断した。", mood: "tense", scene: 1 },
  { from: 60, to: 100, text: "相談する時間は\nなかった。", mood: "tense", scene: 1 },

  // Scene 2: 「正しかったのか、まだ自分でも分からない。」
  { from: 100, to: 145, text: "正しかったのか、", mood: "turn", scene: 2 },
  { from: 145, to: 200, text: "まだ自分でも\n**分からない**。", mood: "turn", scene: 2 },

  // Scene 3: 「次は、一人で抱える前に、連絡する勇気を持ちたい。」
  { from: 200, to: 240, text: "次は、一人で\n抱える前に、", mood: "soft", scene: 3 },
  { from: 240, to: 290, text: "**連絡する勇気**を\n持ちたい。", mood: "soft", scene: 3 },

  // Main CTA, part 1 (save badge under each card):
  // 「保存して、一人で判断していい場面とそうでない場面を、
  //   もう一度確認してみてください。」
  { from: 290, to: 325, text: "一人で判断していい\n場面と", mood: "cta", scene: 4 },
  { from: 325, to: 360, text: "そうでない場面を、\nもう一度", mood: "cta", scene: 4 },
  { from: 360, to: 395, text: "**確認して**\nみてください。", mood: "cta", scene: 4 },

  // Main CTA, part 2 -- the safety message, shown in full and held longest.
  // 「安全に関わることは、一人で抱えずに必ず報告・相談してください。」
  { from: 395, to: 430, text: "**安全**に\n関わることは、", mood: "turn", scene: 4 },
  { from: 430, to: 462, text: "一人で抱えずに", mood: "turn", scene: 4 },
  { from: 462, to: 520, text: "**必ず報告・相談**\nしてください。", mood: "turn", scene: 4 },
];

/** Footage cuts: output frame `from` plays the source from `srcSec`. */
export const CUTS: Cut[] = [
  { from: 0, srcSec: 3.0, note: "S1 writing fast" },
  { from: 100, srcSec: 14.6, note: "S2 last strokes, pen down at src 15.3 (= out 121), hand rests 16.1 (= out 145)" },
  { from: 200, srcSec: 20.5, note: "S3 reaches for the wall, touches the contact sheet at src 23.4 (= out 287)" },
  { from: 290, srcSec: 23.6, rate: 0.75, note: "CTA fingertips resting on the contact sheet, slowed to hold to the end" },
];
