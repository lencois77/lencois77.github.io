/**
 * プロジェクト一覧のデータソース。
 * 新しいプロダクトを追加する場合は、この配列にオブジェクトを1件追加するだけでよい。
 * image を null のままにすると、カードにはプレースホルダー（頭文字ロゴ）が表示される。
 * 画像を用意できたら assets/images/projects/<id>/ 以下にファイルを置き、パスを指定する。
 */
const PROJECTS = [
  {
    id: "digbox",
    name: "DigBox",
    tagline: "音楽コレクションを整理・管理するためのアプリ",
    description:
      "レコードやCD、デジタル音源など、増え続ける音楽コレクションをシンプルに整理・管理できるアプリです。",
    image: null, // 例: "assets/images/projects/digbox/cover.png"
    status: "開発中",
    links: {
      appStore: null,
      website: null,
      detail: null,
    },
  },

  // 新しいプロダクトはこの下に追加していく
  // {
  //   id: "example",
  //   name: "Example",
  //   tagline: "一言説明",
  //   description: "詳しい説明文。",
  //   image: null,
  //   status: "開発中",
  //   links: { appStore: null, website: null, detail: null },
  // },
];
