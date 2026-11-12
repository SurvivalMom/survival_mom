# CARE DESIGN LAB 登場人物設定（固定プロンプト集）

セリフ型（D-4-1）・「セリフ型ドラマ」に登場する3人の参照画像生成プロンプト。
アナリスト（D-4-4／D-4-4-1で使用中、50代半ば男性・light gray blazer）とは
明確に見た目を分け、同一人物に見えないようにしている。

各プロンプトで1枚ずつ参照画像（バストアップ・縦位置）を生成し、以降の
動画生成プロンプトではこの参照画像を読み込ませた上で、Sceneごとの
状況・セリフ指示を追加する運用を想定。

## 1. 経営者（50代前半男性・スーツ姿）

```
Photorealistic portrait, vertical 3:4 framing, upper body / bust shot.
Japanese man, early-to-mid 50s, salt-and-pepper short hair neatly
combed, composed and quietly authoritative expression -- calm,
trustworthy, a long-tenured care facility owner/operator rather than
a flashy executive. Wearing a dark navy or charcoal business suit,
plain tie, no name badge, no visible logos or branding. Soft natural
indoor lighting, warm neutral office background (bookshelf, a plant,
soft window light), softly blurred. No readable text anywhere. The
face should read as a generated, non-specific individual -- not
resembling any real, identifiable public figure.
```

- 衣装：dark navy / charcoal business suit、ネクタイ着用
- 役割：セリフ型ドラマの経営者役。既存の「経営者（dark business suit）」
  表記を踏襲しつつ、年齢・体格・表情をこのプロンプトで固定する

## 2. 管理者（40代前半女性・スクラブ姿／ブルー）

```
Photorealistic portrait, vertical 3:4 framing, upper body / bust shot.
Japanese woman, early 40s, shoulder-length dark hair styled neatly back
or in a simple low bun, warm but composed expression -- capable,
experienced on-site care manager, approachable but not soft-spoken.
Wearing plain blue medical-style scrubs, no logos, no name badge, no
embroidery. Soft natural indoor lighting, care facility interior
background (muted, softly blurred, no readable signage or patient
information). No readable text anywhere. The face should read as a
generated, non-specific individual -- not resembling any real,
identifiable public figure.
```

- 衣装：plain blue scrubs（無地、ロゴ・刺繍なし）
- 役割：セリフ型ドラマの管理者役。既存の「管理者（teal scrubs）」表記を
  この新しいブルー基調のスクラブに置き換える場合は、過去の
  台本側の表記更新も検討

## 3. 若いリーダー（30代前半女性・スクラブ姿／エンジ）

```
Photorealistic portrait, vertical 3:4 framing, upper body / bust shot.
Japanese woman, early 30s, dark hair in a simple low ponytail or
shoulder-length bob, earnest and slightly more tense/attentive
expression than a veteran manager -- someone newly stepping into a
leadership role, capable but still finding her footing. Wearing plain
maroon / burgundy (エンジ) medical-style scrubs, no logos, no name
badge, no embroidery. Soft natural indoor lighting, care facility
interior background (muted, softly blurred, no readable signage or
patient information). No readable text anywhere. The face should read
as a generated, non-specific individual -- not resembling any real,
identifiable public figure.
```

- 衣装：plain maroon / burgundy scrubs（無地、ロゴ・刺繍なし）
- 役割：新任・若手リーダー役。shoseijutsu-02（新任管理者ほど、最初に
  変えすぎない）系統や、今後の新任リーダーものの当事者として使用を想定
- 管理者（ブルー）とスクラブの色で瞬時に見分けがつくようにしている

## 運用メモ

- 3人とも、既存のアナリスト参照画像（mid-50s男性、light gray blazer、
  ノーネクタイ）とは年齢・服装・雰囲気が重ならないように設計済み
- 各参照画像が生成できたら、このファイルに生成済み画像のファイル名／
  保存先を追記し、以後の動画生成プロンプトで「この参照画像の人物」と
  指定できるようにする
- 衣装の色（経営者＝スーツ、管理者＝ブルースクラブ、若いリーダー＝
  エンジスクラブ）は今後のセリフ型台本の「登場人物」欄にもこの表記で
  統一する

## 生成確認（2026-10-26）

3人とも上記プロンプトで参照画像を生成し、確認済み。
- 経営者：濃紺スーツ＋ネクタイ、書斎風の背景。想定通り
- 管理者：ブルースクラブ、落ち着いた温かい表情。想定通り
- 若いリーダー：エンジスクラブ、管理者よりやや緊張感のある表情。
  スクラブの色でブルーの管理者とも一目で区別できる
- 3人ともアナリスト参照画像と顔・年齢・雰囲気が重複していないことを確認
