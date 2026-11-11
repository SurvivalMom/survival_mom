/**
 * survivalmom-ai — アプリのAI機能を中継する Cloudflare Worker
 *
 * アプリ（GitHub Pages）→ この Worker → Google Gemini API
 * APIキーは Worker の「シークレット」(GEMINI_API_KEY) に置き、ページのソースには書かない。
 *
 * 設定手順は workers/README.md を参照。
 */

const ALLOWED_ORIGINS = ['https://survivalmom.github.io'];
const MODEL           = 'gemini-2.5-flash';

// アプリごとの上限。images は「画像を一緒に送ってよい枚数」（0 = 文字だけ）
const APPS = {
  claimlog:       { maxPrompt: 8000,  maxOutput: 2000, images: 0 },
  jikolog:        { maxPrompt: 8000,  maxOutput: 2000, images: 0 },
  watashi_yoyaku: { maxPrompt: 8000,  maxOutput: 2000, images: 0 },
  reel_kenkyu:    { maxPrompt: 16000, maxOutput: 8000, images: 24 },
};
const MAX_IMAGE_CHARS_TOTAL = 2_000_000; // base64 の合計（約1.5MB）
const IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

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
    const conf   = Object.prototype.hasOwnProperty.call(APPS, app) ? APPS[app] : null;
    if (!conf) return json({ error: 'unknown_app' }, 400);
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > conf.maxPrompt) {
      return json({ error: 'bad_prompt' }, 400);
    }
    const maxTokens = Math.min(Number(body.max_tokens) || 1000, conf.maxOutput);

    // 画像（リールの静止画など）。許可されたアプリだけ・枚数とサイズに上限
    const parts = [];
    const images = Array.isArray(body.images) ? body.images : [];
    if (images.length) {
      if (images.length > conf.images) return json({ error: 'too_many_images' }, 400);
      let total = 0;
      for (const img of images) {
        if (!img || !IMAGE_MIMES.includes(img.mime) || typeof img.data !== 'string') {
          return json({ error: 'bad_image' }, 400);
        }
        total += img.data.length;
        if (total > MAX_IMAGE_CHARS_TOTAL) return json({ error: 'images_too_large' }, 400);
        parts.push({ inline_data: { mime_type: img.mime, data: img.data } });
      }
    }
    parts.push({ text: prompt });

    const generationConfig = { maxOutputTokens: maxTokens, thinkingConfig: { thinkingBudget: 0 } };
    if (body.json === true) generationConfig.responseMimeType = 'application/json';

    let res, data;
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
        body: JSON.stringify({ contents: [{ role: 'user', parts }], generationConfig }),
      });
      data = await res.json();
    } catch {
      return json({ error: 'upstream_unreachable' }, 502);
    }
    if (!res.ok) return json({ error: 'upstream_error', status: res.status }, 502);

    const out  = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = out.map(p => p.text || '').join('');
    // アプリ側の読み取り処理を変えずに済むよう、Claude API と同じ形で返す
    return json({ content: [{ type: 'text', text }] });
  },
};
