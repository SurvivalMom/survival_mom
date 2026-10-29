# Vertical Video Pipeline

Reproducible縦型動画（1080x1920, H.264/AAC MP4）制作パイプライン。
外部APIを呼ばない**モックモード**が実装済み。liveモード（実際のAI動画生成・
TTS APIを呼ぶ）は未実装で、呼び出そうとすると明示的なエラーで止まります。

このディレクトリは、リポジトリ内の他の仕組み（`remotion-video/` や
`content/caredesign/`）とは独立した別システムです。

## ファイルの役割

| ファイル | 役割 |
| --- | --- |
| `brief.md` | 企画ブリーフ。何のための動画か、誰向けか、CTAは何か |
| `script.md` | ナレーション全文（レビュー用。正本は shots.yaml） |
| `shots.yaml` | **唯一の構造化ソース**。ショットごとの尺・プロンプト・ナレーション・字幕 |
| `prompts.md` | shots.yaml の prompt フィールドをまとめた、人間が読む用のビュー |

## セットアップ

```bash
cd pipeline
python3 -m venv .venv && source .venv/bin/activate   # 任意
pip install pyyaml
cp .env.example .env   # 現状は PIPELINE_MODE=mock のままで十分
```

ffmpeg / ffprobe がシステムにインストールされている必要があります
（`ffmpeg -version` で確認）。

## モックモードの実行手順（外部API呼び出しなし）

```bash
cd pipeline
python3 scripts/generate_mock_shots.py   # shots.yaml の各ショットの
                                          # プレースホルダー動画を shots/ に生成
python3 scripts/build_video.py           # shots/ を連結し、BGM（あれば）・
                                          # 字幕を合成して output/final.mp4 を書き出す
python3 scripts/qc_check.py              # output/final.mp4 を検査し、
                                          # 結果を docs/qc.md に記録
```

`shots.yaml` の `shots` リストを編集すれば、同じ3コマンドでショット数や
内容を変えた動画を再生成できます。BGMを使いたい場合は `assets/bgm/` に
音源ファイル（.mp3/.wav/.m4a）を1つ置くだけで、次回の `build_video.py`
実行時に自動でミックスされます。

## モックモードの仕組み

`generate_mock_shots.py` は、各ショットについて ffmpeg の `color` ソースで
単色背景の動画を作り、ショットIDと字幕テキストを `drawtext` で焼き込みます。
実際のAI動画生成・音声合成は一切行いません。これにより、「ショット→連結→
BGM/字幕合成→QC」というパイプライン全体の配線を、実際のAI生成コストを
かけずに検証できます。

字幕の焼き込みには ffmpeg の `subtitles`（libass）フィルタを使っています。
これが使えないビルドの ffmpeg では、`build_video.py` は警告を出して字幕
焼き込みをスキップします（動画自体は字幕なしで正常に生成されます）。

## liveモードについて（未実装）

`.env.example` に `VIDEO_GEN_API_KEY` / `TTS_API_KEY` のプレースホルダーを
用意していますが、現状これらを使ってAPIを呼び出すコードは存在しません。
`PIPELINE_MODE=live` を指定した場合、スクリプトは何もせず静かに失敗するの
ではなく、未実装である旨の明確なエラーを出して終了します（意図しない
有料API呼び出しを防ぐためのガードです）。

将来liveモードを実装する場合の拡張ポイント：
- `generate_mock_shots.py` 相当の `generate_live_shots.py` を追加し、
  `shots.yaml` の各 `prompt` を動画生成APIに渡して `shots/<id>.mp4` を
  生成する
- `build_video.py` 自体は変更不要（`shots/` にファイルが揃っていれば
  mock/liveを問わず同じ連結・合成処理が使える）

## 出力の確認

```bash
ffprobe -v error -show_format -show_streams pipeline/output/final.mp4
```

`docs/qc.md` に、直近の `qc_check.py` 実行結果（解像度・コーデック・尺・
合否チェック）が記録されています。

## 機密情報の扱い

- APIキー・認証情報・個人情報はこのリポジトリに一切コミットしません。
  `.env` は `.gitignore` で除外されており、`.env.example` のみを追跡します。
- `shots/*.mp4` と `output/*.mp4`（生成されたメディアファイル）も
  `.gitignore` で除外しています。ディレクトリ構造だけ `.gitkeep` で
  git管理しています。
