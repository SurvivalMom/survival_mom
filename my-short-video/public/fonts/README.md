# 商用フォントの置き場所（git管理外）

このフォルダに置いたフォントファイル（.otf / .ttf / .woff2）は **gitにコミットされません**（.gitignore で除外）。
ヒラギノ・メイリオなどの商用フォントは、ファイルの再配布（リポジトリへの登録・他人への共有）がライセンスで禁止されているためです。

## 使い方

### A. PCに入っているフォントをそのまま使う（ファイルのコピー不要）
`my-short-video/.env` に次の1行を書きます。
```
REMOTION_FONT_MODE=system
```
- Mac：ヒラギノ角ゴシック（Hiragino Sans）が使われます
- Windows：メイリオ／游ゴシックが使われます（メイリオは太さが Regular/Bold のみ）
- 動画の書き出しも、そのPCで行ってください（クラウドで書き出すと Noto Sans JP になります）

### B. 購入したフォントファイルを使う
1. 動画への使用（必要なら商用利用）が許可されたライセンスを確認・購入する
2. ファイルをこのフォルダに置く（例：`public/fonts/HiraginoSans-W8.otf`）
3. `my-short-video/.env` に書く
```
REMOTION_FONT_MODE=file
REMOTION_FONT_BOLD=fonts/HiraginoSans-W8.otf
REMOTION_FONT_MEDIUM=fonts/HiraginoSans-W6.otf
```

### 元に戻す
`.env` の `REMOTION_FONT_MODE` を消すか `noto` にすると、無料の Noto Sans JP に戻ります。
