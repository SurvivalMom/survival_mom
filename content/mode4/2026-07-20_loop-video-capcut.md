# MODE 4：ループ動画化（CapCut手順）

対象素材：content/mode3/2026-07-20_gaman-sign-infographic.md のnanobanana画像

仕様：5秒シームレスループ・Lo-fi BGM・テロップとナレーションは別途追加・最後の1秒でCTA画像フラッシュ

テロップ・ナレーションの原稿は content/mode3/2026-07-20_gaman-sign-infographic.md の
「テロップ仕様」および content/mode2 の台本内 Audio JP を参照。

## CapCut手順
1. 背景PNG（テキストなし）を読み込み → 9:16 → 5秒にトリム
2. 「アニメーション」→「ズームイン（極小）」→ 最も遅い速度
3. 「テキスト」→テロップ仕様どおりにタイトル・リスト・CTA文言を配置（固定表示・全編通して表示）
4. 「オーディオ」→「楽曲」→「lofi」または「calm」で検索
5. BGMを5秒にトリム・1拍目を0秒に合わせる
6. 「ビートに合わせる」→ 自動ビートマーカーを打つ
7. BGM末尾にフェードアウト0.2秒
8. 4.5〜5秒の区間に「きょうだい"我慢サイン"チェックシート」モックアップ画像をオーバーレイ
9. ナレーションを別録りする場合は、Audio JP原稿をこのタイミングでオーディオトラックに追加
10. 1080p・30fpsでエクスポート

## Google Flow背景生成プロンプト（雲）
```
Slow timelapse of soft white clouds drifting gently
across a muted pale blue sky. Camera is completely still.
No camera movement. Calm, continuous and meditative.
Seamlessly loopable. Vertical 9:16. 5 seconds.
Do not include any sparkle, star or decorative symbols.
```

## Google Flow背景生成プロンプト（波）
```
Gentle ocean waves slowly washing onto a sandy shore
and quietly pulling back. Camera low and still.
Muted warm tones. No dramatic splashing.
Seamlessly loopable. Vertical 9:16. 5 seconds.
Do not include any sparkle, star or decorative symbols.
```
