import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

/**
 * Slow, emotional gradient wash for a "neglect -> care" theme
 * (放置マンタイプ -> フォローの仕方を見直す). Starts in cooler, more
 * distant navy/charcoal tones (the neglect being warned about) and
 * drifts toward a faint warm ember undertone as the video approaches
 * the CTA (the care/follow-up being asked for). The motion is a slow
 * diagonal drift, not a flashy animation — this is a serious, reflective
 * tone, not a hype reel.
 */
export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();

	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Slow organic drift for the gradient's focal point.
	const driftX = 50 + Math.sin(frame / 140) * 14;
	const driftY = 35 + Math.cos(frame / 180) * 10;

	// Cool neglect tones early, a faint warm ember undertone creeps in
	// as we approach the "follow up" resolution near the end.
	const emberStrength = interpolate(progress, [0, 0.65, 1], [0, 0, 0.35], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const base = `radial-gradient(ellipse at ${driftX}% ${driftY}%, #1c3146 0%, #101b29 45%, #070c13 100%)`;
	const ember = `radial-gradient(ellipse at 50% 100%, rgba(168,96,52,${emberStrength}) 0%, rgba(168,96,52,0) 55%)`;

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{background: base}} />
			<AbsoluteFill style={{background: ember}} />
			{/* Vignette to keep edges dark and focus on the centered telop */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
