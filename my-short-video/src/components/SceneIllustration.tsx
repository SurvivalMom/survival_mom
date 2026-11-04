import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {sceneBeats} from '../script';

/**
 * Code-drawn stand-in for the AI-generated footage the rest of the ura
 * series uses, since no source clip exists for this episode (brief step
 * 0/3). Deliberately a simplified/abstract illustration -- a believable
 * photoreal hand is not realistic to draw procedurally in this project's
 * scope, and is called out as a known limitation in the build report
 * rather than oversold here. What it preserves from the brief: a
 * first-person POV (the hand enters from the bottom edge, as the
 * viewer's own hand, never a full figure), a notebook with generic
 * invented log lines (never real/identifiable patient info, never
 * English), and the three beats' motion --
 * writing (quick, pressed harder) -> pausing (pen lifts, retraces without
 * writing) -> settling (pen set down, hand withdraws) -- synced to
 * `sceneBeats` from script.ts, the same timeline the background color
 * and SFX read from.
 */

const notebookLines = ['11/4 夜勤', '22:00 巡視。入眠中。', '23:10 水分補給。', '0:20 トイレ誘導。'];

type Beat = 'writing' | 'pausing' | 'settling';

const getBeatProgress = (t: number, name: Beat): number => {
	const beat = sceneBeats.find((b) => b.name === name)!;
	return interpolate(t, [beat.startSeconds, beat.endSeconds], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
};

export const SceneIllustration: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;

	const writingP = getBeatProgress(t, 'writing');
	const pausingP = getBeatProgress(t, 'pausing');
	const settlingP = getBeatProgress(t, 'settling');

	// Pen tip position within the notebook's writable area, in percent of
	// the notebook box.
	let penX = 55;
	let penY = 78;
	let penRotation = -18;
	let handY = 0; // 0 = resting position; positive pushes the hand further down/offscreen.
	let handOpacity = 1;

	if (writingP > 0 && writingP < 1) {
		// Quick small jitter strokes -- a few short back-and-forth beats
		// per second, reading as clipped, slightly harder writing.
		const jitter = Math.sin(t * 14) * 3.2 + Math.sin(t * 27 + 1.3) * 1.1;
		penX = 52 + jitter;
		penY = 78 + Math.sin(t * 9) * 1.5;
		penRotation = -18 + Math.sin(t * 20) * 2;
	} else if (pausingP > 0 && pausingP < 1) {
		// Pen lifts slightly, then slowly retraces a line without writing.
		const liftIn = interpolate(pausingP, [0, 0.15], [0, 1], {extrapolateRight: 'clamp'});
		const retrace = Math.sin((t - sceneBeats[1].startSeconds) * 1.6) * 9;
		penX = 52 + retrace;
		penY = 70 - liftIn * 4;
		penRotation = -14;
	} else if (settlingP > 0) {
		// Pen is set down beside the notebook, then the hand withdraws
		// down and off the bottom of frame.
		const setDown = interpolate(settlingP, [0, 0.25], [0, 1], {extrapolateRight: 'clamp'});
		const withdraw = interpolate(settlingP, [0.3, 0.85], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
		penX = interpolate(setDown, [0, 1], [52, 78]);
		penY = interpolate(setDown, [0, 1], [70, 58]);
		penRotation = interpolate(setDown, [0, 1], [-14, 8]);
		handY = withdraw * 22;
		handOpacity = interpolate(withdraw, [0.7, 1], [1, 0.0], {extrapolateLeft: 'clamp'});
	}

	const notebookWidth = width * 0.74;
	const notebookHeight = notebookWidth * 1.28;
	const notebookLeft = (width - notebookWidth) / 2;
	const notebookTop = height * 0.44;

	return (
		<>
			{/* Notebook */}
			<div
				style={{
					position: 'absolute',
					left: notebookLeft,
					top: notebookTop,
					width: notebookWidth,
					height: notebookHeight,
					background: 'linear-gradient(180deg, #f3efe4 0%, #e9e3d3 100%)',
					borderRadius: 14,
					boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						padding: '10% 8% 0 8%',
						fontFamily: "'Hiragino Mincho ProN', serif",
						fontSize: notebookWidth * 0.032,
						color: 'rgba(40,34,26,0.55)',
						letterSpacing: '0.02em',
					}}
				>
					申し送りノート
				</div>
				<div
					style={{
						marginTop: '6%',
						marginLeft: '8%',
						width: '60%',
						display: 'flex',
						flexDirection: 'column',
						gap: notebookHeight * 0.045,
					}}
				>
					{notebookLines.map((line, i) => (
						<div
							key={i}
							style={{
								fontFamily: "'Hiragino Mincho ProN', serif",
								fontSize: notebookWidth * 0.034,
								color: 'rgba(40,34,26,0.5)',
								borderBottom: '1px solid rgba(60,50,30,0.12)',
								paddingBottom: notebookHeight * 0.015,
							}}
						>
							{line}
						</div>
					))}
				</div>
				{/* Ruled lines filling the rest of the page */}
				{new Array(6).fill(0).map((_, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: '8%',
							right: '8%',
							top: `${62 + i * 6}%`,
							borderBottom: '1px solid rgba(60,50,30,0.10)',
						}}
					/>
				))}
			</div>

			{/* Hand + pen, POV, entering from the bottom-right */}
			<div
				style={{
					position: 'absolute',
					left: notebookLeft + (penX / 100) * notebookWidth - notebookWidth * 0.17,
					top: notebookTop + (penY / 100) * notebookHeight - notebookWidth * 0.17 + handY,
					width: notebookWidth * 0.34,
					height: notebookWidth * 0.34,
					opacity: handOpacity,
					transform: `rotate(${penRotation}deg)`,
					transformOrigin: '70% 30%',
				}}
			>
				{/* Pen */}
				<div
					style={{
						position: 'absolute',
						left: '10%',
						top: '38%',
						width: '85%',
						height: notebookWidth * 0.018,
						background: 'linear-gradient(90deg, #1c1c20 0%, #3a3a42 100%)',
						borderRadius: 4,
					}}
				/>
				{/* Sleeve cuff, grounding the hand as entering from the frame's
				    bottom edge (POV), behind the hand shape itself. */}
				<div
					style={{
						position: 'absolute',
						right: '-30%',
						bottom: '-55%',
						width: '95%',
						height: '75%',
						background: 'linear-gradient(145deg, #2a3348 0%, #1b2133 100%)',
						borderRadius: '30% 30% 40% 40%',
						transform: 'rotate(8deg)',
					}}
				/>
				{/* Hand (simplified, stylized silhouette -- not photoreal): a
				    palm mass plus two short finger bumps curled toward the
				    pen, rather than a single undifferentiated blob. */}
				<div
					style={{
						position: 'absolute',
						right: '-16%',
						bottom: '-18%',
						width: '70%',
						height: '62%',
						background: 'radial-gradient(ellipse at 55% 35%, #dcb08a 0%, #be8d64 75%)',
						borderRadius: '48% 52% 50% 50% / 62% 58% 42% 38%',
						boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
					}}
				/>
				{[0, 1].map((i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							right: `${2 + i * 14}%`,
							bottom: `${28 + i * 6}%`,
							width: '22%',
							height: '34%',
							background: 'linear-gradient(160deg, #dcb08a 0%, #c89968 100%)',
							borderRadius: '50% 50% 45% 45% / 60% 60% 40% 40%',
							transform: `rotate(${-18 + i * 10}deg)`,
						}}
					/>
				))}
			</div>
		</>
	);
};
