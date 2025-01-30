import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("New Registration Button", () => {
  test("新規登録ボタンがある", async () => {
    render(<App />);

    await waitFor(() => {
      const buttonElement = screen.getByRole("button", { name: "タスクを登録する" });
      expect(buttonElement).toBeInTheDocument();
    });
  });
});
