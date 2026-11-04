#!/usr/bin/env bash
# Synthesizes every sound effect used in Ura07Composition entirely with
# ffmpeg's lavfi audio sources/filters -- no recorded or licensed audio,
# so there is nothing to clear rights on. Re-run this script any time the
# clips in public/audio/ need regenerating; it always overwrites them.
#
# Matches the brief's audio spec (content/caredesign/ai-video/ura-07-chiisana-gouman.md):
# continuous quiet room tone, a harsher/faster pen-scratch during the
# irritated writing beat, a softer slower retrace during the pause/re-read
# beat, a small pen-set-down knock, a sleeve-on-desk rub as the hand
# withdraws, and a very quiet low tone under the realization beat. No
# music, no loud/cartoonish effects, and "silence" during the pause beat
# is filled by room tone alone, not by removing audio entirely.
set -euo pipefail
cd "$(dirname "$0")/../public/audio"

# 1. Room tone: brown noise, low-passed and turned down low, running the
#    full composition length. This is the only track that plays for the
#    entire 13.0s.
ffmpeg -y -f lavfi -i "anoisesrc=color=brown:amplitude=0.07:duration=13.5" \
  -af "lowpass=f=500,volume=0.3" \
  -ar 44100 room-tone.wav

# 2. Harsh pen scratch: white noise band-passed into a scratchy range and
#    put through a fast tremolo to read as repeated quick strokes under
#    heavier-than-usual pen pressure. Scene A only (irritated writing).
ffmpeg -y -f lavfi -i "anoisesrc=color=white:amplitude=0.16:duration=5.0" \
  -af "highpass=f=1500,lowpass=f=6500,tremolo=f=7:d=0.85,afade=t=in:d=0.1,afade=t=out:st=4.6:d=0.4,volume=0.45" \
  -ar 44100 pen-scratch-harsh.wav

# 3. Soft pen retrace: pink noise, narrower/lower band, slower tremolo,
#    much quieter -- the pen tip tracing back over already-written text
#    without pressing, during the pause/re-read beat.
ffmpeg -y -f lavfi -i "anoisesrc=color=pink:amplitude=0.05:duration=3.5" \
  -af "highpass=f=900,lowpass=f=4000,tremolo=f=2.2:d=0.6,afade=t=in:d=0.2,afade=t=out:st=3.0:d=0.5,volume=0.22" \
  -ar 44100 pen-trace-soft.wav

# 4. Pen set-down: a short low sine for the knock's body...
ffmpeg -y -f lavfi -i "sine=frequency=140:duration=0.35" \
  -af "afade=t=in:d=0.005,afade=t=out:st=0.08:d=0.27,volume=0.5" \
  -ar 44100 _pen-setdown-tone.wav
# ...mixed with a very short noise transient for the contact click...
ffmpeg -y -f lavfi -i "anoisesrc=color=brown:amplitude=0.35:duration=0.12" \
  -af "bandpass=f=1800:width_type=h:w=1200,afade=t=out:st=0.02:d=0.1,volume=0.4" \
  -ar 44100 _pen-setdown-click.wav
ffmpeg -y -i _pen-setdown-tone.wav -i _pen-setdown-click.wav \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:normalize=0" \
  -ar 44100 pen-setdown.wav
rm -f _pen-setdown-tone.wav _pen-setdown-click.wav

# 5. Sleeve-on-desk rub: brown noise, mid-low bandpass, swelling in and
#    back out across the clip (the hand brushing the desk as it
#    withdraws), not a hard attack.
ffmpeg -y -f lavfi -i "anoisesrc=color=brown:amplitude=0.12:duration=0.9" \
  -af "bandpass=f=750:width_type=h:w=700,afade=t=in:d=0.35,afade=t=out:st=0.5:d=0.4,volume=0.28" \
  -ar 44100 sleeve-rub.wav

# 6. Realization low tone: a very quiet, slow-fading low sine under the
#    "気づいた" beat -- felt more than heard, never a music cue.
ffmpeg -y -f lavfi -i "sine=frequency=68:duration=2.6" \
  -af "afade=t=in:d=0.9,afade=t=out:st=1.8:d=0.8,volume=0.1" \
  -ar 44100 low-realization-tone.wav

echo "Generated SFX:"
ls -la *.wav
