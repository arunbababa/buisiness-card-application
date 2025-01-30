// モーダルを開いた際にインプットが空のまま送信ボタンを押すとエラーメッセージが表示されるかテストする
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";

describe("New Registration Button", () => {
    
    test("学習内容がないときに登録するとエラーがでる", async () => {
        render(<App />);

        await waitFor(() => {
            const addButtonElement = screen.getByRole("button", { name: "タスクを登録する" });
            expect(addButtonElement).toBeInTheDocument();
            addButtonElement.click();
        });

        const saveButtonElement = screen.getByRole("button", { name: "Save" });
        expect(saveButtonElement).toBeInTheDocument();
        saveButtonElement.click();
        
        waitFor(() => {
            const errorMessageTaskName = screen.getByText("タスク名は必須です");
            expect(errorMessageTaskName).toBeInTheDocument();
        });
        waitFor(() => {
            const errorMessageTaskTime = screen.getByText("0より大きい数値を入力してください");
            expect(errorMessageTaskTime).toBeInTheDocument();
        });

    });
});
