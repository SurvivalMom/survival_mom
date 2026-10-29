"""Shared helpers for the pipeline scripts: shots.yaml loading and ffmpeg/ffprobe
subprocess wrappers. Keep this dependency-light (stdlib + PyYAML only)."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path
from typing import Any

import yaml

PIPELINE_ROOT = Path(__file__).resolve().parent.parent
SHOTS_YAML_PATH = PIPELINE_ROOT / "shots.yaml"
SHOTS_DIR = PIPELINE_ROOT / "shots"
OUTPUT_DIR = PIPELINE_ROOT / "output"
ASSETS_DIR = PIPELINE_ROOT / "assets"
DOCS_DIR = PIPELINE_ROOT / "docs"

# Verified present on this system at plan time; override via FFMPEG_DRAWTEXT_FONT
# if running somewhere else.
DEFAULT_FONT = Path("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")


def load_project() -> dict[str, Any]:
    """Load and lightly validate shots.yaml. Raises ValueError on an empty
    or malformed shot list rather than failing deep inside ffmpeg."""
    if not SHOTS_YAML_PATH.exists():
        raise FileNotFoundError(f"shots.yaml not found at {SHOTS_YAML_PATH}")
    with open(SHOTS_YAML_PATH, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    if not data or not data.get("shots"):
        raise ValueError("shots.yaml has no shots defined")
    for shot in data["shots"]:
        for required in ("id", "duration_seconds"):
            if required not in shot:
                raise ValueError(f"shot missing required field '{required}': {shot}")
    return data


def run_ffmpeg(args: list[str], *, quiet: bool = True) -> None:
    """Run ffmpeg with -y (overwrite) and a sane log level. Raises
    CalledProcessError (with stderr attached) on failure rather than
    silently producing a broken/truncated output file."""
    cmd = ["ffmpeg", "-y"]
    if quiet:
        cmd += ["-loglevel", "error"]
    cmd += args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        raise subprocess.CalledProcessError(result.returncode, cmd, result.stdout, result.stderr)


def run_ffprobe(args: list[str]) -> str:
    cmd = ["ffprobe", "-v", "error"] + args
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        raise subprocess.CalledProcessError(result.returncode, cmd, result.stdout, result.stderr)
    return result.stdout


def resolve_font() -> Path:
    import os

    font = Path(os.environ.get("FFMPEG_DRAWTEXT_FONT", DEFAULT_FONT))
    if not font.exists():
        raise FileNotFoundError(
            f"drawtext font not found at {font}. Set FFMPEG_DRAWTEXT_FONT to a valid .ttf/.otf path."
        )
    return font
