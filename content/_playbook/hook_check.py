"""
冒頭6秒チェッカー（hook_yosoku.html）と同じ採点を、完成したリール動画にかける。

アプリの「🎬動画」モードと同じく、最初の6秒から0.5秒ごとに13枚の静止画を切り出し、
アプリと同じ文言（hook_yosoku.html の predictPrompt と BRANDS をそのまま読み込む）で
同じAIの窓口に送る。動画そのものと音声は送らない。

usage:
  python3 hook_check.py 動画.mp4 --brand sm|cdl [--theme 伝えたいこと] [--spoken 最初の6秒の言葉] [--out 結果.json]

  --brand  sm＝survival_mom_diary、cdl＝CARE DESIGN LAB（care_design_lab）
  結果は「6秒残存の予測」「見立て」「離れやすい瞬間」「直すとよいところ」「言い換え案」を表示し、--out にJSONで保存する。
  判定の目安（アプリと同じ）：65%以上＝このまま出せる／45〜64%＝ひと工夫で伸びる／44%以下＝冒頭を作り直したい
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
        brands[key] = {f: re.search(f + r":\s*'([^']*)'", block).group(1) for f in ('persona', 'scenes', 'avoid')}
    tpl = re.search(r"function predictPrompt\(inp\)\{.*?return `(.*?)`;\n\}", html, re.S).group(1)
    return ai_url, app, brands, tpl


def build_prompt(tpl, b, theme, material):
    rep = {
        '${b.persona}': b['persona'], '${b.scenes}': b['scenes'], '${b.avoid}': b['avoid'],
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
        headers = {'Content-Type': 'application/json'}
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
    ap.add_argument('--out')
    a = ap.parse_args()
    ai_url, app, brands, tpl = load_app()
    fr = frames(a.video)
    material = (f"添付の静止画{len(fr)}枚は、動画の {'、'.join(f'{t:g}秒' for t, _ in fr)} の画面です（順番どおり）。\n"
                f"最初の6秒の言葉・音：{a.spoken or '（記入なし。画面のテロップから読み取ってください）'}")
    r = ask(ai_url, app, build_prompt(tpl, brands[a.brand], a.theme, material), fr)
    s = int(r.get('retention6s', 0))
    grade = 'このまま出せる' if s >= 65 else 'ひと工夫で伸びる' if s >= 45 else '冒頭を作り直したい'
    print(f'6秒残存の予測：{s}%（{grade}）　{r.get("verdict", "")}')
    print('曲線：', r.get('curve'))
    print('5つの観点：', r.get('scores'))
    for d in r.get('dropPoints', []):
        print(f"離れやすい：{d.get('sec')}　{d.get('reason')}")
    for t in r.get('fix', []):
        print('直す：', t)
    for w in r.get('rewrites', []):
        print(f"言い換え：{w.get('hook')}（映すもの：{w.get('visual')}）")
    print('心の声：', r.get('innerVoice'))
    if a.out:
        json.dump(r, open(a.out, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
