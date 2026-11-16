"""Synthesize the ura-10 sound effects (no samples, no copyright issues).

md: no BGM, nothing flashy, never fully silent.

    python3 scripts/generate_sfx_ura10.py   # writes public/sfx/ura10/*.wav
"""

import os

import numpy as np

import generate_sfx_ura07 as base
from add_sfx_to_videos import paper_touch
from generate_sfx_ura07 import SR, band, fade, norm, rng

base.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura10")


def pen_down_unsteady():
    """Pen put down by a hand that isn't quite steady: a knock, a small
    second knock as it settles, then a short roll."""
    n = int(0.8 * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    for at, amp in [(0.0, 1.0), (0.09, 0.55), (0.16, 0.3)]:
        k = int(at * SR)
        tt = t[: n - k]
        x[k:] += amp * (
            band(rng.standard_normal(n - k), 1500, 6500) * np.exp(-tt * 120)
            + 0.5 * np.sin(2 * np.pi * 230 * tt) * np.exp(-tt * 50)
        )
    roll = band(rng.standard_normal(n), 500, 2500) * np.clip((t - 0.2) / 0.05, 0, 1) * np.exp(-np.clip(t - 0.2, 0, None) * 8) * 0.15
    return fade(norm(x + roll, 0.55), 0.001, 0.15)


def palm_rest():
    """A palm coming to rest flat on paper: soft, low, papery."""
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 200, 2500) * np.exp(-t * 14) * np.clip(t / 0.03, 0, 1)
    return fade(norm(x, 0.35), 0.005, 0.15)


if __name__ == "__main__":
    base.save("room-tone.wav", base.room_tone(18.0))
    # Faster, rougher writing than a calm entry.
    base.save("pen-fast.wav", base.pen_scratch(3.3, hard=True))
    base.save("pen-down-unsteady.wav", pen_down_unsteady())
    base.save("palm-rest.wav", palm_rest())
    base.save("low-weight.wav", base.realization(2.4))
    base.save("rustle.wav", base.rustle(2.0))
    base.save("sheet-touch.wav", paper_touch())
