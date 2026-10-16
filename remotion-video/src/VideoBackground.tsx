import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile} from 'remotion';

type Props = {
	src: string;
};

/**
 * Plays the AI-generated talking-head footage (with its own audio) as
 * the full-bleed background, in place of the abstract gradient used in
 * the text-only mode. `src` is a path relative to the project's
 * `public/` folder, resolved via Remotion's `staticFile()`.
 */
export const VideoBackground: React.FC<Props> = ({src}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<OffthreadVideo src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
		</AbsoluteFill>
	);
};
