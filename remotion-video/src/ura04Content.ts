// Caption timing for public/source-videos/ura-04/ura-04-cut.mp4
// (「裏・申し送りノート」#4「『要相談』の山」), same two-layer telop
// format as ura-01/02/03 from
// content/caredesign/ai-video/ura-04-yousoudan-no-yama.md.
//
// Source footage: a single uncut ~30s AI-generated take (one locked-off
// shot: a stack of handover documents stamped "要相談", a hand flips
// through them and settles on one such stamp, then hovers a pen over a
// blank decision field before withdrawing without writing, then picks up
// a folder cover and closes it over the stack, resting a hand on top).
// Unlike ura-03, this take stays on-topic and usable throughout -- no
// unrelated beat needed to be cut out. Scene boundaries found by eye
// (1fps, then 4fps around the 18-24s folder-close transition):
//   - ~0-9s: static establishing shot, then the hand flips through the
//     stack and settles on a page stamped "要相談" (close-up)
//   - ~9-19.5s: pen hovers over a blank decision field in a steady,
//     almost motionless hold, then withdraws without writing
//   - ~19.5-22s: hand rests flat on the open page for a beat
//   - ~22-30s: hand picks up the folder cover, closes it over the stack,
//     and rests on top -- reads as a continuation of the same shot, not a
//     different prop/beat
// Trimmed via ffmpeg trim+concat to 3 segments, total 14.0s:
//   - [1.0s, 4.5s]   -> 3.5s (static start into the page-flip, Scene 1)
//   - [13.0s, 18.0s] -> 5.0s (the pen's steady hover/withdraw, Scene 2)
//   - [21.5s, 27.0s] -> 5.5s (the folder closing over the stack and the
//     resting hand, Scene 3)
// Scene 1's blank lower-telop window is kept short (2.0s) per the lesson
// from ura-01's posted Insights (see ura02Content.ts/ura03Content.ts) --
// the header alone carries only the first couple seconds, not the whole
// flip.
// Audio: the clip's own ambient track is not fully silent (confirmed via
// ffmpeg volumedetect on the trimmed+concatenated result: mean -48.7dB /
// max -16.3dB, clearing the project's -30dB silence threshold at several
// points), so no synthesized room-tone layer was needed, same as
// ura-01/ura-02.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-04/ura-04-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 14.0;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// this account's ~6-7 chars/line budget for HeaderTelop's current font
// size within a 90px safe-zone box.
export const ura04Header = '「要相談」の\n判子だけが、\nノートに\n増えていく。';

// Lower telop layer. Scene 1's blank window is 0-2.0s per the ura-02/
// ura-03 pacing lesson. Each caption marks 1 key word/phrase with **…**
// for the account's accent-color + white-stroke emphasis treatment.
// Every card is kept at 14 characters total or fewer (all lines summed,
// not just the longest line) per the account's lower-telop hard rule in
// Telop.tsx -- longer sentences are split into sequential cards rather
// than trimmed/reworded.
//
// Rewritten per explicit feedback that the first pass ("決めていいとは、
// 誰にも言われていない。") read as generic indecisiveness rather than the
// specific structural dilemma this episode pairs with dokuhaku-04-kengen
// (responsibility handed down without the authority to match it). The
// first two cards now name 権限 and 責任 directly and contrast them one
// right after the other, instead of only implying the gap.
export const ura04Segments: AlignedSegment[] = [
	// Scene 1 tail / Scene 2 start (2.0-4.25s, settling on the stamp):
	// the authority was never granted.
	{kind: 'line', text: '**権限**は、\nもらっていない。', startSeconds: 2.0, endSeconds: 4.25},

	// Scene 2 (4.25-8.5s, the pen's hover and withdrawal): but the
	// responsibility keeps landing anyway.
	{kind: 'line', text: '**責任**だけが、\n積もっていく。', startSeconds: 4.25, endSeconds: 6.5},
	{kind: 'line', text: '決めても、\n決めなくても、', startSeconds: 6.5, endSeconds: 8.5},

	// Scene 3 (8.5-14.0s, the folder closing and the resting hand).
	{kind: 'line', text: '**責められる**\n気がしていた。', startSeconds: 8.5, endSeconds: 10.5},
	{kind: 'cta', text: '**保存して**、\n自分に渡された', startSeconds: 10.5, endSeconds: 11.8},
	{kind: 'cta', text: '**権限**を、\n一度だけ', startSeconds: 11.8, endSeconds: 13.0},
	{kind: 'cta', text: '確認して\nみてください。', startSeconds: 13.0, endSeconds: 14.0},
];
