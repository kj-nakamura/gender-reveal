
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteUserButton from "@/app/mypage/_components/DeleteUserButton";
import * as actions from "@/app/auth/actions";

// jest.mockを使用してactionsモジュールをモック化
jest.mock("@/app/auth/actions", () => ({
  deleteUser: jest.fn(),
}));

// deleteUserをモック関数としてキャスト
const mockedDeleteUser = actions.deleteUser as jest.Mock;

describe("DeleteUserButton", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    mockedDeleteUser.mockClear();
  });

  it("should render the delete button", () => {
    render(<DeleteUserButton />);
    expect(screen.getByRole("button", { name: /アカウント削除/i })).toBeInTheDocument();
  });

  it("should show confirmation dialog on button click", async () => {
    render(<DeleteUserButton />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /アカウント削除/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("アカウントを削除しますか？")).toBeInTheDocument();
  });

  it("should close confirmation dialog on cancel", async () => {
    render(<DeleteUserButton />);
    const user = userEvent.setup();
    
    // ダイアログを開く
    await user.click(screen.getByRole("button", { name: /アカウント削除/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // キャンセルボタンをクリック
    await user.click(screen.getByRole("button", { name: /キャンセル/i }));
    
    // ダイアログが閉じるのを待つ
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call deleteUser action on confirmation", async () => {
    mockedDeleteUser.mockResolvedValue({ success: true });
    
    render(<DeleteUserButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /アカウント削除/i }));
    await user.click(screen.getByRole("button", { name: "削除する" }));

    expect(mockedDeleteUser).toHaveBeenCalledTimes(1);
    
    // ローディング状態の確認
    expect(screen.getByRole("button", { name: /削除中.../i })).toBeDisabled();
  });

  it("should show an error message if deleteUser fails", async () => {
    const errorMessage = "削除に失敗しました";
    mockedDeleteUser.mockResolvedValue({ success: false, error: errorMessage });

    render(<DeleteUserButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /アカウント削除/i }));
    await user.click(screen.getByRole("button", { name: "削除する" }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // エラー後、ボタンが再度有効になることを確認
    expect(screen.getByRole("button", { name: /削除する/i })).not.toBeDisabled();
  });
});
