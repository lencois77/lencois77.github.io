# Blogの更新方法

ブログは通常のHTMLだけで表示します。CMS・変換用ライブラリ・追加JavaScriptは不要です。
現在は記事未公開です。サンプル記事は公開していません。

## 更新の流れ

1. Markdownで原稿を書きます。タイトル・公開日・概要も指定します。
2. AIに原稿と下記テンプレートを渡し、`blog/<slug>.html` を作成します。
3. `blog.html` の `.blog-empty` を削除し、下記の一覧項目を新しい日付順に追加します。
4. 記事本文・日付・画像・リンクをブラウザで確認し、差分を確認して公開します。

原稿は任意の手元のフォルダで管理できます。公開フォルダに置いた原稿や下書きは
直接アクセスできるので、公開前の文章はこのサイトのフォルダ外で管理してください。

## AIへの変換指示

原稿の意味を変えず、下記の固定テンプレートに流し込んでください。
`{{TITLE}}`、`{{SUMMARY}}`、`{{DATE}}`、`{{BODY_HTML}}` を置き換えます。
日付はYYYY-MM-DD形式。タイトルや概要の特殊文字はHTMLエスケープしてください。
本文は見出し・段落・リスト・引用・画像・リンク・コードなどの静的HTMLにしてください。
スクリプト、イベントハンドラー、外部ライブラリ、外部埋め込みは追加しないでください。
コード例はエスケープし、リンク先を確認してください。
画像は `assets/images/blog/<slug>/` に保存し、記事から `../assets/images/blog/<slug>/...` で参照します。
画像には内容を説明するaltを付けます。4コマ画像にはセリフのテキストも添えてください。
テンプレート自体は公開記事ではありません。未置換の項目を残さないでください。

## 一覧項目

```html
<ol class="post-list">
  <li>
    <a class="post-link" href="blog/<slug>.html">
      <time datetime="YYYY-MM-DD">YYYY-MM-DD</time>
      <div>
        <h3>記事タイトル</h3>
        <p>記事の短い概要。</p>
      </div>
      <span class="post-arrow" aria-hidden="true">↗</span>
    </a>
  </li>
</ol>
```

## 記事テンプレート

以下を `blog/<slug>.html` のベースに使ってください。

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{{TITLE}} | LENCOIS</title>
  <meta name="description" content="{{SUMMARY}}" />
  <link rel="icon" href="../assets/images/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="../assets/css/style.css" />
</head>
<body>
  <header class="site-header">
    <div class="site-header__inner">
      <a class="wordmark wordmark--logo" href="../index.html" aria-label="LENCOIS ホーム">
        <img src="../assets/images/brand/lencois-logo.svg" alt="LENCOIS" width="566.93" height="127.56" />
      </a>
      <button class="nav-toggle" aria-label="メニューを開く" aria-expanded="false">
        <span></span>
      </button>
      <nav class="site-nav">
        <a href="../index.html">Home</a>
        <a href="../work.html">Work</a>
        <a href="../blog.html" aria-current="page">Blog</a>
        <a href="../contact.html">Contact</a>
      </nav>
    </div>
  </header>

  <main class="container article-page">
    <a class="article-back" href="../blog.html">← Blog</a>
    <article>
      <header class="article-header">
        <p class="article-meta"><time datetime="{{DATE}}">{{DATE}}</time></p>
        <h1>{{TITLE}}</h1>
      </header>
      <div class="article-body">
        {{BODY_HTML}}
      </div>
    </article>
    <div class="article-bottom"><a href="../blog.html">← 記事一覧へ</a></div>
  </main>

  <footer class="site-footer">
    <div class="site-footer__inner">
      <span>&copy; 2026 LENCOIS</span>
      <a href="../contact.html">Contact</a>
    </div>
  </footer>

</body>
</html>

```
