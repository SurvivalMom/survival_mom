# AI動画生成プロンプト一覧（shots.yamlのビュー）

このファイルは `shots.yaml` の各ショットの `prompt` フィールドを、人間が
読みやすい形でまとめたものです。**正本（source of truth）は shots.yaml** で、
このファイルは手動で同期します（自動生成スクリプトは用意していません。
ショット数が多くなった場合は `scripts/common.py` の `load_shots()` を使った
簡単な同期スクリプトを追加してください）。

liveモード（未実装）では、ここに列挙したプロンプトを動画生成APIに渡して
`shots/<id>.mp4` を生成する想定です。モックモードでは使用されません。

## Shot 01
```
Vertical 9:16 cinematic, realistic desk interior at night, warm desk
lamp light. Close-up on a notebook, an anonymous hand opening it to a
blank page. Natural ambient sound only, no music, no on-screen
captions. No face visible.
```

## Shot 02
```
Same setting. The hand writes a short entry, unhurried. Natural
ambient sound only, no music, no captions. No face visible.
```

## Shot 03
```
Same setting. The hand pauses mid-air, pen lifted just above the
page, as if reconsidering. Natural ambient sound only, no music, no
captions. No face visible. Leave the lower third of the frame clean
for text to be added later.
```
