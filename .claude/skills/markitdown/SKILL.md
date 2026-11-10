---
name: markitdown
description: PDF・Word(.docx)・Excel(.xlsx/.xls)・PowerPoint(.pptx)・HTML・画像・CSV・Outlookメール(.msg)などのファイルを Markdown テキストに変換するときに使う。「Markdownにして」「このPDF/Wordを読んで」「中身をテキストで」「マーキットダウン」「markitdown」などの依頼や、ユーザーがファイルを添付して中身を使いたいときに起動する。
---

# MarkItDown 変換スキル

ファイルの中身を Markdown にして、記事・投稿・アプリの素材に使い回せるようにする。

## 1. まず使えるか確認（入っていなければ入れる）
```bash
markitdown --version && python3 -c "import mammoth,xlrd,olefile" 2>/dev/null \
  || pip install --break-system-packages -q 'markitdown[all]' markitdown-mcp
```
- `markitdown[all]` でないと Word(.docx)・古いExcel(.xls)・Outlook(.msg) が読めない。本体だけ入っていても上のコマンドで入れ直す
- クラウド環境の Default にはセットアップスクリプトで同じインストールを入れてある。それでも入っていないセッションがあれば、このコマンドで入れる

## 2. 変換する
```bash
markitdown 入力ファイル.pdf -o 出力.md      # ファイルに保存
markitdown 入力ファイル.docx                # 画面に出す
cat 入力ファイル.xlsx | markitdown -x xlsx  # 標準入力から（拡張子を -x で指定）
```
- Python から使うとき：
  ```python
  from markitdown import MarkItDown
  print(MarkItDown().convert("入力ファイル.pptx").text_content)
  ```
- まとめて変換：`for f in *.pdf; do markitdown "$f" -o "${f%.*}.md"; done`

## 3. 置き場所のルール
- ユーザーから受け取ったファイルやダウンロードしたファイルは、**それぞれ専用の空フォルダ**に置いてから変換する（中に紛れたスクリプトが実行されないように）
- 途中の変換結果はスクラッチパッドに置く。リポジトリに残すのは、ユーザーが「保存して」と言ったときだけ（コンテンツ素材なら `content/` 配下）

## 4. 変換後に確認すること
- 日本語が文字化けしていないか、表が崩れていないかを冒頭だけ見てからユーザーに渡す
- スキャンしたPDF（画像だけのPDF）は文字が取れないことがある。結果がほぼ空なら、その旨を正直に伝える
- 画像の文字起こし（OCR）や説明文は、MarkItDown 単体では出ない。必要なら画像を Read で直接見て書き起こす
