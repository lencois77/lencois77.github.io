# LENCOIS | Developer Site

個人開発者「LENCOIS」のポートフォリオ／プロダクト紹介サイトです。
フレームワークやビルドツールを使わない、素のHTML / CSS / JavaScriptの静的サイトです。

公開URL（予定）: https://lencois77.github.io/

## 構成

```
.
├── index.html          Home
├── work.html        Work（プロダクト一覧）
├── blog.html             Blog（記事一覧）
├── blog/README.md        記事テンプレートと更新手順
├── contact.html          Contact
├── assets/
│   ├── css/style.css     全ページ共通スタイル
│   ├── js/
│   │   ├── projects-data.js    プロダクト一覧データ（★ここを編集する）
│   │   ├── projects-render.js  カードを描画する共通処理
│   │   └── main.js             モバイルメニューの開閉
│   └── images/
│       ├── favicon.svg
│       ├── brand/lencois-logo.svg  LENCOISロゴ（D案）
│       └── projects/<id>/      各プロダクトの画像置き場
└── .nojekyll             GitHub PagesのJekyll処理を無効化
```

## プロダクトを追加する方法

`assets/js/projects-data.js` の `PROJECTS` 配列にオブジェクトを1件追加するだけです。
Home（注目プロダクト）とWork一覧の両方に自動で反映されます。

```js
{
  id: "example",
  name: "Example",
  tagline: "一言説明",
  description: "詳しい説明文。",
  image: null, // 画像を用意したら "assets/images/projects/example/cover.png" のように指定
  status: "開発中",
  links: { appStore: null, website: null, detail: null },
}
```

- `image` が `null` の場合はプレースホルダー（頭文字）が表示されます。
- `links.detail` にURLを指定すると、カード全体がそのページへのリンクになります（詳細ページを追加した際に使用）。

## スクリーンショットを追加する方法

`assets/images/projects/<id>/` にファイルを置き、`projects-data.js` の `image` にパスを指定してください。

## Contactのメールアドレスを設定する

`contact.html` 内の `contact@lencois.dev` を実際のメールアドレスに書き換えてください。

## GitHub Pagesで公開する手順

1. GitHub上に `lencois77.github.io` という名前でリポジトリを作成する（ユーザーサイトのため、リポジトリ名はこの形式である必要があります）。
2. このディレクトリの内容をそのリポジトリにpushする。
3. リポジトリの Settings → Pages を開く。
4. Source を「GitHub Actions」に設定する（DIGBOXを除外する公開ワークフローを使用）。
5. 数分後、`https://lencois77.github.io/` で公開される。

※ 独自ドメインを使う場合は `CNAME` ファイルをルートに追加し、Pages設定でカスタムドメインを設定してください（現時点では未対応）。

## 今後の拡張予定

- 各プロダクトの詳細ページ（`projects/<id>.html` などを想定）
- App Storeへのリンク
- プロダクトのスクリーンショット
- Privacy Policy / Terms of Use
- 英語版の記事・ページ

## ロゴと配色

D案を採用し、全4ページのヘッダーに共通のロゴを掲載しています。
白背景と濃いグレーの本文を基本に、水色を控えめなアクセントとして使います。
共通CSSの `--color-accent` は装飾用、`--color-link` は文字の読みやすさを考慮した濃い青です。

ヘッダーは正式版の文字付きロゴ `assets/images/brand/lencois-logo.svg` を140px幅で控えめに表示します。
マーク単体の `assets/images/brand/lencois-mark.svg` も素材として保持しています。
ロゴの正式色は `#0097E0`。ファビコンにも正式版のマークを使っています。
全ページと記事テンプレートは同じロゴを参照します。

## Blog

記事一覧は `blog.html`、記事は `blog/<slug>.html` に置きます。
Markdown原稿から固定テンプレートでHTMLを作り、一覧を手動更新する運用です。
詳細と記事テンプレートは [blog/README.md](blog/README.md) を参照してください。

## DIGBOX製品サイト

`digbox/` に統合し、このリポジトリで管理します。
現在はトップとWorkのDIGBOXカードの詳細リンクを外しています。
DIGBOX側のフッターにはLENCOISへ戻るリンクがあります。
詳細は [digbox/README.md](digbox/README.md) を参照してください。
元の `digbox-web` は履歴保管用として残し、今後の製品サイト更新は本リポジトリへ反映します。

## 現在の公開範囲（DIGBOX製品サイトは非公開）

公開には `.github/workflows/pages.yml` を使用します。
GitHubの Settings → Pages → Source は **GitHub Actions** にしてください。
以前の「Deploy from a branch / main / root」は使わないでください。
ルート全体を公開すると `digbox/` も公開されます。

`scripts/prepare-pages.py` が公開ファイルだけを `_site/` にコピーします。
DIGBOX製品ページはコピーしません。LENCOISの制作物紹介は残し、詳細リンクを外しています。
ローカルでは引き続き `/digbox/` を確認できます。
この除外はWeb公開用です。リポジトリ自体が公開ならソースは閲覧可能です。
再公開する際は公開準備スクリプトにDIGBOXを追加し、詳細リンクを復元してください。
