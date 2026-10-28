import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ura01Segments, ura01Header, SOURCE_VIDEO} from './ura01Content';
import {VideoBackground} from './VideoBackground';
import {Telop, HeaderTelop} from './Telop';

/**
 * ura-01「今日も『特変なし』と書いた」. First produced episode of the
 * "ura" scenic-monologue series: real AI-generated hand/notebook footage,
 * no on-screen person, two-layer telop (see ura01Content.ts) --
 * HeaderTelop stays pinned to the top for the whole clip, while the lower
 * Telop layer changes per scene and is deliberately blank for Scene 1.
 * The lower-telop layer is vertically centered (not bottom-anchored) --
 * per explicit feedback, anchoring it near the bottom edge put it under
 * Instagram's own posted-account chrome (username, caption text, the
 * like/comment/share column), which isn't visible in this raw render but
 * collides with text placed too close to that edge once actually posted.
 * Centering keeps it clear of both that zone and the persistent header
 * above regardless of how many lines a given caption wraps to.
 *
 * The header's own top padding is kept clear of Instagram's other chrome
 * near the very top (profile pic/follow button, the mute icon) for the
 * same reason.
 *
 * Horizontal padding on both layers is 90px -- 12.5% of this
 * composition's 720px width -- per the account's telop design reference,
 * which measured that margin against a real device comparison (content
 * can crop at the left/right edges on a narrower-aspect phone than the
 * one it was framed on). Telop/HeaderTelop's own maxWidth then narrows
 * further within that, so this is a floor, not the only margin.
 */
export const Ura01WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />

			{/* Persistent header layer -- not wrapped in a Sequence, so it
			    renders from frame 0 through the composition's full duration
			    with no mount/unmount re-trigger. */}
			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '96px 90px 0'}}>
				<HeaderTelop text={ura01Header} />
			</AbsoluteFill>

			{/* Lower telop layer -- blank during Scene 1 (no segment covers
			    0-5.5s), then changes per scene. */}
			{ura01Segments.map((segment, i) => {
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
