import { render, screen, waitFor } from "@testing-library/react";
import Regester from "../components/Regester";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";

// 🔹 Supabase の関数をモック（実際のDBにデータが入らないように）
jest.mock("../utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [{ name: "React" }, { name: "TypeScript" }, {name: "Node"}], // スキル一覧のダミーデータ
        error: null
      })),
    })),
  },
}));

// 🔹 useNavigate をモック
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

describe("Register コンポーネントのテスト", () => {
  let navigate: jest.Mock;
  beforeEach(() => {
    navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  test("タイトルが表示されている", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    expect(await screen.findByText("新規名刺登録")).toBeVisible();
  });

  test("全項目入力して登録ボタンを押すと / に遷移する", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    // 🔹 各項目に入力
    await userEvent.type(screen.getByPlaceholderText("coffee"), "user123");
    await userEvent.type(screen.getByPlaceholderText("名刺太郎"), "Test User");
    await userEvent.type(screen.getByPlaceholderText("自己紹介文を書いてください"), "自己紹介テスト");
    await userEvent.selectOptions(screen.getByRole("combobox"), "React");

    // 🔹 GitHub / Qiita / X の入力はなしでもOK
    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);
    await waitFor(() => {
    expect(navigate).toHaveBeenCalledWith("/");
    });

    // 🔹 送信後、遷移するか確認
    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("IDがないときにエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("user-name"), "userRandomName");
    await userEvent.type(screen.getByTestId("self-introduce"), "test test test");
    await userEvent.selectOptions(screen.getByRole("combobox"), "React");

    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);

    expect(await screen.findByText("ユーザーIDは必須です")).toBeVisible();
  });

  test("名前がないときにエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("user-id"), "userRandomID");
    await userEvent.type(screen.getByTestId("self-introduce"), "test test test");
    await userEvent.selectOptions(screen.getByRole("combobox"), "React");

    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);

    expect(await screen.findByText("お名前は必須です")).toBeVisible();
  });

  test("自己紹介がないときにエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("user-id"), "userRandomID");
    await userEvent.type(screen.getByTestId("user-name"), "userRandomName");
    await userEvent.selectOptions(screen.getByRole("combobox"), "React");


    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);

    expect(await screen.findByText("自己紹介文は必須です")).toBeVisible();
  });

  test("セレクトを選択しないとエラーメッセージが表示される", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("user-id"), "userRandomID");
    await userEvent.type(screen.getByTestId("user-name"), "userRandomName");
    await userEvent.type(screen.getByTestId("self-introduce"), "test test test");

    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);

    expect(await screen.findByText("選択は必須です")).toBeVisible();
  });

  test("GitHub、Qiita、XのIDは空でもエラーが出ない", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByTestId("user-id"), "userRandomID");
    await userEvent.type(screen.getByTestId("user-name"), "userRandomName");
    await userEvent.type(screen.getByTestId("self-introduce"), "test test test");
    await userEvent.selectOptions(screen.getByRole("combobox"), "React");

    // 🔹 GitHub / Qiita / X の ID は空のまま
    const submitButton = screen.getByRole("button", { name: "送信" });
    await userEvent.click(submitButton);

    expect(navigate).toHaveBeenCalledWith("/");
  });
});
