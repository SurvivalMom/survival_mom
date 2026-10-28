import React from 'react';
import {Composition} from 'remotion';
import {DokuhakuShort} from './Composition';
import {DokuhakuShortWithFootage, SOURCE_VIDEO_DURATION_IN_SECONDS} from './CompositionWithFootage';
import {Shoseijutsu02WithFootage} from './CompositionShoseijutsu02';
import {Dokuhaku10WithFootage} from './CompositionDokuhaku10';
import {Ura01WithFootage} from './CompositionUra01';
import {Ura02WithFootage} from './CompositionUra02';
import {segments} from './content';
import {totalDurationInFrames} from './timing';
import {shoseijutsu02DurationInFrames} from './shoseijutsu02Content';
import {SOURCE_VIDEO_DURATION_IN_SECONDS as DOKUHAKU10_DURATION_IN_SECONDS} from './dokuhaku10Content';
import {SOURCE_VIDEO_DURATION_IN_SECONDS as URA01_DURATION_IN_SECONDS} from './ura01Content';
import {SOURCE_VIDEO_DURATION_IN_SECONDS as URA02_DURATION_IN_SECONDS} from './ura02Content';

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
			{/* shoseijutsu-02: assembled from 3 separate AI-generated clips
			    (see shoseijutsu02Content.ts) via Series rather than one
			    continuous talking-head take. */}
			<Composition
				id="Shoseijutsu02WithFootage"
				component={Shoseijutsu02WithFootage}
				durationInFrames={shoseijutsu02DurationInFrames(FPS)}
				fps={FPS}
				width={720}
				height={1280}
			/>
			{/* dokuhaku-10: single continuous AI-generated talking-head clip,
			    same approach as DokuhakuShortWithFootage (see dokuhaku10Content.ts). */}
			<Composition
				id="Dokuhaku10WithFootage"
				component={Dokuhaku10WithFootage}
				defaultProps={{fps: FPS}}
				durationInFrames={Math.ceil(DOKUHAKU10_DURATION_IN_SECONDS * FPS)}
				fps={FPS}
				width={720}
				height={1280}
			/>
			{/* ura-01: first episode of the "ura" scenic-monologue series --
			    real hand/notebook footage, two-layer telop (persistent top
			    header + changing lower telop, see ura01Content.ts). */}
			<Composition
				id="Ura01WithFootage"
				component={Ura01WithFootage}
				defaultProps={{fps: FPS}}
				durationInFrames={Math.ceil(URA01_DURATION_IN_SECONDS * FPS)}
				fps={FPS}
				width={720}
				height={1280}
			/>
			{/* ura-02: second episode of the "ura" series, same two-layer
			    telop format as ura-01 (see ura02Content.ts). */}
			<Composition
				id="Ura02WithFootage"
				component={Ura02WithFootage}
				defaultProps={{fps: FPS}}
				durationInFrames={Math.ceil(URA02_DURATION_IN_SECONDS * FPS)}
				fps={FPS}
				width={720}
				height={1280}
			/>
		</>
	);
};
