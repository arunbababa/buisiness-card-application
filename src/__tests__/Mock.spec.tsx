import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../App";

// Jestのモックを正確に設定
jest.mock("../lib/todo.ts", () => ({
  getTodosFromSupabase: jest.fn(() => Promise.resolve([])), // 初期値を設定
  sendTodosToSupabase: jest.fn(() => Promise.resolve({ id: 3, title: "新しいタスク", time: 15 })),
  deleteTodosFromSupabase: jest.fn(() => Promise.resolve([])),
}));

import { getTodosFromSupabase, sendTodosToSupabase, deleteTodosFromSupabase } from "../lib/todo";

describe("タスク管理アプリのテスト", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 各テスト前にモックをリセット
  });

  test("タスクリストが正しく表示される", async () => {
    // 型を指定してモックの戻り値を設定
    (getTodosFromSupabase as jest.Mock).mockResolvedValue([
      { id: 1, title: "タスク1", time: 10 },
      { id: 2, title: "タスク2", time: 20 },
    ]);

    render(<App />);

    // タスクリストが表示されるのを確認
    await waitFor(() => {
      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
    });
  });

  test("新しいタスクを追加できる", async () => {
    // 初期タスクをモック
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]);
    
    // タスク追加後のタスクリストをモック
    (sendTodosToSupabase as jest.Mock).mockResolvedValueOnce([
      { id: 3, title: "新しいタスク", time: 15 },
    ]);
  
    await act(async () => {
      render(<App />);
    });
  
    // ローディング解除を待つ
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  
    // モーダルを開く
    fireEvent.click(screen.getByText("タスクを登録する"));
  
    // フォームに値を入力
    fireEvent.change(screen.getByPlaceholderText("タスクの名前"), {
      target: { value: "新しいタスク" },
    });
    fireEvent.change(screen.getByPlaceholderText("タスクにかかる時間"), {
      target: { value: "15" },
    });
  
    // タスクを追加
    fireEvent.click(screen.getByText("Save"));
  
    // タスクリストが更新されるのを確認
    await waitFor(() => {
      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
    });
  });  

  test("タスクを削除できる", async () => {
    // 初期タスクをモック
    (getTodosFromSupabase as jest.Mock).mockResolvedValue([
      { id: 1, title: "タスク1", time: 10 },
    ]);
    (deleteTodosFromSupabase as jest.Mock).mockResolvedValue([]);

    await act(async () => {
      render(<App />);
    });

    // ローディング解除を待つ
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // 削除ボタンをクリック
    fireEvent.click(screen.getByText("削除"));

    // タスクが削除されたことを確認
    await waitFor(() => {
      expect(screen.queryByText("タスク1")).not.toBeInTheDocument();
    });
  });
});