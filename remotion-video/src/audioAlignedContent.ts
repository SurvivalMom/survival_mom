// Caption timing for public/source-videos/dokuhaku-09-houchi-raw.mp4,
// anchored to the clip's actual detected speech, not estimated from text
// length alone.
//
// Method: this sandbox cannot reach huggingface.co to download a Whisper
// model for word-level transcription, so exact ASR alignment wasn't
// possible. Instead, pauses were measured directly from the audio with
// `ffmpeg -af silencedetect=noise=-30dB:d=0.3` (see commit message /
// README for the raw detection log), and each script phrase was matched
// to a detected speech window in order, using character count vs. window
// duration (plausible Japanese speech rate ~5.5–7.7 chars/sec) to check
// each match made sense. Where two short phrases shared one detected
// window with no pause between them, they were merged into a single
// caption instead of guessing an arbitrary internal split point — this
// is why this list has fewer, slightly longer captions in Scene 2 than
// the text-only version in content.ts.
//
// Known gap: the clip has one real ~4.9s silence between Scene 1 and
// Scene 2 (5.1s–10.0s) — the previous flat proportional-scaling version
// ignored this entirely, which was the main source of drift. The last
// detected speech window (26.5s–29.0s, "任せきりは、違うのかもしれません。")
// only leaves about 1s of clip remaining before the video ends, which is
// not enough time to naturally speak the CTA sentence — the audio most
// likely does not say "保存して、フォローの仕方を見直してください" out loud
// in this particular render. The CTA caption is still shown (every post
// needs its CTA on screen), but flagged below as text-only, unsynced.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
	/** true if this caption's timing is NOT backed by a detected speech window */
	unsynced?: boolean;
};

export const alignedSegments: AlignedSegment[] = [
	// Hook — fixed overlay, not tied to speech; ends right as real speech
	// begins (1.236s) so it hands off cleanly instead of overlapping.
	{kind: 'hook', text: '【介護管理者様】\n「あとよろしく」で、\n終わらせていませんか', startSeconds: 0, endSeconds: 1.236},

	// Scene 1 — speech windows A, B, C (1.236–5.105s), each held ~1.2s
	// into its following pause so the caption doesn't vanish before the
	// next one is ready, but the last one is NOT held across the long
	// 5.1–10.0s gap (see note above) — nothing is said there, so nothing
	// is captioned there either.
	{kind: 'line', text: '『あとよろしく』、', startSeconds: 1.236, endSeconds: 2.703},
	{kind: 'line', text: 'それだけで', startSeconds: 2.703, endSeconds: 3.947},
	{kind: 'line', text: '終わらせていませんか。', startSeconds: 3.947, endSeconds: 6.3},

	// (6.3s–10.0s: no caption — this is the real ~4.9s silence)

	// Scene 2 — speech windows D–I (10.0–24.3s). D/E/F each covered two
	// script phrases spoken together with no detected pause between them,
	// so those are merged into one caption instead of splitting mid-window.
	{kind: 'line', text: '管理職が陥りやすい\nもうひとつの落とし穴に、', startSeconds: 10.003, endSeconds: 13.252},
	{kind: 'line', text: '「放置マンタイプ」という\n傾向があります。', startSeconds: 13.252, endSeconds: 15.46},
	{kind: 'line', text: '任せた後の\n進捗確認を怠ると、', startSeconds: 15.46, endSeconds: 18.398},
	{kind: 'line', text: '『大丈夫です』という', startSeconds: 18.398, endSeconds: 21.273},
	{kind: 'line', text: '一言だけが', startSeconds: 21.273, endSeconds: 22.47},
	{kind: 'line', text: '積み重なっていくようです。', startSeconds: 22.47, endSeconds: 25.37},

	// Scene 3 — speech windows J, K (25.37–28.963s).
	{kind: 'line', text: '任せることと、', startSeconds: 25.37, endSeconds: 26.493},
	{kind: 'line', text: '任せきりは、\n違うのかもしれません。', startSeconds: 26.493, endSeconds: 28.963},

	// CTA — the clip almost certainly runs out before speaking this line
	// in full (see note above). Shown as a text-only closing card over
	// the clip's final ~1.5s; not synced to audio.
	{kind: 'cta', text: '保存して、\nフォローの仕方を\n見直してください。', startSeconds: 28.5, endSeconds: 30.016, unsynced: true},
];
