import type { Cut } from "../common/Footage";
import type { Card } from "../common/types";

/**
 * Source: content/caredesign/ai-video/ura-12-jibunryuu-no-kijun.md
 * (裏・申し送りノート #12「自分流の基準」)
 *
 * Footage: public/source-videos/ura-12/ura-12-src.mp4 (Gemini, 30s,
 * 720x1280, 24fps, near-silent). Key moments (checked at 0.1-0.25s steps):
 *   0.5-3.5s memo pad held open, crossed-out notes / 3.5s first page flip /
 *   11.0-14.0s flipping back through pages (flips at ~12.35 and ~13.85) /
 *   from 14.0s pausing on the messiest page / 21.0-22.4s a printed card set
 *   down beside the pad / from 23.2s the hand resting on the card.
 * Names written in the pad are blurred (nameTrack.ts, common/RegionBlur).
 *
 * One card is 14 characters or fewer in total; long lines are split, never
 * reworded. `**word**` = emphasis. Frames are at 30fps.
 */

export const FPS = 30;
export const DURATION_IN_FRAMES = 444; // 14.8s (md target: 12-15s)

/** Fixed top header, frame 0 to the end, no fade (per md). */
export const HEADER_TEXT = "基準なんて、\n誰も教えてくれなかった。";

/** Grade warms as the printed card comes in. */
export const TURN_FRAME = 250;

export const FOOTAGE = "source-videos/ura-12/ura-12-src.mp4";

export const CARDS: Card[] = [
  // Scene 1: header alone for frames 0-24, then the caption's
  // 「自己流のメモを書き足しながら、」.
  { from: 24, to: 60, text: "**自己流**のメモを", mood: "tense", scene: 1 },
  { from: 60, to: 110, text: "書き足しながら、", mood: "tense", scene: 1 },

  // Scene 2: 「これで合っているのか、ずっと手探りだった。」
  // 「手探りだった。」 lands as the pages stop on the messiest one.
  { from: 110, to: 160, text: "これで\n合っているのか、", mood: "turn", scene: 2 },
  { from: 160, to: 200, text: "ずっと", mood: "turn", scene: 2 },
  { from: 200, to: 250, text: "**手探り**だった。", mood: "turn", scene: 2 },

  // Scene 3: 「初めて、迷わずに決められた。」 over the card being set down
  // and the hand resting on it.
  { from: 250, to: 300, text: "初めて、", mood: "soft", scene: 3 },
  { from: 300, to: 370, text: "**迷わずに**\n決められた。", mood: "soft", scene: 3 },

  // Main CTA (save badge under each card):
  // 「保存して、今の自分の判断基準を、一度書き出してみてください。」
  { from: 370, to: 402, text: "今の自分の\n判断基準を、", mood: "cta", scene: 4 },
  { from: 402, to: 444, text: "一度**書き出して**\nみてください。", mood: "cta", scene: 4 },
];

/** Footage cuts: output frame `from` plays the source from `srcSec`. */
export const CUTS: Cut[] = [
  { from: 0, srcSec: 0.6, note: "S1 memo pad held open, first flip starts at src 3.5 (= out 87)" },
  { from: 110, srcSec: 11.0, note: "S2 flipping back; flips at src 12.35 (= out 150) and 13.85 (= out 195); messiest page from 14.0 (= out 200)" },
  { from: 250, srcSec: 20.8, note: "S3 card slides in (21.0 = out 256), set down (22.4 = out 298), hand rests (23.2 = out 322)" },
];
