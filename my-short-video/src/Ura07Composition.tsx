import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {Background} from './components/Background';
import {SceneIllustration} from './components/SceneIllustration';
import {HeaderTelop} from './components/HeaderTelop';
import {Telop} from './components/Telop';
import {HEADER_DURATION_SECONDS, sfxCues, telopCards} from './script';

/**
 * ura-07「小さな傲慢に気づいた夜」, built per the task's detailed prompt
 * (illustrated background + synthesized SFX, since no source footage
 * exists for this episode) rather than the rest of the ura series'
 * real-footage + shared-component pipeline in remotion-video/. See
 * script.ts for the full timeline and the intentional deviations from
 * the md it's built from.
 */
export const Ura07Composition: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Background />
			<SceneIllustration />

			{/* Persistent header -- not wrapped in a Sequence further than its
			    own fixed duration, so it never re-triggers an entrance. */}
			<Sequence durationInFrames={Math.round(HEADER_DURATION_SECONDS * fps)} name="header">
				<AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', padding: '88px 90px 0'}}>
					<HeaderTelop />
				</AbsoluteFill>
			</Sequence>

			{/* Lower telop cards */}
			{telopCards.map((card, i) => {
				const from = Math.round(card.startSeconds * fps);
				const durationInFrames = Math.max(1, Math.round((card.endSeconds - card.startSeconds) * fps));
				return (
					<Sequence
						key={i}
						from={from}
						durationInFrames={durationInFrames}
						name={card.text.replace(/\n/g, ' ')}
					>
						{/* Positioned in the fixed gap between the header (bottom
						    edge ~424px: 88px top padding + the 3-line header box)
						    and the notebook illustration (SceneIllustration.tsx
						    starts its notebook at 44% of the 1920px frame height,
						    i.e. ~845px) -- centered within that band via real pixel
						    `top`/`height`, not a percentage `marginTop` (which CSS
						    resolves against the containing block's *width*, not its
						    height, and does not actually land where intended; that
						    was the earlier bug). Keeping this band entirely above
						    the notebook, rather than reaching into the notebook's
						    own internal blank line-gap, means any card -- 1 line or
						    2 -- stays clear of the "申し送りノート" label
						    regardless of its rendered height, per the brief
						    ("テロップの裏は余白にする"). */}
						<AbsoluteFill
							style={{
								top: 454,
								bottom: 'auto',
								height: 805 - 454,
								justifyContent: 'center',
								alignItems: 'center',
								padding: '0 90px',
							}}
						>
							<Telop card={card} />
						</AbsoluteFill>
					</Sequence>
				);
			})}

			{/* SFX -- each cue is its own Audio track, started at its own
			    offset, so they can overlap freely (e.g. room tone under
			    everything else). */}
			{sfxCues.map((cue, i) => (
				<Sequence key={i} from={Math.round(cue.startSeconds * fps)} name={cue.src}>
					<Audio src={staticFile(`audio/${cue.src}`)} volume={cue.volume} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
