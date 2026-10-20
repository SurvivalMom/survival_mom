import React from 'react';
import {AbsoluteFill, Sequence, Series, useVideoConfig} from 'remotion';
import {shoseijutsu02Blocks} from './shoseijutsu02Content';
import {VideoBackground} from './VideoBackground';
import {Telop} from './Telop';

/**
 * shoseijutsu-02 (新任管理者ほど、最初に変えすぎない), assembled from 3
 * separate AI-generated clips (see shoseijutsu02Content.ts for the full
 * clip-to-scene mapping and timing method) using Series to play them
 * back to back. Each block gets its own nested Sequence per caption,
 * positioned the same way as the other footage-mode videos: hook/cta
 * pinned to the top, regular lines centered around the chin.
 */
export const Shoseijutsu02WithFootage: React.FC = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Series>
				{shoseijutsu02Blocks.map((block, blockIndex) => {
					const blockDurationInFrames = Math.round(block.durationSeconds * fps);
					return (
						<Series.Sequence key={blockIndex} durationInFrames={blockDurationInFrames}>
							<AbsoluteFill style={{backgroundColor: '#000'}}>
								<VideoBackground src={block.src} startFromSeconds={block.trimStartSeconds} muted={block.muted} />
								{block.segments.map((segment, segmentIndex) => {
									const from = Math.round(segment.startSeconds * fps);
									const durationInFrames = Math.max(1, Math.round((segment.endSeconds - segment.startSeconds) * fps));
									return (
										<Sequence
											key={segmentIndex}
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
						</Series.Sequence>
					);
				})}
			</Series>
		</AbsoluteFill>
	);
};
