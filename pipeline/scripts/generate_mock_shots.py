#!/usr/bin/env python3
"""Mock mode: generate placeholder clips for every shot in shots.yaml without
calling any external API. Each clip is a solid-color 1080x1920 background
with the shot id + subtitle text drawn on it, at the shot's declared
duration, written to shots/<id>.mp4.

This exists so the rest of the pipeline (concat, BGM mix, subtitle burn-in,
QC) can be exercised end-to-end before any real AI-generated footage or
paid API is involved. See README.md for how this differs from the
(unimplemented) live mode.
"""

from __future__ import annotations

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from common import SHOTS_DIR, load_project, resolve_font, run_ffmpeg  # noqa: E402

# Cycle through a few dark, readable background colors so shots are visually
# distinguishable in the mock output.
PLACEHOLDER_COLORS = ["0x1a1a2e", "0x16213e", "0x0f3460", "0x222831", "0x393e46"]


def escape_drawtext(text: str) -> str:
    """Escape characters ffmpeg's drawtext filter treats specially. A real
    newline byte in `text` is rendered by drawtext as a line break already
    -- it must NOT be converted to a literal backslash-n sequence, which
    drawtext does not interpret as a line break (it printed as the two
    characters "\\n" when this was tried)."""
    return (
        text.replace("\\", "\\\\")
        .replace(":", "\\:")
        .replace("'", "\\'")
        .replace(",", "\\,")
    )


def generate_shot(shot: dict, width: int, height: int, fps: int, font_path: str) -> None:
    shot_id = str(shot["id"])
    duration = float(shot["duration_seconds"])
    label = shot.get("subtitle") or shot.get("narration") or f"Shot {shot_id}"
    color = PLACEHOLDER_COLORS[hash(shot_id) % len(PLACEHOLDER_COLORS)]
    out_path = SHOTS_DIR / f"{shot_id}.mp4"

    text = escape_drawtext(f"[MOCK] Shot {shot_id}\n{label}")
    drawtext = (
        f"drawtext=fontfile='{font_path}':text='{text}':"
        "fontsize=48:fontcolor=white:line_spacing=12:"
        "x=(w-text_w)/2:y=(h-text_h)/2:"
        "box=1:boxcolor=black@0.4:boxborderw=20"
    )

    run_ffmpeg(
        [
            "-f",
            "lavfi",
            "-i",
            f"color=c={color}:s={width}x{height}:d={duration}:r={fps}",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=channel_layout=stereo:sample_rate=44100",
            "-shortest",
            "-vf",
            drawtext,
            "-pix_fmt",
            "yuv420p",
            "-c:v",
            "libx264",
            "-c:a",
            "aac",
            str(out_path),
        ]
    )
    print(f"  wrote {out_path} ({duration}s, mock placeholder)")


def main() -> None:
    project = load_project()
    width, height, fps = project["width"], project["height"], project["fps"]
    SHOTS_DIR.mkdir(parents=True, exist_ok=True)
    font_path = str(resolve_font())

    print(f"Generating {len(project['shots'])} mock shot(s) for '{project['project']}'...")
    for shot in project["shots"]:
        generate_shot(shot, width, height, fps, font_path)
    print("Done. Mock shots written to", SHOTS_DIR)


if __name__ == "__main__":
    main()
