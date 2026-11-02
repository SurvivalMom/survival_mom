# CARE DESIGN LAB 成長モード（4人→100人）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 承認済み設計書の成果物2〜5を実ファイルにする。v2.1への成長モード章の追記、0〜8週のカレンダー制作版、台本の手直し、移行週と5週目の追加素材、ura-05の画面ぼかしが対象。

**Architecture:** 成果物はほぼMarkdownの原稿で、動画はRemotionで仕上げる。各タスクの「テスト」は `grep`、`ffprobe`、フレーム抽出による機械チェックで、どれも完了条件をコマンド1つで確かめられる形にしてある。台本・プレイブック・Remotionはすべて `claude/care-design-weekly-content-se60wo` ブランチにあるので、作業もそのブランチで行う（Task 0）。

**Tech Stack:** Markdown、bash（grep/sed）、ffmpeg/ffprobe、Remotion 4.0.535（`remotion-video/`）

**Spec:** `docs/superpowers/specs/2026-11-02-cdl-follower-growth-design.md`（ブランチ `claude/gracious-johnson-xqnqrc`）

## Global Constraints

- v2.1 の制作ルール（事実性・プライバシー・画像/動画仕様・STEP 0）は変えない。v2.1 からの例外は5週目土曜 shiten-10 のコメントCTAだけ
- 1投稿1主CTA。Scene・テロップ・キャプション・ピン留めコメントを同じ行動にそろえる（v2.1 §4-4）
- 主CTAは、火・木が保存、土がフォロー。例外は5週目の土曜（shiten-10）で、コメント
- 結論の一言は言い切る。「〜ようです」「〜よさそうです」は、データの解釈・他人の内心・将来の結果を語るときだけ使う
- サムネの文言は冒頭の逆説にし、結論や助言にはしない。帯は「解剖 #01」〜「#07」（同じテーマの3本は同じ番号）
- 締めのテロップ（土曜の shiten のみ）は次の2つを、この文言どおりに入れる：「現場を守るために、管理者が先に整えること。」「毎週土曜、管理職の"良かれと思って"を1つ解剖」
- Remotion の下部テロップは、1カード14文字以内（全行の合計。`remotion-video/src/Telop.tsx` のルール）
- 安全面の注意（急変・事故・虐待・服薬の場面は一人で判断せず、必ず報告・相談する）を、sunao-03・ura-10・shiten-09 で弱めない
- 語り手の経歴は、ユーザーが確定するまで `【経歴：ユーザー確定待ち】` のままにする。確定前に公開用の文面へ入れない
- 外部への投稿・コメント・フォローは実行しない（原稿の作成まで）

## Review Focus

1. **CTAの取り残し**：土曜をフォローに変えた shiten に「保存して」が残ると、1投稿にCTAが2つになる → Task 4 の grep で、`保存して` が0件であることを確認する
2. **言い切りの直しすぎ**：安全面の注意文や、データ・内心の推測まで断定にしてしまう → Task 3 で、sunao-03・ura-10・shiten-09 の注意文が変わっていないことを diff で確認する
3. **テロップ14文字の上限超え**：新しいCTAや締めの文言をそのまま1枚のカードにすると上限を超える → Task 4 で、カード分割案がすべて14文字以内であることをスクリプトで数える
4. **ぼかしの範囲が足りない**：スマホが手と一緒に動くので、固定の矩形だと文字がはみ出す。画面が明るい区間は特に読めやすい → Task 6 で、ぼかし後のフレームを1秒ごとに抽出し、目で確認する
5. **経歴の未確定文言の公開**：自己紹介投稿とキャプションに、仮の経歴が残る → Task 5 と Task 7 で、`【経歴：ユーザー確定待ち】` が残っていること、架空の経歴文が入っていないことを確認する

---

### Task 0: 作業ブランチの準備

**Files:** なし（git操作のみ）

- [ ] **Step 1:** `git fetch origin claude/care-design-weekly-content-se60wo && git checkout claude/care-design-weekly-content-se60wo && git pull`
- [ ] **Step 2:** 設計書をこのブランチにも置く：`git checkout origin/claude/gracious-johnson-xqnqrc -- docs/superpowers/specs/2026-11-02-cdl-follower-growth-design.md docs/superpowers/plans/2026-11-02-cdl-follower-growth.md`
- [ ] **Step 3:** 確認：`ls content/caredesign/ai-video/ura-05-okurenakatta-hitokoto.md remotion-video/src/CompositionUra05.tsx` がどちらも存在すること
- [ ] **Step 4:** コミット：`git commit -m "Add CDL growth-mode spec and plan"`

### Task 1: v2.1 に「成長モード」の章を追記

**Files:**
- Modify: `content/caredesign/_playbook/weekly-production-prompt.md`（末尾に `## 9. 成長モード（100フォロワー到達まで）` を追加。§3 の「A. 信頼構築モード」の見出し直後に、参照の1行を追加）

**Interfaces:**
- Produces: 章の見出し `## 9. 成長モード（100フォロワー到達まで）`（Task 2〜7 の原稿はこの章を参照する）

- [ ] **Step 1: 失敗するチェック**：`grep -c '^## 9. 成長モード' content/caredesign/_playbook/weekly-production-prompt.md` → `0`
- [ ] **Step 2: 章を書く。** 内容は設計書 §3〜§8 の要約と適用ルール。小見出しは次の7つ：
  - 9-1 適用期間とKPI
  - 9-2 週の型
  - 9-3 投稿前の手直し
  - 9-4 仕上げ工程
  - 9-5 5週目のコメントCTA（v2.1唯一の例外）
  - 9-6 プロフィール
  - 9-7 終了条件

  終了条件は「100フォロワー到達で §3 の通常判定に戻る」。§3 には次の1行を足す：「100フォロワー到達までは §9 成長モードを優先する」
- [ ] **Step 3: チェック。** 次の3つのコマンドがすべて `1` 以上を返すこと
  - `grep -c '^## 9. 成長モード'`
  - `grep -c '現場を守るために、管理者が先に整えること。'`
  - `grep -c '§9 成長モードを優先'`
- [ ] **Step 4:** コミット：`git commit -m "Add growth mode chapter to CDL playbook v2.1"`

### Task 2: カレンダー制作版（0〜8週、27枠）

**Files:**
- Create: `content/caredesign/_playbook/growth-calendar.md`

**Interfaces:**
- Produces: 1行1枠の表。列は `週 | 曜日 | 日付 | 台本 | サムネ文言（逆説） | 帯 | 主CTA | 備考`。日付は、0週目の火曜を 2026-11-03 として、以降は7日ずつ足す（8週目の火曜は 2026-12-29）。Task 3〜7 はこの表の台本名と主CTAに従う

- [ ] **Step 1: 失敗するチェック**：`test -f content/caredesign/_playbook/growth-calendar.md` → 失敗すること
- [ ] **Step 2: 表を書く。** 設計書 §5-1 の割り当てに従う
  - 1週目の木曜は `intro-kono-account`（Task 5 で作る）
  - サムネ文言：台本の冒頭テロップかフックから逆説の一言を取り、16文字以内にする
  - 帯：0〜1週目は空欄、2〜8週目は「解剖 #01」〜「#07」
- [ ] **Step 3: チェック（枠の数と重複）**

```bash
f=content/caredesign/_playbook/growth-calendar.md
for s in ura-0{4..9} ura-1{0..4} shiten-0{6..9} shiten-1{0..3} sunao-0{1..7}; do n=$(grep -c "| $s" $f); [ "$n" = 1 ] || echo "NG $s $n"; done
grep -c '^| [0-8] ' $f   # 27
```
  期待する結果：NG の行が出ないこと、件数が `27` になること
- [ ] **Step 4:** コミット：`git commit -m "Add CDL growth calendar (weeks 0-8)"`

### Task 3: 言い切りへの手直し（sunao・shiten）

**Files（対象行は手直し前の行番号）:**
- Modify: `content/caredesign/ai-video/sunao-02-seikai-machi.md:37`
- Modify: `content/caredesign/ai-video/sunao-05-yottsu-no-kijun.md:36,59`
- Modify: `content/caredesign/ai-video/sunao-06-kotae-awase.md:49`
- Modify: `content/caredesign/ai-video/sunao-07-ichido-kiku.md:49`
- Modify: `content/caredesign/ai-video/shiten-07-sunao-to-kimerarenai.md:64`
- Modify: `content/caredesign/ai-video/shiten-08-seikai-machi-futatsu.md:40`
- Modify: `content/caredesign/ai-video/shiten-11-yottsu-no-kijun-futatsu.md:63`
- Modify: `content/caredesign/ai-video/shiten-12-kotae-awase-futatsu.md:53`
- Modify: `content/caredesign/ai-video/shiten-13-konkyo-futatsu-saishuwa.md:54`

- [ ] **Step 1: 失敗するチェック**：`grep -c -E 'ようです|よさそう' content/caredesign/ai-video/{sunao-0[1-7],shiten-0[6-9],shiten-1[0-3]}*.md | grep -v ':0'` → 9ファイルが出ること
- [ ] **Step 2: 書き換える。** 各行の結論を言い切りにし、意味は変えない
  - 例：「4つあるようです」→「4つあります」
  - 例：「正解待ちになりやすいようです」→「正解待ちになりやすくなります」
  - 同じ台本の中に同じ文が複数あれば（キャプション・ナレーション・後編集テロップ）、すべて同じ文言にそろえる
- [ ] **Step 3: チェック**
  - 上の grep が何も返さないこと
  - `git diff -U0 -- content/caredesign/ai-video/sunao-03-kourisuku-wa-betsu.md content/caredesign/ai-video/ura-10-hitori-de-kimeta-yoru.md content/caredesign/ai-video/shiten-09-hitori-de-kimeta.md` が空であること（安全面の注意文に手を入れていない）
- [ ] **Step 4:** コミット：`git commit -m "Make closing lines assertive in sunao/shiten scripts"`

### Task 4: 土曜の shiten-06〜13 の主CTAを差し替え、締めのテロップを追加

**Files:**
- Modify: `content/caredesign/ai-video/shiten-06-onaji-gouman.md` 〜 `shiten-13-konkyo-futatsu-saishuwa.md`（8ファイル）。書き換える箇所は次の4つ
  - メタ情報の「主CTA」
  - 最終Sceneの後編集テロップ
  - 「## キャプション」の末尾
  - 「## ピン留めコメント」

**Interfaces:**
- Consumes: Task 2 の表で、該当する土曜の主CTA（shiten-10 だけがコメント）

各ファイルに入れる文言（この文言どおりにする）：

| 項目 | shiten-06〜09、11〜13 | shiten-10 |
|---|---|---|
| メタ情報 | `主CTA：フォロー（成長モード §9）` | `主CTA：コメント（成長モード §9-5、1回限りの例外）` |
| 締めテロップ① | `現場を守るために、管理者が先に整えること。` | 同左 |
| 締めテロップ②（CTA） | `毎週土曜、管理職の"良かれと思って"を1つ解剖。フォローして続きを。` | `あなたが職員からよく聞かれる質問を、コメントに一語で。` |
| キャプション末尾 | `毎週土曜、管理職の"良かれと思って"を1つ解剖しています。フォローして、次の解剖を受け取ってください。` | `あなたが職員からよく聞かれる質問を、コメントに一語で教えてください。全部読んで返信します。` |
| ピン留め | 既存のバトンパス文＋最後に `次の土曜は「（次テーマ名）」を解剖します。` | `例：「どうしますか」「これで合ってますか」。一語で大丈夫です。` |

  - 既存の「保存して〜」の依頼文と「（フォローしておくと、次回の投稿も見逃しません）」は削除する
  - 「次テーマ名」は Task 2 の表の、次の週のテーマを使う。shiten-13 だけは `次の解剖テーマは、近日お知らせします。` にする

- [ ] **Step 1: 失敗するチェック**：`grep -l '主CTA：保存' content/caredesign/ai-video/shiten-0[6-9]*.md content/caredesign/ai-video/shiten-1[0-3]*.md | wc -l` → `8`
- [ ] **Step 2:** 上の表のとおりに8ファイルを書き換える
- [ ] **Step 3: チェック**

```bash
d=content/caredesign/ai-video; F="$d/shiten-0[6-9]*.md $d/shiten-1[0-3]*.md"
grep -c '保存して' $F | grep -v ':0'                                        # 何も出ない
grep -l '主CTA：フォロー（成長モード §9）' $F | wc -l                        # 7
grep -l '主CTA：コメント（成長モード §9-5' $F                                # shiten-10 のみ
grep -l '現場を守るために、管理者が先に整えること。' $F | wc -l              # 8
grep -c 'フォロー' $d/shiten-10-kikikaeshi-futatsu.md                        # 0
```

- [ ] **Step 4: テロップのカード分割案（14文字以内）。** 各ファイルの最終Sceneの後編集の指示に、締めテロップ①②を14文字以内のカードに分けた案を書き足す。チェック：

```bash
python3 -I - <<'EOF'
cards=["現場を守るために、","管理者が先に","整えること。","毎週土曜、","管理職の","\"良かれと思って\"を","1つ解剖。","フォローして続きを。","あなたが職員から","よく聞かれる質問を、","コメントに一語で。"]
bad=[c for c in cards if len(c)>14]; print("NG",bad) if bad else print("OK")
EOF
```
  期待する結果：`OK`。台本に書いたカードの文言は、このリストと一字一句同じにする
- [ ] **Step 5:** コミット：`git commit -m "Switch Saturday shiten CTAs to follow (comment for shiten-10) and add closing telops"`

### Task 5: 移行週の素材（ura-04〜06 のつなぎ文、自己紹介投稿、プロフィール）

**Files:**
- Modify: `content/caredesign/ai-video/ura-04-yousoudan-no-yama.md`、`ura-05-okurenakatta-hitokoto.md`、`ura-06-kuuran-no-mama.md`（各「## キャプション」の末尾に1文を追加）
- Create: `content/caredesign/growth/intro-kono-account.md`（1週目木曜。v2.1 C-3 の表系画像1枚の制作指示と、キャプション・ピン留め・主CTA＝保存）
- Create: `content/caredesign/growth/profile-update.md`（プロフィール文の差し替え案、固定投稿3本の指定と並び順）

つなぎ文（この文言どおりにする）：
- ura-04：`以前投稿した「権限のない責任を渡していないか」を、職員の側から描きました。`
- ura-05：`以前投稿した「話が通じない人が、必ず怒る理由」を、職員の側から描きました。`
- ura-06：`以前投稿した「優しいだけの職場、本当に安全か」を、職員の側から描きました。`

プロフィールに追加する1行（この文言どおりにする）：`毎週土曜、管理職の"良かれと思って"を1つ解剖`

固定投稿：①「仲良し」が組織をつぶす ②組織を殺す「精神論」の正体 ③intro-kono-account

自己紹介投稿の語り手の一言は `【経歴：ユーザー確定待ち】` とし、文面を作らない

- [ ] **Step 1: 失敗するチェック**：`grep -c '職員の側から描きました' content/caredesign/ai-video/ura-0[4-6]*.md` → 3つとも `0`
- [ ] **Step 2:** 3ファイルにつなぎ文を足し、`intro-kono-account.md` と `profile-update.md` を作る
- [ ] **Step 3: チェック**
  - つなぎ文の grep が3つとも `1`
  - `grep -c '【経歴：ユーザー確定待ち】' content/caredesign/growth/intro-kono-account.md` → `1` 以上
  - `grep -c '毎週土曜、管理職の"良かれと思って"を1つ解剖' content/caredesign/growth/profile-update.md` → `1` 以上
- [ ] **Step 4:** コミット：`git commit -m "Add week-0/1 bridge captions, intro post and profile update drafts"`

### Task 6: ura-05 の画面ぼかし（元素材を差し替えて再レンダリング）

**Files:**
- Modify: `remotion-video/public/source-videos/ura-05/ura-05-cut.mp4`（ぼかしを入れた版で上書きする。元は `ura-05-cut-noblur.mp4` に名前を変えて残す）
- Modify: `remotion-video/src/ura05Content.ts`（先頭のコメントに、ぼかし処理の範囲・時間・理由を追記）

**Interfaces:**
- Consumes: Remotion のコンポジション `Ura05WithFootage`（既存。尺は `URA05_DURATION_IN_SECONDS` で、17.0秒のまま変えない）

方針：テロップまでぼけないように、レンダリング前の元素材だけにぼかしを入れる。区間は 0〜10.5秒（cut 側。10.5秒以降は画面が暗転し、伏せたスマホになる）。範囲はスマホ画面全体と、手の動きのぶんの余白。`ffmpeg` の `crop`→`boxblur`→`overlay` を `enable='between(t,0,10.5)'` で使う。矩形は、1秒ごとのフレームで画面の外接矩形を測り、その和集合にする（明るい画面の区間を含む）

- [ ] **Step 1: 失敗するチェック。** `ffmpeg -ss 4 -i remotion-video/public/source-videos/ura-05/ura-05-cut.mp4 -frames:v 1 /tmp/before.png` を目で見て、「利用者状況」の文字が読めることを確かめる
- [ ] **Step 2:** ぼかし版を作る。尺は `ffprobe` で 17.0秒±0.05秒のまま、音声もそのままコピーする
- [ ] **Step 3: チェック**
  - `ffmpeg -i <ぼかし版> -vf fps=1 /tmp/ura05b_%02d.png` で抽出した 1〜11枚目すべてで、画面の文字が読めないこと
  - 12枚目以降は元素材と同じであること
  - `ffprobe -show_entries format=duration` が `17.0` 前後であること
- [ ] **Step 4:** `cd remotion-video && npx remotion render src/index.ts Ura05WithFootage out/ura-05.mp4` を実行し、出力の 2・5・8秒のフレームで、テロップがぼけていないこと、画面の文字が読めないことを確かめる
- [ ] **Step 5:** コミット：`git commit -m "Blur phone screen in ura-05 source cut to hide resident-record-like text"`

### Task 7: 5週目の追加素材（問いかけ集の画像、コメントCTA回の運用）

**Files:**
- Create: `content/caredesign/growth/week5-toikake-6.md`
  - v2.1 C-3 の表系画像1枚の制作指示
  - nanobanana 用プロンプト
  - キャプション・ピン留め。主CTA＝保存
- Create: `content/caredesign/growth/week5-comment-cta-ops.md`
  - shiten-10 のコメントへの返信文案8本：よくある質問の型（判断・報告・人間関係・新人・ベテラン・家族対応・記録・その他）ごとに、各2〜3文
  - 24時間以内に返信するための手順
  - 6週目のKPIレビューで記録する項目：コメント数、リーチ、フォロー獲得、他の土曜の平均

問いかけ6問：設計書 §6-2 の文言を、そのまま一字一句変えずに使う

- [ ] **Step 1: 失敗するチェック**：`ls content/caredesign/growth/week5-*.md` → 失敗すること
- [ ] **Step 2:** 2ファイルを作る。返信文案は、アドバイスを押しつけず、相手の一語を言い直してから問いを1つ返す形にする（v2.1 の語り口）。経歴に触れる文は `【経歴：ユーザー確定待ち】` にする
- [ ] **Step 3: チェック**
  - 6問それぞれが `week5-toikake-6.md` に完全一致で入っていること：`for q in '実際に見たこと・聞いたことは何ですか？' '次に同じことが起きたら、何を基準に決めますか？'; do grep -c "$q" content/caredesign/growth/week5-toikake-6.md; done` で各 `1`（残りの4問も同様に確かめる）
  - `grep -c '^### 返信' content/caredesign/growth/week5-comment-cta-ops.md` → `8`
- [ ] **Step 4:** コミット：`git commit -m "Add week-5 question-set image brief and comment-CTA ops"`

### Task 8: 仕上げ

- [ ] **Step 1:** Task 0〜7 のチェックをまとめて再実行し、すべて期待どおりであること
- [ ] **Step 2:** `git push -u origin claude/care-design-weekly-content-se60wo`
