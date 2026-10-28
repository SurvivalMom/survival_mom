// Caption timing for public/source-videos/ura-02/ura-02-cut.mp4
// (「裏・申し送りノート」#2「消えた自分の字」), same two-layer telop
// format as ura-01 (persistent top header + changing lower telop) from
// content/caredesign/ai-video/ura-02-kieta-ji.md.
//
// Source footage: a single uncut ~30s AI-generated take (one locked-off
// shot: hand flips through a guidance notebook filled with another
// person's handwriting, searches backward through earlier pages, then
// hovers a pen over a blank line before setting it down and closing the
// notebook without writing). Scene boundaries found by eye the same way
// as ura-01 (1fps/2fps frame extraction, no dialogue to align to):
//   - ~0-18s: continuous forward/backward page-flipping and scanning
//     (covers both Scene 1's "filled with someone else's handwriting"
//     and Scene 2's "searching backward" beats -- one unbroken motion,
//     not two distinct shots)
//   - ~18-27s: pen hovers over a blank line at the end of the notebook,
//     pausing (Scene 3's pause)
//   - ~27-29s: pen set down, notebook closes, final rest shot
// Trimmed via ffmpeg trim+concat to 3 segments, each cut at a
// comparatively low-motion instant, total 16.5s (same budget as ura-01):
//   - [1.5s, 6.0s]   -> 4.5s (early page flip, Scene 1)
//   - [10.5s, 14.0s] -> 3.5s (pen hovering over entries while scanning,
//     Scene 2)
//   - [20.5s, 29.0s] -> 8.5s (pen hovering at the blank line through the
//     closed-book rest shot, Scene 3)
// The clip's own ambient room tone survived the cut (confirmed via
// ffmpeg volumedetect: mean -48dB / max -6dB, not silent), so no
// synthesized ambient layer was needed.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-02/ura-02-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 16.5;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// ~6-7 chars/line (this account's budget at HeaderTelop's current font
// size within a 90px safe-zone box) -- the script's single sentence is
// unusually long (26 chars, nearly double ura-01's), so this needs more
// lines than ura-01's header did.
export const ura02Header = '気づけば、\nノートの字が\n全部、先輩の\nものになって\nいた。';

// Lower telop layer. Scene 1's blank window is 0-2.0s (shortened from an
// original 4.5s) -- ura-01's posted Insights showed average watch time
// landing almost exactly at its Scene 1/2 boundary (5.68s of 16.5s),
// suggesting viewers swiped away before any lower-telop payoff appeared
// at all. Moving the first caption up to 2.0s gets real content on
// screen well before that drop-off point, instead of asking viewers to
// sit through several seconds of page-flipping on the header alone.
// Everything after is shifted earlier by 2.5s to match, and the final
// CTA caption absorbs the leftover runtime (1.5s -> 4.0s) rather than
// compressing every caption's reading time to make room. Each caption
// marks 1 key word/phrase with **…** for the account's accent-color +
// white-stroke emphasis treatment.
export const ura02Segments: AlignedSegment[] = [
	// Scene 2 (2.0-5.5s, searching backward through earlier pages).
	{kind: 'line', text: '最後に**自分で**\n書いたのは、\nいつだった\nだろう。', startSeconds: 2.0, endSeconds: 5.5},

	// Scene 3 (5.5-16.5s, the pen's pause and the close). Realization
	// sentence split across 2 short captions, then the CTA across 3 --
	// same sequential-caption convention as ura-01's Scene 3.
	{kind: 'line', text: '聞かれる前に\n**答えが来る**から、', startSeconds: 5.5, endSeconds: 7.5},
	{kind: 'line', text: '考えなくなった\nのかもしれない。', startSeconds: 7.5, endSeconds: 9.5},
	{kind: 'cta', text: '**保存して**、\n次に答えを', startSeconds: 9.5, endSeconds: 11.0},
	{kind: 'cta', text: '渡される前に、\n**少しだけ**', startSeconds: 11.0, endSeconds: 12.5},
	{kind: 'cta', text: '自分で考えて\nみてください。', startSeconds: 12.5, endSeconds: 16.5},
];
