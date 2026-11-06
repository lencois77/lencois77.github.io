import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from './worker.mjs';
const data = { name: 'テスト', email: 'visitor@example.com', product: 'digbox', subject: '質問', message: '本文', token: 'token', website: '' };
function setup() {
  const sent = [];
  const env = { ALLOWED_ORIGINS: 'https://lencois.dev', TURNSTILE_SECRET_KEY: 'secret', MAIL_FROM: 'contact@lencois.dev', MAIL_TO: 'owner@example.com', MAILER: { send: async x => sent.push(x) } };
  const request = (value = data, origin = 'https://lencois.dev') => new Request('https://worker.example/contact', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(value) });
  const verify = async () => Response.json({ success: true, hostname: 'lencois.dev', action: 'contact' });
  return { sent, env, request, verify };
}
test('valid message goes only to configured recipient with visitor as replyTo', async () => {
  const s = setup(); const r = await handle(s.request({ ...data, to: 'attacker@example.com' }), s.env, s.verify);
  assert.equal(r.status, 200); assert.equal(s.sent.length, 1);
  assert.match(s.sent[0].subject, /DIGBOX/); assert.match(s.sent[0].text, /お問い合わせ対象: DIGBOX/);
  assert.equal(s.sent[0].to, s.env.MAIL_TO); assert.equal(s.sent[0].replyTo, data.email);
});
test('foreign origin cannot send', async () => {
  const s = setup(); const r = await handle(s.request(data, 'https://other.example'), s.env, s.verify);
  assert.equal(r.status, 403); assert.equal(s.sent.length, 0);
});
test('invalid or injected headers and long content rejected', async () => {
  for (const patch of [{ email: 'bad' }, { subject: 'hello\r\nBcc: x@y.com' }, { name: '' }, { message: 'x'.repeat(5001) }, { website: 'spam' }]) {
    const s = setup(); assert.equal((await handle(s.request({ ...data, ...patch }), s.env, s.verify)).status, 400); assert.equal(s.sent.length, 0);
  }
});
test('oversized request rejected before verification', async () => {
  const s = setup(); assert.equal((await handle(s.request({ ...data, message: 'a'.repeat(25000) }), s.env, s.verify)).status, 413);
});
test('Turnstile rejection, wrong hostname and wrong action never send', async () => {
  for (const result of [{ success: false }, { success: true, hostname: 'other.example', action: 'contact' }, { success: true, hostname: 'lencois.dev', action: 'other' }]) {
    const s = setup(); assert.equal((await handle(s.request(), s.env, async () => Response.json(result))).status, 400); assert.equal(s.sent.length, 0);
  }
});
test('missing configuration fails closed', async () => {
  const s = setup(); delete s.env.TURNSTILE_SECRET_KEY;
  assert.equal((await handle(s.request(), s.env, s.verify)).status, 503);
});
test('mail failure does not claim success or expose provider errors', async () => {
  const s = setup(); s.env.MAILER.send = async () => { throw Error('secret failure'); };
  const r = await handle(s.request(), s.env, s.verify); assert.equal(r.status, 503); assert.ok(!(await r.text()).includes('secret failure'));
});
test('preflight allows only expected request headers', async () => {
  const s = setup(); const r = await handle(new Request('https://worker.example/contact', { method: 'OPTIONS', headers: { Origin: 'https://lencois.dev' } }), s.env);
  assert.equal(r.status, 204); assert.equal(r.headers.get('Access-Control-Allow-Origin'), 'https://lencois.dev');
});

test('only supported products are accepted', async () => {
  for (const product of ['', 'unknown', 'yumeguri', null, undefined]) {
    const s = setup(); assert.equal((await handle(s.request({ ...data, product }), s.env, s.verify)).status, 400); assert.equal(s.sent.length, 0);
  }
  for (const product of ['other']) {
    const s = setup(); assert.equal((await handle(s.request({ ...data, product }), s.env, s.verify)).status, 200); assert.equal(s.sent.length, 1);
  }
});
