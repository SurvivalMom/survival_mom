# care_design_lab リール用サムネの作り方

care_design_lab の投稿ごとに、リールのサムネ（9:16）を下のプロンプトで作る。

## 手順
1. 下のプロンプトの `Input Title`・`Hook phrase`・`[BOTTOM_LEFT_SUBJECT]` を埋めて、Canva の画像生成（9:16）で作る
   - Input Title：その回のタイトル＋一番言いたい一文（例：「とりあえず私がやる。守っていたのは、自分の安心だったのかも。」）
   - Hook phrase：タイトルの中で一番鋭く、引っかかる言葉（1つ）
   - BOTTOM_LEFT_SUBJECT：管理・リーダーの苦労・疲弊・ルールを象徴する、少し緊張感のある物を1つ（英語で）
2. 生成した画像を原寸（1080×1920）で書き出し、文字を原寸で確認する（誤字・欠け・読めない字幕がないか）
3. 文字に問題があれば、`content/_playbook/reel_thumbnail.py` の `--dark` で入れ直す
   - `python3 reel_thumbnail.py 画像.png 出力.png "フック" "字幕" --dark`

### メモ
2026-11-24 に3枚作ったときは、暗い背景だったため、フックも小さい字幕も正しく読める形で出た（入れ直し不要）。
明るい背景の survival_mom_diary では小さい字幕が読めなかったので、そちらは毎回入れ直している
（content/_playbook/reel-thumbnail-prompt.md）。

## プロンプト（毎回これを使う）

```
Create an Instagram Reel thumbnail in 9:16 vertical format.

Visual Style
Vibe: Minimalist, cinematic, professional, slightly dark or tense.
Lighting: Cold, sharp directional light or dim late-night office lighting.
Colors: Deep navy, slate gray, muted teal, with subtle high-contrast accents.
Depth of field: Very shallow, cinematic bokeh.
Font: Clean sans-serif (UD Shin Go style), white.

Layout Rules
The title must be placed exactly at the center of the canvas.
The central 55% of the image must be reserved only for text.
No background objects may overlap the text.

Input Title (Japanese)
「 」

Semantic AI Task
Analyze the meaning of the Japanese title.
Extract the single most sharp, controversial, and scroll-stopping phrase.
→ Hook phrase: 「」

Everything except the hook phrase must be treated as subtitle text.

Based on the meaning of the title (management, leadership struggles, burnout, rules),
select one simple, symbolic, and slightly tense subject for the lower-left area.

Assign this subject to:
[BOTTOM_LEFT_SUBJECT]

Examples:
"A closed laptop on a dark desk with a single spotlight"
"A shattered glass chess piece on a wooden table"
"A heavy pendulum of a clock swinging in the shadows"
"A crumpled document illuminated by cold moonlight"

Text Rendering Instructions
Split the title into 2–3 natural Japanese lines.

The hook phrase must form one strong visual block.

HOOK TEXT (main emotional/sharp phrase):
Size: 100% (base size)
Weight: Extra Bold
Line spacing: 0.9–1.0 (tight)
Shadow: subtle drop shadow for readability against dark background.

SUBTITLE TEXT (all non-hook text):
Size: 35–40% of the hook
Weight: Regular
Line spacing: 1.2–1.3
Shadow: none or ultra-light.

Visual Hierarchy Rule
The hook must be the clear visual focus, striking the viewer with "cognitive dissonance" or harsh truth.
It should appear as one bold, compact block.
The subtitle must look small, quiet, and secondary.

Additional Visual Elements
Place [BOTTOM_LEFT_SUBJECT] in the lower-left quadrant,
slightly away from the edges,
occupying about 15–18% of the frame.

Background: heavily blurred, cinematic, professional but oppressive atmosphere.

Restrictions
Do not add extra objects, decorations, or background elements.
Only the [BOTTOM_LEFT_SUBJECT] is allowed.
```

## これまでに作ったもの

| 投稿日 | Input Title | フック | BOTTOM_LEFT_SUBJECT | 文字 |
| --- | --- | --- | --- | --- |
| 2026-11-24 | 言えなかった『助かったよ』。褒め方を、教わってこなかっただけ。 | 言えなかった『助かったよ』 | A cold, untouched cup of green tea on a dark desk under a single desk lamp | AIのまま |
| 2026-11-26 | とりあえず私がやる。守っていたのは、自分の安心だったのかも。 | とりあえず私がやる | A clipboard lying face-down on a dark desk in cold light | AIのまま |
| 2026-11-28 | 要点だけでいいよ。その一言で、新人の報告は半分になった。 | 要点だけでいいよ | A small spiral memo pad with mostly blank pages and a pen, on a dark desk in cold light | AIのまま |
