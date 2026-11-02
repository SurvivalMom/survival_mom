import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ura05Segments, ura05Header, SOURCE_VIDEO} from './ura05Content';
import {VideoBackground} from './VideoBackground';
import {Telop, HeaderTelop} from './Telop';

/**
 * ura-05「送れなかった一言」. Same layout as CompositionUra01〜04: a
 * persistent HeaderTelop pinned to the top for the whole clip, and a
 * lower Telop layer that's blank during Scene 1 and changes per scene
 * afterward, vertically centered to stay clear of both the header and
 * Instagram's own posted-account chrome. 90px horizontal safe-zone
 * padding on both layers, matching the account's telop design reference.
 */
export const Ura05WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			{/* Blurred: the AI-generated footage renders the phone's
			    messaging-app screen legibly (e.g. "利用者状況：夜間良眠"),
			    even though the brief called for that content to stay
			    abstract/illegible -- left sharp, it reads as a staff member
			    discussing resident information over a personal messaging
			    app, which this account must not appear to endorse. */}
			<VideoBackground src={SOURCE_VIDEO} blurPx={18} />

			{/* Persistent header layer -- not wrapped in a Sequence, so it
			    renders from frame 0 through the composition's full duration
			    with no mount/unmount re-trigger. */}
			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '96px 90px 0'}}>
				<HeaderTelop text={ura05Header} />
			</AbsoluteFill>

			{/* Lower telop layer -- blank during Scene 1 (no segment covers
			    0-2.0s), then changes per scene. */}
			{ura05Segments.map((segment, i) => {
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
