import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {segments} from './content';
import {buildScaledTimeline} from './timing';
import {VideoBackground} from './VideoBackground';
import {Telop} from './Telop';

// public/source-videos/dokuhaku-09-houchi-raw.mp4 — AI-generated
// talking-head footage of the アナリスト character, 720x1280, 24fps,
// with its own spoken audio track (confirmed via ffprobe: 30.016s).
export const SOURCE_VIDEO = 'source-videos/dokuhaku-09-houchi-raw.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 30.016;

/**
 * Same telop treatment as DokuhakuShort (Composition.tsx), but composited
 * over the real AI-generated talking-head clip instead of a text-only
 * gradient background — this is the "automate the 後編集 telop pass"
 * version. Caption timing is proportionally scaled to fill the clip's
 * actual length (see buildScaledTimeline); it is not a frame-accurate
 * transcript alignment, so re-check captions against the audio in
 * Remotion Studio and nudge any that drift before export.
 */
export const DokuhakuShortWithFootage: React.FC<{fps: number}> = ({fps}) => {
	const totalFrames = Math.ceil(SOURCE_VIDEO_DURATION_IN_SECONDS * fps);
	const timeline = buildScaledTimeline(segments, totalFrames);

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />
			{timeline.map((segment, i) => (
				<Sequence
					key={i}
					from={segment.from}
					durationInFrames={segment.durationInFrames}
					name={segment.text.replace(/\n/g, ' ').slice(0, 24)}
				>
					<AbsoluteFill
						style={{
							justifyContent: segment.kind === 'hook' ? 'flex-start' : 'flex-end',
							alignItems: 'center',
							padding: '0 36px',
							paddingTop: segment.kind === 'hook' ? 64 : undefined,
							paddingBottom: segment.kind === 'hook' ? undefined : 120,
						}}
					>
						<Telop segment={segment} />
					</AbsoluteFill>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
