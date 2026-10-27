# LENCOIS | Developer Site

個人開発者「LENCOIS」のポートフォリオ／プロダクト紹介サイトです。
フレームワークやビルドツールを使わない、素のHTML / CSS / JavaScriptの静的サイトです。

公開URL（予定）: https://lencois77.github.io/

## 構成

```
.
├── index.html          Home
├── projects.html        Projects（プロダクト一覧）
├── about.html            About
├── contact.html          Contact
├── assets/
│   ├── css/style.css     全ページ共通スタイル
│   ├── js/
│   │   ├── projects-data.js    プロダクト一覧データ（★ここを編集する）
│   │   ├── projects-render.js  カードを描画する共通処理
│   │   └── main.js             モバイルメニューの開閉
│   └── images/
│       ├── favicon.svg
│       └── projects/<id>/      各プロダクトの画像置き場
└── .nojekyll             GitHub PagesのJekyll処理を無効化
```

## プロダクトを追加する方法

`assets/js/projects-data.js` の `PROJECTS` 配列にオブジェクトを1件追加するだけです。
Home（注目プロダクト）とProjects一覧の両方に自動で反映されます。

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
4. Source を「Deploy from a branch」、Branch を `main` / `root(/)` に設定する。
5. 数分後、`https://lencois77.github.io/` で公開される。

※ 独自ドメインを使う場合は `CNAME` ファイルをルートに追加し、Pages設定でカスタムドメインを設定してください（現時点では未対応）。

## 今後の拡張予定

- 各プロダクトの詳細ページ（`projects/<id>.html` などを想定）
- App Storeへのリンク
- プロダクトのスクリーンショット
- Privacy Policy / Terms of Use
- 開発ブログ／News
