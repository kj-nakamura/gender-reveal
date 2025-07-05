
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
});
