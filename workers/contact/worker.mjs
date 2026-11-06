const EMAIL = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,}$/;
const MAX_BYTES = 24000;
const PRODUCTS = new Map([['digbox', 'DIGBOX'], ['other', 'その他']]);
export async function handle(request, env, fetcher = fetch) {
  const origin = request.headers.get('Origin');
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(x => x.trim()).filter(Boolean);
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Origin' };
  if (allowed.includes(origin)) headers['Access-Control-Allow-Origin'] = origin;
  const reply = (status, message) => new Response(JSON.stringify({ ok: status === 200, message }), { status, headers });
  if (!allowed.includes(origin)) return reply(403, 'このサイトからは送信できません。');
  if (new URL(request.url).pathname !== '/contact') return reply(404, 'Not found');
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  if (request.method !== 'POST') return reply(405, 'POST only');
  if (!env.TURNSTILE_SECRET_KEY || !env.MAIL_FROM || !env.MAIL_TO || !env.MAILER) return reply(503, '現在フォームを利用できません。メールでお問い合わせください。');
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') return reply(415, '送信形式が正しくありません。');
  let data;
  try {
    if (Number(request.headers.get('Content-Length')) > MAX_BYTES) return reply(413, '送信内容が長すぎます。');
    const reader = request.body?.getReader();
    if (!reader) return reply(400, '内容を入力してください。');
    const chunks = []; let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) { await reader.cancel(); return reply(413, '送信内容が長すぎます。'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    data = JSON.parse(new TextDecoder().decode(bytes));
  } catch { return reply(400, '送信内容を確認してください。'); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return reply(400, '送信内容を確認してください。');
  const { name, email, product, subject, message, token, website } = data;
  if (!PRODUCTS.has(product)) return reply(400, 'お問い合わせ対象を選択してください。');
  if (website) return reply(400, '送信内容を確認してください。');
  if (![name, email, subject, message, token].every(x => typeof x === 'string')) return reply(400, '必須項目を入力してください。');
  if (!name.trim() || name.length > 80 || !EMAIL.test(email) || email.length > 254 || !subject.trim() || subject.length > 120 || !message.trim() || message.length > 5000 || !token || token.length > 2048 || /[\r\n\x00-\x1f\x7f]/.test(name + email + subject)) return reply(400, '入力内容や文字数を確認してください。');
  try {
    const verification = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    if (!verification.ok) return reply(503, '確認処理に失敗しました。時間をおいてお試しください。');
    const result = await verification.json();
    if (!result.success || result.action !== 'contact' || result.hostname !== new URL(origin).hostname) return reply(400, '認証の有効期限が切れたか、確認に失敗しました。もう一度お試しください。');
    await env.MAILER.send({
      to: env.MAIL_TO, from: env.MAIL_FROM, replyTo: email,
      subject: `[LENCOIS / ${PRODUCTS.get(product)}] ${subject.trim()}`,
      text: `お問い合わせ対象: ${PRODUCTS.get(product)}\nお名前: ${name.trim()}\n返信先: ${email}\n件名: ${subject.trim()}\n\n${message.trim()}`,
    });
    return reply(200, 'お問い合わせを送信しました。ありがとうございます。');
  } catch { return reply(503, '送信の完了を確認できませんでした。再送で重複する場合があります。メールでもお問い合わせいただけます。'); }
}
export default { fetch(request, env) { return handle(request, env); } };
