/**
 * survivalmom-ai — アプリのAI機能を中継する Cloudflare Worker
 *
 * アプリ（GitHub Pages）→ この Worker → Google Gemini API
 * APIキーは Worker の「シークレット」(GEMINI_API_KEY) に置き、ページのソースには書かない。
 *
 * 設定手順は workers/README.md を参照。
 */

const ALLOWED_ORIGINS = ['https://survivalmom.github.io'];
const ALLOWED_APPS    = ['claimlog', 'jikolog', 'watashi_yoyaku'];
const MODEL           = 'gemini-2.5-flash';
const MAX_PROMPT_CHARS = 8000;
const MAX_OUTPUT_TOKENS = 2000;

export default {
  async fetch(request, env) {
    const origin  = request.headers.get('Origin') || '';
    const allowed = ALLOWED_ORIGINS.includes(origin);
    const cors = {
      'Access-Control-Allow-Origin': allowed ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST')    return json({ error: 'method_not_allowed' }, 405);
    if (!allowed)                     return json({ error: 'forbidden_origin' }, 403);
    if (!env.GEMINI_API_KEY)          return json({ error: 'missing_api_key' }, 500);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
    const app    = body && body.app;
    const prompt = body && body.prompt;
    if (!ALLOWED_APPS.includes(app)) return json({ error: 'unknown_app' }, 400);
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > MAX_PROMPT_CHARS) {
      return json({ error: 'bad_prompt' }, 400);
    }
    const maxTokens = Math.min(Number(body.max_tokens) || 1000, MAX_OUTPUT_TOKENS);

    let res, data;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens, thinkingConfig: { thinkingBudget: 0 } },
        }),
      });
      data = await res.json();
    } catch {
      return json({ error: 'upstream_unreachable' }, 502);
    }
    if (!res.ok) return json({ error: 'upstream_error', status: res.status }, 502);

    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text  = parts.map(p => p.text || '').join('');
    // アプリ側の読み取り処理を変えずに済むよう、Claude API と同じ形で返す
    return json({ content: [{ type: 'text', text }] });
  },
};
