// Caption timing for public/source-videos/dokuhaku-10-ichiban-cut.mp4
// (自分が一番うまい、を何年続けていますか), a single continuous
// AI-generated talking-head clip, same format as dokuhaku-09.
//
// Method: no Whisper/ASR access in this sandbox (see audioAlignedContent.ts
// for the full explanation), so speech/pause boundaries were measured with
// `ffmpeg -af silencedetect=noise=-30dB:d=0.3` and matched to the script's
// 3 scenes in order, cross-checked against each scene's character count at
// a plausible narration rate (~7-9 chars/sec here) before assigning:
//   - Scene 1 (33 chars) -- the clip's first 3 speech bursts (0.698-6.672s,
//     ~4.5s of speech) end right before the clip's one long pause.
//   - Scene 2 (72 chars) -- the next 3 bursts (10.047-20.098s, ~8.6s of
//     speech), ending at the clip's second-longest pause
//     (20.098-21.370s, 1.27s).
//   - Scene 3 (51 chars, including the CTA sentence) -- the remaining
//     4 bursts (21.370-28.421s, ~5.8s of speech). Unlike dokuhaku-09, the
//     CTA line ("保存して、育成の仕方を見直してください") is fully spoken
//     here -- the clip doesn't run out before it, so nothing here is
//     flagged `unsynced`.
// Within each scene's window, individual captions are placed at that
// scene's own natural clause breaks, spaced proportionally to each
// clause's character count (not independently re-verified against
// speech -- same caveat as the other footage-mode videos in this project).
//
// Post-feedback revisions (same clip, 3 fixes):
//   1. Hook was on screen only 0-0.698s (the clip's pre-speech silence) --
//      too short to read a 3-line banner. Extended to 0-1.4s; Scene 1's
//      first caption now starts at 1.4s instead of 0.698s (the dialogue
//      audio itself is unchanged, so for 0.7s the viewer hears the first
//      words while still reading the hook banner, which is normal for
//      this kind of reveal).
//   2. Added a short synthesized whoosh+pop sound effect
//      (public/sfx/hook-pop.wav, ~0.31s) under the hook reveal at frame 0
//      -- it ends well before real speech starts at 0.698s, so it never
//      overlaps dialogue.
//   3. The clip's one long pause (originally 6.672-10.047s, 3.375s) read
//      as dead air. Cut down via ffmpeg trim+concat to a short natural
//      breath instead of removed outright: kept 0.3s of pause on each
//      side of the actual speech boundaries (cut window 6.97s-9.75s,
//      2.75s removed -- confirmed via ffprobe: clip is now 27.266s, down
//      from 30.016s). Scene 1's last caption was shortened to end at
//      6.97s (the new cut point) instead of lingering to 7.9s, and every
//      timestamp from the original Scene 2 onward is shifted back by the
//      measured 2.75s to match.

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
	unsynced?: boolean;
};

export const SOURCE_VIDEO = 'source-videos/dokuhaku-10-ichiban-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 27.266;
export const HOOK_SFX = 'sfx/hook-pop.wav';

export const dokuhaku10Segments: AlignedSegment[] = [
	// Hook -- extended to 1.4s (was 0.698s) so the 3-line banner has time
	// to be read; the dialogue's own first words start at 0.698s as
	// before, so the banner overlaps the very start of real speech.
	{kind: 'hook', text: '自分が一番うまい、\nを何年続けて\nいますか', startSeconds: 0, endSeconds: 1.4},

	// Scene 1 -- 3 speech bursts (0.698-6.672s). First caption now starts
	// at 1.4s (right as the hook clears); last caption ends at 6.97s, the
	// new cut point, instead of lingering into where the gap used to be.
	{kind: 'line', text: '管理職になって\n何年経っても、', startSeconds: 1.4, endSeconds: 2.9},
	{kind: 'line', text: '現場で\n一番うまいのは', startSeconds: 2.9, endSeconds: 5.3},
	{kind: 'line', text: '自分のまま\nですか。', startSeconds: 5.3, endSeconds: 6.97},

	// (the ~2.75s of the original pause that used to sit here has been
	// cut from the video itself; everything below is shifted back by the
	// measured 2.75s to match)

	// Scene 2 -- 3 speech bursts, each split into 2 short captions rather
	// than one long multi-line block.
	{kind: 'line', text: 'これは、\n管理職が陥りやすい', startSeconds: 7.297, endSeconds: 9.45},
	{kind: 'line', text: '落とし穴の\nひとつのようです。', startSeconds: 9.45, endSeconds: 11.75},
	{kind: 'line', text: '自分が一番\nできてしまうと、', startSeconds: 11.75, endSeconds: 14.05},
	{kind: 'line', text: '無意識のうちに\n人に教える機会を', startSeconds: 14.05, endSeconds: 15.94},
	{kind: 'line', text: '手放してしまう\n傾向が見えてきます。', startSeconds: 15.94, endSeconds: 17.55},

	// Scene 3 -- 4 speech bursts. The realization half stays at chin
	// level; the CTA half moves to the top of frame (same convention as
	// dokuhaku-09 and shoseijutsu-02's CTAs).
	{kind: 'line', text: '教えてこなかったのは、', startSeconds: 18.62, endSeconds: 20.15},
	{kind: 'line', text: '自分だったのかも\nしれません。', startSeconds: 20.15, endSeconds: 21.75},
	{kind: 'cta', text: '保存して、\n育成の仕方を', startSeconds: 21.75, endSeconds: 23.55},
	{kind: 'cta', text: '見直すきっかけに\nしてください。', startSeconds: 23.55, endSeconds: 25.671},
];
