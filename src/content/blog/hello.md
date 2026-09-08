---
title: このブログの書き方
description: 記事の置き方と frontmatter の項目のメモ。動作確認用のサンプル記事です。
pubDate: 2026-09-08
tags: ["meta"]
---

`src/content/blog/` に `.md` を置くと記事になります。ファイル名がそのまま URL になるので、この記事は `/blog/hello` です。

## frontmatter

必須は `title` と `pubDate` の 2 つだけです。

```yaml
---
title: 記事のタイトル
pubDate: 2026-09-08
---
```

残りは任意です。

| 項目          | 型           | 既定値  | 用途                                     |
| ------------- | ------------ | ------- | ---------------------------------------- |
| `description` | 文字列       | なし    | 一覧の抜粋と OGP の説明文                |
| `updatedDate` | 日付         | なし    | 記事上部に Updated として表示            |
| `tags`        | 文字列の配列 | `[]`    | タグページ `/blog/tags/<tag>` を自動生成 |
| `draft`       | 真偽値       | `false` | `true` の間は本番ビルドから除外          |

### 下書き

`draft: true` を書いておくと `npm run dev` では見えますが、`npm run build` の出力には含まれません。書きかけのまま push しても公開されないので、気軽にコミットできます。

## 本文

見出し・リスト・引用・表・コードブロックが使えます。h2 と h3 は自動で目次に載ります。

> 引用はこう表示されます。

コードブロックはテーマに追従します。

```rust
#[no_mangle]
pub extern "C" fn kernel_main() -> ! {
    loop {
        core::hint::spin_loop();
    }
}
```

インラインの `code` もこの通りです。

## 消していい記事です

これは動作確認用のサンプルなので、実際に書き始めるときは削除してください。
