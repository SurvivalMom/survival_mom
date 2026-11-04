import React from 'react';
import {useVideoConfig} from 'remotion';
import {HEADER_TEXT} from '../script';

const FONT_STACK =
	"'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Noto Sans JP', 'Meiryo', sans-serif";

/**
 * Persistent top-of-frame header. Per the md's explicit instruction: red
 * background / yellow text (matching the account's "hook" card colors
 * elsewhere in the series), no fade-in, no text-reveal -- present at full
 * opacity from frame 0, for the composition's whole duration (not
 * wrapped in a Sequence that could re-trigger it).
 */
export const HeaderTelop: React.FC = () => {
	const {width} = useVideoConfig();
	const rem = width / 1080;

	return (
		<div
			style={{
				maxWidth: '88%',
				textAlign: 'center',
				background: '#d92b1f',
				borderRadius: 18 * rem,
				padding: `${22 * rem}px ${40 * rem}px`,
				boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
			}}
		>
			<div
				style={{
					fontFamily: FONT_STACK,
					fontWeight: 900,
					fontSize: 76 * rem,
					lineHeight: 1.28,
					color: '#ffe8a3',
					whiteSpace: 'pre-line',
					textShadow: '0 3px 0 rgba(0,0,0,0.25)',
					letterSpacing: '0.01em',
				}}
			>
				{HEADER_TEXT}
			</div>
		</div>
	);
};
