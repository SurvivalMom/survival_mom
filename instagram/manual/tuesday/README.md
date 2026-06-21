# tuesday: 6シーン構成のInstagram Reels動画

`instagram/scripts/generate_post.py` の自動パイプラインとは別に、手動で企画・生成している
6シーン構成のナラティブ動画(疲れた母親に向けたメッセージ)。

## スタイル方針

- 全シーン共通: 柔らかい色鉛筆・水彩風のイラストアニメーション(実写・フォトリアルではない)
- 同じキャラクターデザイン(疲れた30代の日本人女性、母親)と同じ配色パレット(暖色系)を一貫して保つ
- Veo 3のネイティブ音声生成で日本語ナレーションをシーンごとに埋め込み
- 映像内の文字・字幕・テロップはモデルに描かせず、後工程でffmpeg(`drawtext` + IPAGothicフォント)で焼き込む方針

## 現在の状態

| シーン | ファイル | 状態 |
|---|---|---|
| scene1 | `tuesday_v2_scene1.mp4` | 完成(新スタイル+ナレーション) |
| scene2 | `tuesday_v2_scene2.mp4` | 完成(新スタイル+ナレーション) |
| scene3 | `tuesday_v2_scene3.mp4` | 完成(新スタイル+ナレーション) |
| scene4 | `tuesday_v2_scene4.mp4` | 完成(新スタイル+ナレーション) |
| scene5 | (未生成) | Gemini APIのクォータ/クレジット枯渇でブロック中 |
| scene6 | (未生成) | 同上 |

## スクリプト

- `generate_tuesday_v2.py`: 6シーン全部を新スタイルで生成するスクリプト(scene1〜4はこれで生成済み)
- `generate_remaining.py`: scene5・6のみを対象に、429エラー時の指数バックオフ付きで再試行するスクリプト

いずれも `GEMINI_API_KEY` 環境変数にAPIキーを設定して実行する。

## 残作業

1. scene5・6をクレジット補充後にAPIで生成、またはGoogle Flow(labs.google/fx/tools/flow)で手動生成
2. 全6シーンにffmpegで日本語字幕を焼き込み
3. 6シーンを結合して1本の動画に
