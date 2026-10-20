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

	// Authors hand-place `\n` in segment text to control where each line
	// breaks. But if a line is too long for the box at the kind's base
	// font size, the browser re-wraps it anyway -- and CJK text has no
	// word boundaries, so that re-wrap lands mid-word ("前のや" / "り方は").
	// Shrink the font just enough that the longest authored line always
	// fits on one line, so the hand-placed breaks are the only ones that
	// ever show. 1.35em/char is an empirically-fit width for bold
	// Hiragino/Gothic full-width glyphs at this weight (wider than the
	// nominal 1em box), with a small safety margin.
	const longestLineChars = Math.max(...segment.text.split('\n').map((line) => line.length));
	const EM_PER_CHAR = 1.35;
	const fitFontSize = (baseFontSizePx: number, maxWidthFraction: number) => {
		const availableWidthPx = width * maxWidthFraction;
		const maxSafeFontSizePx = availableWidthPx / (longestLineChars * EM_PER_CHAR);
		return Math.min(baseFontSizePx, maxSafeFontSizePx);
	};

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
						fontSize: fitFontSize(72 * rem, 0.88),
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
						fontSize: fitFontSize(86 * rem, 0.85),
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
					fontSize: fitFontSize(78 * rem, 0.86),
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
