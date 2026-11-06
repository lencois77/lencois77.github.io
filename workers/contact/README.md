# LENCOIS Contact Worker

問い合わせフォーム用の受付。公開HPはGitHub Pagesのまま、WorkerのみCloudflareに公開します。
このフォルダは `scripts/prepare-pages.py` の公開対象に含めていません。
本文・メールアドレスをログやデータベースに保存せず、認証済み宛先にメール通知します。

## Cloudflareで必要な設定

1. Email Routingの宛先Gmailが確認済みであることを確認。
2. TurnstileでManagedウィジェットを作成し、ホスト名に `lencois.dev` を登録。
3. `wrangler.toml` の `MAIL_TO` と `destination_address` を同じ確認済みGmailに置換。
   この設定の宛先はWorker用です。HPのJavaScriptには宛先Gmailを含めません。
4. このフォルダでWranglerを使用して `npx wrangler secret put TURNSTILE_SECRET_KEY` を実行し、
   Turnstileの秘密キーを入力。秘密キーをファイルやGitに保存しないでください。
5. `npx wrangler deploy` でWorkerを公開。Workers Freeを使用します。
6. `assets/js/contact-config.js` の `endpoint` に `https://<Workerのホスト名>/contact`、
   `siteKey` にTurnstileの公開サイトキーを設定。
7. HPを公開して、独自ドメイン上から送信し、Gmailへの着信と返信先を確認。
   動作確認後、失敗時のメッセージやスマートフォンでの表示も確認してください。

ローカルで実送信を確認する場合はTurnstile側にも開発用ホストを許可し、
ALLOWED_ORIGINSに `http://127.0.0.1:8000` を一時追加してください。本番では削除します。
公式テストキーは開発用に限り、本番の秘密キーと混ぜないでください。

現時点では公開URLとキーは空で、フォームは停止中です。
未設定状態でメールを送ったふりをする処理はありません。
送信成功はメール送信APIの受付を意味し、受信箱への到着を保証するものではありません。
宛先は管理者に固定し、自動返信や添付ファイルには対応しません。
送信失敗時は入力を保持し、認証をやり直せます。自動再送はしません。
CORSは認証の代わりではないため、必ずTurnstileをサーバーで検証します。

## 検証

`node --test workers/contact/worker.test.mjs`（リポジトリのルートから）
外部へのメール送信をせず、宛先固定・入力検証・Turnstile検証・送信失敗をテストします。

## 公式資料

- https://developers.cloudflare.com/email-service/api/send-emails/workers-api/
- https://developers.cloudflare.com/email-service/configuration/send-bindings/
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
