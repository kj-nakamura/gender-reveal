
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RevealCard from "@/app/mypage/_components/RevealCard";
import * as actions from "@/app/reveal/actions";
import { useRouter } from "next/navigation";

// next/navigationをモック化
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// useRouterをモック関数としてキャスト
const mockedUseRouter = useRouter as jest.Mock;

// navigator.clipboardをモック化


// next/linkをモック化
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// actionsモジュールをモック化
jest.mock("@/app/reveal/actions", () => ({
  deleteReveal: jest.fn(),
}));

const mockedDeleteReveal = actions.deleteReveal as jest.Mock;

const mockReveal = {
  id: "test-id-123",
  template_id: "TemplateA",
  gender: "boy",
  share_slug: "test-slug",
  is_paid: false,
  created_at: "2023-01-01T12:00:00Z",
};

describe("RevealCard", () => {
  // 各テストの前にモックをリセット
  beforeEach(() => {
    mockedDeleteReveal.mockClear();
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      refresh: jest.fn(),
    });
  });

  it("should render reveal card with correct data", () => {
    render(<RevealCard reveal={mockReveal} />);

    expect(screen.getByText("2023/1/1")).toBeInTheDocument();
    expect(screen.getByText("無料")).toBeInTheDocument();
    expect(screen.getByText("TemplateA")).toBeInTheDocument();
    expect(screen.getByText("👶 男の子")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://localhost/reveal/test-slug")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /プレビュー/i })).toHaveAttribute(
      "href",
      "/reveal/test-slug"
    );
  });

  it("should handle copy to clipboard", async () => {
    render(<RevealCard reveal={mockReveal} />);
    const user = userEvent.setup();

    const copyButton = screen.getByRole("button", { name: /コピー/i });
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "http://localhost/reveal/test-slug"
    );
    expect(copyButton).toHaveTextContent("✓");

    // 2秒後に「コピー」に戻ることを確認
    await waitFor(() => {
      expect(copyButton).toHaveTextContent("コピー");
    }, { timeout: 2100 });
  });

  it("should show delete confirmation dialog", async () => {
    render(<RevealCard reveal={mockReveal} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /削除/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("リビールを削除しますか？")).toBeInTheDocument();
  });

  it("should close delete confirmation dialog on cancel", async () => {
    render(<RevealCard reveal={mockReveal} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /削除/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /キャンセル/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("should call deleteReveal action on confirm delete", async () => {
    mockedDeleteReveal.mockResolvedValue(undefined);

    render(<RevealCard reveal={mockReveal} />);
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /削除/i }));
    await user.click(screen.getByRole("button", { name: "削除する" }));

    expect(mockedDeleteReveal).toHaveBeenCalledTimes(1);
    expect(mockedDeleteReveal).toHaveBeenCalledWith(mockReveal.id);

    // router.refresh()が呼び出されることを確認
    expect(mockedUseRouter().refresh).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
