import type { Cut } from "../common/Footage";
import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-09-mata-kikini-itta.md
 * (裏・申し送りノート #9「また聞きに行った」)
 *
 * Footage: public/source-videos/ura-09/ura-09-src.mp4 (Gemini, 30s, 720x1280,
 * 24fps, near-silent). Key moments in the source (checked at 0.2s steps):
 *   7.4s pen stops mid-sentence / 10.7s pen set down on the clipboard /
 *   13.6-16s viewer rises from the chair / 19.9-21.0s sits back down /
 *   21.3s picks the pen up / 22.0s- writes again in their own words.
 *
 * One card is 14 characters or fewer in total; long lines are split, never
 * reworded. `**word**` = emphasis. Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 444; // 14.8s (md target: 12-15s)

/** Fixed top header, frame 0 to the end, no fade (per md). */
export const HEADER_TEXT = "自分の言葉が、\n出てこない。";

/** Where the grade starts turning from cool to warm (sitting back down). */
export const TURN_FRAME = 220;

export const FOOTAGE = "source-videos/ura-09/ura-09-src.mp4";

export const CARDS: Card[] = [
  // Scene 1: frames 0-24 header alone. Then the caption's
  // 「記録を書きかけで手が止まり」, with 「手が止まり」 landing as the pen stops.
  { from: 24, to: 56, text: "記録を書きかけで", mood: "tense", scene: 1 },
  { from: 56, to: 100, text: "**手が止まり**、", mood: "tense", scene: 1 },

  // Scene 2: 「『これで合ってますか』が、今日も真っ先に出た。」
  // over the pen being set down and the viewer getting up.
  { from: 100, to: 150, text: "「これで\n合ってますか」が、", mood: "turn", scene: 2 },
  { from: 150, to: 220, text: "今日も\n**真っ先に**出た。", mood: "turn", scene: 2 },

  // Scene 3: 「正解を探す前に、まず自分の考えを書いてみることにした。」
  // over sitting back down, picking up the pen, writing again.
  { from: 220, to: 256, text: "**正解**を探す前に、", mood: "soft", scene: 3 },
  { from: 256, to: 298, text: "まず自分の考えを", mood: "soft", scene: 3 },
  { from: 298, to: 340, text: "書いてみることに\nした。", mood: "soft", scene: 3 },

  // Main CTA (save badge under each card):
  // 「保存して、次に聞きに行く前に、一度だけ自分の答えを書いてみてください。」
  { from: 340, to: 370, text: "次に聞きに行く前に、", mood: "cta", scene: 4 },
  { from: 370, to: 400, text: "一度だけ\n自分の答えを", mood: "cta", scene: 4 },
  { from: 400, to: 444, text: "**書いて**\nみてください。", mood: "cta", scene: 4 },
];

/** Footage cuts: output frame `from` plays the source from `srcSec`. */
export const CUTS: Cut[] = [
  { from: 0, srcSec: 5.4, note: "S1 writing, pen stops at src 7.4 (= out 60)" },
  { from: 100, srcSec: 10.0, note: "S2 pen set down on clipboard at src 10.7 (= out 121)" },
  { from: 136, srcSec: 13.4, note: "S2 rising from the chair, src 13.6-16 (= out 142-214)" },
  { from: 220, srcSec: 19.7, note: "S3 sits back down src 19.9-21.0, pen picked up 21.3 (= out 268)" },
  { from: 280, srcSec: 22.0, note: "S3/CTA writing again in their own words" },
];
