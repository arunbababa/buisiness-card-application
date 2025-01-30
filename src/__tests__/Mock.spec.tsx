import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import App from "../App";
import { getTodosFromSupabase, sendTodosToSupabase, deleteTodosFromSupabase, updateTodosFromSupabase } from "../lib/todo";

// Jestのモックを設定
jest.mock("../lib/todo.ts", () => ({
  getTodosFromSupabase: jest.fn(),
  sendTodosToSupabase: jest.fn(),
  deleteTodosFromSupabase: jest.fn(),
  updateTodosFromSupabase: jest.fn()
}));

describe("タスク管理アプリのテスト", () => {

  beforeEach(() => {
    jest.clearAllMocks(); // 各テストの前にモックをクリア
  });

  /** 📌 **アプリの初期状態確認** */
  test("アプリのタイトルが表示される", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValue([]);
    
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("title")).toBeInTheDocument();
    });
  });

  test("タスクリストが正しく表示される", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValue([
      { id: 1, title: "タスク1", time: 10 },
      { id: 2, title: "タスク2", time: 20 },
    ]);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("タスク1")).toBeInTheDocument();
      expect(screen.getByText("タスク2")).toBeInTheDocument();
    });
  });

  /** 📌 **タスクの追加** */
  test("新しいタスクを追加できる", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]);
    (sendTodosToSupabase as jest.Mock).mockResolvedValueOnce({ id: 3, title: "新しいタスク", time: 15 });
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([{ id: 3, title: "新しいタスク", time: 15 }]);

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
      fireEvent.change(screen.getByPlaceholderText("タスクの名前"), { target: { value: "新しいタスク" } });
      fireEvent.change(screen.getByPlaceholderText("タスクにかかる時間"), { target: { value: "15" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });

    await waitFor(() => {
      expect(screen.getByText("新しいタスク")).toBeInTheDocument();
      expect(screen.getByText("15")).toBeInTheDocument();
    });
  });

  /** 📌 **タスクの削除** */
  test("タスクを削除できる", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([{ id: 1, title: "タスク1", time: 10 }]);
    (deleteTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]);
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([]); 

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText("タスク1")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("削除"));
    });

    await waitFor(() => {
      expect(screen.queryByText("タスク1")).not.toBeInTheDocument();
    });
  });

  /** 📌 **タスクの編集** */
  test("タスクを編集するとリストが更新される", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([{ id: 1, title: "タスク1", time: 10 }]);
    (updateTodosFromSupabase as jest.Mock).mockResolvedValueOnce({ id: 1, title: "編集されたタスク", time: 20 });
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([{ id: 1, title: "編集されたタスク", time: 20 }]);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("編集")[0]);
    });

    await waitFor(() => {
      expect(screen.getByText("タスクを編集しましょう！")).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue("タスク1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("10")).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("タスクの名前"), { target: { value: "編集されたタスク" } });
      fireEvent.change(screen.getByPlaceholderText("タスクにかかる時間"), { target: { value: "20" } });
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Save"));
    });

    await waitFor(() => {
      expect(screen.getByText("編集されたタスク")).toBeInTheDocument();
      expect(screen.getByText("20")).toBeInTheDocument();
    });
  });

  /** 📌 **モーダルの挙動** */
  test("編集モーダルのタイトルが正しい", async () => {
    (getTodosFromSupabase as jest.Mock).mockResolvedValueOnce([{ id: 1, title: "タスク1", time: 10 }]);

    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getAllByText("編集")[0]);
    });

    await waitFor(() => {
      expect(screen.getByText("タスクを編集しましょう！")).toBeInTheDocument();
    });
  });
});