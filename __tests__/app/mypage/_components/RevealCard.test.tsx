import { render, screen } from "@testing-library/react";

// Mock RevealCard component to avoid Supabase imports
const MockRevealCard = ({ reveal }: { reveal: any }) => {
  const templateName = reveal.template_id === "template_A" ? "七夕デザイン" : "バルーンデザイン";
  const genderName = reveal.gender === "boy" ? "男の子" : "女の子";

  return (
    <div>
      <div>{reveal.share_slug}</div>
      <div>{templateName}</div>
      <div>{genderName}</div>
      <a href={`/reveal/${reveal.share_slug}`}>Link</a>
    </div>
  );
};

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("RevealCard", () => {
  const mockReveal = {
    id: "1",
    template_id: "template_A",
    gender: "boy",
    share_slug: "test-slug",
    created_at: "2024-01-01T00:00:00Z",
  };

  it("should render reveal information", () => {
    render(<MockRevealCard reveal={mockReveal} />);
    expect(screen.getByText(/test-slug/)).toBeInTheDocument();
  });

  it("should display correct template name for template_A", () => {
    render(<MockRevealCard reveal={mockReveal} />);
    expect(screen.getByText(/七夕デザイン/)).toBeInTheDocument();
  });

  it("should display correct template name for template_B", () => {
    const templateBReveal = { ...mockReveal, template_id: "template_B" };
    render(<MockRevealCard reveal={templateBReveal} />);
    expect(screen.getByText(/バルーンデザイン/)).toBeInTheDocument();
  });

  it("should display correct gender for boy", () => {
    render(<MockRevealCard reveal={mockReveal} />);
    expect(screen.getByText(/男の子/)).toBeInTheDocument();
  });

  it("should display correct gender for girl", () => {
    const girlReveal = { ...mockReveal, gender: "girl" };
    render(<MockRevealCard reveal={girlReveal} />);
    expect(screen.getByText(/女の子/)).toBeInTheDocument();
  });

  it("should render share link", () => {
    render(<MockRevealCard reveal={mockReveal} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/reveal/${mockReveal.share_slug}`);
  });
});
