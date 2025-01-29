import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

// テーブルが表示されるか確認するテスト
describe("Table", () => {
  test("テーブルをみることができる", async () => {
    render(<App />);

    // 非同期で表示される場合は待機
    await waitFor(async () => {
      const tableElement = await screen.findByTestId("table"); // テーブルを取得
      expect(tableElement).toBeInTheDocument(); // テーブルが存在することを確認
    });
  });
});
