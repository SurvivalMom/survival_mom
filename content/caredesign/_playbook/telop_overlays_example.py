"""
CARE DESIGN LAB リールのテロップ画像（@light_kaigo型）を作るスクリプトの例。
ura-13「答え合わせのないまま」の完成版で使ったもの。

使い方：
  python3 telop_overlays_example.py
  → lt_s1.png（タイトルカード）／lt_s2.png・lt_s3.png・lt_s3q.png（字幕＋タイトルラベル）を出力。
  ffmpeg の overlay で、0〜4秒／4〜9秒／9〜12.5秒／12.5〜14.5秒 に重ねる。
  手順の詳細は reel-telop-handoff.md の「3. 動画の仕上げ手順」を参照。

必要なもの：Pillow、Noto Sans CJK（Black）、Noto Color Emoji。
フォントの場所は環境に合わせて BLACK・EMOJI を書き換える。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 720, 1280
BLACK = '/usr/share/fonts/opentype/noto/NotoSansCJK-Black.ttc'
EMOJI = '/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf'
WHITE, YELLOW, INK = (255, 255, 255, 255), (255, 228, 0, 255), (0, 0, 0, 255)

def jp(size):
    return ImageFont.truetype(BLACK, size, index=0)

def emoji_img(ch, size):
    f = ImageFont.truetype(EMOJI, 109)
    im = Image.new('RGBA', (136, 128), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((0, 0), ch, font=f, embedded_color=True)
    im = im.crop(im.getbbox())
    return im.resize((size, int(im.height * size / im.width)), Image.LANCZOS)

def line(d, runs, y, size, stroke):
    """runs: [(text, color)] を1行として中央揃えで描く（白・黄文字＋黒フチ）"""
    f = jp(size)
    widths = [d.textlength(t, font=f) for t, _ in runs]
    x = (W - sum(widths)) / 2
    for (t, c), w in zip(runs, widths):
        d.text((x, y), t, font=f, fill=c, stroke_width=stroke, stroke_fill=INK)
        x += w
    return y + int(size * 1.25)

def label(d):
    # シリーズ名：黄色帯に黒文字（ライトさんの「介護保険のスペシャリスト▶」風）
    f = jp(26)
    t = '答え合わせのないまま ▶'
    tw = d.textlength(t, font=f)
    x0, y0 = 40, 110
    d.rectangle([x0, y0, x0 + tw + 24, y0 + 44], fill=YELLOW)
    d.text((x0 + 12, y0 + 4), t, font=f, fill=INK)

def title():
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    y = 330
    y = line(d, [('記録を見返すたびに、思う。', WHITE)], y, 40, 6) + 10
    y = line(d, [('あの判断、', WHITE)], y, 80, 9)
    y = line(d, [('正しかった', YELLOW)], y, 112, 11)
    y = line(d, [('か分からない。', WHITE)], y, 80, 9) + 14
    line(d, [('誰にも、答え合わせされないまま〜', WHITE)], y, 32, 5)
    im.save('lt_s1.png')

def sub(name, rows, cta=False, choice=False):
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    label(d)
    y = 700
    for runs in rows:
        y = line(d, runs, y, 46, 7)
    if cta:
        y += 10
        y = line(d, [('保存して、気になっていた判断を', WHITE)], y, 28, 5)
        y = line(d, [('一度、誰かに話してみてください。', WHITE)], y, 28, 5)
    if choice:
        y += 18
        y = line(d, [('判断の答え合わせ、', WHITE), ('してもらえてる？', YELLOW)], y, 38, 6) + 4
        f = jp(40)
        items = [('👍', 'ある'), ('🙌', 'ない')]
        x = W / 2 - 150
        for e, t in items:
            im.alpha_composite(emoji_img(e, 46), (int(x), int(y + 2)))
            d.text((x + 56, y - 4), t, font=f, fill=YELLOW, stroke_width=6, stroke_fill=INK)
            x += 190
    im.save(name)

title()
sub('lt_s2.png', [[('根拠を聞かれないまま、', WHITE)], [('時間だけが', WHITE), ('過ぎていく。', YELLOW)]])
sub('lt_s3.png', [[('今度は、自分から', WHITE)], [('聞いてみようと思う。', YELLOW)]], cta=True)
sub('lt_s3q.png', [[('今度は、自分から', WHITE)], [('聞いてみようと思う。', YELLOW)]], cta=False, choice=True)
print('ok')
