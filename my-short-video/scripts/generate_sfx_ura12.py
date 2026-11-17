"""Synthesize the ura-12 sound effects (no samples, no copyright issues).

md: no BGM, nothing flashy, never fully silent.

    python3 scripts/generate_sfx_ura12.py   # writes public/sfx/ura12/*.wav
"""

import os

import generate_sfx_ura07 as base
from add_sfx_to_videos import page_flip, paper_slide, paper_touch
from generate_sfx_ura10 import palm_rest

base.OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sfx", "ura12")


if __name__ == "__main__":
    base.save("room-tone.wav", base.room_tone(15.5))
    base.save("paper-touch.wav", paper_touch())
    # A small spiral-pad page: shorter than a sheet of A4.
    base.save("page-flip.wav", page_flip(0.7))
    base.save("low-weight.wav", base.realization(2.4))
    base.save("card-slide.wav", paper_slide(1.2))
    base.save("card-down.wav", paper_touch())
    base.save("palm-rest.wav", palm_rest())
