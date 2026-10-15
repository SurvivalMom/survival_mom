import React from 'react';
import {Composition} from 'remotion';
import {DokuhakuShort} from './Composition';
import {segments} from './content';
import {totalDurationInFrames} from './timing';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<Composition
			id="DokuhakuShort"
			component={DokuhakuShort}
			durationInFrames={totalDurationInFrames(segments)}
			fps={FPS}
			width={1080}
			height={1920}
		/>
	);
};
