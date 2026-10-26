import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {Segment} from './content';

const FONT_STACK =
	"'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', 'Meiryo', sans-serif";

type Props = {
	segment: Segment;
};

export const Telop: React.FC<Props> = ({segment}) => {
	const {fps, width} = useVideoConfig();
	// Relative to the enclosing <Sequence>, not the whole timeline.
	const localFrame = useCurrentFrame();
	// Font sizes below were authored against a 1080px-wide canvas; scale
	// them proportionally so the same design reads correctly at other
	// composition widths (e.g. 720px when overlaying on raw footage).
	const rem = width / 1080;

	// Fast punch-in pop, matching the quick-cut SNS telop style. No
	// fade-out — the next Sequence hard-cuts over this one, which reads
	// as snappier than a cross-fade for this kind of kinetic text.
	const pop = spring({
		frame: localFrame,
		fps,
		config: {damping: 14, stiffness: 180, mass: 0.6},
		durationInFrames: 10,
	});

	const scale = 0.86 + pop * 0.14;
	const opacity = Math.min(1, pop * 1.3);

	// Font size per kind is a FIXED constant -- never adjusted per caption.
	// A size that changes caption-to-caption reads as more distracting
	// than an occasional long line, so instead every caption's `\n`
	// placement (in content.ts / audioAlignedContent.ts / etc.) is
	// hand-fit to stay within these sizes' safe per-line character budget
	// at this box's width, calibrated empirically against bold
	// Hiragino/Gothic full-width glyphs (~1.35em/char, wider than the
	// nominal 1em box): hook ~9 chars/line, line ~11 chars/line,
	// cta ~10 chars/line. A caption needing more text than that reads
	// better split into several shorter sequential captions than packed
	// into one tall multi-line block -- see content files for examples.

	if (segment.kind === 'hook') {
		return (
			<div
				style={{
					transform: `scale(${scale})`,
					opacity,
					maxWidth: '88%',
					padding: `${36 * rem}px ${44 * rem}px`,
					borderRadius: 28 * rem,
					background: '#d92b1f',
					boxShadow: '0 18px 46px rgba(0,0,0,0.45)',
				}}
			>
				<div
					style={{
						fontFamily: FONT_STACK,
						fontWeight: 900,
						fontSize: 72 * rem,
						lineHeight: 1.28,
						color: '#ffe8a3',
						textAlign: 'center',
						whiteSpace: 'pre-line',
						textShadow: '0 4px 0 rgba(0,0,0,0.25)',
						letterSpacing: '0.01em',
					}}
				>
					{segment.text}
				</div>
			</div>
		);
	}

	if (segment.kind === 'cta') {
		return (
			<div
				style={{
					transform: `scale(${scale})`,
					opacity,
					maxWidth: '85%',
					textAlign: 'center',
				}}
			>
				<div
					style={{
						fontFamily: FONT_STACK,
						fontWeight: 900,
						fontSize: 64 * rem,
						lineHeight: 1.32,
						color: '#ffffff',
						whiteSpace: 'pre-line',
						textShadow: '0 6px 28px rgba(0,0,0,0.65)',
					}}
				>
					{segment.text}
				</div>
				<div
					style={{
						marginTop: 28 * rem,
						height: 6 * rem,
						width: 160 * rem,
						marginLeft: 'auto',
						marginRight: 'auto',
						borderRadius: 999,
						background: '#ffb84d',
					}}
				/>
			</div>
		);
	}

	// Regular mid-monologue line — the dark rounded "burned-in" caption
	// box used throughout the account's existing produced videos.
	return (
		<div
			style={{
				transform: `scale(${scale})`,
				opacity,
				maxWidth: '86%',
				textAlign: 'center',
				background: 'rgba(10,10,12,0.72)',
				borderRadius: 18 * rem,
				padding: `${22 * rem}px ${36 * rem}px`,
			}}
		>
			<div
				style={{
					fontFamily: FONT_STACK,
					fontWeight: 800,
					fontSize: 62 * rem,
					lineHeight: 1.3,
					color: '#ffffff',
					whiteSpace: 'pre-line',
				}}
			>
				{segment.text}
			</div>
		</div>
	);
};

/**
 * Persistent small header for the ura series' two-layer telop format: the
 * original hook line stays pinned to the top of frame for the whole video
 * (not just the first scene), while the lower Telop changes per scene.
 * Deliberately NOT built on the pop/spring entrance above -- the brief
 * says no fade-in, no text-reveal, just present from frame 1 -- and
 * deliberately smaller/lighter than every other telop kind so it reads as
 * subordinate to whatever the lower layer is showing.
 */
export const HeaderTelop: React.FC<{text: string}> = ({text}) => {
	const {width} = useVideoConfig();
	const rem = width / 1080;

	return (
		<div
			style={{
				maxWidth: '90%',
				textAlign: 'center',
				background: 'rgba(10,10,12,0.55)',
				borderRadius: 12 * rem,
				padding: `${10 * rem}px ${22 * rem}px`,
			}}
		>
			<div
				style={{
					fontFamily: FONT_STACK,
					fontWeight: 700,
					fontSize: 30 * rem,
					lineHeight: 1.3,
					color: 'rgba(255,255,255,0.78)',
					whiteSpace: 'pre-line',
				}}
			>
				{text}
			</div>
		</div>
	);
};
