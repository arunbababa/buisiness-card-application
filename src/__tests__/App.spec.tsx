import {render,screen, waitFor } from "@testing-library/react";
import App from "../App";
import { Todo } from "../domain/todo";

// モックの作成と呼び出し
const mockGetAllTodos = jest.fn().mockResolvedValue([
  new Todo(1, 'test1', false, new Date()),
  new Todo(2, 'test2', true, new Date()),
  new Todo(3, 'test3', false, new Date())
]);

jest.mock("../lib/todo.ts", () => {
  return {
    GetAllTodos: () => mockGetAllTodos()
  }
});

describe('App', () => {
  test('タイトルがあることを確認し、jestの動作確認をする', async () => {
    render(<App />);
    await waitFor(() => screen.getByTestId('table'));
    const title = screen.getByTestId('title');
    expect(title).toBeInTheDocument();
  });
});