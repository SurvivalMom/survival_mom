#!/usr/bin/env python3
"""Concatenate the shot clips in shots/ (in shots.yaml order), optionally mix
in background music from assets/bgm/, optionally burn in subtitles from each
shot's `subtitle` field, and write the final 1080x1920 H.264/AAC MP4 to
output/final.mp4.

Requires shots/<id>.mp4 to already exist for every shot (run
generate_mock_shots.py first in mock mode, or populate shots/ with real
footage for a live run).
"""

from __future__ import annotations

import os
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, os.path.dirname(__file__))

from common import ASSETS_DIR, OUTPUT_DIR, SHOTS_DIR, load_project, run_ffmpeg  # noqa: E402

OUTPUT_PATH = OUTPUT_DIR / "final.mp4"


def srt_timestamp(seconds: float) -> str:
    hours, rem = divmod(seconds, 3600)
    minutes, rem = divmod(rem, 60)
    secs, millis = divmod(rem, 1)
    return f"{int(hours):02}:{int(minutes):02}:{int(secs):02},{int(millis * 1000):03}"


def build_srt(shots: list[dict], srt_path: Path) -> bool:
    """Write an SRT from each shot's `subtitle` field, timed against the
    shots' concatenated durations. Returns False (and writes nothing) if no
    shot has subtitle text, so callers can skip the subtitles filter."""
    cursor = 0.0
    entries = []
    for shot in shots:
        duration = float(shot["duration_seconds"])
        subtitle = (shot.get("subtitle") or "").strip()
        if subtitle:
            entries.append((cursor, cursor + duration, subtitle))
        cursor += duration
    if not entries:
        return False
    with open(srt_path, "w", encoding="utf-8") as f:
        for i, (start, end, text) in enumerate(entries, start=1):
            f.write(f"{i}\n{srt_timestamp(start)} --> {srt_timestamp(end)}\n{text}\n\n")
    return True


def subtitles_filter_available() -> bool:
    result = subprocess.run(["ffmpeg", "-filters"], capture_output=True, text=True)
    return " subtitles " in result.stdout or "subtitles " in result.stdout


def find_bgm() -> Path | None:
    bgm_dir = ASSETS_DIR / "bgm"
    if not bgm_dir.exists():
        return None
    for ext in ("*.mp3", "*.wav", "*.m4a"):
        matches = sorted(bgm_dir.glob(ext))
        if matches:
            return matches[0]
    return None


def main() -> None:
    project = load_project()
    shots = project["shots"]

    missing = [s["id"] for s in shots if not (SHOTS_DIR / f"{s['id']}.mp4").exists()]
    if missing:
        raise FileNotFoundError(
            f"Missing shot clip(s) for id(s) {missing} in {SHOTS_DIR}. "
            "Run generate_mock_shots.py (mock mode) or supply real footage first."
        )

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmpdir:
        tmpdir_path = Path(tmpdir)

        # 1. Concat demuxer needs a list file of absolute paths.
        concat_list_path = tmpdir_path / "concat_list.txt"
        with open(concat_list_path, "w", encoding="utf-8") as f:
            for shot in shots:
                clip_path = (SHOTS_DIR / f"{shot['id']}.mp4").resolve()
                f.write(f"file '{clip_path}'\n")

        concatenated_path = tmpdir_path / "concatenated.mp4"
        run_ffmpeg(
            [
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(concat_list_path),
                "-c",
                "copy",
                str(concatenated_path),
            ]
        )
        print(f"Concatenated {len(shots)} shot(s).")

        # 2. Optional subtitle burn-in.
        srt_path = tmpdir_path / "subtitles.srt"
        has_subtitles = build_srt(shots, srt_path)
        video_with_subs_path = concatenated_path
        if has_subtitles:
            if not subtitles_filter_available():
                print(
                    "WARNING: ffmpeg build has no 'subtitles' filter (libass). "
                    "Skipping subtitle burn-in -- see README.md.",
                    file=sys.stderr,
                )
            else:
                video_with_subs_path = tmpdir_path / "with_subs.mp4"
                # Escape the path for the filtergraph (colons are special on
                # the filter argument).
                escaped_srt = str(srt_path).replace(":", "\\:")
                run_ffmpeg(
                    [
                        "-i",
                        str(concatenated_path),
                        "-vf",
                        f"subtitles='{escaped_srt}'",
                        "-c:a",
                        "copy",
                        str(video_with_subs_path),
                    ]
                )
                print("Burned in subtitles from shots.yaml's subtitle fields.")

        # 3. Optional BGM mix (ducked under any existing shot audio).
        bgm_path = find_bgm()
        if bgm_path:
            run_ffmpeg(
                [
                    "-i",
                    str(video_with_subs_path),
                    "-i",
                    str(bgm_path),
                    "-filter_complex",
                    "[1:a]volume=0.25,aloop=loop=-1:size=2e9[bgm];"
                    "[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]",
                    "-map",
                    "0:v",
                    "-map",
                    "[aout]",
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    "-c:a",
                    "aac",
                    "-shortest",
                    str(OUTPUT_PATH),
                ]
            )
            print(f"Mixed in BGM from {bgm_path}.")
        else:
            run_ffmpeg(
                [
                    "-i",
                    str(video_with_subs_path),
                    "-c:v",
                    "libx264",
                    "-pix_fmt",
                    "yuv420p",
                    "-c:a",
                    "aac",
                    str(OUTPUT_PATH),
                ]
            )
            print("No BGM found in assets/bgm/ -- skipped.")

    print(f"Final video written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
