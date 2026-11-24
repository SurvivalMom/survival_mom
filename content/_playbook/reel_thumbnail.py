"""
survival_mom_diary のリール用サムネ（9:16）を仕上げる。

（content/_playbook/reel-thumbnail-prompt.md の手順で使う）
AI画像生成で作った背景（サムネ用プロンプトで生成したもの）から、AIが描いた文字を消し、
プロンプトの文字ルールどおりにタイトルを入れ直す。
  - タイトルはキャンバスの真ん中、中央55%は文字だけ
  - フック：最大・極太・行間0.9〜1.0・ごく薄い影
  - 字幕（フック以外）：フックの35〜40%・細字・行間1.2〜1.3・影なし
  - 文字色：白

usage: python3 thumb.py bg.png out.png "フック" "字幕1行目" ["字幕2行目"] [--erase y0,y1]
  --erase: AIが描いた文字を消す縦の範囲（高さに対する割合）。既定 0.39,0.56
"""
import sys
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter

args = sys.argv[1:]
erase = (0.39, 0.56)
if '--erase' in args:
    i = args.index('--erase')
    erase = tuple(float(v) for v in args[i + 1].split(','))
    del args[i:i + 2]
bg, out, hook, *subs = args

BOLD = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
REG = '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'

img = cv2.imread(bg)
h, w = img.shape[:2]
# 1) AIが描いた文字を消す（中央の帯を周りから塗り直す）
mask = np.zeros((h, w), np.uint8)
x0, x1 = int(w * 0.10), int(w * 0.90)
mask[int(h * erase[0]):int(h * erase[1]), x0:x1] = 255
img = cv2.inpaint(img, mask, 25, cv2.INPAINT_TELEA)
# 塗り直した帯だけをなめらかにし、端はぼかしてなじませる
soft = cv2.GaussianBlur(img, (0, 0), 22)
m = cv2.GaussianBlur(mask.astype(np.float32) / 255, (0, 0), 25)[..., None]
img = (img * (1 - m) + soft * m).astype(np.uint8)
base = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)).convert('RGBA')

# 2) 文字サイズを決める（フックの一番長い行が幅の78%に収まる大きさ。上限は幅の13%）
hook_lines = hook.split('/')
size = int(w * 0.13)
while size > 20:
    f = ImageFont.truetype(BOLD, size, index=0)
    if max(f.getlength(l) for l in hook_lines) <= w * 0.78:
        break
    size -= 2
fh = ImageFont.truetype(BOLD, size, index=0)
ss = int(size * 0.38)
fs = ImageFont.truetype(REG, ss, index=0)
while subs and max(fs.getlength(s) for s in subs) > w * 0.82 and ss > 12:
    ss -= 1
    fs = ImageFont.truetype(REG, ss, index=0)

hook_lh = int(size * 0.95)
sub_lh = int(ss * 1.25)
gap = int(size * 0.35)
total = hook_lh * len(hook_lines) + (gap + sub_lh * len(subs) if subs else 0)
y0 = (h - total) // 2

txt = Image.new('RGBA', base.size, (0, 0, 0, 0))
shadow = Image.new('RGBA', base.size, (0, 0, 0, 0))
dt, ds = ImageDraw.Draw(txt), ImageDraw.Draw(shadow)
y = y0
for l in hook_lines:
    x = (w - fh.getlength(l)) / 2
    ds.text((x, y + 3), l, font=fh, fill=(90, 70, 50, 70))
    dt.text((x, y), l, font=fh, fill=(255, 255, 255, 255))
    y += hook_lh
y += gap
for s in subs:
    x = (w - fs.getlength(s)) / 2
    ds.text((x, y + 2), s, font=fs, fill=(90, 70, 50, 80))
    dt.text((x, y), s, font=fs, fill=(255, 255, 255, 255))
    y += sub_lh
shadow = shadow.filter(ImageFilter.GaussianBlur(6))
out_img = Image.alpha_composite(Image.alpha_composite(base, shadow), txt).convert('RGB')
out_img.save(out, quality=95)
print('wrote', out, 'hook', size, 'sub', ss)
