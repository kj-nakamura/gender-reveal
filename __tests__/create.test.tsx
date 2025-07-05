import { render, screen, fireEvent } from "@testing-library/react";
import CreateRevealPage from "../app/create/page";

// Server Actionsをモック
jest.mock("../app/reveal/actions", () => ({
  createReveal: jest.fn(),
}));

describe("CreateRevealPage", () => {
  it("renders page title correctly", () => {
    render(<CreateRevealPage />);

    expect(screen.getByText("デザインを選んで作成")).toBeInTheDocument();
  });

  it("renders template A section", () => {
    render(<CreateRevealPage />);

    expect(screen.getByText("シンプルデザイン")).toBeInTheDocument();
    expect(screen.getByText("一番ベーシックなデザインです。")).toBeInTheDocument();
  });

  it("renders template B section", () => {
    render(<CreateRevealPage />);

    expect(screen.getByText("バルーンデザイン")).toBeInTheDocument();
    expect(screen.getByText("風船が飛び出すアニメーション付きのデザインです。")).toBeInTheDocument();
  });

  it("renders all gender selection buttons", () => {
    render(<CreateRevealPage />);

    // Template A buttons
    expect(screen.getByText("男の子で作成")).toBeInTheDocument();
    expect(screen.getByText("女の子で作成")).toBeInTheDocument();

    // Template B buttons (there should be 2 "男の子で作成" and 2 "女の子で作成" buttons)
    const boyButtons = screen.getAllByText("男の子で作成");
    const girlButtons = screen.getAllByText("女の子で作成");

    expect(boyButtons).toHaveLength(2);
    expect(girlButtons).toHaveLength(2);
  });

  it("calls createReveal with correct parameters when buttons are clicked", () => {
    const mockCreateReveal = require("../app/reveal/actions").createReveal;

    render(<CreateRevealPage />);

    const boyButtons = screen.getAllByText("男の子で作成");
    const girlButtons = screen.getAllByText("女の子で作成");

    // Template A - Boy button
    fireEvent.click(boyButtons[0]);
    expect(mockCreateReveal).toHaveBeenCalledWith("template_A", "boy");

    // Template A - Girl button
    fireEvent.click(girlButtons[0]);
    expect(mockCreateReveal).toHaveBeenCalledWith("template_A", "girl");

    // Template B - Boy button
    fireEvent.click(boyButtons[1]);
    expect(mockCreateReveal).toHaveBeenCalledWith("template_B", "boy");

    // Template B - Girl button
    fireEvent.click(girlButtons[1]);
    expect(mockCreateReveal).toHaveBeenCalledWith("template_B", "girl");
  });
});
