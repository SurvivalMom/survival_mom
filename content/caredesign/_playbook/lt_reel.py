"""
@light_kaigo型テロップで、15秒前後の4場面リールを仕上げる（AI動画を4場面で生成したとき用）。
手順と配置の考え方は reel-telop-handoff.md の「4. テロップ配置のヒント」を参照。
（SurvivalMom/survival_mom の content/caredesign/_playbook/reel-telop-handoff.md と
 telop_overlays_example.py の決めごとに合わせたもの）

構成（各場面の切れ目 t2, t3, t4 は spec で指定）:
  0 〜 t2        タイトルカード（中央・ラベルなし）
  t2 〜 t3       Scene 2 字幕＋左上ラベル
  t3 〜 t4       Scene 3 字幕＋左上ラベル
  t4 〜 end      Scene 4 字幕＋保存の依頼＋左上ラベル
  end 〜 end+2   Scene 4 字幕＋二択＋左上ラベル（映像は Scene 1 の頭に戻してループ）

usage: python3 lt_reel.py spec.json src.mp4 out.mp4

spec の主なキー：label, card{pre, main, mutter, y}, s2, s3, s4, cta, choice{q, a, b},
  t2, t3, t4, end, loop, gain_db, blur, card_dim（タイトルカードの暗さ 0〜1、既定0.35）,
  sub_y（字幕の基本位置）, s2_y/s3_y/s4_y（場面ごとの字幕位置）
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

BLACK = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
EMOJI = '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
WHITE, YELLOW, INK = (255, 255, 255, 255), (255, 228, 0, 255), (0, 0, 0, 255)
C = {'w': WHITE, 'y': YELLOW}

spec_path, src, out = sys.argv[1:4]
spec = json.load(open(spec_path))
W, H = [int(v) for v in subprocess.run(
    ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
     '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(',')]
K = W / 720  # 720x1280 基準のサイズを実寸に合わせる倍率


def jp(size):
    return ImageFont.truetype(BLACK, max(8, int(size * K)), index=0)


def emoji_img(ch, size):
    f = ImageFont.truetype(EMOJI, 109)
    im = Image.new('RGBA', (136, 128), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((0, 0), ch, font=f, embedded_color=True)
    im = im.crop(im.getbbox())
    s = int(size * K)
    return im.resize((s, int(im.height * s / im.width)), Image.LANCZOS)


def line(d, runs, y, size, stroke):
    f = jp(size)
    widths = [d.textlength(t, font=f) for t, _ in runs]
    total = sum(widths)
    if total > W - 30 * K:
        raise SystemExit(f'行が画面幅を超えています: {"".join(t for t, _ in runs)}')
    x = (W - total) / 2
    for (t, c), w in zip(runs, widths):
        d.text((x, y), t, font=f, fill=C[c], stroke_width=int(stroke * K), stroke_fill=INK)
        x += w
    return y + int(size * K * 1.25)


def label(d):
    f = jp(26)
    t = spec['label']
    tw = d.textlength(t, font=f)
    x0, y0 = 40 * K, 110 * H / 1280
    d.rectangle([x0, y0, x0 + tw + 24 * K, y0 + 44 * K], fill=YELLOW)
    d.text((x0 + 12 * K, y0 + 4 * K), t, font=f, fill=INK)


def card(path):
    # 悩みを代弁するタイトルカードは、画面を少し暗くして中央の言葉を立たせる
    dim = int(255 * spec.get('card_dim', 0.35))
    im = Image.new('RGBA', (W, H), (0, 0, 0, dim))
    d = ImageDraw.Draw(im)
    c = spec['card']
    y = c.get('y', 330) * H / 1280
    y = line(d, [(c['pre'], 'w')], y, 40, 6) + 10 * K
    for row in c['main']:
        big = any(col == 'Y' for _, col in row)
        runs = [(t, col.lower()) for t, col in row]
        y = line(d, runs, y, 112 if big else 80, 11 if big else 9)
    if c.get('mutter'):
        line(d, [(c['mutter'], 'w')], y + 14 * K, 32, 5)
    im.save(path)


def sub(path, rows, cta=None, choice=None, y_base=None):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    label(d)
    y = (y_base if y_base is not None else spec.get('sub_y', 700)) * H / 1280
    for row in rows:
        y = line(d, [tuple(r) for r in row], y, 46, 7)
    if cta:
        y += 10 * K
        for t in cta:
            y = line(d, [(t, 'w')], y, 28, 5)
    if choice:
        y += 18 * K
        y = line(d, [tuple(r) for r in choice['q']], y, 38, 6) + 4 * K
        f = jp(40)
        em = 46 * K
        items = [('👍', choice['a']), ('🙌', choice['b'])]
        widths = [em + 10 * K + d.textlength(t, font=f) for _, t in items]
        gap = 40 * K
        x = (W - sum(widths) - gap) / 2
        # 2つを比べやすいように、👍は黄色、🙌は白で色を分ける
        for (e, t), w, col in zip(items, widths, (YELLOW, WHITE)):
            im.alpha_composite(emoji_img(e, 46), (int(x), int(y + 2 * K)))
            d.text((x + em + 10 * K, y - 4 * K), t, font=jp(40), fill=col,
                   stroke_width=int(6 * K), stroke_fill=INK)
            x += w + gap
    im.save(path)


tmp = os.path.join(os.path.dirname(os.path.abspath(out)), '_lt')
os.makedirs(tmp, exist_ok=True)
t2, t3, t4, end = spec['t2'], spec['t3'], spec['t4'], spec['end']
loop = spec.get('loop', 2.0)
card(f'{tmp}/0.png')
# 字幕の位置は場面ごとに変えられる（s2_y／s3_y／s4_y、720x1280基準。主役の物と重ならない側へ）
sub(f'{tmp}/1.png', spec['s2'], y_base=spec.get('s2_y'))
sub(f'{tmp}/2.png', spec['s3'], y_base=spec.get('s3_y'))
sub(f'{tmp}/3.png', spec['s4'], cta=spec['cta'], y_base=spec.get('s4_y'))
sub(f'{tmp}/4.png', spec['s4'], choice=spec['choice'], y_base=spec.get('s4_y'))
spans = [(0, t2), (t2, t3), (t3, t4), (t4, end), (end, end + loop)]

# 映像：本編 0〜end ＋ Scene 1 の頭 loop 秒（ループ）。音は切れ目にフェード、全体を持ち上げる
gain = spec.get('gain_db', 0)
pre = []
for blur in spec.get('blur', []):  # [start, end, x, y, w, h]（割合）
    s, e, bx, by, bw, bh = blur
    pre.append((s, e, bx, by, bw, bh))
fc = (f"[0:v]trim=0:{end},setpts=PTS-STARTPTS[va];"
      f"[0:v]trim=0:{loop},setpts=PTS-STARTPTS[vb];"
      f"[0:a]atrim=0:{end},asetpts=PTS-STARTPTS,afade=t=in:d=0.05,afade=t=out:st={end-0.12}:d=0.12[aa];"
      f"[0:a]atrim=0:{loop},asetpts=PTS-STARTPTS,afade=t=in:d=0.12,afade=t=out:st={loop-0.3}:d=0.3[ab];"
      f"[va][aa][vb][ab]concat=n=2:v=1:a=1[v0][a0];")
last = '[v0]'
for i, (s, e, bx, by, bw, bh) in enumerate(pre):
    fc += (f"{last}split[bs{i}][bb{i}];[bb{i}]crop=iw*{bw}:ih*{bh}:iw*{bx}:ih*{by},boxblur=20:2[bl{i}];"
           f"[bs{i}][bl{i}]overlay=W*{bx}:H*{by}:enable='between(t,{s},{e})'[vbl{i}];")
    last = f'[vbl{i}]'
for i, (s, e) in enumerate(spans):
    fc += f"{last}[{i+1}:v]overlay=0:0:enable='between(t,{s},{e})'[o{i}];"
    last = f'[o{i}]'
fc += f"[a0]volume={gain}dB,alimiter=limit=0.35:level=disabled[aout]"
cmd = ['ffmpeg', '-y', '-v', 'error', '-i', src]
for i in range(5):
    cmd += ['-i', f'{tmp}/{i}.png']
cmd += ['-filter_complex', fc, '-map', last, '-map', '[aout]', '-c:v', 'libx264', '-crf', '18',
        '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k',
        '-movflags', '+faststart', out]
subprocess.run(cmd, check=True)
print('wrote', out)
