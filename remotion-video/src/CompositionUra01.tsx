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
 * Unlike CompositionDokuhaku10, every lower-telop kind is anchored toward
 * the bottom third of frame here (not centered/top), both to match this
 * footage's own framing (the source prompts left the lower third clean for
 * text) and to stay clear of the persistent header above.
 *
 * Top/bottom padding is kept clear of where Instagram's own Reels chrome
 * sits once posted (profile pic/follow button and the mute icon near the
 * very top; caption text and the like/comment/share column near the very
 * bottom) -- neither is visible in this raw render, so there's nothing to
 * preview here, but the margin is sized generously against that UI rather
 * than against this preview's own edges.
 */
export const Ura01WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src={SOURCE_VIDEO} />

			{/* Persistent header layer -- not wrapped in a Sequence, so it
			    renders from frame 0 through the composition's full duration
			    with no mount/unmount re-trigger. */}
			<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 96}}>
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
								justifyContent: 'flex-end',
								alignItems: 'center',
								padding: '0 36px',
								paddingBottom: 180,
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
