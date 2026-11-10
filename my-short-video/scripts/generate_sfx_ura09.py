"""Synthesize the ura-09 sound effects (no samples, no copyright issues).

md: no BGM, nothing flashy, never fully silent; Scene 2 asks for the chair
to creak slightly as the viewer gets up.

    python3 scripts/generate_sfx_ura09.py   # writes public/sfx/ura09/*.wav
"""

import os

import numpy as np

import generate_sfx_ura07 as base
from generate_sfx_ura07 import SR, band, fade, norm, rng

base.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura09")


def creak(duration, f0, f1, peak):
    """Office chair: a stick-slip squeak gliding in pitch, with grit."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    f = np.linspace(f0, f1, n) * (1 + 0.03 * np.sin(2 * np.pi * 7 * t))
    phase = 2 * np.pi * np.cumsum(f) / SR
    # Stick-slip: a pulse train rich in harmonics, softened.
    tone = np.sign(np.sin(phase)) * 0.4 + np.sin(phase) * 0.6
    tone = band(tone, 300, 3000)
    grit = band(rng.standard_normal(n), 800, 4000) * 0.25
    env = np.sin(np.pi * np.clip(t / duration, 0, 1)) ** 1.2
    env *= 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 5 * t))  # uneven friction
    return fade(norm((tone + grit) * env, peak), 0.01, 0.05)


def chair_rise():
    """Weight leaves the seat: cushion exhale, then a short creak."""
    d = 1.4
    n = int(d * SR)
    t = np.arange(n) / SR
    cushion = band(rng.standard_normal(n), 120, 900) * np.exp(-t * 4) * np.clip(t / 0.08, 0, 1)
    x = norm(cushion, 0.35)
    c = creak(0.55, 520, 380, 0.35)
    k = int(0.25 * SR)
    x[k : k + len(c)] += c
    return fade(x, 0.01, 0.2)


def chair_sit():
    """Sitting back down: creak, then the seat taking the weight."""
    d = 1.3
    n = int(d * SR)
    t = np.arange(n) / SR
    x = np.zeros(n)
    c = creak(0.5, 360, 470, 0.3)
    x[: len(c)] += c
    k = int(0.45 * SR)
    m = n - k
    tt = np.arange(m) / SR
    x[k:] += np.sin(2 * np.pi * 85 * tt) * np.exp(-tt * 14) * 0.5
    x[k:] += band(rng.standard_normal(m), 150, 1200) * np.exp(-tt * 9) * 0.25
    return fade(norm(x, 0.5), 0.01, 0.2)


def pen_down_clipboard():
    """Pen laid on a clipboard: hard plastic click on board, tiny roll."""
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    click = band(rng.standard_normal(n), 1800, 7000) * np.exp(-t * 110)
    knock = np.sin(2 * np.pi * 260 * t) * np.exp(-t * 45) * 0.5
    second = np.zeros(n)
    k = int(0.07 * SR)
    second[k:] = band(rng.standard_normal(n - k), 2000, 6000) * np.exp(-t[: n - k] * 140) * 0.35
    return fade(norm(click + knock + second, 0.5), 0.001, 0.1)


def pen_pickup():
    """Fingers taking the pen off the clipboard: light scrape and tick."""
    n = int(0.3 * SR)
    t = np.arange(n) / SR
    scrape = band(rng.standard_normal(n), 2000, 7000) * np.exp(-t * 25) * 0.4
    tick = band(rng.standard_normal(n), 2500, 8000) * np.exp(-np.clip(t - 0.12, 0, None) * 150) * (t > 0.12)
    return fade(norm(scrape + tick, 0.35), 0.002, 0.05)


if __name__ == "__main__":
    base.save("room-tone.wav", base.room_tone(15.5))
    base.save("pen-write.wav", base.pen_scratch(2.0, hard=False))
    base.save("pen-lift.wav", base.tick())
    base.save("pen-down.wav", pen_down_clipboard())
    base.save("chair-rise.wav", chair_rise())
    base.save("rustle.wav", base.rustle(1.6))
    base.save("chair-sit.wav", chair_sit())
    base.save("pen-pickup.wav", pen_pickup())
    # Writing again in their own words: steady, unhurried strokes.
    base.save("pen-own-words.wav", base.pen_scratch(5.4, hard=False))
