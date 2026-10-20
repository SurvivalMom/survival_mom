import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';

type Props = {
	src: string;
	/** Seconds into the source file to start playback from (for trimming a longer clip down to one scene's portion). */
	startFromSeconds?: number;
	/** Mute the clip's own audio -- for a clip reused later in the timeline purely for its visuals (its original dialogue has already played once and would otherwise clash with new captions). */
	muted?: boolean;
};

/**
 * Plays AI-generated footage (with its own audio, unless muted) as the
 * full-bleed background, in place of the abstract gradient used in the
 * text-only mode. `src` is a path relative to the project's `public/`
 * folder, resolved via Remotion's `staticFile()`.
 */
export const VideoBackground: React.FC<Props> = ({src, startFromSeconds = 0, muted = false}) => {
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo
				src={staticFile(src)}
				startFrom={Math.round(startFromSeconds * fps)}
				muted={muted}
				style={{width: '100%', height: '100%', objectFit: 'cover'}}
			/>
		</AbsoluteFill>
	);
};
