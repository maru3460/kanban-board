# React DnD カンバンボード 設計書

## 1. プロジェクト概要

シンプルなカンバンボードを実装し、React DnD の基本的な機能を学習する。

### 1.1 使用技術

- React 18.x
- TypeScript 5.x
- Vite 5.x
- react-dnd
- react-dnd-html5-backend
- CSS Modules
- npm
- GitHub Pages

### 1.2 機能要件

- タスクの作成（テキスト入力）
- タスクカードのドラッグ&ドロップ
- ステータス（Todo, In Progress, Done）間の移動
- タスクの削除
- ローカルストレージでの永続化

## 2. 開発フェーズ

### フェーズ 1: 初期セットアップとデプロイ確認

#### 2.1.1 ローカル環境構築

```bash
# プロジェクト作成
npm create vite@latest kanban-board -- --template react-ts
cd kanban-board

# 依存関係のインストール
npm install
npm install react-dnd react-dnd-html5-backend
npm install --save-dev @types/react-dnd

# 開発サーバー起動
npm run dev
```

#### 2.1.2 初期表示の実装

1. App.tsx の作成

```typescript
import "./App.css";

function App() {
  return (
    <div className="app">
      <h1>Kanban Board</h1>
      <div className="board">
        <div className="column">
          <h2>Todo</h2>
        </div>
        <div className="column">
          <h2>In Progress</h2>
        </div>
        <div className="column">
          <h2>Done</h2>
        </div>
      </div>
    </div>
  );
}

export default App;
```

2. App.css の作成

```css
.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.board {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.column {
  flex: 1;
  min-width: 300px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1rem;
}
```

#### 2.1.3 初期表示確認項目

- [ ] `npm run dev`で開発サーバーが起動する
- [ ] `http://localhost:5173`でアプリケーションが表示される
- [ ] 3 つのカラム（Todo, In Progress, Done）が横並びで表示される
- [ ] レスポンシブ対応（画面幅が狭いときにカラムが縦並びになる）

### 2.1.4 GitHub Pages デプロイ設定

1. vite.config.ts の設定

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/kanban-board/",
});
```

2. GitHub リポジトリの作成と初期プッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ユーザー名/kanban-board.git
git push -u origin main
```

3. GitHub Actions 設定ファイル作成（.github/workflows/deploy.yml）

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install Dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### 2.1.5 GitHub Pages 確認項目

- [ ] GitHub リポジトリにコードがプッシュされている
- [ ] GitHub Actions のワークフローが正常に完了している
- [ ] `https://ユーザー名.github.io/kanban-board/`でアプリケーションが表示される
- [ ] ローカル環境と同じレイアウトが表示される

## 3. 次フェーズの準備

フェーズ 1 が完了したら、以下の実装を行う：

1. コンポーネントの作成

   - Board
   - Column
   - Card
   - AddTaskForm

2. 型定義の作成
3. カスタムフックの実装
4. DnD 機能の実装

## 4. 注意事項

### 4.1 開発環境

- Node.js v18 以上を使用すること
- npm を使用すること（yarn, pnpm は使用しない）
- VSCode の使用を推奨

### 4.2 コードスタイル

- ESLint の推奨設定を使用
- Prettier を使用した一貫したコードフォーマット
- コンポーネントはアロー関数で作成

### 4.3 ブランチ戦略

- main ブランチは保護する
- 機能実装は`feature/`ブランチで行う
- デプロイは`main`ブランチへのマージで自動的に行われる

## 5. トラブルシューティング

### 5.1 ローカル環境のトラブル対応

- `npm install`でエラーが出た場合
  ```bash
  rm -rf node_modules
  npm cache clean --force
  npm install
  ```

### 5.2 GitHub Pages 関連のトラブル対応

- デプロイに失敗した場合
  1. GitHub Actions のログを確認
  2. リポジトリの Settings → Pages の設定を確認
  3. `vite.config.ts`の`base`が正しく設定されているか確認

## 6. 開発スケジュール

1. フェーズ 1（初期セットアップとデプロイ確認）: 1 日
2. フェーズ 2（基本機能の実装）: 2-3 日
3. フェーズ 3（DnD 機能の実装）: 2-3 日
4. フェーズ 4（スタイリングと最終調整）: 1-2 日
