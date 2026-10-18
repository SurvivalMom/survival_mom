// Caption timing for public/source-videos/dokuhaku-09-houchi-cut.mp4,
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
// Post-cut update: the raw clip had one real ~4.9s silence between
// Scene 1 and Scene 2 (measured 5.105s–10.003s). That silence has since
// been physically removed from the video itself (ffmpeg trim+concat,
// cut window 5.4s–9.7s, 4.3s removed — padded ~0.3s on each side of the
// measured speech boundaries). Every timestamp below that originally
// fell at/after 9.7s has been shifted back by 4.3s to match, and the
// "終わらせていませんか。" caption's end was pulled in from the old 6.3s
// to exactly 5.4s, the new cut point, so no caption lingers into the cut.
//
// The last detected speech window (originally 26.5s–29.0s, now
// 22.2s–24.663s, "任せきりは、違うのかもしれません。") only leaves about
// 1s of clip remaining before the new video end (25.732s) — not enough
// time to naturally speak the CTA sentence, so the audio most likely
// does not say "保存して、フォローの仕方を見直してください" out loud in
// this particular render. The CTA caption is still shown (every post
// needs its CTA on screen) and is flagged below as text-only, unsynced.
// It was also moved to the top of the frame (see CompositionWithFootage)
// because at the chin position it visually collided with the final
// spoken line's caption; now that they're in separate screen regions,
// the CTA is given a longer, more readable window (from the start of
// Scene 3's last line through the end of the clip) instead of being
// squeezed into the final ~1.5s.

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
	{kind: 'hook', text: '「あとよろしく」で、\n終わらせていませんか', startSeconds: 0, endSeconds: 1.236},

	// Scene 1 — speech windows A, B, C (1.236–5.4s), each held ~1.2s into
	// its following pause so the caption doesn't vanish before the next
	// one is ready. The clip now cuts to Scene 2 right at 5.4s, so the
	// last line's end is pulled in to exactly that point.
	{kind: 'line', text: '『あとよろしく』、', startSeconds: 1.236, endSeconds: 2.703},
	{kind: 'line', text: 'それだけで', startSeconds: 2.703, endSeconds: 3.947},
	{kind: 'line', text: '終わらせていませんか。', startSeconds: 3.947, endSeconds: 5.4},

	// (the ~4.9s silence that used to sit here has been cut from the
	// video itself; everything below is shifted back by 4.3s to match)

	// Scene 2 — speech windows D–I. D/E/F each covered two script phrases
	// spoken together with no detected pause between them, so those are
	// merged into one caption instead of splitting mid-window.
	{kind: 'line', text: '管理職が陥りやすい\nもうひとつの落とし穴に、', startSeconds: 5.703, endSeconds: 8.952},
	{kind: 'line', text: '「放置マンタイプ」という\n傾向があります。', startSeconds: 8.952, endSeconds: 11.16},
	{kind: 'line', text: '任せた後の\n進捗確認を怠ると、', startSeconds: 11.16, endSeconds: 14.098},
	{kind: 'line', text: '『大丈夫です』という', startSeconds: 14.098, endSeconds: 16.973},
	{kind: 'line', text: '一言だけが', startSeconds: 16.973, endSeconds: 18.17},
	{kind: 'line', text: '積み重なっていくようです。', startSeconds: 18.17, endSeconds: 21.07},

	// Scene 3 — speech windows J, K.
	{kind: 'line', text: '任せることと、', startSeconds: 21.07, endSeconds: 22.193},
	{kind: 'line', text: '任せきりは、\n違うのかもしれません。', startSeconds: 22.193, endSeconds: 24.663},

	// CTA — now positioned at the top of the frame (see
	// CompositionWithFootage.tsx), so it no longer needs to dodge the
	// line caption above it. Given a longer, more readable window
	// spanning Scene 3's final line through the end of the clip, rather
	// than squeezed into the last ~1.5s.
	{kind: 'cta', text: '保存して、\nフォローの仕方を\n見直してください。', startSeconds: 21.07, endSeconds: 25.732, unsynced: true},
];
