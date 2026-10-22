import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {dokuhaku10Segments} from './dokuhaku10Content';
import {VideoBackground} from './VideoBackground';
import {Telop} from './Telop';

/**
 * dokuhaku-10-ichiban (自分が一番うまい、を何年続けていますか). Same
 * treatment as DokuhakuShortWithFootage: real AI-generated talking-head
 * clip, captions anchored to detected speech (see dokuhaku10Content.ts),
 * regular lines at chin level, hook/cta pinned to the top of frame.
 */
export const Dokuhaku10WithFootage: React.FC<{fps: number}> = ({fps}) => {
	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<VideoBackground src="source-videos/dokuhaku-10-ichiban-raw.mp4" />
			{dokuhaku10Segments.map((segment, i) => {
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
								justifyContent: segment.kind === 'line' ? 'center' : 'flex-start',
								alignItems: 'center',
								padding: '0 36px',
								paddingTop: segment.kind === 'line' ? undefined : 64,
								transform: segment.kind === 'line' ? 'translateY(18%)' : undefined,
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
