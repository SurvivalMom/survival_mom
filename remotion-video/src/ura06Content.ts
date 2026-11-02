// Caption timing for public/source-videos/ura-06/ura-06-cut.mp4
// (「裏・申し送りノート」#6「空欄のままのフィードバック欄」), same
// two-layer telop format as ura-01〜05 from
// content/caredesign/ai-video/ura-06-kuuran-no-mama.md.
//
// Source footage: the uploaded ~41s take is NOT usable start-to-finish --
// unlike every prior ura episode, its first ~29.5s is not new footage at
// all, but a near-exact repeat of ura-05's phone/handover-notebook scene
// (same desk, same notebook, same messaging-app screens), completely
// unrelated to this script's subject (a staff evaluation record with a
// blank feedback column). Only the tail, from ~30s to the clip's end at
// ~41s, actually shows the evaluation record: a wide establishing shot
// of the record (title card reads as an invented company name, not a
// real one), a hand entering to rest near the blank "フィードバック"
// column for a brief pause, then lifting the page, closing the record's
// cover, and resting beside a second closed notebook. The whole
// unrelated first ~29.5s was excluded entirely rather than trimmed down,
// the same policy as ura-03's mismatched mid-section.
// Trimmed via a single cut (one continuous take, no internal scene
// break needed): [30.0s, 41.0s] -> 11.0s.
// Scene 1's blank lower-telop window is kept short (2.0s) per the
// pacing lesson from ura-01's posted Insights.
// Audio: the clip's own ambient track is not fully silent (confirmed via
// ffmpeg volumedetect on the trimmed result: mean -47.1dB / max
// -15.9dB, clearing the project's -30dB silence threshold), so no
// synthesized room-tone layer was needed.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-06/ura-06-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 11.0;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// this account's ~6-7 chars/line budget for HeaderTelop's current font
// size within a 90px safe-zone box.
export const ura06Header = 'フィードバック\n欄が、また\n空欄で\n返ってきた。';

// Lower telop layer. Scene 1's blank window is 0-2.0s per the pacing
// lesson. Each caption marks 1 key word/phrase with **…** for the
// account's accent-color + white-stroke emphasis treatment. Every card
// is kept at 14 characters total or fewer (all lines summed) per the
// account's lower-telop hard rule in Telop.tsx -- longer sentences are
// split into sequential cards rather than trimmed/reworded. Cards run
// shorter than usual (~0.7-1.2s each) since only 9.0s of lower-telop
// runway is available in this shorter 11.0s edit.
export const ura06Segments: AlignedSegment[] = [
	{kind: 'line', text: '叱られないのは、', startSeconds: 2.0, endSeconds: 2.8},
	{kind: 'line', text: '**気にかけられて**\nいないのと、', startSeconds: 2.8, endSeconds: 4.0},
	{kind: 'line', text: '同じかも\nしれない。', startSeconds: 4.0, endSeconds: 4.9},

	{kind: 'line', text: '**優しさ**だと\n思っていた', startSeconds: 4.9, endSeconds: 5.9},
	{kind: 'line', text: 'ものが、\nただの', startSeconds: 5.9, endSeconds: 6.6},
	{kind: 'line', text: '**無関心**\nだったら。', startSeconds: 6.6, endSeconds: 7.4},

	{kind: 'cta', text: '**保存して**、\n次の面談で、', startSeconds: 7.4, endSeconds: 8.5},
	{kind: 'cta', text: '**空欄**の理由を', startSeconds: 8.5, endSeconds: 9.2},
	{kind: 'cta', text: '聞いて\nみてください。', startSeconds: 9.2, endSeconds: 11.0},
];
