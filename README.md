# Create React App を使い始める

このプロジェクトは [Create React App](https://github.com/facebook/create-react-app) で作成されました。

## 利用可能なスクリプト

プロジェクトディレクトリで次のコマンドが実行できます。

### `npm start`

開発モードでアプリを起動します。\
ブラウザで [http://localhost:3000](http://localhost:3000) を開くと確認できます。

ファイルを編集するとページが自動的にリロードされます。\
また、コンソールに ESLint のエラーが表示されることがあります。

### `npm test`

インタラクティブなウォッチモードでテストランナーを起動します。\
詳細は [running tests](https://facebook.github.io/create-react-app/docs/running-tests) の節を参照してください。

### `npm run build`

本番用にアプリを `build` フォルダーにビルドします。\
本番モードで React を正しくバンドルし、最適化を行います。

ビルドは縮小（minify）され、ファイル名にはハッシュが含まれます。\
これでアプリはデプロイ可能な状態になります。

詳細は [deployment](https://facebook.github.io/create-react-app/docs/deployment) の節を参照してください。

### `npm run eject`

**注意: これは一度行うと元に戻せません。`eject` すると元に戻せません！**

ビルドツールや設定に満足できない場合は、いつでも `eject` できます。このコマンドはプロジェクトから単一のビルド依存を取り除きます。

代わりに、すべての設定ファイルとトランジティブな依存関係（webpack、Babel、ESLint など）をプロジェクト内にコピーするため、完全に制御できるようになります。`eject` 以外のコマンドは引き続き動作しますが、コピーされたスクリプトを参照するようになります。以降の調整はご自身で行ってください。

`eject` を必ず使う必要はありません。Create React App のキュレーションされた機能セットは小中規模のデプロイに適しており、準備ができるまではそのまま使うことをおすすめします。

## さらに学ぶ

詳細は [Create React App のドキュメント](https://facebook.github.io/create-react-app/docs/getting-started) を参照してください。

React を学ぶには [React の公式ドキュメント](https://reactjs.org/) が役立ちます。
