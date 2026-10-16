import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {alignedSegments} from './audioAlignedContent';
import {VideoBackground} from './VideoBackground';
import {Telop} from './Telop';

// public/source-videos/dokuhaku-09-houchi-raw.mp4 — AI-generated
// talking-head footage of the アナリスト character, 720x1280, 24fps,
// with its own spoken audio track (confirmed via ffprobe: 30.016s).
export const SOURCE_VIDEO = 'source-videos/dokuhaku-09-houchi-raw.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 30.016;

/**
 * Same telop treatment as DokuhakuShort (Composition.tsx), composited
 * over the real AI-generated talking-head clip. Caption timing here
 * comes from audioAlignedContent.ts, which is anchored to pauses
 * actually measured in the clip's audio (ffmpeg silencedetect) rather
 * than a flat proportional estimate from text length — see that file's
 * header comment for method and known limitations (the CTA caption in
 * particular is not backed by detected speech; see `unsynced`).
 *
 * Caption position: centered around the lower-face / chin area rather
 * than hugging the bottom edge, per request. The hook banner stays at
 * the top (same place every produced video in this account uses it).
 */
export const DokuhakuShortWithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />
			{alignedSegments.map((segment, i) => {
				const from = Math.round(segment.startSeconds * fps);
				const durationInFrames = Math.max(
					1,
					Math.round((segment.endSeconds - segment.startSeconds) * fps),
				);
				return (
					<Sequence
						key={i}
						from={from}
						durationInFrames={durationInFrames}
						name={segment.text.replace(/\n/g, ' ').slice(0, 24)}
					>
						<AbsoluteFill
							style={{
								justifyContent: segment.kind === 'hook' ? 'flex-start' : 'center',
								alignItems: 'center',
								padding: '0 36px',
								paddingTop: segment.kind === 'hook' ? 64 : undefined,
								// Nudge below true vertical center so captions land
								// around the jaw/chin, not over the eyes/mouth.
								transform: segment.kind === 'hook' ? undefined : 'translateY(18%)',
							}}
						>
							<Telop segment={segment} />
						</AbsoluteFill>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};
