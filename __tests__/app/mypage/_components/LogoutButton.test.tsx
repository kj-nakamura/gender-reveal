
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "@/app/mypage/_components/LogoutButton";
import * as actions from "@/app/auth/actions";

// actionsモジュールをモック化
jest.mock("@/app/auth/actions", () => ({
  logout: jest.fn(),
}));

const mockedLogout = actions.logout as jest.Mock;

describe("LogoutButton", () => {
  beforeEach(() => {
    mockedLogout.mockClear();
  });

  it("should render the logout button", () => {
    render(<LogoutButton />);
    expect(screen.getByRole("button", { name: /ログアウト/i })).toBeInTheDocument();
  });

  it("should show confirmation dialog on button click", async () => {
    render(<LogoutButton />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /ログアウト/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("ログアウトしますか？")).toBeInTheDocument();
  });

  it("should close confirmation dialog on cancel", async () => {
    render(<LogoutButton />);
    const user = userEvent.setup();
    
    // ダイアログを開く
    await user.click(screen.getByRole("button", { name: /ログアウト/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // キャンセルボタンをクリック
    await user.click(screen.getByRole("button", { name: /キャンセル/i }));
    
    // ダイアログが閉じるのを待つ
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call logout action on confirmation", async () => {
    mockedLogout.mockResolvedValue(undefined); // logoutはvoidを返す
    
    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /ログアウト/i }));
    // 確認ダイアログ内の「ログアウト」ボタンをクリック
    await user.click(screen.getAllByRole("button", { name: "ログアウト" })[1]);

    expect(mockedLogout).toHaveBeenCalledTimes(1);
    
    // ローディング状態の確認
    expect(screen.getByRole("button", { name: /ログアウト中.../i })).toBeDisabled();
  });

  it("should handle logout error", async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedLogout.mockRejectedValue(new Error("Logout failed"));
    
    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /ログアウト/i }));
    // 確認ダイアログ内の「ログアウト」ボタンをクリック
    await user.click(screen.getAllByRole("button", { name: "ログアウト" })[1]);

    // エラーがログに出力されることを確認
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith("Logout failed:", expect.any(Error));
    });

    // ローディング状態が解除されることを確認
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /ログアウト/i })).not.toBeDisabled();
    });

    // ダイアログが閉じることを確認
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it("should disable buttons during loading", async () => {
    // ログアウト処理を遅延させる
    mockedLogout.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LogoutButton />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /ログアウト/i }));
    // 確認ダイアログ内の「ログアウト」ボタンをクリック
    await user.click(screen.getAllByRole("button", { name: "ログアウト" })[1]);

    // ローディング中はボタンが無効化されることを確認
    expect(screen.getByRole("button", { name: /ログアウト中.../i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /キャンセル/i })).toBeDisabled();
  });
});
