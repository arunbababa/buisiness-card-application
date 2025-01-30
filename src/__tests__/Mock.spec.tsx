import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../App";

// Jestのモックを正確に設定
jest.mock("../lib/todo.ts", () => ({
  getTodosFromSupabase: jest.fn(() => Promise.resolve([])), // 初期値を設定
  sendTodosToSupabase: jest.fn(() => Promise.resolve({ id: 3, title: "新しいタスク", time: 15 })),
  deleteTodosFromSupabase: jest.fn(() => Promise.resolve([])),
  updateTodosFromSupabase: jest.fn(() => Promise.resolve({ id: 1, title: "編集されたタスク", time: 20 }))
}));

import { getTodosFromSupabase, sendTodosToSupabase, deleteTodosFromSupabase,updateTodosFromSupabase } from "../lib/todo";

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
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]);
    (sendTodosToSupabase as jest.Mock).mockResolvedValueOnce(
      { id: 3, title: "新しいタスク", time: 15 }
    );
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([
      { id: 3, title: "新しいタスク", time: 15 }
    ]); // タスク追加後のリストを更新
  
    await act(async () => {
      render(<App />);
    });
  
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });
  
    await act(async () => {
      fireEvent.click(screen.getByText("タスクを登録する"));
    });
  
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("タスクの名前"), {
        target: { value: "新しいタスク" },
      });
      fireEvent.change(screen.getByPlaceholderText("タスクにかかる時間"), {
        target: { value: "15" },
      });
    });
  
    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });
  
    // タスクリストが更新されるのを確認
    await waitFor(() => {
      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
    });
  });    

  test("タスクを削除できる", async () => {
    // 初期タスクをモック
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([
      { id: 1, title: "タスク1", time: 10 },
    ]);
    (deleteTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]);
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]); // 削除後のタスクリスト
  
    await act(async () => {
      render(<App />);
    });
  
    // タスクリストが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText("タスク1")).toBeInTheDocument();
    });
  
    // 削除ボタンをクリック
    await act(async () => {
      const deleteButton = screen.getByText("削除").closest("button");
      if (deleteButton) fireEvent.click(deleteButton);
    });
  
    // タスクが削除されたことを確認
    await waitFor(() => {
      expect(screen.queryByText("タスク1")).not.toBeInTheDocument();
    });
  });    
});

test("モーダルのタイトルが「タスクを編集しましょう！」である", async () => {
  render(<App />);

  // ローディングが終わるのを待つ
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  // 編集ボタンが表示されるのを待つ
  await waitFor(() => {
    expect(screen.getAllByText("編集").length).toBeGreaterThan(0);
  });

  // 最初の編集ボタンをクリック
  await act(async () => {
    const editButton = screen.getAllByText("編集")[0].closest("button");
    if (editButton) fireEvent.click(editButton);
  });

  // モーダルのタイトルが表示されるのを確認
  await waitFor(() => {
    expect(screen.getByText("タスクを編集しましょう！")).toBeInTheDocument();
  });
});

test("タスクを編集するとリストが更新される", async () => {
  // 初期タスクをモック
  (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([
    { id: 1, title: "タスク1", time: 10 },
  ]);

  // 更新処理のモック
  (updateTodosFromSupabase as jest.Mock).mockResolvedValueOnce(
    { id: 1, title: "編集されたタスク", time: 20 }
  );

  // タスク更新後のリスト
  (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([
    { id: 1, title: "編集されたタスク", time: 20 },
  ]);

  // コンポーネントをレンダー
  await act(async () => {
    render(<App />);
  });

  // ローディングが終わるのを待つ
  await waitFor(() => {
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  // 編集ボタンをクリック
  await act(async () => {
    const editButton = screen.getAllByText("編集")[0].closest("button");
    if (editButton) fireEvent.click(editButton);
  });

  // モーダルが開かれたことを確認
  await waitFor(() => {
    expect(screen.getByText("タスクを編集しましょう！")).toBeInTheDocument();
  });

  // 既存のタスク情報が入力されていることを確認
  expect(screen.getByDisplayValue("タスク1")).toBeInTheDocument();
  expect(screen.getByDisplayValue("10")).toBeInTheDocument();

  // フォームに新しい値を入力
  await act(async () => {
    fireEvent.change(screen.getByPlaceholderText("タスクの名前"), {
      target: { value: "編集されたタスク" },
    });
    fireEvent.change(screen.getByPlaceholderText("タスクにかかる時間"), {
      target: { value: "20" },
    });
  });

  // 更新ボタンをクリック
  await act(async () => {
    fireEvent.click(screen.getByText("Save"));
  });

  // タスクリストが更新されるのを確認
  await waitFor(() => {
    expect(screen.getByText("編集されたタスク")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});