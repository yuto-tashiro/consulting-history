# コンサルティングの歴史

歴史を俯瞰し、これからの「考える仕事」を考える日本語の学習サイト。

公開URL: https://consulting-history.hiluco.workers.dev
運営: 株式会社HILUCO

## サイト

- 8章の静的記事：対話、測定、専門職、戦略、日本の改善、実装、知識創造、AI
- 主要な出来事の年表とテーマ別の絞り込み
- 章別の参考文献、編集方針、運営情報
- 未来への問いと、ブラウザ内だけに保存するメモ・Markdown書き出し
- モバイル対応、キーボード操作、JavaScriptなしでも読める本文
- OGP画像、サイトマップ、独自404、セキュリティヘッダー

古代思想は近代産業の直接の起源とは扱わず、史実・編集上の解釈・未来の仮説を分けています。米国・日本中心の入門的な概説です。

## 開発

Node.js 22以上。

```sh
npm ci
npm run dev
```

http://localhost:8787 を開きます。

```sh
npm run build
npm run check
npx playwright install chromium
# 別ターミナルで npm run dev を起動した状態
npx playwright test
npx wrangler deploy --dry-run
```

`content/history.mjs` が記事・参考文献、`scripts/build.mjs` がページ生成、`public/` がCSS・JS・配信用アセットです。ビルド時の外部API呼び出しはありません。`dist/` は生成物のためコミットしません。

## Cloudflare Workers

HILUCOアカウントIDとWorker名は `wrangler.jsonc` に固定しています。Workers Static Assetsで配信し、データベースや外部AI APIは使いません。アカウントIDは秘密情報ではありません。

```sh
npx wrangler whoami
npm run deploy
```

既存OAuth認証を使った初回公開が可能です。秘密情報をリポジトリへコミットしないでください。

## GitHub経由の継続デプロイ

`main`へのpushで、ビルド・内部リンク・Workers dry-run・ブラウザテストがGitHub Actionsで実行されます。

Cloudflare Workers Buildsの連携には、Cloudflare側で別途接続が必要です。Wranglerの通常OAuth権限だけではBuilds APIを操作できません。接続先と設定は次のとおりです。

1. HILUCOのWorkers & Pagesで `consulting-history` を開く。
2. Settings → Builds → Connect からGitHubを接続する。
3. `yuto-tashiro/consulting-history`、本番ブランチ `main` を選ぶ。
4. ルート `/`、ビルド `npm run build && npm run check`、デプロイ `npx wrangler deploy` を設定する。
5. 初回ビルド成功後、pushによる自動デプロイを確認する。

この接続は、コードのpushやローカルからの初回デプロイとは別の設定です。

公式資料: https://developers.cloudflare.com/workers/ci-cd/builds/

## メモの扱い

`localStorage` の `consulting-history-notes-v1` にだけ保存します。サーバーへ送信せず、別端末へ同期しません。ブラウザのデータ消去で消えるため、必要に応じて書き出してください。広告・アクセス解析は設置していません。
