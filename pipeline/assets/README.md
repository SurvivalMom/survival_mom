# assets/

Static input files the pipeline reads from, but never generates.

- `bgm/` — background music track(s). `build_video.py` picks the first
  `.mp3` / `.wav` / `.m4a` file it finds here and mixes it in at low volume,
  looped to cover the full video. Leave empty to render without music.
- `fonts/` — optional place to drop a custom font for subtitle/drawtext
  rendering. Not read automatically yet; point `FFMPEG_DRAWTEXT_FONT` (see
  `.env.example`) at a file here if you add one.

Only commit files you have the rights to use in the final video — this
directory is tracked by git (unlike `shots/` and `output/`, which hold
generated media and are gitignored).
