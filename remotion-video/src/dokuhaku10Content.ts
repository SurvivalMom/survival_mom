// Caption timing for public/source-videos/dokuhaku-10-ichiban-raw.mp4
// (自分が一番うまい、を何年続けていますか), a single continuous
// AI-generated talking-head clip, same format as dokuhaku-09.
//
// Method: no Whisper/ASR access in this sandbox (see audioAlignedContent.ts
// for the full explanation), so speech/pause boundaries were measured with
// `ffmpeg -af silencedetect=noise=-30dB:d=0.3` and matched to the script's
// 3 scenes in order, cross-checked against each scene's character count at
// a plausible narration rate (~7-9 chars/sec here) before assigning:
//   - Scene 1 (33 chars) -- the clip's first 3 speech bursts (0.698-6.672s,
//     ~4.5s of speech) end right before the clip's one long pause
//     (6.672-10.047s, 3.4s) -- a clean scene boundary, same shape as
//     dokuhaku-09's Scene1/Scene2 gap.
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

export type AlignedSegment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	startSeconds: number;
	endSeconds: number;
	unsynced?: boolean;
};

export const SOURCE_VIDEO = 'source-videos/dokuhaku-10-ichiban-raw.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 30.016;

export const dokuhaku10Segments: AlignedSegment[] = [
	// Hook -- fixed overlay, ends right as real speech begins.
	{kind: 'hook', text: '自分が一番うまい、\nを何年続けて\nいますか', startSeconds: 0, endSeconds: 0.698},

	// Scene 1 -- 3 speech bursts (0.698-6.672s), held briefly into the
	// long pause that follows before going blank.
	{kind: 'line', text: '管理職になって\n何年経っても、', startSeconds: 0.698, endSeconds: 2.9},
	{kind: 'line', text: '現場で\n一番うまいのは', startSeconds: 2.9, endSeconds: 5.3},
	{kind: 'line', text: '自分のまま\nですか。', startSeconds: 5.3, endSeconds: 7.9},

	// (6.672-10.047s: the clip's one long pause -- no caption, same
	// convention as dokuhaku-09's Scene1/Scene2 gap, left uncut here)

	// Scene 2 -- 3 speech bursts (10.047-20.098s), each split into 2
	// short captions rather than one long multi-line block.
	{kind: 'line', text: 'これは、\n管理職が陥りやすい', startSeconds: 10.047, endSeconds: 12.2},
	{kind: 'line', text: '落とし穴の\nひとつのようです。', startSeconds: 12.2, endSeconds: 14.5},
	{kind: 'line', text: '自分が一番\nできてしまうと、', startSeconds: 14.5, endSeconds: 16.8},
	{kind: 'line', text: '無意識のうちに\n人に教える機会を', startSeconds: 16.8, endSeconds: 18.69},
	{kind: 'line', text: '手放してしまう\n傾向が見えてきます。', startSeconds: 18.69, endSeconds: 20.3},

	// Scene 3 -- 4 speech bursts (21.370-28.421s). The realization half
	// stays at chin level; the CTA half moves to the top of frame (same
	// convention as dokuhaku-09 and shoseijutsu-02's CTAs).
	{kind: 'line', text: '教えてこなかったのは、', startSeconds: 21.37, endSeconds: 22.9},
	{kind: 'line', text: '自分だったのかも\nしれません。', startSeconds: 22.9, endSeconds: 24.5},
	{kind: 'cta', text: '保存して、\n育成の仕方を', startSeconds: 24.5, endSeconds: 26.3},
	{kind: 'cta', text: '見直すきっかけに\nしてください。', startSeconds: 26.3, endSeconds: 28.421},
];
