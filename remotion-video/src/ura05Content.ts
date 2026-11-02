// Caption timing for public/source-videos/ura-05/ura-05-cut.mp4
// (「裏・申し送りノート」#5「送れなかった一言」), same two-layer telop
// format as ura-01〜04 from
// content/caredesign/ai-video/ura-05-okurenakatta-hitokoto.md.
//
// Source footage: a single uncut ~30s AI-generated take (locked-off, POV
// framing per the account's new first-person camera convention): a
// notebook and a phone resting face-down on a desk, a hand picks the
// phone up and composes in a messaging thread, sets it down briefly,
// picks it back up to a second thread and holds the thumb still over
// the keyboard without sending, then the screen dims to black while
// still held up, and the hand lowers the phone face-down onto the
// notebook to rest. The two message threads shown differ slightly in
// contact name between the "typing" beat and the "hovering" beat (an
// artifact of the AI generation, not a continuity choice) -- not
// corrected, since the brief already calls for the screen content to
// stay "abstract/illegible" and no caption references on-screen text
// directly. Scene boundaries found by eye (1fps, then 2fps around the
// two transitions):
//   - ~0-2s: static establishing shot, phone face-down beside the
//     notebook
//   - ~3-9s: phone picked up, first thread, finger near the keyboard
//     (typing/deleting)
//   - ~9-11s: brief lower/re-grip transition (not used)
//   - ~11-20s: phone held steady, second thread, thumb resting over the
//     keyboard without pressing -- a long, nearly motionless hold
//   - ~20.5-21.5s: the screen dims to black while still held up
//   - ~21.5-30s: the hand lowers the phone face-down onto the notebook
//     and withdraws
// Trimmed via ffmpeg trim+concat to 3 segments, total 17.0s:
//   - [1.5s, 7.0s]   -> 5.5s (static start into the first thread's
//     typing, Scene 1)
//   - [13.0s, 18.0s] -> 5.0s (the second thread's motionless hold,
//     Scene 2)
//   - [20.5s, 27.0s] -> 6.5s (the screen dimming, the phone being set
//     down, and the resting hand, Scene 3)
// Scene 1's blank lower-telop window is kept short (2.0s) per the
// lesson from ura-01's posted Insights (see ura02Content.ts and later
// episodes for the full rationale).
// Audio: the clip's own ambient track is not fully silent (confirmed via
// ffmpeg volumedetect on the trimmed+concatenated result: mean -46.2dB /
// max -11.4dB, clearing the project's -30dB silence threshold
// throughout), so no synthesized room-tone layer was needed.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-05/ura-05-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 17.0;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// this account's ~6-7 chars/line budget for HeaderTelop's current font
// size within a 90px safe-zone box.
export const ura05Header = '反論を\n打っては、\n消した。';

// Lower telop layer. Scene 1's blank window is 0-2.0s per the pacing
// lesson. Each caption marks 1 key word/phrase with **…** for the
// account's accent-color + white-stroke emphasis treatment. Every card
// is kept at 14 characters total or fewer (all lines summed) per the
// account's lower-telop hard rule in Telop.tsx -- longer sentences are
// split into sequential cards rather than trimmed/reworded.
export const ura05Segments: AlignedSegment[] = [
	// Scene 1 tail / Scene 2 start: the realization that the critique was
	// fair.
	{kind: 'line', text: '正しいことを', startSeconds: 2.0, endSeconds: 3.2},
	{kind: 'line', text: '**言われただけ**\nなのに、', startSeconds: 3.2, endSeconds: 4.9},
	{kind: 'line', text: 'なぜか\n**悔しかった**。', startSeconds: 4.9, endSeconds: 6.3},

	// Scene 2/3: who the anger was actually at.
	{kind: 'line', text: '怒っていたのは、', startSeconds: 6.3, endSeconds: 7.6},
	{kind: 'line', text: '相手じゃなく、', startSeconds: 7.6, endSeconds: 8.8},
	{kind: 'line', text: '**できない**\n自分にだった', startSeconds: 8.8, endSeconds: 10.3},
	{kind: 'line', text: 'のかもしれない。', startSeconds: 10.3, endSeconds: 11.6},

	// Scene 3: CTA.
	{kind: 'cta', text: '**保存して**、\n今度こそ、', startSeconds: 11.6, endSeconds: 13.1},
	{kind: 'cta', text: '**送らなかった**\n理由を', startSeconds: 13.1, endSeconds: 14.5},
	{kind: 'cta', text: '考えて\nみてください。', startSeconds: 14.5, endSeconds: 17.0},
];
