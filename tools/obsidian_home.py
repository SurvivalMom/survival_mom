#!/usr/bin/env python3
"""content/ 以下の .md を集めて、Obsidian の入口ノート content/ホーム.md を作り直す。

使い方（リポジトリのルートで）:  python3 tools/obsidian_home.py
新しい台本や記事を追加したら、もう一度実行すれば一覧が最新になる。
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent / 'content'
SKIP = {'ホーム.md', 'はじめに_Obsidianの使い方.md'}

def title(p):
    for line in p.read_text(encoding='utf-8').splitlines():
        if line.startswith('# '):
            return line[2:].strip()
    return p.stem

def link(p):
    rel = p.relative_to(ROOT).with_suffix('').as_posix()
    t = title(p).replace('|', '｜').replace('[', '［').replace(']', '］')
    return f'- [[{rel}|{t}]]'

def files(sub):
    d = ROOT / sub
    return sorted(p for p in d.glob('*.md') if p.name not in SKIP) if d.is_dir() else []

def section(head, paths):
    return [f'### {head}', *[link(p) for p in paths], ''] if paths else []

SERIES = [  # (ファイル名の頭, 見出し)
    (r'^\d', 'セリフ型（01〜10）'),
    (r'^dokuhaku-', '独白・語りかけ（dokuhaku）'),
    (r'^sunao-', '素直シリーズ（sunao）'),
    (r'^ura-', '裏シリーズ・情景独白（ura）'),
    (r'^shiten-', '視点差分（shiten）'),
    (r'^shoseijutsu-', '処世術・長尺解説（shoseijutsu）'),
    (r'^wakai-leader-', '若いリーダーへ（wakai-leader）'),
    (r'^gunzougeki-', '群像劇（gunzougeki）'),
]

out = ['# ホーム', '',
       'すべての台本・記事・プレイブックへの入口です。',
       '一覧は `python3 tools/obsidian_home.py` で自動生成しています（手で書き換えても、次の実行で上書きされます）。',
       '', '→ はじめての方は [[はじめに_Obsidianの使い方]]', '',
       '---', '', '## survival_mom（不登校・発達グレー・中学受験ママ向け）', '']
out += section('制作の手順書', files('_playbook'))
for sub, head in [('mode1', 'MODE1：note記事'), ('mode2', 'MODE2：ショート動画台本'),
                  ('mode3', 'MODE3：表系画像'), ('mode4', 'MODE4：ループ動画'), ('mode5', 'MODE5：SNS投稿文')]:
    out += section(head, files(sub))

cd = files('caredesign/ai-video')
if (ROOT / 'caredesign').is_dir():
    out += ['---', '', '## CARE DESIGN LAB（介護経営・管理者向け）', '']
    out += section('制作の手順書・設定', files('caredesign/_playbook'))
    out += ['### AI動画', '']
    used = set()
    for pat, head in SERIES:
        ps = [p for p in cd if re.match(pat, p.name)]
        used.update(ps)
        out += [f'#### {head}', *[link(p) for p in ps], ''] if ps else []
    rest = [p for p in cd if p not in used]
    out += ['#### その他', *[link(p) for p in rest], ''] if rest else []
    for sub, head in [('note', 'note記事'), ('tuesday-carousel', '火曜カルーセル'),
                      ('thursday-table', '木曜表系画像'), ('saturday-reel', '土曜リール'),
                      ('stories', 'ストーリーズ'), ('growth', '成長モード・運用'), ('kyozai', '教材')]:
        out += section(head, files('caredesign/' + sub))

(ROOT / 'ホーム.md').write_text('\n'.join(out).rstrip() + '\n', encoding='utf-8')
print('wrote', ROOT / 'ホーム.md')
