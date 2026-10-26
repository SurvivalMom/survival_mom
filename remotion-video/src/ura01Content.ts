// Caption timing for public/source-videos/ura-01/ura-01-cut.mp4
// (「裏・申し送りノート」#1「今日も『特変なし』と書いた」), the account's
// first produced episode in the new scenic-monologue "ura" series: no
// on-screen person, hand-only close-ups of a handover notebook, with the
// two-layer telop format (persistent small top header + a lower telop that
// changes per scene) from content/caredesign/ai-video/ura-01-tokuhennashi-zoku.md.
//
// Source footage: a single uncut ~30s AI-generated take (one locked-off
// shot, same framing throughout -- desk lamp, notebook, no camera cuts).
// No Whisper/ASR needed here (no dialogue), so scene boundaries were found
// by eye, extracting frames at 1fps/2fps and reviewing them directly:
//   - 0-~6s: hand enters and writes the 5th "特変なし" (matches Scene 1,
//     the writing beat)
//   - ~6-20s: the pen lifts and hovers, trembling, over the page -- a long
//     held pause (matches Scene 2)
//   - ~20-29s: the hand sets the pen down, closes the notebook, and the
//     final shot rests on the closed book under the lamp (matches Scene 3)
// The account's own 2 historical hits in this format ran 10-17s, well
// under this raw take's 30s, so rather than use the whole thing (risking
// the same mid-video drop-off the account's prior revision notes already
// flagged for slower-paced cuts), it was trimmed via ffmpeg trim+concat
// down to 3 segments total 16.5s, each cut at a near-static moment (end of
// a stroke, deep in the pause's hold, mid-way through the close) so the
// join doesn't read as a jump cut:
//   - [1.0s, 6.5s]  -> 5.5s  (writing, kept almost whole)
//   - [14.0s, 18.0s] -> 4.0s  (pause -- trimmed from the source's much
//     longer ~12s hold down to its most legible trembling stretch)
//   - [22.0s, 29.0s] -> 7.0s  (the pen being set down through the final
//     closed-book rest shot)
// All caption timestamps below are against this 16.5s edited clip, not the
// original 30s source. The clip's own ambient room tone survived the cut
// (confirmed via ffmpeg volumedetect: mean -45dB / max -4dB, not silent),
// so no synthesized ambient layer was needed as the audio safety net the
// script's meta info calls for.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-01/ura-01-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 16.5;

// Persistent top-of-frame header, 0.0s through the full clip -- the
// original hook line from the script, shown once and never re-triggered.
// Manually broken after と (10 chars / 4 chars) -- left to auto-wrap at
// HeaderTelop's size, the browser split it as 今日も「特変なし」と書い /
// た。, an unbalanced 2-character orphan on the second line.
export const ura01Header = '今日も「特変なし」と\n書いた。';

// Lower telop layer. Scene 1 (0-5.5s, the writing beat) is deliberately
// blank per the script -- the header alone carries that stretch.
export const ura01Segments: AlignedSegment[] = [
	// Scene 2 (5.5-9.5s, the pen's held pause).
	{kind: 'line', text: '本当に、\n何もなかっただろうか。', startSeconds: 5.5, endSeconds: 9.5},

	// Scene 3 (9.5-16.5s, closing the notebook). Realization line first,
	// then the CTA -- same sequential-caption convention as dokuhaku10's
	// Scene 3, rather than stacking both in one block.
	{kind: 'line', text: '変わったのは\n現場じゃなく、', startSeconds: 9.5, endSeconds: 11.5},
	{kind: 'line', text: '気づく力の方\nかもしれない。', startSeconds: 11.5, endSeconds: 13.5},
	{kind: 'cta', text: '保存して、\n次に書く前に、', startSeconds: 13.5, endSeconds: 15.3},
	{kind: 'cta', text: '一度だけ手を\n止めてみてください。', startSeconds: 15.3, endSeconds: 16.5},
];
