# dokuhaku-09-houchi 動画レンダラー（Remotion）

`content/caredesign/ai-video/dokuhaku-09-houchi.md`（「あとよろしく」で、終わらせていませんか）
の内容を、9:16（1080×1920）の縦型ショート動画としてテンポよく自動生成する
Remotionプロジェクトです。

## 構成

- `src/content.ts` — mdファイルから抽出したセリフ・テロップのタイムライン
  データ（修正はここだけでOK。他のmdファイルに差し替える場合もこのファイルを
  書き換える）
- `src/timing.ts` — 各テロップの表示時間を文字数から自動計算
- `src/Background.tsx` — テーマ（放置→フォロー）に合わせた、冷たいネイビーから
  わずかに暖色が滲むグラデーション背景
- `src/Telop.tsx` — テロップ本体。フック（赤バナー）／通常セリフ（黒半透明
  角丸ボックス）／締めCTA（白文字＋オレンジのアンダーライン）の3種類の見た目
- `src/Composition.tsx` — 上記を`Sequence`でタイムラインに並べるメイン
  コンポーネント
- `src/Root.tsx` / `src/index.ts` — Remotionのコンポジション登録

## 使い方

```bash
cd remotion-video
npm install

# プレビュー（Remotion Studio）
npm run start

# mp4書き出し
npm run build
# -> out/dokuhaku-09-houchi.mp4 に出力
```

## 注意（このサンドボックス環境固有）

Remotionは通常、初回実行時に専用のChrome Headless Shellを
`remotion.media`からダウンロードしますが、このサンドボックスからは
到達できません。そのため `remotion.config.ts` で、Playwright用に
プリインストールされているChromium（`/opt/pw-browsers/...`）を
`Config.setBrowserExecutable()`で指定しています。別の環境（通常のPC等）で
実行する場合は、このパスが存在しなければ自動的に通常のダウンロード処理に
フォールバックするよう、該当行を削除するかパスの存在確認を追加してください。

## 他のdokuhaku/shoseijutsu/sunaoテーマに展開する場合

`src/content.ts` の `segments` 配列を、別のmdファイルの「シーン構成」の
セリフに差し替えるだけで、同じ見た目のまま別テーマの動画を生成できます。
`kind: 'hook'` は冒頭フックテロップ（0.0秒で全文表示）、`kind: 'cta'` は
締めの保存CTAに使ってください。
