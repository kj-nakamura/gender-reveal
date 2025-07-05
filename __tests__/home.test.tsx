import { render, screen } from "@testing-library/react";
import Home from "../app/page";

// next/imageをモック
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("Home", () => {
  it("renders the main heading", () => {
    render(<Home />);

    // Next.js logo image
    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
  });

  it("renders the getting started text", () => {
    render(<Home />);

    expect(screen.getByText("Get started by editing")).toBeInTheDocument();
    expect(screen.getByText("src/app/page.tsx")).toBeInTheDocument();
    expect(screen.getByText("Save and see your changes instantly.")).toBeInTheDocument();
  });

  it("renders navigation links", () => {
    render(<Home />);

    // Deploy now button
    const deployLink = screen.getByRole("link", { name: /deploy now/i });
    expect(deployLink).toBeInTheDocument();
    expect(deployLink).toHaveAttribute("href", expect.stringContaining("vercel.com"));

    // Read our docs button
    const docsLink = screen.getByRole("link", { name: /read our docs/i });
    expect(docsLink).toBeInTheDocument();
    expect(docsLink).toHaveAttribute("href", expect.stringContaining("nextjs.org/docs"));
  });

  it("renders footer links", () => {
    render(<Home />);

    // Learn link
    const learnLink = screen.getByRole("link", { name: /learn/i });
    expect(learnLink).toBeInTheDocument();
    expect(learnLink).toHaveAttribute("href", expect.stringContaining("nextjs.org/learn"));

    // Examples link
    const examplesLink = screen.getByRole("link", { name: /examples/i });
    expect(examplesLink).toBeInTheDocument();
    expect(examplesLink).toHaveAttribute("href", expect.stringContaining("vercel.com/templates"));

    // Go to nextjs.org link
    const nextjsLink = screen.getByRole("link", { name: /go to nextjs.org/i });
    expect(nextjsLink).toBeInTheDocument();
    expect(nextjsLink).toHaveAttribute("href", expect.stringContaining("nextjs.org"));
  });

  it("renders images with correct alt text", () => {
    render(<Home />);

    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
    expect(screen.getByAltText("Vercel logomark")).toBeInTheDocument();
    expect(screen.getByAltText("File icon")).toBeInTheDocument();
    expect(screen.getByAltText("Window icon")).toBeInTheDocument();
    expect(screen.getByAltText("Globe icon")).toBeInTheDocument();
  });
});
