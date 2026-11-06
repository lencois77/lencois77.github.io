(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const fields = form.querySelector('fieldset');
  const status = document.querySelector('#contact-status');
  const submit = form.querySelector('button[type="submit"]');
  const config = window.LENCOIS_CONTACT || {};
  let widget; let token = ''; let sending = false; let completed = false;
  const update = () => { submit.disabled = !token || sending || completed; };
  if (!config.endpoint || !config.siteKey) return;
  try { if (new URL(config.endpoint).protocol !== 'https:') return; } catch { return; }
  status.textContent = '送信には迷惑投稿対策の確認が必要です。';
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.onerror = () => { status.textContent = '認証を読み込めませんでした。時間をおいて再読み込みしてください。'; };
  script.onload = () => {
    if (!window.turnstile) return;
    fields.disabled = false;
    widget = window.turnstile.render('#contact-verification', {
      sitekey: config.siteKey, action: 'contact', language: 'ja',
      callback: value => { token = value; update(); },
      'expired-callback': () => { token = ''; update(); status.textContent = '認証の有効期限が切れました。もう一度確認してください。'; },
      'error-callback': () => { token = ''; update(); status.textContent = '認証に失敗しました。時間をおいて再確認してください。'; },
    });
  };
  document.head.appendChild(script);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || completed || !token || !form.reportValidity()) return;
    sending = true; update(); fields.disabled = true;
    form.setAttribute('aria-busy', 'true'); status.textContent = '送信しています…';
    const payload = {};
    // Read only the expected fields, including while the fieldset is disabled.
    for (const name of ['name', 'email', 'product', 'subject', 'message', 'website']) payload[name] = form.elements.namedItem(name).value;
    try {
      const response = await fetch(config.endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'omit', body: JSON.stringify({ ...payload, token }), signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error(response.status === 503 ? '現在送信を完了できません。重複送信にご注意のうえ、時間をおいてお試しください。' : (result.message || '送信に失敗しました。'));
      completed = true; form.reset(); status.textContent = result.message;
      submit.textContent = '送信済み';
    } catch (error) {
      status.textContent = error.name === 'TimeoutError' || error.name === 'TypeError'
        ? '送信の完了を確認できませんでした。再送で重複する場合があります。時間をおいてご確認ください。'
        : error.message;
    } finally {
      sending = false; token = ''; fields.disabled = completed;
      form.removeAttribute('aria-busy'); update();
      if (!completed) window.turnstile.reset(widget);
    }
  });
})();
