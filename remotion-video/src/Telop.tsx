import React from 'react';
import {useCurrentFrame, spring, useVideoConfig} from 'remotion';
import {Segment} from './content';

const FONT_STACK =
	"'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', 'Meiryo', sans-serif";

// Desaturated accent palette for emphasis words, paired with a white
// stroke per the account's telop design reference: color carries the
// impression, the stroke keeps it legible against any box/background
// behind it. Cycled in order rather than picked per-word, since the
// reference caps emphasis at 1-2 words per line and any of the 3 reads
// fine together.
const ACCENT_PALETTE = ['#5FB5FF', '#FF719D', '#5D79FF'];

/**
 * Renders `text`, treating `**word**` spans as emphasis: filled with the
 * next color in ACCENT_PALETTE and given a white stroke, while everything
 * else renders plain in the caller's own color. A caption with no `**`
 * markers renders exactly as before -- this is opt-in per caption, not a
 * change to the default look, and reserved for keywords/numbers/the call
 * to action per the reference's "1-2 words per line, not the whole
 * sentence" rule.
 */
const renderWithEmphasis = (text: string): React.ReactNode[] => {
	const parts = text.split(/(\*\*.+?\*\*)/g);
	let accentIndex = 0;
	return parts.map((part, i) => {
		const match = part.match(/^\*\*(.+)\*\*$/);
		if (!match) {
			return part;
		}
		const color = ACCENT_PALETTE[accentIndex % ACCENT_PALETTE.length];
		accentIndex += 1;
		return (
			<span
				key={i}
				style={{
					color,
					WebkitTextStrokeWidth: '2px',
					WebkitTextStrokeColor: '#ffffff',
					paintOrder: 'stroke fill',
				}}
			>
				{match[1]}
			</span>
		);
	});
};

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
	// nominal 1em box). Bumped up a size step from an earlier pass (hook
	// 72->82, line 62->72, cta 64->74) per explicit feedback that the
	// telop still read too small; maxWidth widened too (85-88% -> 95%)
	// to recover some of the per-line character budget that a bigger
	// font alone would have eaten: hook ~9 chars/line, line ~10
	// chars/line, cta ~10 chars/line at this box's width -- tighter than
	// before, so captions that fit 2 lines previously may now need 3
	// shorter ones. A caption needing more text than the budget reads
	// better split into several shorter sequential captions than packed
	// into one tall multi-line block -- see content files for examples.
	//
	// HARD RULE (explicit feedback, applies to `line`/`cta` only -- not
	// HeaderTelop, which is a persistent banner rather than a sequential
	// telop): a single card must show 14 characters or fewer in total,
	// counting every line, not just the longest one. The per-line budget
	// above bounds line *width*; this bounds how much a viewer has to
	// read in one glance. A caption whose total exceeds 14 should be
	// split into multiple sequential cards (shortening the timing window
	// per card accordingly), never trimmed/reworded to force a fit.

	if (segment.kind === 'hook') {
		return (
			<div
				style={{
					transform: `scale(${scale})`,
					opacity,
					maxWidth: '95%',
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
						fontSize: 82 * rem,
						lineHeight: 1.26,
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
		// Same dark "burned-in" box as the `line` kind below -- without it,
		// the plain white text + drop-shadow combination this used to have
		// read fine over a dark scene but lost contrast over a lighter
		// background (e.g. the desk/notebook footage in the ura series),
		// per explicit feedback that the CTA was hard to read.
		return (
			<div
				style={{
					transform: `scale(${scale})`,
					opacity,
					maxWidth: '95%',
					textAlign: 'center',
					background: 'rgba(10,10,12,0.72)',
					borderRadius: 18 * rem,
					padding: `${22 * rem}px ${36 * rem}px`,
				}}
			>
				<div
					style={{
						fontFamily: FONT_STACK,
						fontWeight: 900,
						fontSize: 74 * rem,
						lineHeight: 1.3,
						color: '#ffffff',
						whiteSpace: 'pre-line',
					}}
				>
					{renderWithEmphasis(segment.text)}
				</div>
				<div
					style={{
						marginTop: 20 * rem,
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
				maxWidth: '95%',
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
					fontSize: 72 * rem,
					lineHeight: 1.28,
					color: '#ffffff',
					whiteSpace: 'pre-line',
				}}
			>
				{renderWithEmphasis(segment.text)}
			</div>
		</div>
	);
};

/**
 * Persistent header for the ura series' two-layer telop format: the
 * original hook line stays pinned to the top of frame for the whole video
 * (not just the first scene), while the lower Telop changes per scene.
 * Deliberately NOT built on the pop/spring entrance above -- the brief
 * says no fade-in, no text-reveal, just present from frame 1. Styled to
 * match the account's established "hook" red/yellow card (same colors as
 * the `hook` kind above) rather than a subordinate caption, since during
 * Scene 1 -- where the lower telop is blank -- this is the only text on
 * screen and needs to carry the hook's attention-grabbing job by itself.
 * Font size (78, bumped from an earlier 68 per the same feedback as the
 * `line`/`cta` sizes above) is deliberately larger than both lower-telop
 * kinds (`line` 72, `cta` 74) so the header reads as more prominent than
 * whatever the lower layer is showing, not less -- per earlier explicit
 * feedback, this replaced a smaller size that read as subordinate.
 * Same fixed-size-plus-manual-line-break convention as the rest of this
 * file applies here too: left to auto-wrap, this size fits roughly
 * ~7 chars/line within a 90px-safe-zone box like CompositionUra01's (down
 * from ~10 before the size bump), so header text longer than that should
 * carry its own hand-placed `\n` at natural clause boundaries, often
 * meaning 3 shorter lines rather than 2 (see ura01Content.ts).
 */
export const HeaderTelop: React.FC<{text: string}> = ({text}) => {
	const {width} = useVideoConfig();
	const rem = width / 1080;

	return (
		<div
			style={{
				maxWidth: '95%',
				textAlign: 'center',
				background: '#d92b1f',
				borderRadius: 18 * rem,
				padding: `${18 * rem}px ${32 * rem}px`,
				boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
			}}
		>
			<div
				style={{
					fontFamily: FONT_STACK,
					fontWeight: 900,
					fontSize: 78 * rem,
					lineHeight: 1.26,
					color: '#ffe8a3',
					whiteSpace: 'pre-line',
					textShadow: '0 3px 0 rgba(0,0,0,0.25)',
					letterSpacing: '0.01em',
				}}
			>
				{text}
			</div>
		</div>
	);
};
