// Caption/footage timeline for shoseijutsu-02-shinnin-kawasugi
// (新任管理者ほど、最初に変えすぎない), built from 3 separately AI-generated
// clips rather than one continuous talking-head take:
//
//   analyst-speaking.mp4   -- アナリスト, camera-facing (Scene 1 + reused for Scene 5)
//   corkboard-notebook.mp4 -- bulletin board -> handover notebook B-roll (Scene 2 + 3)
//   hand-drawing.mp4       -- memo pad, hand drawing 3 bullet points (Scene 4)
//
// None of the clips were transcribed (no Whisper access in this sandbox,
// same constraint as dokuhaku-09 -- see audioAlignedContent.ts). Instead,
// each clip's speech/pause boundaries were measured with
// `ffmpeg -af silencedetect=noise=-30dB:d=0.3`, and the total detected
// speech duration in each clip was checked against the character count
// of its corresponding script line(s) at a plausible Japanese narration
// rate (~6-7 chars/sec) to confirm the match before assigning captions:
//   - analyst-speaking.mp4: ~7.3s of detected speech vs. Scene 1's
//     36-char line (~5-6s expected) -- consistent. The clip's 3 speech
//     bursts (0.45-1.68s / 2.05-4.73s / 6.12-9.47s) line up with the
//     line's 3 natural clauses.
//   - corkboard-notebook.mp4: ~22s of detected speech vs. Scene 2 + 3
//     combined (~130 chars, ~21-22s expected) -- consistent. The
//     Scene 2/Scene 3 boundary was placed at the clearest mid-clip
//     pause (14.41-15.16s), close to the ~10s-of-speech crossover point
//     predicted by each scene's share of the combined character count.
//   - hand-drawing.mp4: ~7.5s of detected speech vs. Scene 4's 55-char
//     line (~7-8s expected) -- consistent.
// Within each scene's window, individual captions are placed at that
// scene's own natural clause breaks, spaced proportionally to each
// clause's character count (not independently re-verified against
// speech -- same caveat as the merged-window captions in
// audioAlignedContent.ts).
//
// Scene 5 (closing + CTA) has no dedicated footage or spoken audio --
// analyst-speaking.mp4 is reused for its visual (same setting as
// Scene 1, per the script), muted, with the closing line and CTA shown
// as text-only captions. Flagged `unsynced` below, same convention as
// dokuhaku-09's CTA.

export type Segment = {
	text: string;
	kind: 'hook' | 'line' | 'cta';
	/** Seconds, local to this block's own video clip. */
	startSeconds: number;
	endSeconds: number;
	/** true if this caption's timing is NOT backed by detected speech in this block's clip. */
	unsynced?: boolean;
};

export type VideoBlock = {
	src: string;
	/** Seconds into the source file this block starts playing from. */
	trimStartSeconds: number;
	durationSeconds: number;
	/** Mute this block's clip audio (for a clip reused later purely for its visuals). */
	muted?: boolean;
	segments: Segment[];
};

export const shoseijutsu02Blocks: VideoBlock[] = [
	// Scene 1 -- アナリスト, camera-facing. Hook banner, then the spoken
	// hook line split at its 2 natural clause breaks.
	{
		src: 'source-videos/shoseijutsu-02/analyst-speaking.mp4',
		trimStartSeconds: 0,
		durationSeconds: 9.5,
		segments: [
			{kind: 'hook', text: '新任管理者が、最初に\nやってはいけないこと', startSeconds: 0, endSeconds: 1.3},
			{kind: 'line', text: '最初の一週間で\n避けたいことが\nあります。', startSeconds: 1.3, endSeconds: 5.0},
			{kind: 'line', text: 'それは\n改革宣言です。', startSeconds: 5.0, endSeconds: 9.5},
		],
	},
	// Scene 2 + 3 -- bulletin board / handover notebook B-roll, voice
	// continues over both. Trimmed to this clip's detected speech span.
	{
		src: 'source-videos/shoseijutsu-02/corkboard-notebook.mp4',
		trimStartSeconds: 1.09,
		durationSeconds: 28.69,
		segments: [
			{kind: 'line', text: '着任直後に\n『前のやり方は非効率です』と\n変え始めると、', startSeconds: 0, endSeconds: 5.15},
			{kind: 'line', text: '職員は内容よりも\n『自分たちを否定された』と\n受け取ってしまう\n傾向があるようです。', startSeconds: 5.15, endSeconds: 13.32},
			{kind: 'line', text: '最初の30日は、\n申し送りで詰まる場所、\n記録に時間がかかる場面、\n誰に相談が集まるかを\n観察してみてください。', startSeconds: 14.07, endSeconds: 24.36},
			{kind: 'line', text: '現場には、\n資料に出ない\n理由があるものです。', startSeconds: 24.36, endSeconds: 28.69},
		],
	},
	// Scene 4 -- memo pad, hand drawing 3 bullet points.
	{
		src: 'source-videos/shoseijutsu-02/hand-drawing.mp4',
		trimStartSeconds: 0,
		durationSeconds: 9.61,
		segments: [
			{kind: 'line', text: 'そのうえで、\n一つだけ変える。', startSeconds: 0, endSeconds: 2.45},
			{kind: 'line', text: '何を守るか、\n何を変えるか、\nいつ振り返るか。', startSeconds: 2.45, endSeconds: 6.12},
			{kind: 'line', text: 'この3つを\n職員と共有すると\nよさそうです。', startSeconds: 6.12, endSeconds: 9.61},
		],
	},
	// Scene 5 -- analyst-speaking.mp4 reused (muted); no spoken audio for
	// this closing line or the CTA, both shown as text-only captions.
	{
		src: 'source-videos/shoseijutsu-02/analyst-speaking.mp4',
		trimStartSeconds: 0,
		durationSeconds: 7.0,
		muted: true,
		segments: [
			{kind: 'line', text: '早く成果を出すより、\n長く協力される\n管理者の方が\nうまくいくようです。', startSeconds: 0, endSeconds: 3.3, unsynced: true},
			{kind: 'cta', text: '保存して、\n着任直後に見たかった\n現場のポイントを、\n次の面談で\n使ってください。', startSeconds: 3.3, endSeconds: 7.0, unsynced: true},
		],
	},
];

export const shoseijutsu02DurationInFrames = (fps: number): number =>
	shoseijutsu02Blocks.reduce((total, block) => total + Math.round(block.durationSeconds * fps), 0);
