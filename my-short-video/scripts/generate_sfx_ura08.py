"""Synthesize the ura-08 sound effects (no samples, no copyright issues).

md: no BGM, nothing flashy, never fully silent. The Gemini footage is
near-silent, so its audio is dropped and replaced with these.

    python3 scripts/generate_sfx_ura08.py   # writes public/sfx/ura08/*.wav
"""

import os

import numpy as np

import generate_sfx_ura07 as base
from generate_sfx_ura07 import SR, band, fade, norm, rng

base.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura08")


def pen_careful(duration):
    """Copying someone else's phrasing: light, measured strokes with
    regular small pauses (looking back at the reference)."""
    n = int(duration * SR)
    grit = band(rng.standard_normal(n), 2600, 8500)
    body = band(rng.standard_normal(n), 700, 1800) * 0.2
    env = np.zeros(n)
    t = int(0.03 * SR)
    stroke = 0
    while t < n:
        length = int(rng.uniform(90, 200) / 1000 * SR)
        e = np.sin(np.linspace(0, np.pi, length)) * rng.uniform(0.55, 0.9)
        end = min(n, t + length)
        env[t:end] = e[: end - t]
        stroke += 1
        # Every few strokes, a longer pause: glancing at the model text.
        gap = rng.uniform(380, 650) if stroke % 6 == 0 else rng.uniform(50, 130)
        t = end + int(gap / 1000 * SR)
    return fade(norm((grit + body) * env, 0.5), 0.005, 0.04)


def turn_rustle():
    """Small cloth shift as the viewer turns to look sideways."""
    return base.rustle(0.7) * 0.8


if __name__ == "__main__":
    base.save("room-tone.wav", base.room_tone(16.5))
    base.save("pen-write.wav", base.pen_scratch(2.0, hard=False))
    base.save("pen-copy.wav", pen_careful(4.1))
    base.save("pen-copy-short.wav", pen_careful(0.6))
    base.save("pen-lift.wav", base.tick())
    base.save("turn-rustle.wav", turn_rustle())
    base.save("realization.wav", base.realization(2.6))
