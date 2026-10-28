import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ura02Segments, ura02Header, SOURCE_VIDEO} from './ura02Content';
import {VideoBackground} from './VideoBackground';
import {Telop, HeaderTelop} from './Telop';

/**
 * ura-02「消えた自分の字」. Same layout as CompositionUra01: a persistent
 * HeaderTelop pinned to the top for the whole clip, and a lower Telop
 * layer that's blank during Scene 1 and changes per scene afterward,
 * vertically centered to stay clear of both the header and Instagram's
 * own posted-account chrome at the bottom. Horizontal padding (90px) on
 * both layers matches the account's telop design reference's 12.5%
 * safe-zone margin -- see CompositionUra01.tsx for the full rationale.
 */
export const Ura02WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />

			{/* Persistent header layer -- not wrapped in a Sequence, so it
			    renders from frame 0 through the composition's full duration
			    with no mount/unmount re-trigger. */}
			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '96px 90px 0'}}>
				<HeaderTelop text={ura02Header} />
			</AbsoluteFill>

			{/* Lower telop layer -- blank during Scene 1 (no segment covers
			    0-4.5s), then changes per scene. */}
			{ura02Segments.map((segment, i) => {
				const from = Math.round(segment.startSeconds * fps);
				const durationInFrames = Math.max(1, Math.round((segment.endSeconds - segment.startSeconds) * fps));
				return (
					<Sequence
						key={i}
						from={from}
						durationInFrames={durationInFrames}
						name={segment.text.replace(/\n/g, ' ').slice(0, 24)}
					>
						<AbsoluteFill
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								padding: '0 90px',
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
