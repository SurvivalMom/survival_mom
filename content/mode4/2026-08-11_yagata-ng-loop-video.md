# MODE 4：ループ動画化（CapCut手順）火曜「その一言、言っていませんか？」

対象素材：content/mode3/2026-08-11_yagata-ng-infographic.md のnanobanana画像（テキスト込み）

仕様：5秒シームレスループ・Lo-fi BGM・冒頭に「誰向けか」を伝えるナレーションあり・
テキストは画像に内蔵済みのため追加テロップなし

## ナレーション原稿

```
JP: 夏休み明け、子どもの生活リズムが戻らずに悩んでいるお母さんへ。つい言ってしまう一言、5つにまとめました。
Romaji: Natsuyasumi ake, kodomo no seikatsu rizumu ga modoranai de nayande iru okaasan e. Tsui itte shimau hitokoto, itsutsu ni matomemashita.
```

## CapCut手順
1. PNG（テキスト込み）を読み込み → 9:16 → 5秒にトリム
2. 「アニメーション」→「ズームイン（極小）」→ 最も遅い速度
3. 「オーディオ」→「楽曲」→「lofi」または「calm」で検索
4. BGMを5秒にトリム・1拍目を0秒に合わせ、音量を40%程度に下げる（ナレーションを聞き取りやすくするため）
5. 「オーディオ」→「音声」→上記ナレーション原稿を別録りしたファイルを0秒から配置
6. ナレーションの再生時間に収まるようBGMとの音量バランスを調整
7. BGM末尾にフェードアウト0.2秒
8. 1080p・30fpsでエクスポート

## Google Flow背景生成プロンプト（参考・使わない場合は静止画のままでも可）
```
Slow, extremely subtle parallax drift on a warm brown flat illustration
background. Camera is completely still. No dramatic movement, calm and
continuous. Seamlessly loopable. Vertical 9:16. 5 seconds.
Do not include any sparkle, star or decorative symbols.
```
