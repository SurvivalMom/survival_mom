import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';

type Props = {
	src: string;
	/** Seconds into the source file to start playback from (for trimming a longer clip down to one scene's portion). */
	startFromSeconds?: number;
	/** Mute the clip's own audio -- for a clip reused later in the timeline purely for its visuals (its original dialogue has already played once and would otherwise clash with new captions). */
	muted?: boolean;
	/**
	 * Gaussian blur radius (px, at this composition's native resolution)
	 * applied to the video layer only -- never the telop layers, which are
	 * separate sibling AbsoluteFills stacked on top and unaffected by this
	 * filter. For footage whose AI-generated content renders legible text
	 * the brief called for staying abstract/illegible (e.g. a phone's
	 * messaging-app screen), so it needs obscuring after the fact rather
	 * than left readable. Must be baked in at render time like this --
	 * blurring the already-composited output would blur the telop too.
	 */
	blurPx?: number;
};

/**
 * Plays AI-generated footage (with its own audio, unless muted) as the
 * full-bleed background, in place of the abstract gradient used in the
 * text-only mode. `src` is a path relative to the project's `public/`
 * folder, resolved via Remotion's `staticFile()`.
 */
export const VideoBackground: React.FC<Props> = ({src, startFromSeconds = 0, muted = false, blurPx}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo
				src={staticFile(src)}
				startFrom={Math.round(startFromSeconds * fps)}
				muted={muted}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					// Slight overscan so the blur's edge softening doesn't
					// reveal a sharp, un-blurred sliver at the frame edge.
					...(blurPx ? {filter: `blur(${blurPx}px)`, transform: 'scale(1.08)'} : {}),
				}}
			/>
		</AbsoluteFill>
	);
};
