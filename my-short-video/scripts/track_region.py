"""Track a small region (e.g. a name written on a memo) through AI footage,
so it can be blurred frame by frame.

Multi-scale, multi-angle template matching, searching near the previous hit.
Writes JSON: [{"t": seconds, "x","y","w","h": box in source px, "score"}].

    pip install opencv-python-headless   # once
    python3 scripts/track_region.py SRC.mp4 TPL_SEC X Y W H START END OUT.json

Always check the result by drawing the boxes on frames: matches with a low
score (< 0.5) are usually noise, e.g. when a hand covers the region.
"""

import json
import sys

import cv2
import numpy as np


def rotate(img, deg):
    h, w = img.shape[:2]
    m = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1.0)
    return cv2.warpAffine(img, m, (w, h), borderMode=cv2.BORDER_REPLICATE)


def frame_at(cap, sec):
    cap.set(cv2.CAP_PROP_POS_MSEC, sec * 1000)
    ok, f = cap.read()
    return cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) if ok else None


def main(src, tpl_sec, x, y, w, h, start, end, out):
    tpl_sec, start, end = float(tpl_sec), float(start), float(end)
    x, y, w, h = int(x), int(y), int(w), int(h)
    cap = cv2.VideoCapture(src)
    fps = cap.get(cv2.CAP_PROP_FPS)
    tpl = frame_at(cap, tpl_sec)[y : y + h, x : x + w]
    scales = np.arange(0.45, 1.35, 0.05)
    angles = range(-16, 17, 4)
    templates = []
    for s in scales:
        t = cv2.resize(tpl, None, fx=s, fy=s)
        for a in angles:
            templates.append((s, a, rotate(t, a)))

    results = []
    prev = None
    n0, n1 = int(round(start * fps)), int(round(end * fps))
    for n in range(n0, n1 + 1):
        sec = n / fps
        img = frame_at(cap, sec)
        if img is None:
            break
        H, W = img.shape
        if prev is None:
            x0, y0, x1, y1 = 0, 0, W, H
        else:
            px, py = prev
            x0, y0 = max(0, int(px - 200)), max(0, int(py - 200))
            x1, y1 = min(W, int(px + 200)), min(H, int(py + 200))
        region = img[y0:y1, x0:x1]
        best = (-1, None)
        for s, a, t in templates:
            th, tw = t.shape
            if th >= region.shape[0] or tw >= region.shape[1]:
                continue
            r = cv2.matchTemplate(region, t, cv2.TM_CCOEFF_NORMED)
            _, mx, _, loc = cv2.minMaxLoc(r)
            if mx > best[0]:
                best = (mx, (loc[0] + x0, loc[1] + y0, tw, th, s, a))
        score, (bx, by, bw, bh, s, a) = best
        prev = (bx + bw / 2, by + bh / 2) if score > 0.45 else prev
        results.append(
            {"t": round(sec, 4), "x": bx, "y": by, "w": bw, "h": bh, "scale": round(float(s), 2), "angle": a, "score": round(float(score), 3)}
        )
        print(f"{sec:6.2f}s score={score:.2f} box=({bx},{by},{bw},{bh}) s={s:.2f} a={a}")
    with open(out, "w") as f:
        json.dump(results, f, indent=1)


if __name__ == "__main__":
    main(*sys.argv[1:10])
