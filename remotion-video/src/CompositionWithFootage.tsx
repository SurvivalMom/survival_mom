import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {alignedSegments} from './audioAlignedContent';
import {VideoBackground} from './VideoBackground';
import {Telop} from './Telop';

// public/source-videos/dokuhaku-09-houchi-cut.mp4 — the raw AI-generated
// talking-head footage with the dead-air silence between Scene 1 and
// Scene 2 (originally ~5.4s–9.7s) physically cut out via ffmpeg
// trim+concat. 720x1280, 24fps, confirmed via ffprobe: 25.732s (down
// from the original 30.016s). See audioAlignedContent.ts for how the
// caption timestamps were shifted to match this new timeline.
export const SOURCE_VIDEO = 'source-videos/dokuhaku-09-houchi-cut.mp4';
export const SOURCE_VIDEO_DURATION_IN_SECONDS = 25.732;

/**
 * Same telop treatment as DokuhakuShort (Composition.tsx), composited
 * over the real AI-generated talking-head clip. Caption timing here
 * comes from audioAlignedContent.ts, which is anchored to pauses
 * actually measured in the clip's audio (ffmpeg silencedetect) rather
 * than a flat proportional estimate from text length — see that file's
 * header comment for method and known limitations (the CTA caption in
 * particular is not backed by detected speech; see `unsynced`).
 *
 * Caption position: regular lines are centered around the lower-face /
 * chin area rather than hugging the bottom edge, per request. The hook
 * banner and the closing CTA both sit at the top of the frame instead —
 * the CTA was moved there because it was colliding with the final
 * spoken line's caption at the chin position; overlapping the face at
 * the very end of the clip is acceptable per request.
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
								justifyContent: segment.kind === 'line' ? 'center' : 'flex-start',
								alignItems: 'center',
								padding: '0 36px',
								paddingTop: segment.kind === 'line' ? undefined : 64,
								// Nudge below true vertical center so regular-line
								// captions land around the jaw/chin, not over the
								// eyes/mouth. Hook and CTA stay pinned to the top.
								transform: segment.kind === 'line' ? 'translateY(18%)' : undefined,
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
