"""Synthesize the ura-07 sound effects (no samples, no copyright issues).

The md asks for "no BGM, no flashy SFX" but never fully silent: a pen on
paper and quiet room tone. So everything here is a quiet, natural sound,
timed in Composition.tsx to the DeskScene animation.

    python3 scripts/generate_sfx_ura07.py   # writes public/sfx/ura07/*.wav
"""

import os
import wave

import numpy as np

SR = 48000
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura07")
rng = np.random.default_rng(7)


def band(x, lo, hi):
    """Band-pass by FFT mask with soft edges."""
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    mask = np.clip((f - lo * 0.7) / (lo * 0.3 + 1e-9), 0, 1) * np.clip(
        (hi * 1.3 - f) / (hi * 0.3), 0, 1
    )
    return np.fft.irfft(spec * mask, len(x))


def norm(x, peak):
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def fade(x, a=0.01, b=0.05):
    n = len(x)
    env = np.ones(n)
    na, nb = int(a * SR), int(b * SR)
    if na:
        env[:na] = np.linspace(0, 1, na)
    if nb:
        env[-nb:] = np.linspace(1, 0, nb)
    return x * env


def save(name, x):
    os.makedirs(OUT, exist_ok=True)
    data = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print("wrote", name, f"{len(x) / SR:.2f}s")


def strokes(duration, min_ms, max_ms, gap_ms, hard):
    """Envelope of separate pen strokes: each stroke a quick attack and
    release, with short lifts between characters."""
    n = int(duration * SR)
    env = np.zeros(n)
    t = int(0.02 * SR)
    while t < n:
        length = int(rng.uniform(min_ms, max_ms) / 1000 * SR)
        e = np.sin(np.linspace(0, np.pi, length)) ** (0.6 if hard else 1.0)
        e *= rng.uniform(0.6, 1.0)
        end = min(n, t + length)
        env[t:end] = np.maximum(env[t:end], e[: end - t])
        t = end + int(rng.uniform(*gap_ms) / 1000 * SR)
    return env


def pen_scratch(duration, hard):
    n = int(duration * SR)
    noise = rng.standard_normal(n)
    # Paper fibre grit: noise with fast random amplitude flutter.
    grit = band(noise, 1800 if hard else 2500, 6500 if hard else 8000)
    flutter = band(rng.standard_normal(n), 20, 120)
    flutter = 0.6 + 0.4 * norm(flutter, 1)
    body = band(rng.standard_normal(n), 600, 1800) * (0.55 if hard else 0.25)
    env = strokes(duration, 70, 160 if hard else 220, (20, 70) if hard else (40, 120), hard)
    x = (grit * flutter + body) * env
    return fade(norm(x, 0.9 if hard else 0.6), 0.005, 0.03)


def room_tone(duration):
    n = int(duration * SR)
    # Brown-ish noise (ventilation), very low.
    brown = np.cumsum(rng.standard_normal(n))
    brown = band(brown - np.mean(brown), 40, 600)
    brown = norm(brown, 0.5)
    hiss = norm(band(rng.standard_normal(n), 3000, 9000), 0.04)
    t = np.arange(n) / SR
    # Faint fluorescent-light hum at a night nursing station.
    hum = 0.05 * np.sin(2 * np.pi * 100 * t) + 0.025 * np.sin(2 * np.pi * 200 * t)
    swell = 0.85 + 0.15 * np.sin(2 * np.pi * t / 7.0)
    return fade(norm((brown + hiss + hum) * swell, 0.5), 0.4, 0.8)


def tick(duration=0.08, freq=3200, peak=0.5):
    """Pen tip leaving the paper: a tiny dry tick."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 2000, 7000) * np.exp(-t * 90)
    x += 0.3 * np.sin(2 * np.pi * freq * t) * np.exp(-t * 140)
    return fade(norm(x, peak), 0.001, 0.02)


def pen_down():
    """Plastic pen laid on paper over a wooden desk: soft thump, small
    click, and a short roll."""
    d = 0.9
    n = int(d * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 140 * t) * np.exp(-t * 28) * 0.8
    click = band(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 70) * 0.6
    second = np.zeros(n)
    k = int(0.11 * SR)
    second[k:] = (band(rng.standard_normal(n - k), 1500, 5000) * np.exp(-t[: n - k] * 90)) * 0.25
    roll = band(rng.standard_normal(n), 400, 2500) * np.clip((t - 0.15) / 0.05, 0, 1) * np.exp(-np.clip(t - 0.15, 0, None) * 7) * 0.12
    return fade(norm(thump + click + second + roll, 0.6), 0.001, 0.2)


def rustle(duration=2.4):
    """Uniform sleeve brushing the desk as the hand withdraws."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 300, 3500)
    grain = 0.5 + 0.5 * norm(band(rng.standard_normal(n), 4, 18), 1)
    env = np.sin(np.pi * np.clip(t / duration, 0, 1)) ** 1.5
    return fade(norm(x * grain * env, 0.4), 0.05, 0.3)


def realization(duration=3.0):
    """Very soft low tone under 「刺々しいことに気づいた。」: not music, just a
    quiet weight in the room. Kept well under the room tone's presence."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    env = np.sin(np.pi * t / duration) ** 2
    x = (np.sin(2 * np.pi * 73.4 * t) + 0.4 * np.sin(2 * np.pi * 110 * t + 0.6)) * env
    air = band(rng.standard_normal(n), 200, 1200) * env * 0.15
    return fade(norm(x + air, 0.35), 0.2, 0.4)


if __name__ == "__main__":
    save("room-tone.wav", room_tone(15.5))
    save("pen-scratch.wav", pen_scratch(50 / 30, hard=False))
    save("pen-scratch-hard.wav", pen_scratch(57 / 30, hard=True))
    save("pen-lift.wav", tick())
    save("realization.wav", realization())
    save("pen-down.wav", pen_down())
    save("rustle.wav", rustle())
