import { render, screen } from "@testing-library/react";
import App from "../App";

// テーブルが表示されるか確認するテスト
describe("Table", () => {
  test("テーブルをみることができる", async () => {
    render(<App />);
    // テーブルが表示されるのを待つ
    expect(await screen.findByTestId("table")).toBeInTheDocument();
  });
});
