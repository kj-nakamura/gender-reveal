import { render, screen, fireEvent } from "@testing-library/react";
import LoginPage from "../app/login/page";

// next/navigation をモック
jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

// Server Actionsをモック
jest.mock("../app/login/actions", () => ({
  login: jest.fn(),
  signup: jest.fn(),
}));

describe("LoginPage", () => {
  it("renders login form correctly", () => {
    render(<LoginPage />);

    // フォーム要素の存在確認
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("パスワード")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ログイン" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "新規登録" })).toBeInTheDocument();
  });

  it("has email input with correct attributes", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("name", "email");
    expect(emailInput).toBeRequired();
  });

  it("has password input with correct attributes", () => {
    render(<LoginPage />);

    const passwordInput = screen.getByLabelText("パスワード");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(passwordInput).toHaveAttribute("name", "password");
    expect(passwordInput).toBeRequired();
  });

  it("allows user to input email and password", () => {
    render(<LoginPage />);

    const emailInput = screen.getByLabelText("メールアドレス");
    const passwordInput = screen.getByLabelText("パスワード");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});