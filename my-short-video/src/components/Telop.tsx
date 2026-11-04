import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {sceneBeats, TelopCard} from '../script';

const FONT_STACK =
	"'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', 'Meiryo', sans-serif";

/** Renders `text`, coloring the one `accent`-matched substring (if any) in `color` with a white stroke; everything else plain white. */
const renderWithAccent = (text: string, accent: string | undefined, color: string): React.ReactNode => {
	if (!accent) return text;
	const idx = text.indexOf(accent);
	if (idx === -1) return text;
	return (
		<>
			{text.slice(0, idx)}
			<span
				style={{
					color,
					WebkitTextStrokeWidth: '2px',
					WebkitTextStrokeColor: '#ffffff',
					paintOrder: 'stroke fill',
				}}
			>
				{accent}
			</span>
			{text.slice(idx + accent.length)}
		</>
	);
};

type Mood = 'irritated' | 'calm';

const moodForSeconds = (seconds: number): Mood => {
	const beat = sceneBeats.find((b) => seconds >= b.startSeconds && seconds < b.endSeconds);
	return beat?.name === 'writing' ? 'irritated' : 'calm';
};

/** Accent color varies by scene mood per the brief (苛立ち=赤, 気づき=黄, 内省=暖色). */
const accentColorForSeconds = (seconds: number): string => {
	const beat = sceneBeats.find((b) => seconds >= b.startSeconds && seconds < b.endSeconds);
	if (beat?.name === 'writing') return '#ff6b5e'; // 苛立ち: red
	if (beat?.name === 'pausing') return '#ffd34d'; // 気づき: yellow
	return '#ffb066'; // 内省: warm orange
};

type Props = {
	card: TelopCard;
};

export const Telop: React.FC<Props> = ({card}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const rem = width / 1080;
	const mood = moodForSeconds(card.startSeconds);
	const accentColor = accentColorForSeconds(card.startSeconds);

	let scale: number;
	let translateY: number;
	let opacity: number;

	if (mood === 'irritated') {
		// 苛立ち: 速く弾む -- a fast, bouncy spring, snapping in.
		const pop = spring({frame, fps, config: {damping: 11, stiffness: 220, mass: 0.6}, durationInFrames: 8});
		scale = 0.82 + pop * 0.18;
		translateY = 0;
		opacity = Math.min(1, pop * 1.3);
	} else {
		// 気づき・内省: ゆっくり浮かぶ -- a slow, no-bounce rise and fade-in.
		const rise = spring({frame, fps, config: {damping: 20, stiffness: 60, mass: 1}, durationInFrames: 22});
		scale = 1;
		translateY = interpolate(rise, [0, 1], [18, 0]);
		opacity = rise;
	}

	const isCta = card.kind === 'cta';

	return (
		<div
			style={{
				transform: `scale(${scale}) translateY(${translateY * rem}px)`,
				opacity,
				maxWidth: '82%',
				textAlign: 'center',
				background: 'rgba(10,10,12,0.72)',
				borderRadius: 18 * rem,
				padding: `${24 * rem}px ${38 * rem}px`,
			}}
		>
			<div
				style={{
					fontFamily: FONT_STACK,
					fontWeight: isCta ? 900 : 800,
					fontSize: (isCta ? 58 : 56) * rem,
					lineHeight: 1.3,
					color: '#ffffff',
					whiteSpace: 'pre-line',
				}}
			>
				{card.text.split('\n').map((line, i) => (
					<div key={i}>{renderWithAccent(line, card.accent, accentColor)}</div>
				))}
			</div>
			{isCta && (
				<div
					style={{
						marginTop: 18 * rem,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 8 * rem,
						padding: `${8 * rem}px ${16 * rem}px`,
						borderRadius: 999,
						border: `1.5px solid rgba(255,255,255,0.55)`,
						fontFamily: FONT_STACK,
						fontSize: 28 * rem,
						fontWeight: 700,
						color: '#ffe8a3',
					}}
				>
					<span style={{fontSize: 30 * rem}}>🔖</span>
					保存
				</div>
			)}
		</div>
	);
};
