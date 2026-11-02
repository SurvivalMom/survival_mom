import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ura06Segments, ura06Header, SOURCE_VIDEO} from './ura06Content';
import {VideoBackground} from './VideoBackground';
import {Telop, HeaderTelop} from './Telop';

/**
 * ura-06「空欄のままのフィードバック欄」. Same layout as
 * CompositionUra01〜05: a persistent HeaderTelop pinned to the top for
 * the whole clip, and a lower Telop layer that's blank during Scene 1
 * and changes per scene afterward, vertically centered to stay clear of
 * both the header and Instagram's own posted-account chrome. 90px
 * horizontal safe-zone padding on both layers, matching the account's
 * telop design reference.
 */
export const Ura06WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />

			{/* The evaluation record's printed heading renders as a garbled
			    Latin-letter brand name (e.g. "Flocolesen評価表"), which the
			    brief said to avoid entirely. It's small and easy to miss,
			    but blurred out regardless rather than left as-is. Two
			    time-boxed overlays, not one: the heading sits in a
			    different screen position before vs. after the camera
			    settles into its close framing, so a single fixed box can't
			    cover both without also blurring the blank feedback column
			    in between. Each box's position was read off a rendered
			    frame from that window, not computed. */}
			<Sequence from={0} durationInFrames={Math.round(2.0 * fps)}>
				<div
					style={{
						position: 'absolute',
						left: 230,
						top: 693,
						width: 180,
						height: 36,
						backdropFilter: 'blur(10px)',
						WebkitBackdropFilter: 'blur(10px)',
					}}
				/>
			</Sequence>
			<Sequence from={Math.round(2.0 * fps)} durationInFrames={Math.round(3.5 * fps)}>
				<div
					style={{
						position: 'absolute',
						left: 225,
						top: 438,
						width: 235,
						height: 52,
						backdropFilter: 'blur(10px)',
						WebkitBackdropFilter: 'blur(10px)',
					}}
				/>
			</Sequence>

			{/* Persistent header layer -- not wrapped in a Sequence, so it
			    renders from frame 0 through the composition's full duration
			    with no mount/unmount re-trigger. */}
			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '96px 90px 0'}}>
				<HeaderTelop text={ura06Header} />
			</AbsoluteFill>

			{/* Lower telop layer -- blank during Scene 1 (no segment covers
			    0-2.0s), then changes per scene. */}
			{ura06Segments.map((segment, i) => {
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
