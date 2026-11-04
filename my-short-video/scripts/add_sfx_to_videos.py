"""Add synthesized, natural SFX to finished clips (video stream is copied
untouched; the original audio is kept and mixed under the effects).

    python3 scripts/add_sfx_to_videos.py kuran   IN.mp4 OUT.mp4
    python3 scripts/add_sfx_to_videos.py nomikonda IN.mp4 OUT.mp4

Cue times (seconds) were read off the footage frame by frame.
Same rules as the ura series: no BGM, nothing flashy, never fully silent.
"""

import os
import subprocess
import sys
import tempfile
import wave

import numpy as np

sys.path.insert(0, os.path.dirname(__file__))
from generate_sfx_ura07 import SR, band, fade, norm, rng, room_tone, rustle  # noqa: E402


# ---------- extra synth voices ----------

def paper_touch():
    """Fingertips landing on a sheet of paper."""
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 800, 5000) * np.exp(-t * 30)
    return fade(norm(x, 0.35), 0.002, 0.08)


def paper_slide(duration):
    """A sheet pushed/slid across a desk: smooth, slightly papery hiss."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 1200, 7000)
    grain = 0.7 + 0.3 * norm(band(rng.standard_normal(n), 8, 40), 1)
    env = np.sin(np.pi * np.clip(t / duration, 0, 1)) ** 0.8
    return fade(norm(x * grain * env, 0.4), 0.03, 0.15)


def page_flip(duration=1.1):
    """A page lifted and turned: crinkle that grows, then a soft flap."""
    n = int(duration * SR)
    t = np.arange(n) / SR
    crinkle = band(rng.standard_normal(n), 1500, 9000)
    flutter = np.clip(band(rng.standard_normal(n), 15, 70) * 4, 0, None)
    flutter = norm(flutter, 1)
    env = np.clip(t / (duration * 0.75), 0, 1) ** 1.6 * np.exp(-np.clip(t - duration * 0.75, 0, None) * 18)
    flap = np.zeros(n)
    k = int(duration * 0.78 * SR)
    m = n - k
    flap[k:] = band(rng.standard_normal(m), 150, 1500) * np.exp(-np.arange(m) / SR * 25)
    return fade(norm(crinkle * (0.4 + flutter) * env * 0.8 + flap * 1.2, 0.55), 0.01, 0.08)


def folder_close():
    """Cardboard folder cover landing: low papery thump with air puff."""
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    thump = np.sin(2 * np.pi * 95 * t) * np.exp(-t * 22)
    puff = band(rng.standard_normal(n), 200, 2500) * np.exp(-t * 30) * 0.7
    slap = band(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 80) * 0.4
    return fade(norm(thump + puff + slap, 0.6), 0.001, 0.2)


def glass_tap(peak=0.3):
    """Thumb tapping a phone screen."""
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    x = band(rng.standard_normal(n), 1500, 6000) * np.exp(-t * 160)
    x += 0.4 * np.sin(2 * np.pi * 240 * t) * np.exp(-t * 120)
    return fade(norm(x, peak), 0.0005, 0.01)


def lock_click():
    """Side button press as the screen turns off."""
    n = int(0.12 * SR)
    t = np.arange(n) / SR
    a = band(rng.standard_normal(n), 2000, 8000) * np.exp(-t * 220)
    b = np.zeros(n)
    k = int(0.035 * SR)
    b[k:] = band(rng.standard_normal(n - k), 2500, 8000) * np.exp(-t[: n - k] * 260) * 0.6
    return fade(norm(a + b, 0.45), 0.0005, 0.02)


def phone_down():
    """Phone laid face down on a wooden desk."""
    n = int(0.6 * SR)
    t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * 120 * t) * np.exp(-t * 35)
    knock = band(rng.standard_normal(n), 600, 3500) * np.exp(-t * 60) * 0.6
    return fade(norm(thud + knock, 0.55), 0.001, 0.15)


# ---------- cue sheets ----------

def kuran():
    """空欄のまま返ってきた (14.0s): evaluation sheet put away into a folder."""
    return [
        (1.65, paper_touch(), 0.6),
        (2.0, paper_slide(1.8), 0.35),  # hand resting/sliding on the sheet
        (4.0, page_flip(1.15), 0.7),  # sheet lifted and turned
        (5.15, folder_close(), 0.75),  # folder cover comes down
        (5.6, paper_slide(1.6), 0.3),  # palm smoothing the closed folder
        (8.2, rustle(1.4), 0.4),  # sleeve, hand withdrawing
    ]


def nomikonda():
    """言いたいことを、飲み込んだ (17.0s): message typed, deleted, never sent."""
    cues = []
    # Typing, uneven rhythm with small hesitations (0.3-4.6s).
    t = 0.3
    while t < 4.6:
        cues.append((t, glass_tap(rng.uniform(0.22, 0.32)), 0.55))
        t += rng.uniform(0.11, 0.24) if rng.random() > 0.15 else rng.uniform(0.45, 0.7)
    # Holding delete: a quick, even burst (5.2-5.7s).
    t = 5.2
    while t < 5.7:
        cues.append((t, glass_tap(0.2), 0.45))
        t += 0.065
    # 5.7-11.3s: nothing but the room. Staring at the screen.
    cues.append((11.35, lock_click(), 0.6))  # screen goes dark
    cues.append((12.3, rustle(0.9), 0.3))  # arm lowering the phone
    cues.append((13.05, phone_down(), 0.7))  # laid face down
    return cues


# ---------- mixing ----------

def read_audio(path, duration):
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "a.wav")
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", path, "-vn", "-ac", "1", "-ar", str(SR), wav],
            check=True,
        )
        with wave.open(wav) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    out = np.zeros(int(duration * SR))
    out[: min(len(x), len(out))] = x[: len(out)]
    return out


def duration_of(path):
    r = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True, check=True,
    )
    return float(r.stdout.strip())


def main(kind, src, dst):
    dur = duration_of(src)
    mix = read_audio(src, dur)  # keep original ambience
    tone = room_tone(dur + 0.5)[: len(mix)]
    mix += tone * 0.2
    for at, clip, vol in {"kuran": kuran, "nomikonda": nomikonda}[kind]():
        i = int(at * SR)
        end = min(len(mix), i + len(clip))
        mix[i:end] += clip[: end - i] * vol
    # Normalize so the loudest effect peaks at about -3 dBFS: audible on a
    # phone speaker, with headroom so nothing clips.
    mix *= 0.7 / (np.max(np.abs(mix)) or 1.0)
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "mix.wav")
        with wave.open(wav, "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", src, "-i", wav,
             "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
             "-ac", "2", "-shortest", "-movflags", "+faststart", dst],
            check=True,
        )
    print("wrote", dst)


if __name__ == "__main__":
    main(*sys.argv[1:4])
