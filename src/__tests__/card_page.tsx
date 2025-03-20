import { render, screen } from "@testing-library/react";
import Cards from "../components/Cards";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { useNavigate, useParams } from "react-router";


// React Router の `useNavigate` と `useParams` をモック化
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

// Supabase のデータ取得をモック化
jest.mock("../utils/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [{ skill_id: "1" }], // ダミーのスキルID
          error: null,
        })),
      })),
    })),
  },
}));

describe("Cards コンポーネントのテスト", () => {
  beforeEach(() => {
    // ダミーの `user_id` を指定
    (useParams as jest.Mock).mockReturnValue({ id: "dummyUserId" });
  });

  test("名前が表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const name = await screen.findByTestId("self-name");
    expect(name).toBeVisible();
  });

  test("自己紹介が表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const description = await screen.findByTestId("self-introduce");
    expect(description).toBeVisible();
  });

  test("技術が表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const skillText = await screen.findByTestId("like-stack");
    expect(skillText).toBeVisible();
  });

  test("GitHubアイコンが表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const githubIcon = await screen.findByLabelText("GitHub");
    expect(githubIcon).toBeVisible();
  });

  test("Qiitaのアイコンが表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const qiitaIcon = await screen.findByLabelText("Qiita");
    expect(qiitaIcon).toBeVisible();
  });

  test("Twitterのアイコンが表示されている", async () => {
    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const twitterIcon = await screen.findByLabelText("X (Twitter)");
    expect(twitterIcon).toBeVisible();
  });

  test("戻るボタンをクリックすると/に遷移する", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <Cards />
      </MemoryRouter>
    );

    const backButton = screen.getByRole("button", { name: "戻る" });
    await userEvent.click(backButton);

    expect(navigate).toHaveBeenCalledWith("/");
  });
});