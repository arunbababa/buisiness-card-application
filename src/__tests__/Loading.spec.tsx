import { render, screen } from "@testing-library/react";
import App from "../App";

// テストケース: ローディング画面が表示される
describe("App", () => {
  test("ローディング画面をみることができる", () => {
    render(<App />);
    const loadingElement = screen.getByText("Loading..."); // "Loading..." を取得
    expect(loadingElement).toBeInTheDocument(); // DOM に存在することを確認
  });
});
