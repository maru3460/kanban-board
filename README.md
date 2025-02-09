# React DnDを使ってみる
1. Claudeにアイデアと設計書を書いてもらう
2. 調べながら実装してみる

以上の手順で作成中の、React DnDを使ったアプリです

## 参考
- [Claude](https://claude.ai)
- [ESLint + Prettier + React + TypeScript + Vite で開発環境を整える](https://qiita.com/Stellarium/items/095ca74299a50016c321)

## 書いてもらった設計書

### React DnD カンバンボード 設計書

#### 1. プロジェクト概要

DnDを使用したカンバンボードアプリケーション。タスクをドラッグ&ドロップで管理できる。

##### 1.1 機能一覧
- タスクの作成
- タスクのドラッグ&ドロップ
- ステータス管理（Todo, In Progress, Done）
- タスクの削除
- ローカルストレージでの状態保持

##### 1.2 技術スタック
- React 18.x
- TypeScript 5.x
- Vite 5.x
- react-dnd
- react-dnd-html5-backend
- CSS Modules

#### 2. 実装フェーズ

##### フェーズ1: 基本セットアップ ✅
###### 1.1 ローカル環境構築

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

###### 1.2 初期表示の実装

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

###### 1.3 初期表示確認項目

- [ ] `npm run dev`で開発サーバーが起動する
- [ ] `http://localhost:5173`でアプリケーションが表示される
- [ ] 3 つのカラム（Todo, In Progress, Done）が横並びで表示される
- [ ] レスポンシブ対応（画面幅が狭いときにカラムが縦並びになる）

##### 1.4 GitHub Pages デプロイ設定

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

###### 1.5 GitHub Pages 確認項目

- [ ] GitHub リポジトリにコードがプッシュされている
- [ ] GitHub Actions のワークフローが正常に完了している
- [ ] `https://ユーザー名.github.io/kanban-board/`でアプリケーションが表示される
- [ ] ローカル環境と同じレイアウトが表示される

##### フェーズ2: 型定義とベース実装

###### 2.1 型定義（types/index.ts）
```typescript
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  text: string;
  status: TaskStatus;
  createdAt: Date;
}

export interface DragItem {
  type: 'TASK';
  id: string;
  status: TaskStatus;
}
```

###### 2.2 定数定義（constants/index.ts）
```typescript
export const COLUMN_NAMES = {
  TODO: 'todo',
  IN_PROGRESS: 'inProgress',
  DONE: 'done'
} as const;

export const COLUMN_TITLES = {
  [COLUMN_NAMES.TODO]: 'Todo',
  [COLUMN_NAMES.IN_PROGRESS]: 'In Progress',
  [COLUMN_NAMES.DONE]: 'Done'
} as const;

export const ItemTypes = {
  TASK: 'TASK'
} as const;
```

###### 2.3 コンポーネント構造
```
src/
├── components/
│   ├── Board/
│   │   ├── Board.tsx        # ボード全体のコンテナ
│   │   └── Board.module.css
│   ├── Column/
│   │   ├── Column.tsx       # カラム（Todo/In Progress/Done）
│   │   └── Column.module.css
│   ├── Card/
│   │   ├── Card.tsx         # タスクカード
│   │   └── Card.module.css
│   └── AddTaskForm/
│       ├── AddTaskForm.tsx  # タスク追加フォーム
│       └── AddTaskForm.module.css
```

##### フェーズ3: 状態管理の実装

###### 3.1 LocalStorage Hook（hooks/useLocalStorage.ts）
```typescript
import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}
```

###### 3.2 Tasks Hook（hooks/useTasks.ts）
```typescript
import { useCallback } from 'react';
import { Task, TaskStatus } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      status: 'todo',
      createdAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const moveTask = useCallback((id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status } : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  return { tasks, addTask, moveTask, deleteTask };
}
```

##### フェーズ4: DnD実装

###### 4.1 DnDプロバイダー設定（App.tsx）
```typescript
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Board from './components/Board/Board';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <h1>Kanban Board</h1>
        <Board />
      </div>
    </DndProvider>
  );
}
```

###### 4.2 ドラッグ実装（Card.tsx）
```typescript
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../../constants';
import type { Task } from '../../types';
import styles from './Card.module.css';

interface Props {
  task: Task;
  onDelete: (id: string) => void;
}

export function Card({ task, onDelete }: Props) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { type: 'TASK', id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  return (
    <div
      ref={drag}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
    >
      <p>{task.text}</p>
      <button 
        onClick={() => onDelete(task.id)}
        className={styles.deleteButton}
      >
        ×
      </button>
    </div>
  );
}
```

###### 4.3 ドロップ実装（Column.tsx）
```typescript
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../constants';
import type { Task, TaskStatus, DragItem } from '../../types';
import { Card } from '../Card/Card';
import styles from './Column.module.css';

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function Column({ status, tasks, onMove, onDelete }: Props) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item: DragItem) => {
      if (item.status !== status) {
        onMove(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`${styles.column} ${isOver ? styles.over : ''}`}
    >
      <h2>{COLUMN_TITLES[status]}</h2>
      {tasks.map(task => (
        <Card
          key={task.id}
          task={task}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
```

##### フェーズ5: スタイリング

###### 5.1 ベーススタイル（index.css）
```css
:root {
  --color-bg: #f5f5f5;
  --color-border: #e0e0e0;
  --color-text: #333;
  --color-primary: #1976d2;
  --color-error: #d32f2f;
  --color-success: #388e3c;
}

body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

###### 5.2 カードスタイル（Card.module.css）
```css
.card {
  background: white;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  cursor: move;
  position: relative;
}

.dragging {
  opacity: 0.5;
}

.deleteButton {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-error);
}
```

###### 5.3 カラムスタイル（Column.module.css）
```css
.column {
  flex: 1;
  min-width: 300px;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.over {
  background-color: rgba(25, 118, 210, 0.1);
}
```

#### 3. テスト項目

##### 3.1 機能テスト
- [ ] タスクの追加が正常に動作する
- [ ] タスクのドラッグ&ドロップが正常に動作する
- [ ] 異なるカラム間でのドロップが正常に動作する
- [ ] タスクの削除が正常に動作する
- [ ] ページリロード後もタスクが保持されている

##### 3.2 UI/UXテスト
- [ ] ドラッグ中のカードの表示が適切
- [ ] ドロップ可能な領域が視覚的に明確
- [ ] レスポンシブデザインが機能している
- [ ] エラー時のフィードバックが適切

#### 4. デプロイ手順

##### 4.1 ビルドとテスト
```bash
# 依存関係の更新確認
npm outdated

# ビルド
npm run build

# ビルド成果物の確認
ls dist
```

##### 4.2 GitHub Pagesへのデプロイ
1. ソースコードをコミット
2. mainブランチにプッシュ
3. GitHub Actionsの実行を確認
4. デプロイされたページの動作確認

#### 5. パフォーマンス最適化

##### 5.1 実装時の注意点
- useCallbackとuseMemoの適切な使用
- 不要なre-renderの防止
- 画像やアセットの最適化

##### 5.2 監視項目
- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- メモリ使用量

#### 6. エラーハンドリング

##### 6.1 対応すべきエラー
- LocalStorage操作の失敗
- DnD操作の中断
- タスク操作の失敗

##### 6.2 エラーメッセージ
```typescript
export const ERROR_MESSAGES = {
  STORAGE_ERROR: 'データの保存に失敗しました',
  TASK_CREATE_ERROR: 'タスクの作成に失敗しました',
  TASK_MOVE_ERROR: 'タスクの移動に失敗しました',
  TASK_DELETE_ERROR: 'タスクの削除に失敗しました'
} as const;
```

#### 7. 今後の拡張案

##### 7.1 機能拡張
- タスクの編集機能
- タスクの優先度設定
- カラムの追加/削除
- タスクの検索機能
- ドラッグ&ドロップでの順序変更

##### 7.2 UI/UX改善
- ダークモード対応
- アニメーション追加
- タッチデバイス最適化
- キーボード操作対応

#### 8. 開発フロー

1. 機能実装
2. スタイリング
3. テスト
4. コードレビュー
5. デプロイ

各ステップで問題が発見された場合は、前のステップに戻って修正を行う。

#### 9. コーディング規約

##### 9.1 TypeScript
- 型定義は明示的に行う
- any型の使用を避ける
- readonly修飾子を適切に使用

##### 9.2 React
- 関数コンポーネントを使用
- PropsにはTypeScript型定義を必ず付ける
- 副作用は適切にuseEffectで管理

##### 9.3 CSS
- CSS Modulesを使用
- BEM命名規則に従う
- メディアクエリは適切に設定

#### 10. セキュリティ考慮事項

- XSS対策
  - ユーザー入力のサニタイズ
  - ReactのデフォルトエスケープHTMLを活用
- LocalStorageのデータ検証
- エラーメッセージでの情報漏洩防止
