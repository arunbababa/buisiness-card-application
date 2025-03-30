import { render, screen } from "@testing-library/react";
import Regester from "../components/Regester";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router";
// import { act } from "react-dom/test-utils";

jest.mock("../utils/supabase", () => {
  const mockFrom = jest.fn((tableName) => {
    if (tableName === "skills") {
      const select = jest.fn(() => {
        const result = {
          data: [
            { id: 1, name: "React" },
            { id: 2, name: "TypeScript" },
            { id: 3, name: "Node" },
          ],
          error: null,
        };

        // eqがチェーンされる場合に備えてモック追加
        return {
          ...result,
          eq: jest.fn(() => ({
            data: [{ id: 1 }],
            error: null,
          })),
        };
      });

      return { select };
    }

    return {
      select: jest.fn(() => ({
        data: [{ name: "React" }, { name: "TypeScript" }, { name: "Node" }],
        error: null,
      })),
      insert: jest.fn(() => ({
        data: [{ id: 123 }],
        error: null,
      })),
      eq: jest.fn(() => ({
        data: [{ id: 1 }],
        error: null,
      })),
    };
  });

  return {
    supabase: {
      from: mockFrom,
    },
  };
});

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

describe("Register コンポーネントのテスト", () => {

  let navigate: jest.Mock;
  beforeEach(() => {
  navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);
  console.log("🧪 useNavigate mock:", useNavigate());
});

  test("タイトルが表示されている", async () => {
    render(
      <MemoryRouter>
        <Regester />
      </MemoryRouter>
    );

    expect(await screen.findByText("新規名刺登録")).toBeVisible();
  });

  // test("全項目入力して登録ボタンを押すと / に遷移する", async () => {
  //   render(
  //     <MemoryRouter>
  //       <Regester />
  //     </MemoryRouter>
  //   );

  //   // 🔹 各項目に入力
  //   await userEvent.type(screen.getByPlaceholderText("coffee"), "user123");
  //   await userEvent.type(screen.getByPlaceholderText("名刺太郎"), "Test User");
  //   await userEvent.type(screen.getByPlaceholderText("自己紹介文を書いてください"), "自己紹介テスト");
  //   await userEvent.selectOptions(screen.getByRole("combobox"), "React");

  //   const submitButton = screen.getByRole("button", { name: "送信" });
  //   console.log("📤 ボタン押下前");
  //   await act(async () => {
  //   await userEvent.click(submitButton);
  //   });
  //   await waitFor(() => {
  //   expect(navigate).toHaveBeenCalled();
  //   }, { timeout: 3000 }); // 3秒待つ（環境により調整）
  //   expect(navigate).toHaveBeenCalledWith("/");
  // });

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

  // test("GitHub、Qiita、XのIDは空でも登録できる", async () => {
  //   render(
  //     <MemoryRouter>
  //       <Regester />
  //     </MemoryRouter>
  //   );

  //   // 🔹 GitHub / Qiita / X 以外を入力
  //   await userEvent.type(screen.getByTestId("user-id"), "userRandomID");
  //   await userEvent.type(screen.getByTestId("user-name"), "userRandomName");
  //   await userEvent.type(screen.getByTestId("self-introduce"), "test test test");
  //   await userEvent.selectOptions(screen.getByRole("combobox"), "React");

  //   const submitButton = screen.getByRole("button", { name: "送信" });
  //   await userEvent.click(submitButton);

  // これ思ったけどscreen更新してないからDOM更新されていないんじゃね？
  //   const sinki = await screen.findByText("新規登録はこちら");
  //   expect(sinki).toBeVisible();
  // });
});
