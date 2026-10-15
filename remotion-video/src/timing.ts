import {Segment} from './content';

// Rough reading-speed model for short-form JP telop: fast enough to feel
// "tempo good" (テンポよく) but never faster than a viewer can read.
// Minimum hold times keep very short bursts ("それだけで") from flashing by.
const FRAMES_PER_CHAR = 2.6;
const MIN_FRAMES: Record<Segment['kind'], number> = {
	hook: 75, // ~2.5s — full headline must be legible immediately (D-4-2: 0.0秒で全文表示)
	line: 22, // ~0.73s
	cta: 90, // ~3s — the save CTA gets extra hold time
};

export const durationInFrames = (segment: Segment): number => {
	const charCount = segment.text.replace(/\n/g, '').length;
	const estimated = Math.round(charCount * FRAMES_PER_CHAR);
	return Math.max(MIN_FRAMES[segment.kind], estimated);
};

export type TimedSegment = Segment & {
	from: number;
	durationInFrames: number;
};

export const buildTimeline = (segments: Segment[]): TimedSegment[] => {
	let cursor = 0;
	return segments.map((segment) => {
		const duration = durationInFrames(segment);
		const timed: TimedSegment = {...segment, from: cursor, durationInFrames: duration};
		cursor += duration;
		return timed;
	});
};

export const totalDurationInFrames = (segments: Segment[]): number =>
	buildTimeline(segments).reduce((sum, s) => sum + s.durationInFrames, 0);
