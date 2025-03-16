import { render, screen } from "@testing-library/react";
import App from "../App";
import '@testing-library/jest-dom';

test("App コンポーネントが正常にレンダリングされる", () => {
  render(<App />);

  const buttons = screen.getAllByText("Click me"); // 複数あるので getAllByText を使う
  expect(buttons).toHaveLength(2); // ボタンが 2 つあることを確認
});