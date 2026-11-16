"""Synthesize the ura-11 sound effects (no samples, no copyright issues).

md: no BGM, nothing flashy, never fully silent. This episode ends on a warm
turn, so the reveal gets one soft swell instead of the usual low weight.

    python3 scripts/generate_sfx_ura11.py   # writes public/sfx/ura11/*.wav
"""

import os

import numpy as np

import generate_sfx_ura07 as base
from add_sfx_to_videos import paper_slide, paper_touch
from generate_sfx_ura07 import SR, band, fade, norm, rng
from generate_sfx_ura08 import pen_careful
from generate_sfx_ura09 import pen_pickup

base.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura11")


def memo_flutter():
    """A small sheet held up between fingers: a couple of soft flutters."""
    x = paper_slide(0.5) * 0.6
    y = np.concatenate([np.zeros(int(0.25 * SR)), paper_slide(0.35) * 0.4])
    n = max(len(x), len(y))
    out = np.zeros(n)
    out[: len(x)] += x
    out[: len(y)] += y
    return fade(norm(out, 0.35), 0.01, 0.1)


def warm_swell(duration=3.2):
    """Soft major chord swell with slow attack: warmth, not music."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    env = np.clip(t / 1.1, 0, 1) ** 2 * np.exp(-np.clip(t - 1.4, 0, None) * 1.2)
    freqs = [220.0, 277.18, 329.63, 440.0]
    x = sum(np.sin(2 * np.pi * f * t + i) * (0.9 ** i) for i, f in enumerate(freqs))
    shimmer = band(rng.standard_normal(n), 2000, 6000) * 0.04
    return fade(norm((x + shimmer) * env, 0.35), 0.05, 0.6)


if __name__ == "__main__":
    base.save("room-tone.wav", base.room_tone(15.5))
    base.save("memo-flutter.wav", memo_flutter())
    base.save("memo-down.wav", paper_touch())
    base.save("pen-pickup.wav", pen_pickup())
    base.save("pen-slow.wav", pen_careful(2.8))
    base.save("warm-swell.wav", warm_swell())
