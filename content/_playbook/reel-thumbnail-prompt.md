# survival_mom_diary リール用サムネの作り方

survival_mom_diary の投稿ごとに、リールのサムネ（9:16）を下のプロンプトで作る。
文字だけはAIに任せず、最後に `reel_thumbnail.py` で入れ直す。

## 手順
1. 下のプロンプトの `Input Title`・`Hook phrase`・`[BOTTOM_LEFT_SUBJECT]` を埋めて、Canva の画像生成（9:16）で作る
   - Input Title：その回のキャプションの1行目など、タイトルにしたい日本語
   - Hook phrase：タイトルの中で一番感情が動く、スクロールを止める言葉（1つ）
   - BOTTOM_LEFT_SUBJECT：タイトルの意味に合う、シンプルで温かい物を1つ（英語で）
2. 生成した画像を原寸（1080×1920）で書き出す
3. `python3 reel_thumbnail.py 画像.png 出力.png "フック" "字幕1行目" ["字幕2行目"]` で文字を入れ直す
   - フックを2行にするときは `/` で区切る（例：`"模試、/申し込まなかった週"`）
   - AIが描いた文字の位置がずれていたら `--erase 0.38,0.55`（消す縦の範囲・高さに対する割合）で調整する

### AIの文字をそのまま使わない理由
2026-11-24 に3枚作ったところ、大きいフックの文字は正しく出たが、小さい字幕は
ぼやけた影のようになって読めなかった（3枚とも）。そのため、AIが描いた文字を消して、
プロンプトの文字ルール（中央・フック極太100%・行間0.9〜1.0・ごく薄い影／字幕35〜40%・細字・行間1.2〜1.3・白）
どおりに入れ直している。フォントは UD新ゴの代わりに Noto Sans CJK（フック Black／字幕 Regular）。

## プロンプト（毎回これを使う）

```
Create an Instagram Reel thumbnail in 9:16 vertical format.

Visual Style

Vibe: Minimalist, warm, calm, cozy, clean

Lighting: Soft natural light

Colors: Off-white, pale beige

Depth of field: Very shallow, creamy bokeh

Font: Clean sans-serif (UD Shin Go style), white

Layout Rules

The title must be placed exactly at the center of the canvas.

The central 55% of the image must be reserved only for text.

No background objects may overlap the text.

Input Title (Japanese)

「」

Semantic AI Task

Analyze the meaning of the Japanese title.

Extract the single most emotionally powerful and scroll-stopping phrase.

→ Hook phrase: 「」

Everything except the hook phrase must be treated as subtitle text.

Based on the meaning of the title,

select one simple, warm, symbolic subject for the lower-left area.

Assign this subject to:

[BOTTOM_LEFT_SUBJECT]

Examples:

"A small school backpack on a wooden chair"

"Two pairs of sneakers near the door"

"A warm mug on a wooden table"

Text Rendering Instructions

Split the title into 2–3 natural Japanese lines.

The hook phrase must form one strong visual block.

HOOK TEXT (main emotional phrase):

Size: 100% (base size)

Weight: Extra Bold

Line spacing: 0.9–1.0 (tight)

Shadow: ultra-light only

SUBTITLE TEXT (all non-hook text):

Size: 35–40% of the hook

Weight: Regular

Line spacing: 1.2–1.3

Shadow: none or ultra-light

Visual Hierarchy Rule

The hook must be the clear visual focus.

It should appear as one bold, compact block.

The subtitle must look small, quiet, and secondary.

Additional Visual Elements

Place [BOTTOM_LEFT_SUBJECT] in the lower-left quadrant,

slightly away from the edges,

occupying about 15–18% of the frame.

Background: heavily blurred, soft, warm atmosphere.

Restrictions

Do not add extra objects, decorations, or background elements.

Only the [BOTTOM_LEFT_SUBJECT] is allowed.
```

## これまでに作ったもの

| 投稿日 | Input Title | フック | 字幕 | BOTTOM_LEFT_SUBJECT |
| --- | --- | --- | --- | --- |
| 2026-11-25 | 玄関で止まる足と、増えていく塾のテキスト。 | 玄関で止まる足 | と、増えていく塾のテキスト。 | A pair of small navy children's sneakers on the entrance floor by the door |
| 2026-11-27 | 普通にしてれば、困らないのにね | 「普通にしてれば、 | 困らないのにね」 | A warm glass cup of barley tea on a wooden table |
| 2026-11-30 | 模試、申し込まなかった週。過去問を1ページだけ、一緒に。 | 模試、／申し込まなかった週 | 過去問を1ページだけ、一緒に。 | An open workbook with a pencil on a wooden table |
