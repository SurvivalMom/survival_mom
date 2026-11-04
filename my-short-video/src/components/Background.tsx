import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, interpolateColors, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {sceneBeats} from '../script';

/**
 * Procedural background: no source video exists for this episode (see
 * the build instructions' step 0 -- public/source-videos has nothing for
 * ura-07), so the brief's step 2/3 calls for an illustrated,
 * code-drawn scene instead of real footage. This layer handles the
 * color/mood side (gradient, lamp flicker, floating dust, vignette,
 * grain); SceneIllustration.tsx (rendered on top) handles the
 * notebook/hand/pen drawing itself.
 *
 * Color arc per the brief: cold navy/purple through the irritated
 * writing beat, shifting to warm amber starting at the realization beat.
 * Driven directly off sceneBeats from script.ts rather than a separate
 * hand-tuned curve, so the color transition and the telop/SFX timing
 * can't drift out of sync with each other.
 */
const COLD_TOP = '#0c1020';
const COLD_BOTTOM = '#1c1230';
const WARM_TOP = '#241408';
const WARM_BOTTOM = '#3a2210';

const PARTICLE_COUNT = 26;

export const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;

	// Warm transition begins at the start of the "settling" (realization)
	// beat and completes a couple seconds in, rather than snapping.
	const settlingStart = sceneBeats.find((s) => s.name === 'settling')?.startSeconds ?? 8.5;
	const warmth = interpolate(t, [settlingStart - 1.2, settlingStart + 1.8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const topColor = interpolateColors(warmth, [0, 1], [COLD_TOP, WARM_TOP]);
	const bottomColor = interpolateColors(warmth, [0, 1], [COLD_BOTTOM, WARM_BOTTOM]);

	// Desk lamp flicker: only during the cold (writing) phase, a small
	// irregular opacity wobble built from two offset sine waves (kept
	// deterministic per-frame, not Math.random(), since Remotion renders
	// frames independently and out of order).
	const flicker =
		0.85 +
		0.08 * Math.sin(frame / 5.3) +
		0.05 * Math.sin(frame / 2.1 + 1.7) * (1 - warmth);
	const lampOpacity = interpolate(warmth, [0, 0.6], [flicker, 1], {extrapolateRight: 'clamp'});

	const particles = useMemo(
		() =>
			new Array(PARTICLE_COUNT).fill(0).map((_, i) => ({
				x: random(`dust-x-${i}`) * 100,
				y: random(`dust-y-${i}`) * 100,
				size: 1.5 + random(`dust-size-${i}`) * 2.5,
				speed: 0.15 + random(`dust-speed-${i}`) * 0.25,
				driftPhase: random(`dust-phase-${i}`) * Math.PI * 2,
				opacityBase: 0.15 + random(`dust-op-${i}`) * 0.25,
			})),
		[],
	);

	return (
		<AbsoluteFill>
			{/* Gradient wash */}
			<AbsoluteFill
				style={{
					background: `linear-gradient(170deg, ${topColor} 0%, ${bottomColor} 100%)`,
				}}
			/>

			{/* Desk lamp glow, upper-left-of-center, as if just out of frame
			    above the notebook. */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 60% 40% at 50% 18%, rgba(255, ${interpolate(
						warmth,
						[0, 1],
						[221, 190],
					)}, ${interpolate(warmth, [0, 1], [150, 110])}, ${0.22 * lampOpacity}) 0%, transparent 70%)`,
				}}
			/>

			{/* Floating dust, drifting slowly upward with a gentle horizontal
			    sway, brighter once the lamp turns warm. */}
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				{particles.map((p, i) => {
					const driftY = (p.y - ((t * p.speed * 8) % 100) + 100) % 100;
					const sway = Math.sin(t * 0.6 + p.driftPhase) * 2.5;
					const opacity = p.opacityBase * (0.6 + 0.4 * warmth);
					return (
						<circle
							key={i}
							cx={`${p.x + sway}%`}
							cy={`${driftY}%`}
							r={p.size}
							fill={interpolateColors(warmth, [0, 1], ['#cdd6ff', '#ffd9a0'])}
							opacity={opacity}
						/>
					);
				})}
			</svg>

			{/* Vignette */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(ellipse 70% 65% at 50% 45%, transparent 45%, rgba(0,0,0,0.55) 100%)',
				}}
			/>

			{/* Film grain: a turbulence-filtered noise overlay, reseeded every
			    few frames (not every single frame -- a new seed each frame
			    reads as flicker/strobing rather than texture) for a subtle
			    moving-grain feel without taxing the renderer. */}
			<svg width={width} height={height} style={{position: 'absolute', inset: 0, mixBlendMode: 'overlay'}}>
				<filter id="grain">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves={2}
						seed={Math.floor(frame / 3) % 50}
						stitchTiles="stitch"
					/>
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={width} height={height} filter="url(#grain)" opacity={0.05} />
			</svg>
		</AbsoluteFill>
	);
};
