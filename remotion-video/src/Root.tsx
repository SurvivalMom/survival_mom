import React from 'react';
import {Composition} from 'remotion';
import {DokuhakuShort} from './Composition';
import {DokuhakuShortWithFootage, SOURCE_VIDEO_DURATION_IN_SECONDS} from './CompositionWithFootage';
import {segments} from './content';
import {totalDurationInFrames} from './timing';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* Text-only mode: telops over an abstract gradient background. */}
			<Composition
				id="DokuhakuShort"
				component={DokuhakuShort}
				durationInFrames={totalDurationInFrames(segments)}
				fps={FPS}
				width={1080}
				height={1920}
			/>
			{/* Footage mode: same telops composited over the real AI-generated
			    talking-head clip (public/source-videos/dokuhaku-09-houchi-raw.mp4). */}
			<Composition
				id="DokuhakuShortWithFootage"
				component={DokuhakuShortWithFootage}
				defaultProps={{fps: FPS}}
				durationInFrames={Math.ceil(SOURCE_VIDEO_DURATION_IN_SECONDS * FPS)}
				fps={FPS}
				width={720}
				height={1280}
			/>
		</>
	);
};
