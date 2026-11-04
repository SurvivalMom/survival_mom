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
// break needed): [30.0s, 41.0s] -> 11.0s of real footage.
// Scene 1's blank lower-telop window is kept short (2.0s) per the
// pacing lesson from ura-01's posted Insights.
// Audio: the clip's own ambient track is not fully silent (confirmed via
// ffmpeg volumedetect on the trimmed result: mean -47.1dB / max
// -15.9dB, clearing the project's -30dB silence threshold), so no
// synthesized room-tone layer was needed.
//
// Runtime extended 11.0s -> 14.0s per explicit feedback: at 11.0s, 9
// lower-telop cards left some on screen as briefly as ~0.5s, too fast
// to read for a format whose whole appeal is a monologue the viewer
// reads start to finish. With no more real footage left in the source
// (11.0s already used every frame through the clip's end), the extra
// 3.0s is a held freeze-frame of the final shot (ffmpeg
// tpad=stop_mode=clone, silence-padded to match -- the source audio's
// own tail was already silent under the project's threshold past
// ~5.3s into the 11.0s cut, so the pad introduces no audible seam) --
// a natural choice for a shot that was already motionless at rest.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-06/ura-06-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 14.0;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// this account's ~6-7 chars/line budget for HeaderTelop's current font
// size within a 90px safe-zone box.
// Reworded from the original "フィードバック\n欄が、また\n空欄で\n
// 返ってきた。" (21 chars across 4 lines -- the longest header in the
// series, authored before the header-length hypothesis existed). Per
// the same hypothesis applied to ura-07 onward (see Telop.tsx), tightened
// to keep the loss/recurrence it already had ("また" + a blank column)
// while cutting the line count roughly in half. Not yet posted/measured.
export const ura06Header = 'また、\n空欄のまま\n返ってきた。';

// Lower telop layer. Scene 1's blank window is 0-2.0s per the pacing
// lesson. Each caption marks 1 key word/phrase with **…** for the
// account's accent-color + white-stroke emphasis treatment. Every card
// is kept at 14 characters total or fewer (all lines summed) per the
// account's lower-telop hard rule in Telop.tsx -- longer sentences are
// split into sequential cards rather than trimmed/reworded.
//
// Re-timed against the 14.0s runway (12.0s of lower-telop window) so
// every card holds 1.2s or longer -- the fastest card at the old 11.0s
// timing held only ~0.5s, too quick to read for this format's
// read-to-the-end monologue style.
export const ura06Segments: AlignedSegment[] = [
	{kind: 'line', text: '叱られないのは、', startSeconds: 2.0, endSeconds: 3.3},
	{kind: 'line', text: '**気にかけられて**\nいないのと、', startSeconds: 3.3, endSeconds: 4.9},
	{kind: 'line', text: '同じかも\nしれない。', startSeconds: 4.9, endSeconds: 6.2},

	{kind: 'line', text: '**優しさ**だと\n思っていた', startSeconds: 6.2, endSeconds: 7.6},
	{kind: 'line', text: 'ものが、\nただの', startSeconds: 7.6, endSeconds: 8.8},
	{kind: 'line', text: '**無関心**\nだったら。', startSeconds: 8.8, endSeconds: 10.1},

	{kind: 'cta', text: '**保存して**、\n次の面談で、', startSeconds: 10.1, endSeconds: 11.6},
	{kind: 'cta', text: '**空欄**の理由を', startSeconds: 11.6, endSeconds: 12.8},
	{kind: 'cta', text: '聞いて\nみてください。', startSeconds: 12.8, endSeconds: 14.0},
];
