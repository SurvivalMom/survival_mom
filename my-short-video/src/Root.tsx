import React from 'react';
import {Composition} from 'remotion';
import {Ura07Composition} from './Ura07Composition';
import {TOTAL_DURATION_IN_FRAMES, FPS} from './script';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Ura07"
				component={Ura07Composition}
				defaultProps={{fps: FPS}}
				durationInFrames={TOTAL_DURATION_IN_FRAMES}
				fps={FPS}
				width={1080}
				height={1920}
			/>
		</>
	);
};
