import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

// テーブルが表示されるか確認するテスト
describe("Table", () => {
  test("テーブルをみることができる", async () => {
    render(<App />);

    // 非同期で表示される場合は待機
    await waitFor(() => {
      expect(screen.getByTestId("table")).toBeInTheDocument();
    }, { timeout: 10000 });    
  });
});
