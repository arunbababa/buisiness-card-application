import { render, screen, act } from "@testing-library/react";
import App from "../App";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";

// 🚀 `useNavigate` をモック
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

describe("トップページのテスト", () => {
  let navigate: jest.Mock;

  beforeEach(() => {
    navigate = jest.fn(); // モック関数を初期化
    (useNavigate as jest.Mock).mockReturnValue(navigate); // `useNavigate` をモック
  });

  test("タイトル:[ユーザIDを検索してください]が表示されていることをテストする", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const title = screen.getByText("ユーザIDを検索してください");
    expect(title).toBeVisible();
  });

  test("IDをinputに入力してボタンを押すと/cards/:idに遷移することをテストする", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const input = screen.getByRole("textbox");
    const button = screen.getByText("送信");

    await act(async () => {
      await userEvent.type(input, "coffee");
      await userEvent.click(button);
    });

    // 🚀 `useNavigate` が `/cards/coffee` に遷移したことを確認
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/cards/coffee");
  });

  test("IDを入力しないでボタンを押すとエラーメッセージ[ユーザーIDは必須です]が表示される", async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", { name: "送信" });

    await act(async () => {
      await userEvent.click(submitButton);
    });

    expect(screen.getByText("ユーザーIDは必須です")).toBeVisible();
  });

  test("新規登録ボタンを押すと/cards/registerに遷移することをテストする", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    const registerButton = screen.getByRole("button", { name: "新規登録はこちら" });

    await userEvent.click(registerButton);

    expect(navigate).toHaveBeenCalledWith("/cards/register");
  });

});
