# AI動画（セリフ型）：「年上部下への指示」に悩む、新しいリーダーへ

## メタ情報
- 形式：セリフ型（ドラマ仕立て）。プレイブックD-4-1準拠
- 登場人物：**若いリーダー**（30代前半女性、エンジのスクラブ）／**管理者**
  （40代前半女性、ブルーのスクラブ）。_playbook/characters.mdの固定参照画像を
  使用する、若いリーダー初登場回
- テロップ・BGMなし（テロップは後編集で追加）
- 主CTA：保存（Scene5に「指示派／相談派」の二択の問いかけを補助的に追加。主CTAは保存のまま）
- フック設計：冒頭で「リーダーは指示を出すもの」という思い込みを1行で否定する
  （否定するのは人ではなく考え方。年上職員・ベテランを責める表現は使わない）
- ループ設計：Scene5の最後をScene1と同じ入口側の画角に戻し、2周目につなげる
- 編集ペース：カット間を詰めて1.2〜1.3倍速相当のテンポにする（ジャンプカット推奨。初速の離脱対策）
- 参照画像の使い方：各シーンの生成プロンプトに、そのシーンに登場する人物の
  参考画像（_playbook/characters.md）を添付する。2人同時に映るシーンは、
  使用ツールが複数人物の参照画像を同時に扱えるか要確認。片方しか反映されない
  場合は、先に若いリーダーを軸に生成し、結果を見て調整する

## タイトル
「年上部下への指示」に悩む、新しいリーダーへ

## キャプション
経験の長い年上の職員に、指示を出すのが気まずい。
それは、あなたの力不足ではありません。
「指示を出さなきゃ」と思い込んでいるから、苦しくなるのかもしれません。
保存して、次に声をかけるときの参考にしてください。

年上の職員さんには「指示」と「相談」、あなたはどっち派ですか？

## ハッシュタグ
#介護経営 #新任リーダー #介護管理職 #年上部下 #マネジメント

## ピン留めコメント（バトンパス型）
このバトンは、経験の長い年上の職員に指示が出せずにいる、新しいリーダーさんへ。
同じ悩みを抱えるリーダーさんが、隣の事業所にもいるかもしれません。

## シーン構成

**テロップレイヤー構成（@light_kaigo型）**
参考：@light_kaigo「知らなきゃ後悔する！ケアマネの選び方3選」のテロップの入れ方に合わせる。
文字はすべて白か黄の太字に太い黒フチ。背景の帯・座布団は付けない。
- タイトルカード（0.0〜3秒）：画面中央に、次の順で大きく表示する。
  フェードイン・文字送りは使わず、0.0秒（1フレーム目）から全文を表示する
    1段目：「年上部下への指示」に悩む、新しいリーダーへ（白・小さめの前置き）
    2段目：年上部下に「指示」を（白）
    3段目：出そうとするから、（白）
    4段目：苦しくなる。（黄・最大）
  （タイトルカードの間はセリフ字幕を出さない。Scene 1のセリフは、カードが消えてから字幕を出す）
- セリフ字幕（3秒〜最後）：画面の中ほどより下に、白文字＋黒フチで表示する。
  1セリフにつき、要点の語だけを黄色にする
- Scene 3の3つのポイント：①〜③を1つずつ、字幕より一回り大きい白文字＋黒フチで
  画面中央に出す。番号と要点の語を黄色にする
  （@light_kaigoの「②メールやLINEなど多様なツールが使える」と同じ出し方）
- Scene 5の問いかけ：字幕と同じ白文字＋黒フチ。選択肢の語と絵文字（👍・🙅など）を黄色にする。
  保存の依頼は、問いかけの下に一回り小さく添える
- タイトルラベル（3秒〜最後）：画面左上に、この回のタイトル『「年上部下への指示」に悩む、新しいリーダーへ ▶』を
  黄色の帯に黒文字で表示する（タイトルカードの間は出さない）

**Scene 1**
（0.0〜3秒：中央のタイトルカードのみ表示。セリフ字幕・タイトルラベルはカードが消えてから出す）
若いリーダー（小さく、自分に）：「指示、出さなきゃ……でも、〇〇さん、私より
ずっとベテランだし……」
```
[参照画像：若いリーダー（_playbook/characters.md #3）を使用]
Vertical 9:16 cinematic, realistic care facility office interior,
natural ambient sound only, no music, no on-screen captions. Opens
already in motion. The young leader (early 30s woman, maroon scrubs)
stands near the doorway, glancing toward the floor where a senior
staff member is working, hesitating, clipboard held close to her
chest. In Japanese (romanized for correct pronunciation), muttering to
herself: "Shiji, dasanakya... demo, maru-maru-san, watashi yori zutto
beteran dashi..."
```

**Scene 2**
管理者：「どうしたの、浮かない顔して。」
若いリーダー：「年上の職員さんに、指示を出すのが苦手で……経験も長いのに、
私なんかが言っていいのかって。」
```
[参照画像：管理者（_playbook/characters.md #2）と若いリーダー（#3）を
両方使用（同時生成が難しい場合は管理者を軸に生成）]
Same setting. The manager (early 40s woman, blue scrubs) approaches,
noticing the young leader's troubled expression, and asks gently, in
Japanese (romanized): "Doushita no, ukanai kao shite." The young
leader (maroon scrubs) replies, looking down slightly: "Toshiue no
shokuin-san ni, shiji wo dasu no ga nigate de... Keiken mo nagai noni,
watashi nanka ga itte ii no ka tte." Natural ambient sound only, no
music, no captions.
```

**Scene 3（言い切り＋具体策・テンポよく3点提示）**
管理者、まず短く言い切る：「指示、出さなくていいのよ。」
（一拍おいて、指を折りながらテンポよく）「①指示じゃなくて相談の形で伝える、
②相手の経験を先に認める一言を添える、③結論だけでなく理由も一緒に伝える。」
（後編集で「指示、出さなくていい」を大きめのテロップで表示。①〜③は1行ずつ表示）
```
[参照画像：管理者（#2）を使用]
Same setting. Manager (blue scrubs) first says one short, firm line
with a small reassuring smile, in Japanese (romanized): "Shiji, dasanakute
ii no yo." A brief beat, then she counts on her fingers in quick
succession (jump-cut pacing between each point): "Ichi, shiji janakute
soudan no katachi de tsutaeru. Ni, aite no keiken wo saki ni mitomeru
hitokoto wo soeru. San, ketsuron dake de naku riyuu mo issho ni
tsutaeru." Young leader (maroon scrubs) looks up, surprised at the
first line, then nods, writing each point down in a small notebook.
```

**Scene 4**
若いリーダー（ベテラン職員へ、少し緊張しながら）：「〇〇さんの経験、
お借りしたくて……この件、意見を聞かせてもらえますか。」
```
[参照画像：若いリーダー（#3）を使用]
Same setting, different angle. The young leader (maroon scrubs) walks
up to an out-of-focus senior staff member (back only, anonymous, no
face), speaking carefully, in Japanese (romanized): "Maru-maru-san no
keiken, okarishitakute... Kono ken, iken wo kikasete moraemasu ka."
Natural ambient sound only, no music, no captions.
```

**Scene 5（無音・締め・テロップは後入れ）**
（後編集で「年上の職員さんには、『指示』と『相談』どっち派？　👍指示　🙌相談」の
二択の問いかけテロップを追加。保存の依頼は継続して表示）
```
[参照画像：若いリーダー（#3）と管理者（#2）を両方使用]
Same setting, natural ambient sound only, no music, no dialogue, no
captions. The young leader (maroon scrubs) lets out a small relieved
breath, glancing back toward the manager (blue scrubs), who gives a
small approving nod from across the room. In the final seconds, the
camera settles into the same doorway-side framing as Scene 1, with the
young leader standing near the doorway again, now with a calm,
resolved expression (so the end visually loops back into the opening).
Leave the upper third of the frame clean for text to be added later.
```

## 公開前の映り込み確認項目
- [ ] 生成人物が特定の実在職員・管理者に見えないか
- [ ] 実在施設・記録画面・名札・ロゴが写り込んでいないか
- [ ] 衣装が管理者＝ブルースクラブ、若いリーダー＝エンジスクラブで統一されているか
- [ ] Scene5に主CTA（保存）と二択の問いかけ以外の要素・音楽・テロップが入っていないか
- [ ] タイトルカードの言い切りが、年上職員・ベテランを責める言い方になっていないか
- [ ] Scene5の最後の画角が、Scene1の入口側の画角とつながって見えるか
- [ ] 0〜3秒のタイトルカードが中央に全文表示され、強調語だけ黄色になっているか
- [ ] すべての文字に太い黒フチがあり、背景の帯・座布団が付いていないか
- [ ] 3秒以降、左上にタイトルラベル『「年上部下への指示」に悩む、新しいリーダーへ ▶』（黄色の帯・黒文字）が表示されているか
- [ ] Scene 3のポイントが1つずつ、番号と要点の語が黄色で表示されているか
- [ ] 各シーンの生成時に、該当する人物の参照画像が正しく指定されているか
- [ ] Scene2・Scene5など2人が同時に映るシーンで、両者の見た目が参照画像と
  ずれていないか
