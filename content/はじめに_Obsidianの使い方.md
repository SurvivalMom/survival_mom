# はじめに：Obsidianの使い方

この `content` フォルダは、そのまま **Obsidian の保管庫（Vault）** として開けるようにしてあります。
台本・note記事・プレイブックを、ノートとして読んだり書いたりできます。

まずは → [[ホーム]] を開いてください。全部の台本と記事への入口です。

---

## 1. はじめての準備（15分・最初の1回だけ）

### ① Obsidianを入れる
https://obsidian.md からダウンロードして、インストールします（無料）。

### ② このリポジトリをPCに持ってくる
いちばん簡単なのは **GitHub Desktop** を使う方法です。

1. https://desktop.github.com から GitHub Desktop を入れて、GitHubアカウントでログイン
2. 「Clone a repository」→ `SurvivalMom/survival_mom` を選んで「Clone」
3. PCの「ドキュメント」の中などに `survival_mom` フォルダができます

### ③ Obsidianで開く
1. Obsidianを起動 →「**フォルダを保管庫として開く**」
2. ②でできた `survival_mom` の中の **`content` フォルダ**を選ぶ
3. 左側にフォルダが並べば成功です。[[ホーム]] を開いてみてください

> `survival_mom` フォルダ全体ではなく、**`content` フォルダ**を選んでください。
> 全体を開くと、アプリのHTMLファイルが100個以上並んで探しにくくなります。

---

## 2. GitHubとの同期（Claudeと共有するため）

Claudeはあなたのパソコンの中は見られません。GitHubに上げたものだけを読めます。

### いちばん簡単な方法：GitHub Desktop
- **Claudeが作った台本を読みたいとき**：GitHub Desktop で「Fetch origin」→「Pull」
- **自分が書いたメモをClaudeに渡したいとき**：GitHub Desktop で、左下に一言メモ（例：「ネタ帳を追加」）を書いて「Commit」→「Push」

### 慣れてきたら：Obsidian Git（自動同期）
Obsidianの「設定 → コミュニティプラグイン」から **Obsidian Git** を入れると、
数分ごとに自動で同期してくれます。最初はGitHub Desktopで慣れてからで十分です。

---

## 3. おすすめの使い方

- **ネタ帳を作る**：思いついたことを `ネタ帳.md` に書きためておく。Claudeに「ネタ帳から今週のテーマを選んで」と頼めます
- **リンクでつなぐ**：`[[` と打つと、ほかのノートを検索してリンクできます。たとえば台本の中で [[caredesign/_playbook/characters|登場人物設定]] を参照する、など
- **一覧が古くなったら**：Claudeに「ホームを更新して」と頼むと、新しい台本も一覧に入ります

---

## 気をつけること
- 同じファイルを、Obsidianで書いている途中にClaudeも書き換えると、ぶつかることがあります。
  **書く前にPull、書いたらPush** を習慣にすると安心です
- 購入者の個人情報やパスワードなど、公開されて困るものはここに書かないでください
