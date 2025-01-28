import {render,screen, waitFor } from "@testing-library/react";
import App from "../App";
import { Todo } from "../domain/todo";

// モックの作成と呼び出し
const mockGetAllTodos = jest.fn().mockResolvedValue([
  new Todo(1, 'test1', 2),
  new Todo(2, 'test2', 5),
  new Todo(3, 'test3', 7)
]);

jest.mock("../lib/todo.ts", () => ({
  getTodosFromSupabase: jest.fn(() => mockGetAllTodos()), // モック関数を返す
}));


describe('App', () => {
  test('タイトルがあることを確認し、jestの動作確認をする', async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId('table'));
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
  });
});