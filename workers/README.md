# AI機能の設定手順（survivalmom-ai）

`claimlog` / `jikolog` / `watashi_yoyaku` / `reel_kenkyu` のAIボタンを、公開サイトで動かすための設定です。
所要時間は約15分。必要なものは **Googleアカウント** と **いつものCloudflareアカウント** だけです。

```
アプリ（GitHub Pages） → survivalmom-ai（Cloudflare Worker） → Google Gemini
                          ↑ APIキーはここに隠す（ページには書かない）
```

---

## ステップ1：GeminiのAPIキーをもらう（5分）

1. https://aistudio.google.com/apikey を開き、Googleアカウントでログイン
2. 「APIキーを作成」を押す
3. 表示された `AIza…` で始まる文字列をコピーして、メモ帳に一時的に貼っておく

> ⚠️ このキーは「お財布の鍵」です。LINEやメール、HTMLファイルには貼らないでください。

## ステップ2：Workerを作る（5分）

1. https://dash.cloudflare.com を開く（`cocolog-license` があるアカウント）
2. 左メニュー「Workers & Pages」→ 右上「作成」→「Hello World から始める」（Workerを作成）
3. 名前を **`survivalmom-ai`** にする（この名前のとおりにしてください。アプリ側はこの名前で呼びに行きます）
4. 「デプロイ」を押す
5. 「コードを編集」を押し、左側の中身を**全部消して**、このフォルダの `ai-proxy.js` の中身を**全部貼り付ける**
6. 右上の「デプロイ」を押す

## ステップ3：キーをWorkerにしまう（3分）

1. `survivalmom-ai` の画面で「設定」→「変数とシークレット」→「追加」
2. 種類：**シークレット**　／　名前：**`GEMINI_API_KEY`**（半角・この通り）　／　値：ステップ1のキー
3. 「デプロイ」を押す
4. メモ帳に貼ったキーは消してOK

## ステップ4：動作確認（2分）

スマホで https://survivalmom.github.io/survival_mom/watashi_yoyaku.html を開き、AIで台本を作るボタンを押す。
文章が出てくれば完了です 🎉

うまくいかないとき：
- エラーになる → ステップ2の名前が `survivalmom-ai` になっているか確認
- 何も出ない → ステップ3の名前が `GEMINI_API_KEY` になっているか確認

---

## 知っておいてほしいこと

- **無料枠について**：無料のまま使うと、入力した内容がGoogleのサービス改善に使われることがあります。
  `claimlog`（苦情対応）・`jikolog`（事故記録）のように**施設の個人情報が入るアプリを実際に使う前に**、
  Google AI Studio で「お支払い（請求先アカウント）」を設定して有料枠にしてください（1回数円程度）。
  有料枠では入力は学習に使われません。
- **他のサイトからは使えません**：Workerは `survivalmom.github.io` から来た依頼だけを受け付けます。
- **アプリを増やすとき**：`ai-proxy.js` の `APPS` に名前を足して、もう一度デプロイします。
- **すでにWorkerを作ってある場合**：`ai-proxy.js` を更新したら、ステップ2の5〜6（中身を全部貼り替えて「デプロイ」）だけやり直してください。キーの設定はそのまま残ります。
- **`reel_kenkyu`（リール研究ノート）について**：リール動画から切り出した静止画（最大24枚・合計約1.5MB）も一緒に送れます。動画そのものと音声は送りません。
