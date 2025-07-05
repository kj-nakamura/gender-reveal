import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home", () => {
  it("renders the main heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /ジェンダーリビール/,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(
      /赤ちゃんの性別を特別な方法で発表しませんか？/
    );
    expect(description).toBeInTheDocument();
  });

  it('renders "ログイン / 新規登録" link', () => {
    render(<Home />);
    const loginLink = screen.getByRole("link", { name: /ログイン \/ 新規登録/ });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it('renders "デザインを見る" link', () => {
    render(<Home />);
    const createLink = screen.getByRole("link", { name: /デザインを見る/ });
    expect(createLink).toBeInTheDocument();
    expect(createLink).toHaveAttribute("href", "/create");
  });

  it("renders the feature list", () => {
    render(<Home />);
    expect(screen.getByText(/複数のデザインテンプレートから選択/)).toBeInTheDocument();
    expect(screen.getByText(/共有リンクで家族や友人と共有/)).toBeInTheDocument();
    expect(screen.getByText(/特別な瞬間を演出/)).toBeInTheDocument();
  });
});
