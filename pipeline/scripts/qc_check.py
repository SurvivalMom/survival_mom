#!/usr/bin/env python3
"""Run ffprobe against output/final.mp4 and record the result (resolution,
codecs, duration, framerate) to docs/qc.md. Run this after build_video.py."""

from __future__ import annotations

import datetime
import json
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from common import DOCS_DIR, OUTPUT_DIR, run_ffprobe  # noqa: E402

OUTPUT_PATH = OUTPUT_DIR / "final.mp4"
QC_MD_PATH = DOCS_DIR / "qc.md"


def main() -> None:
    if not OUTPUT_PATH.exists():
        raise FileNotFoundError(f"{OUTPUT_PATH} not found. Run build_video.py first.")

    raw = run_ffprobe(
        [
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            str(OUTPUT_PATH),
        ]
    )
    probe = json.loads(raw)

    video_stream = next((s for s in probe["streams"] if s["codec_type"] == "video"), None)
    audio_stream = next((s for s in probe["streams"] if s["codec_type"] == "audio"), None)
    fmt = probe["format"]

    width = video_stream.get("width") if video_stream else None
    height = video_stream.get("height") if video_stream else None
    video_codec = video_stream.get("codec_name") if video_stream else "MISSING"
    audio_codec = audio_stream.get("codec_name") if audio_stream else "MISSING"
    duration = float(fmt.get("duration", 0))
    size_bytes = int(fmt.get("size", 0))

    # Parse the video stream's frame rate ("30/1" -> 30.0).
    fps = None
    if video_stream and video_stream.get("r_frame_rate"):
        num, _, den = video_stream["r_frame_rate"].partition("/")
        if num and den and float(den) != 0:
            fps = float(num) / float(den)

    checks = {
        "resolution is 1080x1920": (width == 1080 and height == 1920),
        "video codec is h264": (video_codec == "h264"),
        "audio codec is aac": (audio_codec == "aac"),
        "has at least one audio stream": (audio_stream is not None),
    }
    all_passed = all(checks.values())

    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.datetime.now().isoformat(timespec="seconds")

    lines = [
        "# QC Report",
        "",
        f"Generated: {timestamp}",
        f"File: `{OUTPUT_PATH.relative_to(OUTPUT_PATH.parent.parent)}`",
        "",
        "## ffprobe summary",
        "",
        "| Property | Value |",
        "| --- | --- |",
        f"| Resolution | {width}x{height} |",
        f"| Video codec | {video_codec} |",
        f"| Audio codec | {audio_codec} |",
        f"| Frame rate | {fps} |",
        f"| Duration (s) | {duration:.3f} |",
        f"| File size (bytes) | {size_bytes} |",
        "",
        "## Checks",
        "",
    ]
    for label, passed in checks.items():
        lines.append(f"- [{'x' if passed else ' '}] {label}")
    lines.append("")
    lines.append(f"**Overall: {'PASS' if all_passed else 'FAIL'}**")
    lines.append("")

    with open(QC_MD_PATH, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("\n".join(lines))
    print(f"\nWritten to {QC_MD_PATH}")

    if not all_passed:
        sys.exit(1)


if __name__ == "__main__":
    main()
