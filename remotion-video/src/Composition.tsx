import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {segments} from './content';
import {buildTimeline} from './timing';
import {Background} from './Background';
import {Telop} from './Telop';

/**
 * 9:16 (1080x1920) vertical short for TikTok / YouTube Shorts / IG
 * Reels, built from content/caredesign/ai-video/dokuhaku-09-houchi.md
 * (解説×語りかけ型 / D-4-4). The monologue is broken into short telop
 * bursts that hard-cut in tempo, over a slow emotional gradient
 * background, matching the account's established caption style
 * (red headline card for the 0.0s hook, dark rounded boxes for the
 * mid-monologue lines, emphasized closing card for the 保存 CTA).
 */
export const DokuhakuShort: React.FC = () => {
	const timeline = buildTimeline(segments);

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<Background />
			{timeline.map((segment, i) => (
				<Sequence
					key={i}
					from={segment.from}
					durationInFrames={segment.durationInFrames}
					name={segment.text.replace(/\n/g, ' ').slice(0, 24)}
				>
					<AbsoluteFill
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							padding: '0 48px',
						}}
					>
						<Telop segment={segment} />
					</AbsoluteFill>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
