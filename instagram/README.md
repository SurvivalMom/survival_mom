# Instagram投稿自動化(Reels)

LP(`*.html`)の内容からInstagram Reels用のキャプションと短い縦長動画を自動生成し、
人によるレビュー・承認を経てInstagramに自動投稿するパイプラインです。

## 全体の流れ

1. **生成**(`.github/workflows/instagram-generate.yml`): 手動実行 or 定期実行(月・木 10:00 JST)。
   - LPの中から1ファイルを選び、タイトル/description/見出しを抽出
   - Gemini API(Veo 3)でキャプションと縦長(9:16, 約8秒)動画を生成
     (`GEMINI_API_KEY` 未設定/Veo利用不可時はテンプレート動画にフォールバック)
   - `instagram/pending/<timestamp>-<slug>/` にドラフトを保存してコミット
   - 承認用のGitHub Issueを作成(`instagram-draft` ラベル)
   - Discord/Slack Webhookでドラフト内容を通知(任意・設定時のみ)
2. **承認**: 通知を見て、作成されたIssueに `approve` または `reject` とコメントする
3. **投稿**(`.github/workflows/instagram-publish.yml`): Issueコメントをトリガーに実行
   - `approve` → Instagram Graph APIでReelsとして実際に投稿し、ドラフトを `instagram/published/` に移動
   - `reject` → 投稿せず `instagram/rejected/` に移動
   - 結果をIssueにコメントしてクローズ

承認ボタンのようなチャット上での双方向操作は、受け口となる常駐サーバーが
別途必要になるため採用していません。Discord/Slack通知は確認用、実際の承認操作は
GitHub Issueコメントで行います。

## 必要なGitHub Secrets

| Secret名 | 用途 | 必須 |
|---|---|---|
| `GEMINI_API_KEY` | キャプション/動画(Veo 3)のAI生成(Google AI Studioで発行) | 任意(無い場合はテンプレート動画にフォールバック) |
| `DISCORD_WEBHOOK_URL` | ドラフトのDiscord通知 | 任意 |
| `IG_ACCESS_TOKEN` | Instagram Graph APIの投稿権限を持つアクセストークン | 投稿には必須 |
| `IG_USER_ID` | 投稿先のInstagramビジネス/プロアカウントのID | 投稿には必須 |

`GITHUB_TOKEN` はGitHub Actionsが自動的に発行するため、設定不要です。

### Veo 3(動画生成)について

- Veo 3はGoogleの動画生成AIモデルです。「Google Flow」という画面操作前提のアプリ自体には
  プログラムから自動操作する手段(API)がありませんが、Flowが内部で使っているVeoモデルは
  Gemini API経由でスクリプトから直接呼び出せます。本パイプラインはこの経路を使っています。
- Veo 3の利用には、Gemini APIの有料利用(課金設定済みのGoogleアカウント/プロジェクト)が必要です。
  無料枠では利用できない場合があります。
- モデルID(`veo-3.0-generate-001`)は提供状況により変わることがあるため、
  利用できない場合は `instagram/scripts/generate_post.py` の `generate_video()` 内のモデル名を
  実際に使えるモデルIDに合わせて変更してください。

### Instagram Graph APIの準備

1. InstagramアカウントをビジネスまたはプロアカウントにしてFacebookページと連携する
2. [Meta for Developers](https://developers.facebook.com/) で開発者アプリを作成し、
   `instagram_basic` / `instagram_content_publish` / `pages_show_list` 権限を持つ
   アクセストークンを発行する(長期トークンへの交換を推奨)
3. 連携したFacebookページから `IG_USER_ID`(Instagram User ID)を取得する
4. 取得したトークンとIDをリポジトリの Settings → Secrets and variables → Actions に登録する

投稿動画はInstagram Graph APIの仕様上、公開URLとして取得可能である必要があります。
このパイプラインは `instagram/pending/...` にコミットされた動画ファイルを
`https://raw.githubusercontent.com/<owner>/<repo>/<branch>/...` 経由で参照するため、
リポジトリ(または最低限動画ファイル)が公開状態である必要があります。

### Gemini APIキーの取得

[Google AI Studio](https://aistudio.google.com/) でAPIキーを発行し、`GEMINI_API_KEY` として登録してください。

## ローカルでの動作確認

API資格情報なしでも、ドラフト生成のロジック自体はローカルで確認できます。

```bash
pip install -r instagram/requirements.txt
python instagram/scripts/generate_post.py --dry-run --source futoukou.html
```

`--dry-run` 時はGemini/Veo APIを呼ばず、プレースホルダーのキャプションとテンプレート動画(静止画ベースの5秒動画)を生成します。

## 投稿対象ページの除外設定

`instagram/scripts/generate_post.py` の `EXCLUDED_FILES` で、投稿対象から外すHTMLファイルを指定できます。
デフォルトでは `index.html`(サイトトップ)と `tokusyou.html`(特定商取引法表記)、
および `success_*.html`(購入完了ページ)を除外しています。
