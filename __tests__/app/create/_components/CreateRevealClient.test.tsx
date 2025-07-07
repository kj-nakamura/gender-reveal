import { render, screen } from "@testing-library/react";
import CreateRevealClient from "@/app/create/_components/CreateRevealClient";

// Mock CommonHeader
jest.mock("@/app/_components/CommonHeader", () => {
  return function MockCommonHeader() {
    return <div data-testid="common-header">Header</div>;
  };
});

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("CreateRevealClient", () => {
  const mockExistingReveal = {
    id: "1",
    template_id: "template_A",
    gender: "boy",
    share_slug: "test-slug",
  };

  it("should render create mode when no existing reveal", () => {
    render(<CreateRevealClient existingReveal={null} />);
    expect(screen.getByText("デザインを選んで作成")).toBeInTheDocument();
  });

  it("should render replacement mode when existing reveal provided", () => {
    render(<CreateRevealClient existingReveal={mockExistingReveal} />);
    expect(screen.getByText("テンプレートを差し替え")).toBeInTheDocument();
  });

  it("should show info message in replacement mode", () => {
    render(<CreateRevealClient existingReveal={mockExistingReveal} />);
    expect(screen.getByText(/テンプレートを差し替えても、共有URLは変わりません/)).toBeInTheDocument();
  });

  it("should show current reveal information in replacement mode", () => {
    render(<CreateRevealClient existingReveal={mockExistingReveal} />);
    expect(screen.getByText("現在のリビール情報")).toBeInTheDocument();
    expect(screen.getAllByText(/七夕デザイン/)).toHaveLength(2);
    // Check for exact text in reveal info section
    expect(screen.getByText("テンプレート: 七夕デザイン | 性別: 男の子")).toBeInTheDocument();
  });

  it("should render template cards", () => {
    render(<CreateRevealClient existingReveal={null} />);
    expect(screen.getByText("七夕デザイン")).toBeInTheDocument();
    expect(screen.getByText("バルーンデザイン")).toBeInTheDocument();
  });

  it("should render sample buttons for each template", () => {
    render(<CreateRevealClient existingReveal={null} />);
    expect(screen.getAllByText("👦 男の子のサンプル")).toHaveLength(2);
    expect(screen.getAllByText("👧 女の子のサンプル")).toHaveLength(2);
  });

  it("should render premium design with coming soon notice", () => {
    render(<CreateRevealClient existingReveal={null} />);
    expect(screen.getByText("✨ プレミアムデザイン（近日公開）")).toBeInTheDocument();
  });

  it("should render disabled premium buttons", () => {
    render(<CreateRevealClient existingReveal={null} />);
    const boyButton = screen.getByText("男の子で作成（購入へ）");
    const girlButton = screen.getByText("女の子で作成（購入へ）");
    
    expect(boyButton).toBeDisabled();
    expect(girlButton).toBeDisabled();
  });
});
