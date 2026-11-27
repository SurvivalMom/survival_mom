"""
冒頭6秒チェッカー（hook_yosoku.html）と同じ分析を、完成したリール動画にかける。

アプリの「🎬動画」モードと同じく、最初の6秒から0.5秒ごとに13枚の静止画を切り出し、
アプリと同じ文言（hook_yosoku.html の analyzePrompt と BRANDS をそのまま読み込む）で
同じAIの窓口に送る。動画そのものと音声は送らない（音は --audio と --spoken で言葉で伝える）。

usage:
  python3 hook_check.py 動画.mp4 --brand sm|cdl [--theme 伝えたいこと] [--spoken 最初の6秒の言葉]
                        [--audio "人の声（ナレーション・セリフ）あり・BGMなし"] [--out 結果.json]

  --brand  sm＝survival_mom_diary、cdl＝CARE DESIGN LAB（care_design_lab）
  何%残るかの予測はしない。8つの要素（あり／弱い／なし）、伸びた例と同じ要素の数（x/8）、
  秒ごとの分解、伸びた例との違い、直すとよいところ（撮り直し不要／必要）、言い換え案を表示し、--out にJSONで保存する。
"""
import argparse, base64, json, os, re, subprocess, sys, tempfile, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
APP_HTML = os.path.normpath(os.path.join(HERE, '..', '..', 'hook_yosoku.html'))
MODES_VIDEO = '完成した動画（冒頭の静止画）'


def load_app():
    html = open(APP_HTML, encoding='utf-8').read()
    ai_url = re.search(r"const AI_URL = '([^']+)'", html).group(1)
    app = re.search(r"const APP = '([^']+)'", html).group(1)
    brands = {}
    for key in ('sm', 'cdl'):
        block = re.search(key + r":\s*\{(.*?)\n\s*\},", html, re.S).group(1)
        brands[key] = {f: re.search(f + r":\s*'([^']*)'", block).group(1) for f in ('persona', 'scenes', 'avoid', 'winners')}
    tpl = re.search(r"function analyzePrompt\(inp\)\{.*?return `(.*?)`;\n\}", html, re.S).group(1)
    elements = re.findall(r"\['(\w+)', '([^']+)', '[^']*'\]", re.search(r"const ELEMENTS = \[(.*?)\n\];", html, re.S).group(1))
    return ai_url, app, brands, tpl, elements


def build_prompt(tpl, b, theme, material):
    rep = {
        '${b.persona}': b['persona'], '${b.scenes}': b['scenes'], '${b.avoid}': b['avoid'], '${b.winners}': b['winners'],
        '${inp.mine}': '（まだ記録なし）',
        "${inp.theme || '（記入なし）'}": theme or '（記入なし）',
        '${MODES[inp.mode]}': MODES_VIDEO, '${inp.material}': material,
    }
    for k, v in rep.items():
        tpl = tpl.replace(k, v)
    if '${' in tpl:
        raise SystemExit('hook_yosoku.html の文言の形が変わったため、読み込めませんでした: ' + tpl[tpl.index('${'):][:60])
    return tpl


def frames(video):
    out = []
    with tempfile.TemporaryDirectory() as d:
        for i in range(13):
            t = i * 0.5
            p = os.path.join(d, f'{i}.jpg')
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t + 0.01), '-i', video, '-frames:v', '1',
                            '-vf', 'scale=360:-2', '-q:v', '6', p], check=True)
            if os.path.exists(p):
                out.append((t, base64.b64encode(open(p, 'rb').read()).decode()))
    return out


def ask(ai_url, app, prompt, images):
    body = json.dumps({'app': app, 'prompt': prompt, 'max_tokens': 3000, 'json': True,
                       'images': [{'mime': 'image/jpeg', 'data': d} for _, d in images]}).encode()
    for n, wait in enumerate([4, 10, None]):
        # Cloudflare は Python の標準の名前（Python-urllib）をロボットとして弾く（エラー1010）ので、名前を付ける
        headers = {'Content-Type': 'application/json', 'User-Agent': 'survivalmom-hook-check/1.0'}
        # 窓口は、公開ページ以外からの呼び出しを合言葉ヘッダー x-sm-key で受け付ける（workers/README.md ステップ5）。
        # Claude Code のクラウド環境では、ネットワークのシークレットとして登録した合言葉を通信の途中で自動で付ける。
        # 手元のパソコンで動かすときは、環境変数 SM_KEY に合言葉を入れる。
        if os.environ.get('SM_KEY'):
            headers['x-sm-key'] = os.environ['SM_KEY']
        req = urllib.request.Request(ai_url, data=body, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                data = json.loads(r.read())
        except urllib.error.HTTPError as e:
            try:
                data = json.loads(e.read())
            except Exception:
                data = {'error': f'HTTP {e.code}'}
        if data.get('content'):
            text = ''.join(c.get('text', '') for c in data['content']).strip()
            text = re.sub(r'^```(?:json)?\s*|```\s*$', '', text)
            a, b = text.find('{'), text.rfind('}')
            return json.loads(text[a:b + 1])
        if data.get('error') == 'upstream_error' and data.get('status') in (429, 500, 503) and wait:
            print(f'混み合っているので {wait} 秒後にやり直します（{n + 1}回目）', file=sys.stderr)
            time.sleep(wait)
            continue
        raise SystemExit('採点できませんでした: ' + json.dumps(data, ensure_ascii=False)[:300])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--brand', choices=['sm', 'cdl'], required=True)
    ap.add_argument('--theme', default='')
    ap.add_argument('--spoken', default='')
    ap.add_argument('--audio', default='')
    ap.add_argument('--out')
    a = ap.parse_args()
    ai_url, app, brands, tpl, elements = load_app()
    fr = frames(a.video)
    material = (f"添付の静止画{len(fr)}枚は、動画の {'、'.join(f'{t:g}秒' for t, _ in fr)} の画面です（順番どおり）。\n"
                f"最初の6秒の言葉・音：{a.spoken or '（記入なし。画面のテロップから読み取ってください）'}\n"
                f"音：{a.audio or '（記入なし）'}")
    r = ask(ai_url, app, build_prompt(tpl, brands[a.brand], a.theme, material), fr)
    st = {'あり': 1, '弱い': 0.5, 'なし': 0}
    el = r.get('elements') or {}
    match = sum(st.get((el.get(k) or {}).get('status'), 0.5) for k, _ in elements)
    r['match'] = match
    print(f'見立て：{r.get("verdict", "")}　冒頭の型：{r.get("hookType", "")}')
    print(f'0〜1秒：{r.get("firstLine", "")}')
    print(f'伸びた例と同じ要素：{match:g}/8')
    for k, name in elements:
        e = el.get(k) or {}
        print(f"  [{e.get('status', '?')}] {name}：{e.get('note', '')}")
    for k, n in (('g2', '2秒の関門（指が止まるか）'), ('g6', '6秒の関門（続きを見る理由があるか）')):
        g = (r.get('gates') or {}).get(k) or {}
        print(f"{n}：{g.get('result', '?')}　{g.get('reason', '')}")
    for t in r.get('timeline', []):
        print(f"秒ごと：{t.get('sec')}【{t.get('title', '')}】（離れる人：{t.get('risk')}）見える：{t.get('see')}／聞こえる：{t.get('hear')}／頭の中：{t.get('mind')}")
    print('伸びた例との違い：', r.get('vsWinner'))
    for f in r.get('fix', []):
        f = f if isinstance(f, dict) else {'what': f}
        print(f"直す：［{f.get('reshoot', '')}］{f.get('what')}")
    for w in r.get('rewrites', []):
        print(f"言い換え：{w.get('hook')}（映すもの：{w.get('visual')}）")
    print('心の声：', r.get('innerVoice'))
    if a.out:
        json.dump(r, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
