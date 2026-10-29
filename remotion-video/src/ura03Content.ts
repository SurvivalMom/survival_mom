// Caption timing for public/source-videos/ura-03/ura-03-cut.mp4
// (「裏・申し送りノート」#3「開かなかった誘い」), same two-layer telop
// format as ura-01/ura-02 from
// content/caredesign/ai-video/ura-03-hirakanakatta-sasoi.md.
//
// Source footage: a single ~30s AI-generated take of a staff break room,
// but unlike ura-01/ura-02 it wanders across multiple unrelated beats
// rather than one continuous corkboard shot: an empty-room establishing
// shot (~0-1s), the corkboard + target flyer (~1-5s), a *different*
// person's face and torso writing in a notebook (~5-12s -- not usable:
// violates the series' "no face" rule and isn't even the right prop for
// this script), a hand reaching toward/withdrawing from the flyer on the
// corkboard (~12-20s), and a pulled-back wide shot of the corkboard
// (~20-30s). Found by eye via 1fps frame extraction, the same way as the
// other ura episodes.
//
// Trimmed via ffmpeg trim+concat to 3 segments that skip the face/
// notebook stretch entirely, total 15.0s:
//   - [1.5s, 5.0s]   -> 3.5s (corkboard establishing -> close-up on the
//     target flyer, Scene 1)
//   - [12.0s, 17.0s] -> 5.0s (hand reaching toward the flyer, pausing,
//     withdrawing without touching it, Scene 2)
//   - [23.0s, 29.5s] -> 6.5s (camera pulled back, flyer untouched, calm
//     closing shot, Scene 3)
//
// Audio: unlike ura-01/ura-02, this clip's own ambient track registered
// as silent across its *entire* duration under this project's
// `silencedetect=noise=-30dB:d=0.3` convention (confirmed before and
// after trimming). Per the script's "音声について" safety note, replaced
// the track with a synthesized subtle room-tone (ffmpeg anoisesrc
// brown-noise, low-passed and gain-staged to mean -28dB / max -15dB --
// loud enough to clear the -30dB silence threshold throughout, quiet
// enough to read as ambient room noise rather than a sound effect).

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
};

export const SOURCE_VIDEO = 'source-videos/ura-03/ura-03-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 15.0;

// Persistent top-of-frame header, 0.0s through the full clip. Broken at
// this account's ~6-7 chars/line budget for HeaderTelop's current font
// size within a 90px safe-zone box.
export const ura03Header = '歓迎会の\nチラシが、\nもう3週間\n貼られた\nままだ。';

// Lower telop layer. Scene 1's blank window is kept short (2.0s, not the
// script's original 0-4s) per the lesson from ura-01's posted Insights
// (average watch time landed almost exactly on its Scene 1/2 boundary) --
// see ura02Content.ts for the full rationale. Each caption marks 1 key
// word/phrase with **…** for the account's accent-color + white-stroke
// emphasis treatment.
//
// Further re-split per explicit feedback that no single card should show
// more than 14 characters total (not just per line): the original
// "ないと思っていたのかもしれない。" card (16 chars) exceeded that, so
// it was split into 2 cards rather than trimmed.
export const ura03Segments: AlignedSegment[] = [
	// Scene 2 (2.0-6.0s, the hand reaching/withdrawing from the flyer).
	{kind: 'line', text: '断る理由は、\n**いつも**\n思いつく。', startSeconds: 2.0, endSeconds: 6.0},

	// Scene 3 (6.0-15.0s, the pulled-back closing shot). Realization
	// sentence split across 3 short captions (was 2), then the CTA across
	// 3 -- same sequential-caption convention as ura-01/ura-02's Scene 3.
	{kind: 'line', text: 'もう、ここに\n**馴染む必要**が', startSeconds: 6.0, endSeconds: 8.5},
	// Split into 2 cards (11 + 5 chars) -- was 1 card at 16 chars.
	{kind: 'line', text: 'ないと思って\nいたのかも', startSeconds: 8.5, endSeconds: 9.75},
	{kind: 'line', text: 'しれない。', startSeconds: 9.75, endSeconds: 11.0},
	{kind: 'cta', text: '**保存して**、\n断った理由を、', startSeconds: 11.0, endSeconds: 12.3},
	{kind: 'cta', text: 'もう一度だけ\n振り返って', startSeconds: 12.3, endSeconds: 13.6},
	{kind: 'cta', text: 'みてください。', startSeconds: 13.6, endSeconds: 15.0},
];
